'use strict';

window.onload = () => {
    if (window.innerWidth >= 610) return;
    document.querySelector('svg.menuButton').addEventListener('click', handleMenu);
};

function handleMenu() {
    const menu = document.querySelector('nav');
    if (menu.classList.contains('slide')) {
        menu.classList.remove('slide');
        menu.classList.add('slideOut');
    } else if (menu.classList.contains('slideOut')) {
        menu.classList.remove('slideOut');
        menu.classList.add('slide');
    } else {
        menu.classList.add('slide');
    }
}
