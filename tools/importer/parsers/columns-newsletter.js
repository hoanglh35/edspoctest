/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-newsletter
 * Base block: columns
 * Source: https://www.lg.com/de/
 * Generated: 2026-05-26
 *
 * Extracts newsletter signup section into a two-column Columns block:
 * - Left column: newsletter hero image + benefit/feature icons
 * - Right column: heading + description text + CTA/signup link
 *
 * Instance selectors from page-templates.json:
 * 1. .c-wrapper.ST0003 - Section heading ("LG Newsletter")
 * 2. .c-wrapper.ST0001.width-content - Main content with hero banner layout
 *
 * Source DOM structure (.ST0001.width-content):
 *   > .component > .cmp-container > .c-hero-banner > .c-floating-contents
 *     > .c-floating-contents__floor (main image: img.cmp-image__image)
 *     > .c-floating-contents__floating > .c-hero-banner__contents
 *       > .c-floating-contents__main-contents (heading h2 + body text p)
 *       > .c-floating-contents__sub-contents (benefit icons carousel)
 *
 * Note: Validator cannot load lg.com in headless mode (page requires JS rendering
 * with cookie consent). Selectors verified via interactive Playwright session.
 */
export default function parse(element, { document }) {
  // Determine which instance selector matched this element
  const isSectionTitle = element.classList && element.classList.contains('ST0003');

  if (isSectionTitle) {
    // .c-wrapper.ST0003 only contains the section heading "LG Newsletter"
    // Extract and create a simple single-row columns block with the title
    const sectionTitle = element.querySelector('.cmp-title__text, h2, h3');
    const cells = [];
    if (sectionTitle) {
      cells.push([sectionTitle, '']);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: 'columns-newsletter', cells });
    element.replaceWith(block);
    return;
  }

  // .c-wrapper.ST0001.width-content - Main newsletter content with two-column layout
  const heroBanner = element.querySelector('.c-hero-banner');
  const contentRoot = heroBanner || element;

  // === LEFT COLUMN: Main newsletter image + benefit icons ===
  const leftContent = [];

  // Main hero image from the floor area
  const floorImage = contentRoot.querySelector(
    '.c-floating-contents__floor img, .c-hero-banner__image img'
  );
  if (floorImage) {
    leftContent.push(floorImage);
  }

  // Benefit/feature icons from sub-contents carousel
  const subContents = contentRoot.querySelector('.c-floating-contents__sub-contents');
  if (subContents) {
    const benefitItems = subContents.querySelectorAll('.cmp-carousel__item');
    Array.from(benefitItems).forEach((item) => {
      const iconImg = item.querySelector('img');
      const iconTitle = item.querySelector('.cmp-title__text, h3, h4');
      if (iconImg) leftContent.push(iconImg);
      if (iconTitle) leftContent.push(iconTitle);
    });
  }

  // === RIGHT COLUMN: Heading + description + CTA ===
  const rightContent = [];

  // Heading from main contents area
  const mainContents = contentRoot.querySelector('.c-floating-contents__main-contents');
  if (mainContents) {
    const heading = mainContents.querySelector('.cmp-title__text, h2, h3');
    if (heading) {
      rightContent.push(heading);
    }

    // Body text paragraphs
    const bodyText = mainContents.querySelector('.c-text-contents__bodycopy .cmp-text');
    if (bodyText) {
      Array.from(bodyText.querySelectorAll('p')).forEach((p) => {
        const text = p.textContent.trim();
        // Skip empty paragraphs and non-breaking space only paragraphs
        if (text && text !== ' ') {
          rightContent.push(p);
        }
      });
    }
  } else {
    // Fallback: look for heading/text anywhere in contentRoot
    const heading = contentRoot.querySelector('.cmp-title__text, h2, h3');
    if (heading) rightContent.push(heading);
    const bodyText = contentRoot.querySelector('.c-text-contents__bodycopy .cmp-text');
    if (bodyText) {
      Array.from(bodyText.querySelectorAll('p')).forEach((p) => {
        const text = p.textContent.trim();
        if (text && text !== ' ') {
          rightContent.push(p);
        }
      });
    }
  }

  // CTA links/buttons
  const ctaLinks = contentRoot.querySelectorAll(
    'a.c-btn, a[class*="button"], a[class*="cta"]'
  );
  Array.from(ctaLinks).forEach((link) => {
    rightContent.push(link);
  });

  // === BUILD CELLS: Single row with left and right columns ===
  const cells = [];
  cells.push([
    leftContent.length > 0 ? leftContent : '',
    rightContent.length > 0 ? rightContent : ''
  ]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-newsletter', cells });
  element.replaceWith(block);
}
