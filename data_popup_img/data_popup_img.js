

document.addEventListener("DOMContentLoaded", function () {
    initPopupImg();
});



var popupImages;
var popupImagesForGroup;
var popupImageGroup;
var popupImageIndex;

function closePopupImag() {
    document.querySelectorAll(".popupImageContainer").forEach(el => el.remove());
}
function movePopupImage(direction) {
    event.stopImmediatePropagation();

    if (direction == "next") {
        popupImageIndex++;
        if (popupImageIndex >= popupImagesForGroup.length) {
            popupImageIndex = 0;
        }

    } else {
        popupImageIndex--;
        if (popupImageIndex < 0) {
            popupImageIndex = popupImagesForGroup.length - 1;
        }

    }

    document.querySelector("#jsPopupImageBody img").src = popupImagesForGroup[popupImageIndex].getAttribute("src");



}

function initPopupImg() {

    popupImages = document.querySelectorAll("[data-popup-img]");
    popupImages.forEach(img => {
        img.style.cursor="zoom-in";
        img.onclick = () => {

            var src = event.target.getAttribute("src");
            popupImageGroup = event.target.getAttribute("data-popup-img-group");
            popupImagesForGroup = document.querySelectorAll(`[data-popup-img-group=${popupImageGroup}]`);
            for (var [index, value] of popupImagesForGroup.entries()) {

                if (value.getAttribute("src") == src) {
                    popupImageIndex = index;
                    break;
                }
            }

            var popupImageStyle = `
                <style>
                    .popupImageContainer{
                        position:fixed;
                        top:0;
                        bottom:0;
                        left:0;
                        right:0;
                        width:100%;
                        height:100%;
                        background-color:#00000099;
                        z-index: 99;
                    }
                    .popupImageHeader{
                        position: fixed;
                        top: 1rem;
                        color:white;
                        padding: 0 2rem;
                        font-size:1.5rem;
                        cursor:pointer;
                        z-index:10
                    }
                    .popupImageBody{
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100%;
                        width: 100%;
                        position:relative;
                    }
                    .popupImageBody img{
                        z-index:5;
                        max-width:100%;
                        max-height:100%;
                    }
                    .popImageControls{
                        position:absolute;
                        top:50%;
                        display:flex;
                        justify-content:space-between;
                        width:90%;
                        left:0;
                        right:0;
                        margin:auto;
                        z-index:10;
                        
                    }
                    .popImageControls div{
                        width:3rem;
                        height:3rem;
                        display:flex;
                        justify-content:center;
                        align-items:center;
                        border-radius:100%;
                        background-color:white;
                        color:black;
                        cursor: pointer;

                    }
                    .popupImageContainer{
                        animation:0.3s zoomInAnimation forwards;
                    }
                    @keyframes zoomInAnimation{
                        0%{
                           transform:scale(1.2);
                            opacity:0;
                        }
                        100%{
                          transform:scale(1);
                          opacity:1;
                        }
                    }
                </style>
                `;
            var popImageControls = ``;
            if (popupImageGroup != null) {
                popImageControls = `
                    <div class='popImageControls'>
                        <div onclick='movePopupImage("prev")'>❮</div>    
                        <div onclick='movePopupImage("next")'>❯</div>    
                    </div>
                    `;

            }
            var popupImageHeader = ` <div class="popupImageHeader" 
                                     onclick="closePopupImag()">
                                        ✖
                                     </div>`;
            var popupImage = `
                                <div class='popupImageContainer'  onclick="closePopupImag()">
                                  ${popupImageHeader}
                                     <div id="jsPopupImageBody" class="popupImageBody" >  
                                        ${popImageControls}
                                        <img onclick="event.stopPropagation()" src='${src}'/>
                                    </div>
                                  ${popupImageStyle}
                                </div>
                               `;
            document.querySelector("body").insertAdjacentHTML("beforeend", popupImage);
        };
    });
}
