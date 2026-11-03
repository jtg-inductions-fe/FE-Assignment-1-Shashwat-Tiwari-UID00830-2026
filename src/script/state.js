const wonDeals = [];

export function addWonDeal(deal) {
    const won = { ...deal, wonAt: Date.now() };
    wonDeals.push(won);
    return won;
}

export function getWonDeals() {
    return [...wonDeals];
}

export function getWonCount() {
    return wonDeals.length;
}

export function isWon(deal) {
    return wonDeals.some((d) => d.code === deal.code);
}
