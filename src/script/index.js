/**
 * This script handles the functionality part of the entire page.
 */
import * as c from './constants.js';
import { initializeCarousel } from './splide.js';

export const menuBtn = document.querySelector('.header__menu-button');
export const navLinks = document.getElementById('nav-links');
export const menuIcon = document.querySelector('.header__menu-icon');
export const btnContainer = document.querySelector('.header__button-container');
export const body = document.body;
/**
 * Toggles the mobile navigation menu and updates the menu icon.
 * Also handles the button container visibility for narrow mobile viewports.
 */
function handleMenuToggle() {
    navLinks.classList.toggle('header__navlinks--active');

    if (window.innerWidth <= c.mobilewidth) {
        btnContainer.classList.toggle('header__button-container--active');
    }

    if (navLinks.classList.contains('header__navlinks--active')) {
        menuIcon.src = c.closeIconPath;
        menuIcon.alt = 'Close';
        body.style.overflow = 'hidden';
    } else {
        menuIcon.src = c.hamburgerIconPath;
        menuIcon.alt = 'Menu';
        body.style.overflow = '';
    }
}

/**
 * Closes the mobile navigation menu and resets the icon when a link is clicked.
 * @param {Event} event - The click event object.
 */
function handleNavLinkClick(event) {
    if (event.target.tagName === 'A') {
        closeMobileMenu();
    }
}

function closeMobileMenu() {
    navLinks.classList.remove('header__navlinks--active');
    btnContainer.classList.remove('header__button-container--active');
    menuIcon.src = c.hamburgerIconPath;
    menuIcon.alt = 'Menu';
    body.style.overflow = '';
}
/**
 * Adjusts the navigation menu and button container visibility based on the viewport size.
 */
function handleWindowResize() {
    if (window.innerWidth > c.tabletwidth) {
        navLinks.classList.remove('header__navlinks--active');
        menuIcon.src = c.hamburgerIconPath;
        menuIcon.alt = 'Menu';
    }

    if (window.innerWidth > c.mobilewidth) {
        btnContainer.classList.remove('header__button-container--active');
    }

    if (
        window.innerWidth <= c.mobilewidth &&
        navLinks.classList.contains('header__navlinks--active')
    ) {
        btnContainer.classList.add('header__button-container--active');
    }
}

/**
 * Locks the focus of the keyboard navigation within the mobile menu when it's open.
 * @param {KeyboardEvent} e - The keyboard event object.
 */
function menuAccessibility(e) {
    const isMenuOpen = navLinks.classList.contains('header__navlinks--active');
    if (!isMenuOpen) {
        return;
    }
    if (e.key === 'Escape') {
        e.preventDefault();
        closeMobileMenu();
        menuIcon.focus();
        return;
    }
    if (e.key === 'Tab') {
        const navElements = Array.from(navLinks.querySelectorAll('a'));
        const buttonElements = Array.from(
            btnContainer.querySelectorAll('button'),
        );

        const elements = [menuIcon, ...navElements, ...buttonElements];

        const allFocusableElements = elements.filter(
            (el) => el.offsetWidth > 0 || el.offsetHeight > 0,
        );
        if (allFocusableElements.length <= 1) return;

        const firstElement = allFocusableElements[0];
        const lastElement =
            allFocusableElements[allFocusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
}
/**
 * Closes the mobile menu if the user clicks outside of it.
 * @param {event} - The click event object.
 */
function outOfFocus(event) {
    const isClickInsideMenu =
        navLinks.contains(event.target) || menuBtn.contains(event.target);
    if (
        !isClickInsideMenu &&
        navLinks.classList.contains('header__navlinks--active')
    ) {
        closeMobileMenu();
    }
}

document.querySelectorAll('.footer__trigger').forEach((button) => {
    button.addEventListener('click', toggleFooterSection);
});

window.addEventListener('keydown', menuAccessibility);
menuBtn.addEventListener('click', handleMenuToggle);
navLinks.addEventListener('click', handleNavLinkClick);
window.addEventListener('resize', handleWindowResize);
document.addEventListener('click', outOfFocus);
document.addEventListener('DOMContentLoaded', initializeCarousel);
