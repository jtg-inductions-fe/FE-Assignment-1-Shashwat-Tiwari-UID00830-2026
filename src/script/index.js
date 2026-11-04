/**
 * This script handles the functionality part of the entire page.
 */
import * as c from './constants.js';
import { initializeCarousel } from './splide.js';
import { getDeals } from './api.js';
import { isWon, addWonDeal, getWonCount, getWonDeals } from './state.js';

const menuBtn = document.querySelector('.header__menu-button');
const navLinks = document.getElementById('nav-links');
const menuIcon = document.querySelector('.header__menu-icon');
const btnContainer = document.querySelector('.header__button-container');
const body = document.body;
const footerButtons = document.querySelectorAll('.footer__trigger');
const desktopQuery = window.matchMedia(`(min-width: ${c.mobilewidth}px)`);
const openModalLink = document.getElementById('openModalLink');
const closeModalBtn = document.querySelector('.deals-modal__close');
const modal = document.querySelector('.deals-modal');
const spinBtn = document.querySelector('.deals-modal__spin-btn');
const loadingState = document.querySelector('.deals-modal__loading-state');
const disc = document.querySelector('.deals-modal__disc');
const resultElement = document.querySelector('.deals-modal__result');
const resultDealElement = document.querySelector('.deals-modal__result-deal');
const viewAllBtn = document.querySelector('.deals-modal__view-all');
const badgeEl = document.querySelector('.deals-modal__badge');
const viewWheel = document.querySelector('.deals-modal__view');
const viewList = document.querySelector('.deals-modal__listview');
const listEl = document.querySelector('.deals-modal__list');
const backBtn = document.querySelector('.deals-modal__back');
const pointer = document.querySelector('.deals-modal__pointer');

let allDeals = [];
let wheelDeals = [];
let currentRotation = 0;
let winningDeal = null;
function outofFocusModal(event) {
    if (event.target === modal) {
        viewWheel.hidden = false;
        viewList.hidden = true;
        closeModal();
    }
}

function closeModal() {
    modal.close();
    body.style.overflow = '';
}
function openModal(e) {
    e.preventDefault();
    modal.showModal();
    body.style.overflow = 'hidden';
}

async function initWheel() {
    allDeals = await getDeals();
    loadingState.hidden = true;
    spinBtn.hidden = false;
    pointer.src = c.redPointerPath;
    if (allDeals.length === 0) {
        loadingState.hidden = false;
        spinBtn.hidden = true;
        loadingState.textContent = 'No deals found';
        return;
    }
    loadWheel();
}

function pickRandomDeal(list, n) {
    const shuffled = [...list].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
}

function renderWheel(deals) {
    disc.innerHTML = '';
    if (deals.length === 0) return;
    deals.forEach((deal) => {
        const label = document.createElement('span');
        label.className = 'deals-modal__label';
        label.textContent = deal.title;
        disc.appendChild(label);
    });
}

function loadWheel() {
    const available = allDeals.filter((deal) => !isWon(deal));
    wheelDeals = pickRandomDeal(available, 4);
    renderWheel(wheelDeals);
}

function spinWheel() {
    resultElement.hidden = true;
    loadWheel();
    if (wheelDeals.length === 0) {
        return;
    }
    spinBtn.disabled = true;
    const randomDegrees = Math.floor(Math.random() * 360);
    const totalspinDegrees = 360 * 3 + randomDegrees;
    currentRotation += totalspinDegrees;
    disc.style.transform = `rotate(${currentRotation}deg)`;
    spinBtn.style.transform = `rotate(${currentRotation}deg)`;
    setTimeout(() => {
        spinBtn.disabled = false;
        const stopDegrees = currentRotation % 360;
        const pointerAngle = (360 - stopDegrees) % 360;
        let winningIndex = 0;
        if (pointerAngle >= 0 && pointerAngle < 90) {
            winningIndex = 0;
        } else if (pointerAngle >= 90 && pointerAngle < 180) {
            winningIndex = 1;
        } else if (pointerAngle >= 180 && pointerAngle < 270) {
            winningIndex = 2;
        } else {
            winningIndex = 3;
        }
        winningDeal = wheelDeals[winningIndex];
        showResult(addWonDeal(winningDeal));
    }, 4000);
}

function getExpiryText(deal) {
    const remaining =
        deal.wonAt + deal.validityDays * (24 * 60 * 60 * 1000) - Date.now();
    if (remaining <= 0) return 'Expired';
    const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
    if (days >= 1) return `Expires in ${days}d`;
    return `Expires in ${Math.max(1, Math.floor(remaining / (60 * 60 * 1000)))}h`;
}

function showResult(won) {
    resultDealElement.innerHTML = `
    <div class="deal">
      <div class="deal__info">
        <p class="deal__title">${won.title}</p>
        <p class="deal__expiry">${getExpiryText(won)}</p>
      </div>
      <code class="deal__code">${won.code}</code>
      <button class="deal__copy" type="button" data-copy="${won.code}" aria-label="Copy code ${won.code}">
        <img src="src/assets/copy.svg" alt="" class="deal__copy-img" />
      </button>
    </div>
    `;
    resultElement.hidden = false;
    badgeEl.textContent = getWonCount();
    viewAllBtn.hidden = false;
}

function getExpiry(deal) {
    return deal.wonAt + deal.validityDays * (24 * 60 * 60 * 1000);
}

function sortDeals(deals) {
    const now = Date.now();

    const valid = deals.filter((deal) => getExpiry(deal) > now);
    const expired = deals.filter((deal) => getExpiry(deal) <= now);

    valid.sort((a, b) => getExpiry(a) - getExpiry(b));

    return [...valid, ...expired];
}

function createList() {
    const sorted = sortDeals(getWonDeals());
    const now = Date.now();

    listEl.innerHTML = sorted
        .map((deal) => {
            const expired = getExpiry(deal) <= now;
            return `
        <li class="deal">
          <div class="deal__info">
            <p class="deal__title">${deal.title}</p>
            <p class="deal__expiry">${expired ? 'Deal expired' : getExpiryText(deal)}</p>
          </div>
          <code class="deal__code">${deal.code}</code>
          <button class="deal__copy" type="button" data-copy="${deal.code}"
                   ${deal.code}" ${expired ? 'disabled' : ''}>
            <img src="src/assets/copy.svg" alt="" />
          </button>
        </li>`;
        })
        .join('');
}

function changeView() {
    createList();
    viewWheel.hidden = true;
    viewList.hidden = false;
}
function changeBack() {
    viewWheel.hidden = false;
    viewList.hidden = true;
}

async function copyCode(e) {
    const btn = e.target.closest('[data-copy]');
    if (!btn || btn.disabled) return;
    await navigator.clipboard.writeText(btn.dataset.copy);
    btn.classList.add('deal__copy--done');
    setTimeout(() => {
        btn.classList.remove('deal__copy--done');
    }, 2000);
}
/**
 * Toggles the mobile navigation menu and updates the menu icon.
 * Also handles the button container visibility for narrow mobile viewports.
 */
function handleMenuToggle() {
    navLinks.classList.toggle('header__navlinks--active');
    const menuButton = menuIcon.closest('button') || menuIcon;
    menuButton.focus();
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

/**
 * Closes the mobile navigation menu and resets the menu icon to its default state.
 */
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
        const menuButton = menuIcon.closest('button') || menuIcon;
        menuButton.focus();
        return;
    }
    if (e.key === 'Tab') {
        const navElements = Array.from(navLinks.querySelectorAll('a'));
        const buttonElements = Array.from(
            desktopQuery.matches ? [] : btnContainer.querySelectorAll('button'),
        );
        const menuButton = menuIcon.closest('button') || menuIcon;
        const elements = [menuButton, ...navElements, ...buttonElements];

        const allFocusableElements = elements.filter(
            (el) => el.offsetWidth > 0 || el.offsetHeight > 0,
        );
        if (allFocusableElements.length <= 1) return;
        e.preventDefault();
        const index = allFocusableElements.indexOf(document.activeElement);
        const last = allFocusableElements.length - 1;
        let next;
        if (e.shiftKey) {
            next = index <= 0 ? last : index - 1;
        } else {
            next = index === last ? 0 : index + 1;
        }
        allFocusableElements[next].focus();
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

/**
 * Toggles the open state of a footer section.
 * @param {event} - The click event object.
 */
function toggleFooterSection(event) {
    const clickedButton = event.currentTarget;
    const currentSection = clickedButton.parentElement;
    currentSection.classList.toggle('footer__section--active');
}

/**
 * This function handles the resizing of the footer section based on the current screen width.
 */
function handleFooterResize() {
    const currentwidth = window.innerWidth;
    footerButtons.forEach((button) => {
        if (currentwidth > c.mobilewidth) {
            document.querySelectorAll('.footer__section').forEach((section) => {
                section.classList.remove('footer__section--active');
            });
            if (document.activeElement === button) {
                button.blur();
            }
            button.setAttribute('tabindex', '-1');
        } else {
            button.setAttribute('tabindex', '0');
        }
    });
}

document.querySelectorAll('.footer__trigger').forEach((button) => {
    button.addEventListener('click', toggleFooterSection);
});

window.addEventListener('resize', handleFooterResize);
window.addEventListener('keydown', menuAccessibility);
menuBtn.addEventListener('click', handleMenuToggle);
navLinks.addEventListener('click', handleNavLinkClick);
window.addEventListener('resize', handleWindowResize);
document.addEventListener('click', outOfFocus);
document.addEventListener('DOMContentLoaded', initializeCarousel);
openModalLink.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', outofFocusModal);
openModalLink.addEventListener('click', initWheel);
spinBtn.addEventListener('click', spinWheel);
viewAllBtn.addEventListener('click', changeView);
backBtn.addEventListener('click', changeBack);
resultDealElement.addEventListener('click', copyCode);
listEl.addEventListener('click', copyCode);
