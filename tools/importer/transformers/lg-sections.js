/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: LG Germany section breaks and section metadata.
 * Inserts <hr> between sections and adds Section Metadata blocks where sections have styles.
 * Runs in afterTransform only (after block parsers have extracted content).
 * All selectors from page-templates.json, validated against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

/**
 * Find the first element matching a section selector within the main element.
 * Handles both string selectors and array selectors (first match wins).
 * @param {Element} element - The main content element
 * @param {string|string[]} selector - CSS selector or array of selectors
 * @returns {Element|null}
 */
function findSectionElement(element, selector) {
  const selectors = Array.isArray(selector) ? selector : [selector];
  for (const sel of selectors) {
    const found = element.querySelector(sel);
    if (found) return found;
  }
  return null;
}

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    const doc = element.ownerDocument || document;

    // Process sections in reverse order to avoid shifting indices
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionEl = findSectionElement(element, section.selector);

      if (!sectionEl) continue;

      // Add Section Metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(sectionMetadata);
      }

      // Insert <hr> before each section except the first one
      if (i > 0) {
        const hr = doc.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
