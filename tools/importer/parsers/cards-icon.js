/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-icon variant.
 * Base block: cards
 * Source: https://www.lg.com/de/
 * Generated: 2026-05-26
 *
 * Handles multiple source patterns on the LG homepage:
 * - .c-quick-links: icon grid with linked items (li.c-quick-links__item)
 * - .c-spec-info (.c-icon-block-contents): member benefits with icons + title + desc
 * - .c-spec-info (.c-spec-info__container): service features with icons + title + desc
 * - .CM0010 (.c-list__item): membership benefits with icon blocks
 * - .c-support--card (.c-list__item): support cards with linked icons + title + desc
 */
export default function parse(element, { document }) {
  const cells = [];

  // Pattern 1: c-quick-links - items in a list with icon + linked name
  const quickLinkItems = element.querySelectorAll('li.c-quick-links__item, .c-quick-links__list > li');
  if (quickLinkItems.length > 0) {
    quickLinkItems.forEach((item) => {
      const img = item.querySelector('img');
      const link = item.querySelector('a');
      const textEl = item.querySelector('.c-quick-links__name, span');

      const iconCell = [];
      if (img) iconCell.push(img.cloneNode(true));

      const textCell = [];
      if (link && textEl) {
        const a = document.createElement('a');
        a.href = link.href || link.getAttribute('href') || '';
        a.textContent = textEl.textContent.trim();
        textCell.push(a);
      } else if (textEl) {
        const p = document.createElement('p');
        p.textContent = textEl.textContent.trim();
        textCell.push(p);
      }

      if (iconCell.length > 0 || textCell.length > 0) {
        cells.push([iconCell, textCell]);
      }
    });
  }

  // Pattern 2: c-list__item - used in .CM0010 and .c-support--card
  // Structure: .c-list__item > (optional a) > .c-image img + .c-text-contents (title/desc)
  if (cells.length === 0) {
    const listItems = element.querySelectorAll('.c-list__item');
    if (listItems.length > 0) {
      listItems.forEach((item) => {
        const img = item.querySelector('img');
        const title = item.querySelector('.cmp-title__text, h2, h3, h4');
        const desc = item.querySelector('.cmp-text p, .c-text-contents__bodycopy p');
        const link = item.querySelector('a');

        const iconCell = [];
        if (img) iconCell.push(img.cloneNode(true));

        const textCell = [];
        if (title) {
          if (link) {
            const a = document.createElement('a');
            a.href = link.href || link.getAttribute('href') || '';
            a.textContent = title.textContent.trim();
            textCell.push(a);
          } else {
            const strong = document.createElement('strong');
            strong.textContent = title.textContent.trim();
            textCell.push(strong);
          }
        }
        if (desc) {
          const p = document.createElement('p');
          p.textContent = desc.textContent.trim();
          textCell.push(p);
        }

        if (iconCell.length > 0 || textCell.length > 0) {
          cells.push([iconCell, textCell]);
        }
      });
    }
  }

  // Pattern 3: c-spec-info with .c-text-contents items (icon-block-contents or spec-info__container)
  // Structure: .c-text-contents blocks each with parent holding .c-image img
  if (cells.length === 0) {
    const textContents = element.querySelectorAll('.c-text-contents');
    if (textContents.length > 0) {
      textContents.forEach((tc) => {
        const title = tc.querySelector('.cmp-title__text, h2, h3, h4');
        const desc = tc.querySelector('.cmp-text p, .c-text-contents__bodycopy p');

        // Find icon image: check sibling .c-image or parent for .c-image img
        let img = tc.querySelector('img');
        if (!img) {
          const parent = tc.parentElement;
          if (parent) {
            img = parent.querySelector('.c-image img, .cmp-image img');
          }
        }

        // Only create a card row if we have meaningful content (title or desc)
        if (title || desc) {
          const iconCell = [];
          if (img) iconCell.push(img.cloneNode(true));

          const textCell = [];
          if (title) {
            const strong = document.createElement('strong');
            strong.textContent = title.textContent.trim();
            textCell.push(strong);
          }
          if (desc) {
            const p = document.createElement('p');
            p.textContent = desc.textContent.trim();
            textCell.push(p);
          }

          cells.push([iconCell, textCell]);
        }
      });
    }
  }

  // Pattern 4: Generic fallback - find any li or item-like children with img + text
  if (cells.length === 0) {
    const items = element.querySelectorAll('li, [class*="item"]');
    if (items.length > 0) {
      items.forEach((item) => {
        const img = item.querySelector('img');
        const link = item.querySelector('a');
        const textEl = item.querySelector('span, p, h3, h4, strong');

        const iconCell = [];
        if (img) iconCell.push(img.cloneNode(true));

        const textCell = [];
        if (link) {
          const a = document.createElement('a');
          a.href = link.href || link.getAttribute('href') || '';
          a.textContent = (textEl || link).textContent.trim();
          textCell.push(a);
        } else if (textEl) {
          const p = document.createElement('p');
          p.textContent = textEl.textContent.trim();
          textCell.push(p);
        }

        if (iconCell.length > 0 || textCell.length > 0) {
          cells.push([iconCell, textCell]);
        }
      });
    }
  }

  // Final fallback: if element itself is a single card (no children matched)
  if (cells.length === 0) {
    const img = element.querySelector('img');
    const link = element.querySelector('a');
    const textEl = element.querySelector('span, p, h3, h4, strong');

    const iconCell = [];
    if (img) iconCell.push(img.cloneNode(true));

    const textCell = [];
    if (link) {
      const a = document.createElement('a');
      a.href = link.href || link.getAttribute('href') || '';
      a.textContent = (textEl || link).textContent.trim();
      textCell.push(a);
    } else if (textEl) {
      const p = document.createElement('p');
      p.textContent = textEl.textContent.trim();
      textCell.push(p);
    }

    if (iconCell.length > 0 || textCell.length > 0) {
      cells.push([iconCell, textCell]);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-icon', cells });
  element.replaceWith(block);
}
