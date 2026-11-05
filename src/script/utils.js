import { msInADay } from './constants.js';

/**
 * Gets the expiry timestamp for a given deal.
 * @param {*} deal The deal object.
 * @returns {number} The expiry timestamp.
 */
export function getExpiry(deal) {
    return deal.wonAt + deal.validityDays * msInADay;
}

export function getRemainingTime(deal) {
    return getExpiry(deal) - Date.now();
}
