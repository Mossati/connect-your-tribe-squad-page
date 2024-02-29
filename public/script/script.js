let cards = document.querySelectorAll('.card-item');
// ============================================================
//toggle front en back display van card
// ============================================================
cards.forEach(card => {
    let cardFront = card.querySelector('.card-front');
    let cardBack = card.querySelector('.card-back');
    let btnFlips = card.querySelectorAll('.btn-flip');

    btnFlips.forEach(btnFlip => {
        btnFlip.addEventListener("click", function(){
            // voeg animatie class toe
            card.classList.toggle('card-scale');

            //verander display class
            cardFront.classList.toggle('content-visible');
            cardFront.classList.toggle('content-hidden');
            cardBack.classList.toggle('content-hidden');
            cardBack.classList.toggle('content-visible');

            //verwijder class na afloop animatie
            card.addEventListener("animationend", function(){
                card.classList.remove('card-scale');
            })
        });
    })
});
// ============================================================
//toggle navbar
// ============================================================
let btnMenu = document.querySelector('.btn-menu');
let navbar = document.querySelector('.navbar');

btnMenu.addEventListener("click", function() {
    //verander navbar icoon en tekst
    if (btnMenu.innerHTML === '<i class="fa-solid fa-bars"></i> Menu') {
        btnMenu.innerHTML = '<i class="fa-solid fa-xmark"></i> Close';
    }else {
        btnMenu.innerHTML = '<i class="fa-solid fa-bars"></i> Menu';
    }

    //toggle navbar menu
    navbar.classList.toggle('content-visible');
    navbar.classList.toggle('content-hidden');
    navbar.classList.toggle('menu-slide');
})
// ============================================================
//search person
// ============================================================
let searchInput = document.querySelector('#search');

searchInput.addEventListener("input", function(){
    //haal de zoekterm op
    let searchedName = searchInput.value.toLowerCase();

    //haal naam van persoon op
    cards.forEach(card => {
        let personName = card.querySelector('.card-front h2').textContent.toLowerCase();

        if (personName.includes(searchedName)) {
            card.classList.remove('content-hidden');
        }else {
            card.classList.add('content-hidden');
        }
    })
})
// ============================================================
//sort menu
// ============================================================
let sortMenu = document.querySelector('.sort-menu');

sortMenu.addEventListener("change", function(){
    let sortOption = sortMenu.value;

    cards = Array.from(cards);

    cards.sort((a, b) => {
        let aValue;
        let bValue;

        if (sortOption === "id") {
            aValue = parseInt(a.querySelector('.like-form input').value);
            bValue = parseInt(b.querySelector('.like-form input').value);
            return aValue - bValue;
        } else if (sortOption === "alphabetic") {
            aValue = a.querySelector('.card-front h2').textContent.toLowerCase();
            bValue = b.querySelector('.card-front h2').textContent.toLowerCase();
            return aValue.localeCompare(bValue);
        } else if (sortOption === "likes") {
            aValue = parseInt(a.querySelector('.like-counter').textContent);
            bValue = parseInt(b.querySelector('.like-counter').textContent);
            return bValue - aValue;
        }
    });

    let container = document.querySelector('.card-list');
    
    cards.forEach(card => {
        container.appendChild(card);
    });
});

