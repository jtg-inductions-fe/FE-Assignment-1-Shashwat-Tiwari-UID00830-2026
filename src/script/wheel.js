/**
 * This module handles the functionality of the deals wheel, including initializing the wheel, spinning it, displaying results, and managing the view between the wheel and list of won deals.
 * It interacts with the API to fetch deals, manages the state of won deals, and updates the UI accordingly.
 */

import { getDeals } from './api.js';
import * as c from './constants.js';
import { addWonDeal, getWonDeals, getWonCount, isWon } from './state.js';
import { updateWheelStyles, getWinningIndex } from './wheel-handler.js';

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
const pointer = document.querySelector('.deals-modal__pointer');

let allDeals = [];
let wheelDeals = [];
let currentRotation = 0;
let winningDeal = null;

/**
 *  Initializes the deals wheel by fetching available deals from the API, updating the UI to reflect the loading state, and preparing the wheel for interaction.
 *  If no deals are available, it displays a message indicating that no deals were found.
 *  @async
 *  @function initWheel
 *  @returns {Promise<void>} A promise that resolves when the wheel is initialized.
 */
export async function initWheel() {
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

/**
 * Picks a random selection of deals from a list.
 * @param {Array} list - The list of deals to choose from.
 * @param {number} n - The number of deals to select.
 * @returns {Array} - The array of selected deals.
 */
function pickRandomDeal(list, n) {
    const shuffled = [...list].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
}

/**
 * Renders the deals wheel with the provided deals, updating the UI to display each deal's title on the wheel.
 * @param {Array} deals - The array of deals to display on the wheel.
 */
function renderWheel(deals) {
    disc.innerHTML = '';
    if (deals.length <= 1) {
        return;
    }
    updateWheelStyles(disc, deals.length);
    deals.forEach((deal) => {
        const label = document.createElement('span');
        label.className = 'deals-modal__label';
        label.textContent = deal.title;
        disc.appendChild(label);
    });
}

/**
 * Loads the deals wheel with available deals that have not been won yet, selecting a random subset of up to 4 deals to display on the wheel.
 * If there are no available deals, the wheel will not be loaded.
 * @returns {boolean} - Returns true if the wheel was successfully loaded with deals, false otherwise.
 */
function loadWheel() {
    const available = allDeals.filter((deal) => !isWon(deal));
    if (available.length <= 1) {
        loadingState.hidden = false;
        spinBtn.hidden = true;
        loadingState.textContent = 'No more deals available';
        return false;
    }
    wheelDeals = pickRandomDeal(available, 4);
    renderWheel(wheelDeals);
    return true;
}

/**
 *  Spins the deals wheel, randomly determining a winning deal based on the final position of the wheel after spinning.
 *  The function disables the spin button during the spin animation, calculates the winning deal based on the pointer's angle, and displays the result.
 *  If there are no available deals to spin, or if the wheel fails to load, the function will not proceed with spinning.
 *  @function spinWheel
 *
 */
export function spinWheel() {
    resultElement.hidden = true;
    if (wheelDeals.length <= 1) {
        return;
    }
    if (!loadWheel()) {
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
        let winningIndex = getWinningIndex(pointerAngle, wheelDeals.length);
        winningDeal = wheelDeals[winningIndex];
        showResult(addWonDeal(winningDeal));
    }, 4000);
}

/**
 * Gets the expiry text for a given deal.
 * @param {*} deal The deal object.
 * @returns {string} The expiry text.
 */
function getExpiryText(deal) {
    const remaining =
        deal.wonAt + deal.validityDays * (24 * 60 * 60 * 1000) - Date.now();
    if (remaining <= 0) return 'Expired';
    const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
    if (days >= 1) return `Expires in ${days}d`;
    return `Expires in ${Math.max(1, Math.floor(remaining / (60 * 60 * 1000)))}h`;
}

/**
 * Shows the result of a spin.
 * @param {*} won The won deal.
 */
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
/**
 * Gets the expiry timestamp for a given deal.
 * @param {*} deal The deal object.
 * @returns {number} The expiry timestamp.
 */
function getExpiry(deal) {
    return deal.wonAt + deal.validityDays * (24 * 60 * 60 * 1000);
}

/**
 * Sorts an array of deals by their expiry date.
 * @param {*} deals
 * @returns {Array} The sorted array of deals.
 */
function sortDeals(deals) {
    const now = Date.now();

    const valid = deals.filter((deal) => getExpiry(deal) > now);
    const expired = deals.filter((deal) => getExpiry(deal) <= now);

    valid.sort((a, b) => getExpiry(a) - getExpiry(b));

    return [...valid, ...expired];
}
/**
 * Creates the list of won deals and updates the UI to display them in a sorted order, with valid deals shown before expired ones.
 */
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

/**
 * Changes the view from the deals wheel to the list of won deals, updating the UI to reflect the change.
 */
export function changeView() {
    createList();
    viewWheel.hidden = true;
    viewList.hidden = false;
}
/**
 * Changes the view from the list of won deals back to the deals wheel, updating the UI to reflect the change.
 */
export function changeBack() {
    viewWheel.hidden = false;
    viewList.hidden = true;
}
/**
 * Copies the code of a deal to the clipboard.
 * @param {Event} e The event object.
 */
export async function copyCode(e) {
    const btn = e.target.closest('[data-copy]');
    if (!btn || btn.disabled) return;
    await navigator.clipboard.writeText(btn.dataset.copy);
    btn.classList.add('deal__copy--done');
    setTimeout(() => {
        btn.classList.remove('deal__copy--done');
    }, 2000);
}
