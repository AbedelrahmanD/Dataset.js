document.addEventListener("DOMContentLoaded",function(){
initDataHtml();
});
var dataHtml;
function initDataHtml(){
    dataHtml=document.querySelectorAll("[data-html]");
    dataHtml.forEach(el=>{
        el.style.cursor="pointer";
        el.onclick=()=>{
            var element=event.currentTarget;
            var dataHtml=element.getAttribute("data-html");
            document.querySelector(`[data-html-content='${dataHtml}']`).innerHTML=element.innerHTML;
        }
    });
}