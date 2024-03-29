var successStatusCodes = [200, 201];
var statusCodesMessages = {
    301: "Permanent Redirect",
    302: "Temporary Redirect",
    400: "Bad Request",
    401: "Unauthorized",
    404: "Not Found",
    408: "Tooks Too Long",
    410: "Gone",
    500: "Server Error",
    503: "Service Unavailable",
};


function changeCheckboxValue(formSelector) {
    document.querySelectorAll(`${formSelector} [type=checkbox]`).forEach(checkbox => {
        checkbox.value = checkbox.checked ? 1 : 0;
    })
}



function runIsValidFormOnChange(formSelector) {
    document.querySelectorAll(`${formSelector} [data-type][name]:not([data-type-ignore])`).forEach(input => {
        input.oninput = () => isValidForm(formSelector, false);
    })
}



function hideDataFormMessage() {
    document.querySelectorAll("[data-form-message]").forEach(element => {
        element.style.display = "none";
    });
}
function hideDataFormLoader() {
    document.querySelectorAll("[data-form-loader]").forEach(element => {
        element.style.display = "none";
    });
}

function isValidInput(input) {

    if (typeof input == "string") {
        input = document.getElementById(input);
    }
    var isValid = true;
    input.setAttribute("data-form-current-input", true);
    input.removeAttribute("data-invalid-input");
    var select2 = input.parentElement.querySelector(".select2-selection");
    if (select2 != null) {
        select2.removeAttribute("data-invalid-input");
    }
    document.querySelectorAll("[data-form-current-input] + [data-invalid-message]").forEach(message => message.remove());
    var type = input.getAttribute("data-type");
    var value = input.value;
    if (formRules[type] == null) {
        alert(`"${type}" is not defined rule in formRules object`);
        return;
    }


    if (type == "radio") {
        var radioInputs = input.querySelectorAll("[type=radio]");
        for (var radio of radioInputs) {
            if (radio.checked) {
                value = 1;
                break;
            }
        }

    }


    if (!formRules[type](value, input)) {
        isValid = false;
        var message = input.getAttribute("data-type-message");
        var messageElement = document.createElement("span");
        messageElement.textContent = message,
            messageElement.setAttribute("data-invalid-message", true),
            input.after(messageElement);
        input.setAttribute("data-invalid-input", true);
        var select2 = input.parentElement.querySelector(".select2-selection");
        if (select2 != null) {
            select2.setAttribute("data-invalid-input", true);
        }


    }
    input.removeAttribute("data-form-current-input");
    return isValid;
}
function isValidForm(formSelector, isSubmitted = true) {
    changeCheckboxValue(formSelector);
    runIsValidFormOnChange(formSelector);
    var isValid = true;
    document.querySelectorAll(`${formSelector} [data-type][name]:not([data-type-ignore])`).forEach(input => {
        if (!isValidInput(input)) {
            isValid = false;
        }

    });


    if (!isValid && isSubmitted) {
        var invalidInput = document.querySelector("[data-invalid-input]");
        var position = invalidInput.getBoundingClientRect();
        window.scrollTo(position.left, position.top + window.scrollY - 30);
    }


    return isValid;



}


function onTypeEvntbinding() {

    document.querySelectorAll("[data-form-auto]").forEach(form => {
        document.querySelectorAll(`#${form.id} [data-type][name]:not([data-type-ignore])`).forEach(input => {
            input.oninput = () => isValidInput(input);

        });

    });

}


function ajaxFormSubmitEventBinding() {
    document.querySelectorAll("[data-form]").forEach(form => {
        form.onsubmit = async function (e) {
            e.preventDefault();
            var formId = form.id;
            if (!isValidForm(`#${formId}`, true)) {
                return;
            }

            submitAjaxForm(`#${formId}`);





        }
    });

}

async function submitAjaxForm(formSelector) {
    var form = document.querySelector(formSelector);

    var formData = new FormData(form);

    var inputFiles = form.querySelectorAll("[type=file]:not([data-type-ignore])");
    var inputFilesNb = inputFiles.length;
    var allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (inputFilesNb) {
        var loaders = document.querySelectorAll(`${formSelector} [data-form-loader]`);
        loaders.forEach(loader => {
            loader.style.display = "flex";
        });

        for (var el of inputFiles) {

            selectedFiles = el.files;
            var name = el.getAttribute("name");

            formData.delete(name);
            // Iterate through selected files and append to FormData
            for (let i = 0; i < selectedFiles.length; i++) {
                var file = selectedFiles[i];
                var fileType = file.type;
                if (!allowedImageTypes.includes(fileType)) {
                    formData.append(name, file);
                    inputFilesNb--;
                } else {
                    // Resize the image before appending to FormData
                    var resizedFile = await imageResize(file);

                    formData.append(name, resizedFile);

                    // Check if all files are processed
                    if (formData.getAll(name).length === selectedFiles.length) {
                        inputFilesNb--;

                    }
                }




                if (inputFilesNb == 0) {
                    loaders.forEach(loader => {
                        loader.style.display = "none";
                    });

                    sendAjaxRequest(formSelector, formData);
                }

            }
        }
    } else {
        sendAjaxRequest(formSelector, formData);
    }




}

async function sendAjaxRequest(formSelector, formData) {

    var form = document.querySelector(formSelector);
    var action = form.getAttribute("action");
    var method = form.getAttribute("method");
    var showToast = form.getAttribute("data-form-toast");
    var fetchOptions = {
        method: method
    }

    if (method.trim().toLowerCase() == "post") {
        fetchOptions.body = formData;
    } else {
        var queryString = new URLSearchParams(formData).toString()
        action += action.includes("?") ? `&${queryString}` : `?${queryString}`
    }

    var loaders = document.querySelectorAll(`${formSelector} [data-form-loader]`);
    var messages = document.querySelectorAll(`${formSelector} [data-form-message]`);
    var elementsToHide = document.querySelectorAll(`${formSelector} [data-form-hide]`);
    var buttons = document.querySelectorAll(`${formSelector} button`);
    var errors = document.querySelectorAll(`[data-error]`);

    loaders.forEach(loader => {
        loader.style.display = "flex";
    });

    buttons.forEach(input => {
        input.setAttribute("disabled", true);
    });

    messages.forEach(message => {
        message.style.display = "none";
    });

    elementsToHide.forEach(el => {
        el.style.display = "none";
    });

    errors.forEach(error => {
        error.textContent = "";
    });


    var response = await fetch(action, fetchOptions);

    loaders.forEach(loader => {
        loader.style.display = "none";
    });

    buttons.forEach(input => {
        input.removeAttribute("disabled");
    });
    elementsToHide.forEach(el => {
        el.style.display = "flex";
    });




    if (!successStatusCodes.includes(response.status)) {
        alert(`${action} ${statusCodesMessages[response.status]}`);
        return;
    }

    response = await response.json();

    if (response.message) {

        messages.forEach(message => {

            message.classList.remove("error");
            message.classList.remove("success");
            message.classList.remove("alert-success");
            message.classList.remove("alert-danger");
            message.classList.remove("alert-warning");
            message.classList.remove("alert-info");

            message.innerHTML = response.message;
            message.style.display = "flex";
            message.classList.add(response.status);
            message.classList.add(`${response.status == 'success' ? 'alert-success' : 'alert-danger'}`)
        });

    }
    if (showToast) {
        toast({
            message: response.message,
            type: response.status,
            style: "position:fixed !important;top:5rem !important"
        });
    }

    if (response.redirect) {
        window.location.href = response.redirect;
    }
    if (response.reset) {
        document.querySelector(`#${formId}`).reset();
    }

    if (response.errors) {
        var errorKeys = Object.keys(response.errors);
        errorKeys.forEach((field) => {
            document.querySelector(`[data-error=${field}]`).textContent = response.errors[field];
        });


    }

    if (form.dataset.form) {
        eval(window[form.dataset.form](response));
    }


}


function initNumberInputs() {
    var numberInputs = document.querySelectorAll("[data-number]");

    numberInputs.forEach(input => {
        input.onkeyup = () => {
            var numberValue = parseInt(input.value);

            if (isNaN(numberValue)) {
                numberValue = "";
            }

            input.value = numberValue;
        }
    });


}


function onFocusOutTel(el) {
    var value = el.value;

    if (!formRules["tel"](value, el) || value == "") {
        return;
    }
    if (!value.includes(telSeparator)) {
        el.value = value.substr(0, telCountryCode.length) + telSeparator + parseInt(value.substr(telCountryCode.length));
    }
}

function onFocusInTel(el) {
    var value = el.value;
    var telParts = value.split(telSeparator);
    if (telParts.length < 2) {
        return;
    }
    var telCountryCode = telParts[0];
    var phoneNumber = telParts[1];
    if (telLength != (telCountryCode.length + phoneNumber.length)) {
        phoneNumber = `0${phoneNumber}`;
    }
    el.value = telCountryCode + phoneNumber;
}
function initTelInputs() {
    var telInputs = document.querySelectorAll("[data-type=tel]");
    telInputs.forEach(el => {
        onFocusOutTel(el);
        el.addEventListener('focusout', () => {
            onFocusOutTel(el);
        });

        el.addEventListener('focusin', () => {
            onFocusInTel(el);
        });


    });
}

function imagePickerPreview(inputFileName) {
    document.querySelector(`[name=${inputFileName}]`).click();

}
function removeImage(inputFileName) {

    document.querySelector(`[name=${inputFileName}]`).value = null;

    document.querySelector(`#${inputFileName}_preview img`).remove();
    event.target.remove();
    event.stopPropagation();
}

function initImageInputs() {

    document.querySelectorAll("[data-image]").forEach(input => {
        input.onchange = (e) => {

            var elementName = e.target.getAttribute("name");
            var files = e.target.files;
            if (files.length == 0) {
                return;
            }

            var selectedImage = files[0];
            if (selectedImage.type != "image/jpeg"
                && selectedImage.type != "image/jpg"
                && selectedImage.type != "image/png"
                && selectedImage.type != "image/png") {
                return;
            }
            var imageSrc = URL.createObjectURL(files[0]);
            var image = `<img src='${imageSrc}'/>`;
            var removeImage = `<span class="${elementName}_remove" onclick='removeImage("${elementName}")'>âœ–</span>`;
            document.querySelector(`#${elementName}_preview`).innerHTML = (image + removeImage);
        }
    });


    var imageInputs = document.querySelectorAll("[data-image]");
    imageInputs.forEach(input => {
        var elementName = input.getAttribute("name");
        var imagePreviewContainer = `
        <div id='${elementName}_preview' 
             name='${elementName}_preview' 
             class='${elementName}_container' 
             onclick='imagePickerPreview("${elementName}")'>
        </div>`;

        input.insertAdjacentHTML("afterend", imagePreviewContainer);
        input.style.display = "none";

    })


}


function imageResize(file) {
    return new Promise((resolve, reject) => {
        var reader = new FileReader();

        reader.onload = function (event) {
            var img = new Image();
            img.src = event.target.result;

            img.onload = function () {
                var maxWidth = 500; // Adjust this as needed
                var aspectRatio = img.width / img.height;
                var newWidth = Math.min(maxWidth, img.width);
                var newHeight = Math.round(newWidth / aspectRatio);

                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                canvas.width = newWidth;
                canvas.height = newHeight;
                ctx.drawImage(img, 0, 0, newWidth, newHeight);

                canvas.toBlob(blob => {
                    var resizedFile = new File([blob], file.name, {
                        type: file.type,
                        lastModified: file.lastModified
                    });
                    resolve(resizedFile);
                }, file.type);
            };
        };

        reader.readAsDataURL(file);
    });
}



function initDataForm() {
    hideDataFormLoader();
    hideDataFormMessage();
    ajaxFormSubmitEventBinding();
    onTypeEvntbinding();
}


document.addEventListener('DOMContentLoaded', function () {
    initDataForm();
    initNumberInputs();
    initTelInputs();
    initImageInputs();
});