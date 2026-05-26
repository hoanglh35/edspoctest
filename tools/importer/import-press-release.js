/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - Press release specific
import heroPressParser from './parsers/hero-press.js';
import cardsPressParser from './parsers/cards-press.js';

// TRANSFORMER IMPORTS - Cohesity specific
import cohesityCleanupTransformer from './transformers/cohesity-cleanup.js';
import cohesitySectionsTransformer from './transformers/cohesity-sections.js';

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'press-release',
  description: 'Press release / news article page with headline, date, body content, and company boilerplate',
  urls: [
    'https://www.cohesity.com/newsroom/press/cohesity-earns-aws-resilience-competency/'
  ],
  blocks: [
    {
      name: 'hero-press',
      instances: ['.cmp-heroes-container']
    },
    {
      name: 'cards-press',
      instances: ['.related-list-container__press']
    }
  ],
  sections: [
    {
      id: 'section-hero',
      name: 'Hero',
      selector: '.heroes',
      style: 'mint-green',
      blocks: ['hero-press'],
      defaultContent: []
    },
    {
      id: 'section-article-body',
      name: 'Article Body',
      selector: '.press-release-detail .responsivegrid',
      style: null,
      blocks: [],
      defaultContent: []
    },
    {
      id: 'section-about',
      name: 'About Cohesity',
      selector: '.press-release-detail .responsivegrid',
      style: null,
      blocks: [],
      defaultContent: []
    },
    {
      id: 'section-contacts',
      name: 'Media Contacts',
      selector: '.press-release-detail .responsivegrid',
      style: null,
      blocks: [],
      defaultContent: []
    },
    {
      id: 'section-related',
      name: 'Related Articles',
      selector: '.relatedlist',
      style: null,
      blocks: ['cards-press'],
      defaultContent: ['.related-list__heading h2']
    }
  ]
};

// PARSER REGISTRY
const parsers = {
  'hero-press': heroPressParser,
  'cards-press': cardsPressParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cohesityCleanupTransformer,
  cohesitySectionsTransformer,
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      }
    }];
  }
};
