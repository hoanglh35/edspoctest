/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-press-release.js
  var import_press_release_exports = {};
  __export(import_press_release_exports, {
    default: () => import_press_release_default
  });

  // tools/importer/parsers/hero-press.js
  function parse(element, { document }) {
    const dateEl = element.querySelector('.cmp-heroes__date, [class*="heroes__date"], .eyebrow');
    const heading = element.querySelector('h1, h2, .cmp-heroes-two-column__title, [class*="heroes__title"]');
    const subtitleContainer = element.querySelector('.cmp-heroes-two-column__subtitle, [class*="heroes__subtitle"], [class*="heroes__description"]');
    let subtitleText = "";
    if (subtitleContainer) {
      const italic = subtitleContainer.querySelector("i, em");
      if (italic) {
        subtitleText = italic.textContent.trim();
      } else {
        subtitleText = subtitleContainer.textContent.trim();
      }
    }
    const image = element.querySelector(".cmp-heroes-two-column__media img, .cmp-image__image, img");
    const cells = [];
    if (image) {
      const imageEl = image.closest("picture") || image;
      cells.push([imageEl]);
    }
    const contentCell = [];
    if (dateEl) {
      const datePara = document.createElement("p");
      datePara.textContent = dateEl.textContent.trim();
      contentCell.push(datePara);
    }
    if (heading) {
      const h1 = document.createElement("h1");
      h1.textContent = heading.textContent.trim();
      contentCell.push(h1);
    }
    if (subtitleText) {
      const subtitlePara = document.createElement("p");
      const em = document.createElement("em");
      em.textContent = subtitleText;
      subtitlePara.appendChild(em);
      contentCell.push(subtitlePara);
    }
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-press", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-press.js
  function parse2(element, { document }) {
    const items = element.querySelectorAll(".related-item");
    const cells = [];
    items.forEach((item) => {
      const icon = item.querySelector(".related-item__icon img");
      const eyebrow = item.querySelector(".related-item__eyebrow, .related-item__text span");
      const heading = item.querySelector("h5.related-item__description, .related-item__description");
      const link = item.querySelector("a[href]");
      const col1 = [];
      if (icon) {
        col1.push(icon);
      }
      const col2 = [];
      if (eyebrow) {
        const eyebrowEl = document.createElement("p");
        eyebrowEl.textContent = eyebrow.textContent.trim();
        col2.push(eyebrowEl);
      }
      if (heading) {
        col2.push(heading);
      }
      if (link) {
        const ctaLink = document.createElement("a");
        ctaLink.href = link.getAttribute("href") || link.href;
        ctaLink.textContent = link.textContent.trim() || "Read now";
        col2.push(ctaLink);
      }
      if (col1.length > 0 || col2.length > 0) {
        cells.push([col1, col2]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-press", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/cohesity-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#consent_blackbar",
        "#truste-consent-track",
        ".cmp-loading",
        "#videoplayer-popup",
        ".video-overlay",
        "#search-overlay-item",
        ".overlay-search",
        ".sharethis-inline-share-buttons",
        '[class*="st-sticky-share-buttons"]'
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.experiencefragment",
        "header.sticky-nav",
        "header.navigation-top",
        "header.navigation-top--mobile",
        "footer.experiencefragment",
        ".violatorbar",
        "noscript",
        "iframe",
        "link"
      ]);
      element.querySelectorAll("img").forEach((img) => {
        const src = img.getAttribute("src") || "";
        if (src.includes("cdn.bizible.com") || src.includes("cdn.bizibly.com") || src.includes("segments.company-target.com") || src.includes("i.liadm.com") || src.includes("sync.sharethis.com")) {
          img.remove();
        }
      });
      element.querySelectorAll("[data-cmp-data-layer]").forEach((el) => {
        el.removeAttribute("data-cmp-data-layer");
      });
      element.querySelectorAll("[data-cmp-clickable]").forEach((el) => {
        el.removeAttribute("data-cmp-clickable");
      });
    }
  }

  // tools/importer/transformers/cohesity-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const document = element.ownerDocument;
      const reversedSections = [...sections].reverse();
      reversedSections.forEach((section, reverseIndex) => {
        const originalIndex = sections.length - 1 - reverseIndex;
        let sectionEl = null;
        const selector = Array.isArray(section.selector) ? section.selector[0] : section.selector;
        if (selector) {
          sectionEl = element.querySelector(selector);
        }
        if (!sectionEl) return;
        if (section.style) {
          const sectionMetadataBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          if (sectionEl.nextSibling) {
            sectionEl.parentNode.insertBefore(sectionMetadataBlock, sectionEl.nextSibling);
          } else {
            sectionEl.parentNode.appendChild(sectionMetadataBlock);
          }
        }
        if (originalIndex > 0) {
          const hr = document.createElement("hr");
          sectionEl.parentNode.insertBefore(hr, sectionEl);
        }
      });
    }
  }

  // tools/importer/import-press-release.js
  var PAGE_TEMPLATE = {
    name: "press-release",
    description: "Press release / news article page with headline, date, body content, and company boilerplate",
    urls: [
      "https://www.cohesity.com/newsroom/press/cohesity-earns-aws-resilience-competency/"
    ],
    blocks: [
      {
        name: "hero-press",
        instances: [".cmp-heroes-container"]
      },
      {
        name: "cards-press",
        instances: [".related-list-container__press"]
      }
    ],
    sections: [
      {
        id: "section-hero",
        name: "Hero",
        selector: ".heroes",
        style: "mint-green",
        blocks: ["hero-press"],
        defaultContent: []
      },
      {
        id: "section-article-body",
        name: "Article Body",
        selector: ".press-release-detail .responsivegrid",
        style: null,
        blocks: [],
        defaultContent: []
      },
      {
        id: "section-about",
        name: "About Cohesity",
        selector: ".press-release-detail .responsivegrid",
        style: null,
        blocks: [],
        defaultContent: []
      },
      {
        id: "section-contacts",
        name: "Media Contacts",
        selector: ".press-release-detail .responsivegrid",
        style: null,
        blocks: [],
        defaultContent: []
      },
      {
        id: "section-related",
        name: "Related Articles",
        selector: ".relatedlist",
        style: null,
        blocks: ["cards-press"],
        defaultContent: [".related-list__heading h2"]
      }
    ]
  };
  var parsers = {
    "hero-press": parse,
    "cards-press": parse2
  };
  var transformers = [
    transform,
    transform2
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
  var import_press_release_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_press_release_exports);
})();
