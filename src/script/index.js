/**
 * THis script handles the functionality part of the entire page.
 */

const menuBtn = document.querySelector('.header__menu-button');
const navLinks = document.getElementById('nav-links');
const menuIcon = document.querySelector('.header__menu-icon');
const btnContainer = document.querySelector('.header__button-container');

const hamburgerIconPath = 'src/assets/menu.png';
const closeIconPath = 'src/assets/cross.png';

/**
 * Event listener for the menu button.
 * Toggles the visibility of the mobile navigation links and updates the menu icon and alt text accordingly.
 * Toggles the visibility of the button container for mobile viewports.
 * @listens click
 */
menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('header__navlinks--active');
    if (window.innerWidth <= 430) {
        btnContainer.classList.toggle('header__button-container--active');
    }
    if (navLinks.classList.contains('header__navlinks--active')) {
        menuIcon.src = closeIconPath;
        menuIcon.alt = 'Close';
    } else {
        menuIcon.src = hamburgerIconPath;
        menuIcon.alt = 'Menu';
    }
});

/**
 * Event listener for the navigation links.
 * Closes the mobile navigation menu when a link is clicked.
 * Resets the menu icon and alt text to the hamburger icon.
 * @listens click
 */
navLinks.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
        navLinks.classList.remove('header__navlinks--active');
        btnContainer.classList.remove('header__button-container--active');
        menuIcon.src = hamburgerIconPath;
        menuIcon.alt = 'Menu';
    }
});

/**
 * Event listener for the window resize event.
 * Resets the mobile menu visibility and icon if the viewport exceeds the tablet/mobile breakpoint.
 * Resets the button container visibility for larger viewports.
 * @listens resize
 */
window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
        navLinks.classList.remove('header__navlinks--active');
        menuIcon.src = hamburgerIconPath;
        menuIcon.alt = 'Menu';
    }
    if (window.innerWidth > 430) {
        btnContainer.classList.remove('header__button-container--active');
    }
    if (
        window.innerWidth <= 430 &&
        navLinks.classList.contains('header__navlinks--active')
    ) {
        btnContainer.classList.add('header__button-container--active');
    }
});
