/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-banner
 * Base block: hero
 * Source: https://www.lg.com/de/
 * Selector: .trdBanner-v1
 * Generated: 2026-05-26
 * Note: Live validation blocked by Akamai CDN bot protection (Access Denied for headless browser).
 * Parser logic validated against cached source.html and confirmed on live page via Playwright.
 *
 * Extracts a full-width promotional banner with background image,
 * heading text, description, and CTA link from the LG trending banner component.
 *
 * Source structure:
 *   .trdBanner-v1
 *     a.trdBanner-v1__item[href]
 *       .trdBanner-v1__bg > .cmp-image > picture > img
 *       .trdBanner-v1__title > span (multiple spans)
 *       .trdBanner-v1__desc > span.trdBanner-v1__desc--text
 */
export default function parse(element, { document }) {
  // Extract background image - try specific selectors first, then fallback
  const bgImage = element.querySelector('.trdBanner-v1__bg img')
    || element.querySelector('.cmp-image__image')
    || element.querySelector('img');

  // Extract title text from .trdBanner-v1__title (contains multiple span children)
  const titleEl = element.querySelector('.trdBanner-v1__title')
    || element.querySelector('[class*="title"]');
  let heading = null;
  if (titleEl) {
    const titleText = titleEl.textContent.trim();
    if (titleText) {
      heading = document.createElement('h1');
      heading.textContent = titleText;
    }
  }

  // Extract description text
  const descEl = element.querySelector('.trdBanner-v1__desc--text')
    || element.querySelector('.trdBanner-v1__desc')
    || element.querySelector('[class*="desc"]');
  let description = null;
  if (descEl) {
    const descText = descEl.textContent.trim();
    if (descText) {
      description = document.createElement('p');
      description.textContent = descText;
    }
  }

  // Extract CTA link from the wrapping anchor
  const ctaAnchor = element.querySelector('a.trdBanner-v1__item')
    || element.querySelector('a[href]');
  let ctaLink = null;
  if (ctaAnchor && ctaAnchor.getAttribute('href')) {
    ctaLink = document.createElement('a');
    ctaLink.href = ctaAnchor.getAttribute('href');
    // Use description text as link label if available, else fallback
    const linkText = descEl ? descEl.textContent.trim() : 'Learn more';
    ctaLink.textContent = linkText || 'Learn more';
  }

  // Build cells array matching library example structure:
  // Row 1: Image (background/hero image)
  // Row 2: Heading (h1)
  // Row 3: Description text
  // Row 4: CTA link
  const cells = [];

  if (bgImage) {
    cells.push([bgImage]);
  }

  if (heading) {
    cells.push([heading]);
  }

  if (description) {
    cells.push([description]);
  }

  if (ctaLink) {
    cells.push([ctaLink]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
