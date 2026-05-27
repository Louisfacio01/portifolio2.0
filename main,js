//Efect scroll 
window.addEventListener("scroll", function(){
    const header = document.querySelector("header");
    header.classList.toggle("sticky", window.scrollY > 0);
});

const serviceModals = document.querySelector(".service-modal");
const learnmoreBtns = document.querySelector(".learn-more-btn");
const modalCloseBtns = document.querySelector(".modal-close-btn");

var modal = function (modalClick) {
    serviceModals[modalClick].classList.add("active");
}

learnmoreBtns.forEach((learnmoreBtn, i) => {
    learnmoreBtn.addEventListener("click", () =>{
        modal(i);
    })
})

modalCloseBtns.forEach((modalCloseBtn) => {
    modalCloseBtn.addEventListener("click", () => {
         serviceModals.forEach((modalView) => {
             modalView.classList.remove("active");
         })
    })
})