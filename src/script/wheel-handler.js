/**
 * This file contains functions to handle the wheel's styles and determine the winning index.
 */

/**
 * Updates the styles of the wheel disc element based on the number of deals available.
 * @param {*} discElement
 * @param {*} dealCount
 */
export function updateWheelStyles(discElement, dealCount) {
    discElement.classList.remove('has-3-deals', 'has-2-deals', 'has-1-deal');
    if (dealCount === 3) {
        discElement.classList.add('has-3-deals');
    } else if (dealCount === 2) {
        discElement.classList.add('has-2-deals');
    } else if (dealCount === 1) {
        discElement.classList.add('has-1-deal');
    }
}
/**
 * Gets the index of the winning deal based on the pointer angle and the number of deals.
 * @param {*} pointerAngle
 * @param {*} dealCount
 * @returns {number} The index of the winning deal.
 */
export function getWinningIndex(pointerAngle, dealCount) {
    if (dealCount === 3) {
        if (pointerAngle >= 0 && pointerAngle < 120) {
            return 0;
        }
        if (pointerAngle >= 120 && pointerAngle < 240) {
            return 1;
        }
        return 2;
    }
    if (dealCount === 2) {
        if (pointerAngle >= 0 && pointerAngle < 180) return 0;
        return 1;
    }
    if (dealCount === 1) {
        return 0;
    }
    if (pointerAngle >= 0 && pointerAngle < 90) return 0;
    if (pointerAngle >= 90 && pointerAngle < 180) return 1;
    if (pointerAngle >= 180 && pointerAngle < 270) return 2;
    return 3;
}
