/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-press
 * Base block: hero
 * Source: https://www.cohesity.com/newsroom/press/cohesity-earns-aws-resilience-competency/
 * Selector: .cmp-heroes-container
 * Generated: 2026-05-26T00:00:00Z
 *
 * Extracts date eyebrow, H1 title, italic subtitle, and image from press release hero.
 * Skips breadcrumb navigation.
 *
 * Source DOM structure:
 *   .cmp-heroes-container
 *     .cmp-heroes__breadcrumb (skipped)
 *     .cmp-heroes-two-column
 *       .cmp-heroes-two-column__content
 *         .cmp-heroes__date.eyebrow — date text
 *         h1.cmp-heroes-two-column__title — heading
 *         p.cmp-heroes-two-column__subtitle — contains italic subtitle
 *       .cmp-heroes-two-column__media
 *         .cmp-image > img.cmp-image__image — hero image
 */
export default function parse(element, { document }) {
  // Extract date eyebrow
  const dateEl = element.querySelector('.cmp-heroes__date, [class*="heroes__date"], .eyebrow');

  // Extract H1 title
  const heading = element.querySelector('h1, h2, .cmp-heroes-two-column__title, [class*="heroes__title"]');

  // Extract subtitle (italic paragraph)
  const subtitleContainer = element.querySelector('.cmp-heroes-two-column__subtitle, [class*="heroes__subtitle"], [class*="heroes__description"]');
  // The subtitle may contain nested <p><i>...</i></p> or just italic text
  let subtitleText = '';
  if (subtitleContainer) {
    const italic = subtitleContainer.querySelector('i, em');
    if (italic) {
      subtitleText = italic.textContent.trim();
    } else {
      subtitleText = subtitleContainer.textContent.trim();
    }
  }

  // Extract hero image from media column
  const image = element.querySelector('.cmp-heroes-two-column__media img, .cmp-image__image, img');

  // Build cells array matching hero block library structure:
  // Row 1: image (if present)
  // Row 2: text content (date, heading, subtitle)
  const cells = [];

  // Image row
  if (image) {
    const imageEl = image.closest('picture') || image;
    cells.push([imageEl]);
  }

  // Content row: date eyebrow + heading + subtitle
  const contentCell = [];

  if (dateEl) {
    const datePara = document.createElement('p');
    datePara.textContent = dateEl.textContent.trim();
    contentCell.push(datePara);
  }

  if (heading) {
    // Clone heading to preserve as h1
    const h1 = document.createElement('h1');
    h1.textContent = heading.textContent.trim();
    contentCell.push(h1);
  }

  if (subtitleText) {
    // Create italic subtitle paragraph
    const subtitlePara = document.createElement('p');
    const em = document.createElement('em');
    em.textContent = subtitleText;
    subtitlePara.appendChild(em);
    contentCell.push(subtitlePara);
  }

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-press', cells });
  element.replaceWith(block);
}
