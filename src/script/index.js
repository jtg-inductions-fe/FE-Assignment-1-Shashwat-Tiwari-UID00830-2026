/**
 * The button element that triggers the opening and closing of the navigation menu.
 * @type {HTMLButtonElement}
 */
const menuBtn = document.querySelector('.header__menu-button');

/**
 * the container element which contains the navigation links.
 * @type {HTMLButtonElement}
 */
const navLinks = document.getElementById('nav-links');

/**
 * the image element used to display the hamburger or close icon depending upon the situation.
 * @type {HTMLImageElement}
 */
const menuIcon = document.querySelector('.header__menu-icon');

/**
 * the file path to the hamburger menu icon asset
 * @type {string}
 */
const hamburgerIconPath = 'src/assets/menu.png';

/**
 * the file path to the cross icon asset
 * @type {string}
 */
const closeIconPath = 'src/assets/cross.jpg';

/**
 * Event listener for the menu button.
 * Toggles the visibility of the mobile navigation links and updates the menu icon and alt text accordingly.
 * @listens click
 */
menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('header__navlinks--active');
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
 * @listens click
 */
navLinks.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
        navLinks.classList.remove('header__navlinks--active');
        menuIcon.src = hamburgerIconPath;
        menuIcon.alt = 'Menu';
    }
});

/**
 * Event listener for the window resize event.
 * Resets the mobile menu visibility and icon if the viewport exceeds the tablet/mobile breakpoint.
 * @listens resize
 */
window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
        navLinks.classList.remove('header__navlinks--active');
        menuIcon.src = hamburgerIconPath;
        menuIcon.alt = 'Menu';
    }
});
