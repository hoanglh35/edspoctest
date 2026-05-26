/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-press variant.
 * Base block: cards
 * Source: https://www.cohesity.com/newsroom/press/cohesity-earns-aws-resilience-competency/
 * Selector: .related-list-container__press
 * Generated: 2026-05-26
 *
 * Extracts related press release items from .related-lists__press.
 * Each .related-item contains: icon image, eyebrow label, headline, and CTA link.
 * Output: Cards block table with one row per card (icon in col1, text content in col2).
 */
export default function parse(element, { document }) {
  // Find all related items within the press release list
  const items = element.querySelectorAll('.related-item');

  const cells = [];

  items.forEach((item) => {
    // Column 1: Icon image
    const icon = item.querySelector('.related-item__icon img');

    // Column 2: Text content (eyebrow, heading, CTA link)
    const eyebrow = item.querySelector('.related-item__eyebrow, .related-item__text span');
    const heading = item.querySelector('h5.related-item__description, .related-item__description');
    const link = item.querySelector('a[href]');

    // Build column 1 content
    const col1 = [];
    if (icon) {
      col1.push(icon);
    }

    // Build column 2 content
    const col2 = [];
    if (eyebrow) {
      const eyebrowEl = document.createElement('p');
      eyebrowEl.textContent = eyebrow.textContent.trim();
      col2.push(eyebrowEl);
    }
    if (heading) {
      col2.push(heading);
    }
    if (link) {
      const ctaLink = document.createElement('a');
      ctaLink.href = link.getAttribute('href') || link.href;
      ctaLink.textContent = link.textContent.trim() || 'Read now';
      col2.push(ctaLink);
    }

    // Add row only if we have content
    if (col1.length > 0 || col2.length > 0) {
      cells.push([col1, col2]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-press', cells });
  element.replaceWith(block);
}
