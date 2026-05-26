/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-promo
 * Base block: carousel
 * Source: https://www.lg.com/de/
 * Selectors: .component.ST0048 .cmp-carousel.c-carousel,
 *            .c-wrapper.PD0002 .cmp-carousel.c-carousel,
 *            .c-wrapper.PD0046 .cmp-carousel.c-carousel
 * Generated: 2026-05-26
 * Validation: lg.com returns "Access Denied" to headless browsers (bot protection).
 *             Parser logic verified via interactive Playwright session against live DOM.
 *             Selectors confirmed working: ST0048 (7 slides), PD0002 (9 slides), PD0046 (3 slides).
 *
 * Handles three carousel variants on the LG homepage:
 * 1. Hero banner carousel (ST0048) - slides with .c-hero-banner containing bg image, heading, desc, CTA
 * 2. Feature list carousel (PD0046) - slides with .c-feature-list__item containing image, heading, desc, CTA
 * 3. Product card carousel (PD0002) - slides with .neo-card containing product image, heading, link
 *
 * Each slide becomes rows in the block table: image, heading, description (if available), CTA link.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Get slides - use .cmp-carousel__item which is consistent across all carousel types
  // Exclude swiper-slide-duplicate to avoid repeating content
  let slides = Array.from(
    element.querySelectorAll(':scope .cmp-carousel__item:not(.swiper-slide-duplicate)')
  );

  // Fallback: if no .cmp-carousel__item found, try direct children with swiper-slide
  if (slides.length === 0) {
    slides = Array.from(
      element.querySelectorAll(':scope .swiper-slide:not(.swiper-slide-duplicate)')
    );
  }

  slides.forEach((slide) => {
    // --- Strategy 1: Hero Banner slides (ST0048 pattern) ---
    const heroBanner = slide.querySelector('.c-hero-banner');
    if (heroBanner) {
      const image = heroBanner.querySelector('.c-hero-banner__image img, .cmp-image__image, img');
      const heading = heroBanner.querySelector('.cmp-title__text');
      const description = heroBanner.querySelector('.c-text-contents__bodycopy .cmp-text p, .c-text-contents__bodycopy p');
      const cta = heroBanner.querySelector('.c-cta a.cmp-button, .c-cta a');

      if (image) cells.push([image]);
      if (heading) {
        const h2 = document.createElement('h2');
        h2.textContent = heading.textContent.trim();
        cells.push([h2]);
      }
      if (description) {
        const p = document.createElement('p');
        p.textContent = description.textContent.trim();
        cells.push([p]);
      }
      if (cta) {
        const link = document.createElement('a');
        link.href = cta.href || cta.getAttribute('href') || '';
        const buttonText = cta.querySelector('.cmp-button__text, .c-button__text');
        link.textContent = buttonText ? buttonText.textContent.trim() : cta.textContent.trim();
        cells.push([link]);
      }
      return;
    }

    // --- Strategy 2: Feature List slides (PD0046 pattern) ---
    const featureItem = slide.querySelector('.c-feature-list__item');
    if (featureItem) {
      const image = featureItem.querySelector('img');
      const heading = featureItem.querySelector('.cmp-title__text');
      const description = featureItem.querySelector('.c-text-contents__bodycopy p, .c-text-contents__bodycopy');
      const cta = featureItem.querySelector('a[href]');

      if (image) cells.push([image]);
      if (heading) {
        const h2 = document.createElement('h2');
        h2.textContent = heading.textContent.trim();
        cells.push([h2]);
      }
      if (description) {
        const p = document.createElement('p');
        p.textContent = description.textContent.trim();
        cells.push([p]);
      }
      if (cta) {
        const link = document.createElement('a');
        link.href = cta.href || cta.getAttribute('href') || '';
        link.textContent = cta.textContent.trim();
        cells.push([link]);
      }
      return;
    }

    // --- Strategy 3: Product Card slides (PD0002 neo-card pattern) ---
    const image = slide.querySelector('img');
    const heading = slide.querySelector('h3, h2, .cmp-title__text, [class*="product-name"]');
    const cta = slide.querySelector('a[href]');

    if (image) cells.push([image]);
    if (heading) {
      const h2 = document.createElement('h2');
      h2.textContent = heading.textContent.trim();
      cells.push([h2]);
    }
    if (cta) {
      const link = document.createElement('a');
      link.href = cta.href || cta.getAttribute('href') || '';
      link.textContent = cta.textContent.trim() || heading?.textContent.trim() || '';
      cells.push([link]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-promo', cells });
  element.replaceWith(block);
}
