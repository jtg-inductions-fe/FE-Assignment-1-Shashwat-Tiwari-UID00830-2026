import * as c from './constants.js';

let cachedDeals = null;

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

function formatDeal(deal) {
    return {
        title: deal.label,
        code: deal.promoCode,
        validityDays: deal.validFor ?? c.DEFAULT_VALIDITY_DAYS,
    };
}
