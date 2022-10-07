var dataCarousel;
document.addEventListener("DOMContentLoaded", function () {
    initDataCarousel();
});
function generateCarouselButtons(dataCarousel) {
    var bodyDir = document.querySelector("body").getAttribute("dir");
    var nextIcon;
    var prevIcon;
    if (bodyDir == "ltr") {
        nextIcon = "❯";
        prevIcon = "❮";
    } else {
        nextIcon = "❮";
        prevIcon = "❯";
    }
    return `    
    <style>
    .carouselPrev,
    .carouselNext{
        position:absolute;
        top:40%;
        width:3rem;
        height:3rem;
        display:flex;
        justify-content:center;
        align-items:center;
        border-radius:100%;
        background-color:white;
        color:black;
        cursor: pointer;
        border:1px solid black;
    }
    .carouselNext{
        right:1rem
    }
    .carouselPrev{
        left:1rem
    }
    </style>
    <button class="carouselNext"  onclick="moveCarousel('next','${dataCarousel}')"> ${nextIcon}</button>
    <button class="carouselPrev" onclick="moveCarousel('prev','${dataCarousel}')"> ${prevIcon}</button>`;
}
function moveCarousel(direction, dataCarousel) {
    var carouselParent = document.querySelector(`[data-carousel='${dataCarousel}']`);
    var scrollBy = carouselParent.getAttribute("data-carousel-scroll") ?? 1;
    var carousel = carouselParent.children[0];
    var childWidth = carousel.children[0].offsetWidth;
    if (direction == "next") {
        carousel.scrollLeft += childWidth * scrollBy;
    } else {
        carousel.scrollLeft -= childWidth * scrollBy;
    }


}
function initDataCarousel() {
    dataCarousel = document.querySelectorAll("[data-carousel]");
    dataCarousel.forEach(el => {
        el.style.position = "relative";
        var carousel = el.children[0];
        carousel.style.display = "flex";
        carousel.style.scrollBehavior = "smooth";
        carousel.style.overflow = "hidden";
        Array.from(carousel.children).forEach(child => {
            child.style.flexShrink = 0;
        });

        el.insertAdjacentHTML("beforeend", generateCarouselButtons(el.getAttribute("data-carousel")));

    });
}