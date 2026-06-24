const primaryNav = document.querySelector('.primary-navigation');
const menuBtn = document.querySelector('.menu-btn');

function menuPrincipal() {

    const visibility = primaryNav.getAttribute('data-visible');

    if(visibility === "false") {
        primaryNav.setAttribute('data-visible', true);
        menuBtn.setAttribute('aria-expanded', true);
    } else if(visibility === "true") {
        primaryNav.setAttribute('data-visible', false);
        menuBtn.setAttribute('aria-expanded', false);
    }
}

menuBtn.addEventListener('click', menuPrincipal);