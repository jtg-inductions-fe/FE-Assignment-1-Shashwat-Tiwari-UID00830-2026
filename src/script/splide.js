/**
 * This file contains the code for initializing and configuring the Splide carousel on the page.
 */

import Splide from '@splidejs/splide';
import '@splidejs/splide/css/core';

/**
 * Makes all the dots in the carousel focusable.
 * @param {containerElement} - The DOM element containing the carousel.
 */
function keepAllDotsFocusable(containerElement) {
    const dots = containerElement.querySelectorAll('.splide__pagination__page');
    dots.forEach((dot) => dot.setAttribute('tabindex', '0'));
}

/**
 * Initializes and configures the main Splide image carousel instance.
 *
 * This function locates the 'splide' DOM container, initialises a new Splide instance with the inputs we require,
 * and sets up event listeners to ensure that all pagination dots are focusable for accessibility.
 *
 * @function initializeCarousel
 * @returns {void} This function does not return a value.
 */
export function initializeCarousel() {
    const el = document.querySelector('.splide');
    if (el) {
        const carousel = new Splide(el, {
            type: 'loop',
            perPage: 1,
            perMove: 1,
            arrows: true,
            pagination: true,
        });
        carousel.on('pagination:mounted', (data) => {
            data.items.forEach((item) => {
                item.button.setAttribute('tabindex', '0');
            });
        });

        carousel.on('moved', () => {
            keepAllDotsFocusable(el);
        });

        carousel.mount();
    }
}
