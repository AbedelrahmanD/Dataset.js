var toggleActiveElements;
var toggleElements;
var toggleContentElements;

document.addEventListener("DOMContentLoaded", function () {
    initDataToggle();
});
function hideToggleContentElements(group = null) {
    var elementsToHide = toggleContentElements;

    if (group != null) {
        elementsToHide = document.querySelectorAll(`[data-toggle-group="${group}"][data-toggle-content]`);
    }
    elementsToHide.forEach(el => {
        el.style.display = "none";
    });
}
function showToggleContentElements(group = null) {
    var elementsToShow = toggleContentElements;
    if (group != null) {
        elementsToShow = document.querySelectorAll(`[data-toggle-group="${group}"][data-toggle-content]`);
    }
    elementsToShow.forEach(el => {
        el.style.display = "flex";
    });
}
function initDataToggle() {
    toggleActiveElements = document.querySelectorAll("[data-toggle-active]");
    toggleElements = document.querySelectorAll("[data-toggle]");
    toggleContentElements = document.querySelectorAll("[data-toggle-content]");

    hideToggleContentElements();

    toggleElements.forEach(el => {
        el.style.cursor = "pointer";
        el.onclick = () => {

            var dataToggleValue = event.target.getAttribute("data-toggle");
            var dataToggleGroup = event.target.getAttribute("data-toggle-group");
            var dataToggleshow = event.target.getAttribute("data-toggle-show");

            if (dataToggleValue == "all") {
                showToggleContentElements(dataToggleGroup);
                return;
            }
            if (dataToggleshow == null) {
                var elementsToShow = [];
                document.querySelectorAll(`[data-toggle-content="${dataToggleValue}"]`).forEach(content => {
                    if (content.style.display == "none") {
                        elementsToShow.push(content);
                    }
                });

                hideToggleContentElements(dataToggleGroup);

                elementsToShow.forEach(content => {
                    content.style.display = "flex";
                });

            } else {
                hideToggleContentElements(dataToggleGroup);
                document.querySelectorAll(`[data-toggle-content="${dataToggleValue}"]`).forEach(content => {
                    content.style.display = "flex";
                });
            }


        }
    });

    toggleActiveElements.forEach(el => {
        el.click();
    });
}