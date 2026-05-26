/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Cohesity section breaks and section metadata.
 * Inserts <hr> section dividers and Section Metadata blocks based on
 * payload.template.sections from page-templates.json.
 *
 * Section selectors verified against migration-work/cleaned.html:
 *   - .heroes (line 2212)
 *   - .cmp-experiencefragment--about-cohesity-experience-fragment (line 2294)
 *   - .mediacontactexperiencefragment (line 2322)
 *   - .relatedlist (line 2352)
 *   - .press-release-detail .responsivegrid (body class + main element, line 1/2263)
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    const document = element.ownerDocument;

    // Process sections in reverse order to preserve DOM positions
    const reversedSections = [...sections].reverse();

    reversedSections.forEach((section, reverseIndex) => {
      const originalIndex = sections.length - 1 - reverseIndex;

      // Find the section element using its selector
      let sectionEl = null;
      const selector = Array.isArray(section.selector) ? section.selector[0] : section.selector;

      if (selector) {
        sectionEl = element.querySelector(selector);
      }

      if (!sectionEl) return;

      // Add Section Metadata block if section has a style
      if (section.style) {
        const sectionMetadataBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        // Insert section metadata after the section element
        if (sectionEl.nextSibling) {
          sectionEl.parentNode.insertBefore(sectionMetadataBlock, sectionEl.nextSibling);
        } else {
          sectionEl.parentNode.appendChild(sectionMetadataBlock);
        }
      }

      // Add <hr> before non-first sections to create section breaks
      if (originalIndex > 0) {
        const hr = document.createElement('hr');
        sectionEl.parentNode.insertBefore(hr, sectionEl);
      }
    });
  }
}
