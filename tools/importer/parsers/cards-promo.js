/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-promo
 * Base block: cards
 * Source: https://www.lg.com/de/
 * Selector: .c-wrapper.PD0041
 * Generated: 2026-05-26
 * Validated: Yes (interactive browser - site blocks headless Chromium with 403)
 *
 * Extracts promotional tiles from a carousel grid within .c-wrapper.PD0041.
 * Each tile contains:
 * - A background image (CSS background-image on .c-hero-banner__bg-image, decoded from CSS escapes)
 * - A title (.cmp-title within .c-text-contents__headline)
 * - A description (.cmp-text within .c-text-contents__bodycopy)
 * - A CTA link (wrapping <a class="c-floating-contents"> with href)
 *
 * Each card becomes one row in the cards block table with image, title, description, and link.
 */
export default function parse(element, { document }) {
  // Find all carousel items (promo tiles)
  const items = element.querySelectorAll('.cmp-carousel__item');

  const cells = [];

  items.forEach((item) => {
    // Each tile is wrapped in an anchor link
    const link = item.querySelector('a.c-floating-contents');
    const href = link ? link.getAttribute('href') : '';

    // Extract background image from inline style on .c-hero-banner__bg-image
    const bgImageDiv = item.querySelector('.c-hero-banner__bg-image');
    let image = null;
    if (bgImageDiv) {
      // Check for an actual img tag first
      const imgEl = bgImageDiv.querySelector('img');
      if (imgEl) {
        image = imgEl;
      } else {
        // Extract background-image URL from style attribute
        const style = bgImageDiv.getAttribute('style') || '';
        // Handle CSS-escaped URLs (e.g., \2f = /) and quoted URLs
        const bgMatch = style.match(/background-image\s*:\s*url\(\s*["']?(.+?)["']?\s*\)/);
        if (bgMatch) {
          // Decode CSS escape sequences: \2f → /
          let imgUrl = bgMatch[1]
            .replace(/\\2f\s*/gi, '/')
            .replace(/\\([0-9a-fA-F]+)\s*/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
          imgUrl = imgUrl.trim();
          // Make relative URLs absolute
          if (imgUrl.startsWith('/')) {
            imgUrl = new URL(imgUrl, document.location?.href || 'https://www.lg.com').href;
          }
          image = document.createElement('img');
          image.src = imgUrl;
          // Use sr-only span as alt text
          const altSpan = bgImageDiv.querySelector('.sr-only');
          image.alt = altSpan ? altSpan.textContent.trim() : '';
        }
      }
    }

    // Extract title from the headline area
    const titleEl = item.querySelector('.c-text-contents__headline .cmp-title');
    const title = titleEl ? titleEl.textContent.trim() : '';

    // Extract description from body copy (first non-empty bodycopy)
    const bodyEl = item.querySelector('.c-text-contents__bodycopy .cmp-text');
    const description = bodyEl ? bodyEl.textContent.trim() : '';

    // Extract CTA button text
    const ctaTextEl = item.querySelector('.cmp-button__text, .c-button__text');
    const ctaText = ctaTextEl ? ctaTextEl.textContent.trim() : 'Mehr erfahren';

    // Build a single cell per card row containing all content
    const cardContent = [];

    // Add image if available
    if (image) {
      cardContent.push(image);
    }

    // Add title as strong element
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title;
      cardContent.push(strong);
    }

    // Add description as paragraph
    if (description) {
      const p = document.createElement('p');
      p.textContent = description;
      cardContent.push(p);
    }

    // Add CTA link
    if (href) {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = ctaText;
      cardContent.push(a);
    }

    if (cardContent.length > 0) {
      cells.push(cardContent);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-promo', cells });
  element.replaceWith(block);
}
