let btnFlips = document.querySelectorAll('.btn-flip');
let cardFront = document.querySelector('.card-front');
let cardBack = document.querySelector('.card-back');

btnFlips.forEach(btnFlip => {
    btnFlip.addEventListener("click", function(){
        if (cardFront.classList.contains('content-visible')) {
            cardBack.classList.toggle('content-visible');
            cardBack.classList.toggle('content-hidden');
        } else {
            cardFront.classList.toggle('content-visible');
            cardFront.classList.toggle('content-hidden');
        }
    })
});