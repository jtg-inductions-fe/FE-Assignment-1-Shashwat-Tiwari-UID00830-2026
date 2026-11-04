/**
 * This file contains functions to manage the state of won deals, including adding new won deals, retrieving the list of won deals, counting them, and checking if a deal has been won.
 */

const wonDeals = [];

/**
 * Adds a new won deal to the list of won deals.
 * @param {*} deal
 * @returns {Object} The added won deal object.
 */
export function addWonDeal(deal) {
    const won = { ...deal, wonAt: Date.now() };
    wonDeals.push(won);
    return won;
}
/**
 * Returns the list of all won deals.
 * @returns {Array} The array of won deals.
 */
export function getWonDeals() {
    return [...wonDeals];
}
/**
 * Gets the count of won deals.
 * @returns {number} The number of won deals.
 */
export function getWonCount() {
    return wonDeals.length;
}
/**
 * Checks if a deal has been won.
 * @param {*} deal
 * @returns {boolean} True if the deal has been won, false otherwise.
 */
export function isWon(deal) {
    return wonDeals.some((d) => d.code === deal.code);
}
