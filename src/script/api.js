/**
 * This file contains functions to fetch and format deal data from the API.
 */

import * as c from './constants.js';

let cachedDeals = null;
/**
 * Fetches the list of deals from the API and caches the result.
 * @returns {Promise<Array>} A promise that resolves to an array of formatted deal objects.
 */
export async function getDeals() {
    if (cachedDeals) return cachedDeals;
    const response = await fetch(c.DEALS_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch deals');
    }
    const data = await response.json();
    cachedDeals = data.map(formatDeal);
    return cachedDeals;
}
/**
 * Formats a deal object with the required properties.
 * @param {*} deal
 * @returns {Object} The formatted deal object.
 */
function formatDeal(deal) {
    return {
        title: deal.label,
        code: deal.promoCode,
        validityDays: deal.validFor ?? c.DEFAULT_VALIDITY_DAYS,
    };
}
