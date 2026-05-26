/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselPromoParser from './parsers/carousel-promo.js';
import cardsIconParser from './parsers/cards-icon.js';
import cardsPromoParser from './parsers/cards-promo.js';
import heroBannerParser from './parsers/hero-banner.js';
import columnsNewsletterParser from './parsers/columns-newsletter.js';

// TRANSFORMER IMPORTS
import lgCleanupTransformer from './transformers/lg-cleanup.js';
import lgSectionsTransformer from './transformers/lg-sections.js';

// PARSER REGISTRY
const parsers = {
  'carousel-promo': carouselPromoParser,
  'cards-icon': cardsIconParser,
  'cards-promo': cardsPromoParser,
  'hero-banner': heroBannerParser,
  'columns-newsletter': columnsNewsletterParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  lgCleanupTransformer,
  lgSectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'LG Germany homepage with hero banners, product categories, and promotional content',
  urls: [
    'https://www.lg.com/de/'
  ],
  blocks: [
    {
      name: 'carousel-promo',
      instances: [
        '.component.ST0048 .cmp-carousel.c-carousel',
        '.c-wrapper.PD0002 .cmp-carousel.c-carousel',
        '.c-wrapper.PD0046 .cmp-carousel.c-carousel'
      ]
    },
    {
      name: 'cards-icon',
      instances: [
        '.c-wrapper.CM0014 .c-quick-links',
        '.c-wrapper.ST0020 .c-spec-info',
        '#experiencefragment-c148a9d37d .CM0010',
        '.c-support--card'
      ]
    },
    {
      name: 'cards-promo',
      instances: [
        '.c-wrapper.PD0041'
      ]
    },
    {
      name: 'hero-banner',
      instances: [
        '.trdBanner-v1'
      ]
    },
    {
      name: 'columns-newsletter',
      instances: [
        '.c-wrapper.ST0003',
        '.c-wrapper.ST0001.width-content'
      ]
    }
  ],
  sections: [
    {
      id: 'section-hero-carousel',
      name: 'Hero Carousel',
      selector: '.component.ST0048',
      style: null,
      blocks: ['carousel-promo'],
      defaultContent: []
    },
    {
      id: 'section-quick-links',
      name: 'Quick Links Bar',
      selector: '.c-wrapper.CM0014',
      style: null,
      blocks: ['cards-icon'],
      defaultContent: []
    },
    {
      id: 'section-promo-tiles',
      name: 'Promotional Tiles',
      selector: '.c-wrapper.PD0041',
      style: null,
      blocks: ['cards-promo'],
      defaultContent: []
    },
    {
      id: 'section-trending-banner',
      name: 'Trending Product Banner',
      selector: '#experiencefragment-8d48ec26cc',
      style: null,
      blocks: ['hero-banner'],
      defaultContent: []
    },
    {
      id: 'section-member-benefits',
      name: 'Member Benefits',
      selector: ['.c-wrapper.ST0020.shape-horizontal:nth-of-type(1)'],
      style: null,
      blocks: ['cards-icon'],
      defaultContent: []
    },
    {
      id: 'section-service-features',
      name: 'Service Features',
      selector: ['.c-wrapper.ST0020.shape-horizontal:nth-of-type(2)'],
      style: null,
      blocks: ['cards-icon'],
      defaultContent: []
    },
    {
      id: 'section-membership',
      name: 'LG Membership',
      selector: '#experiencefragment-c148a9d37d',
      style: null,
      blocks: ['cards-icon'],
      defaultContent: ['.c-region-header__headline', '.c-region-header__text']
    },
    {
      id: 'section-product-recs',
      name: 'Product Recommendations',
      selector: '.c-wrapper.PD0002',
      style: 'border-top',
      blocks: ['carousel-promo'],
      defaultContent: ['.c-region-header__headline']
    },
    {
      id: 'section-highlight-stories',
      name: 'Highlight Stories',
      selector: '.c-wrapper.PD0046',
      style: null,
      blocks: ['carousel-promo'],
      defaultContent: ['.c-region-header__headline', '.c-region-header__text']
    },
    {
      id: 'section-newsletter',
      name: 'Newsletter',
      selector: ['.c-wrapper.ST0003.align-left', '.c-wrapper.ST0001.width-content'],
      style: null,
      blocks: ['columns-newsletter'],
      defaultContent: ['.c-text-contents__eyebrow']
    },
    {
      id: 'section-support',
      name: 'Support Section',
      selector: '.container.responsivegrid.margin-top.margin-bottom',
      style: null,
      blocks: ['cards-icon'],
      defaultContent: ['.c-region-header__headline', '.c-region-header__text']
    },
    {
      id: 'section-disclaimer',
      name: 'Disclaimer',
      selector: '.c-wrapper.ST0003.type-section-title',
      style: null,
      blocks: [],
      defaultContent: ['.cmp-text']
    }
  ]
};

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
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
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
