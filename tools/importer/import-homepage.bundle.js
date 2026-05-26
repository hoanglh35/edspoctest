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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-promo.js
  function parse(element, { document: document2 }) {
    const cells = [];
    let slides = Array.from(
      element.querySelectorAll(":scope .cmp-carousel__item:not(.swiper-slide-duplicate)")
    );
    if (slides.length === 0) {
      slides = Array.from(
        element.querySelectorAll(":scope .swiper-slide:not(.swiper-slide-duplicate)")
      );
    }
    slides.forEach((slide) => {
      const heroBanner = slide.querySelector(".c-hero-banner");
      if (heroBanner) {
        const image2 = heroBanner.querySelector(".c-hero-banner__image img, .cmp-image__image, img");
        const heading2 = heroBanner.querySelector(".cmp-title__text");
        const description = heroBanner.querySelector(".c-text-contents__bodycopy .cmp-text p, .c-text-contents__bodycopy p");
        const cta2 = heroBanner.querySelector(".c-cta a.cmp-button, .c-cta a");
        if (image2) cells.push([image2]);
        if (heading2) {
          const h2 = document2.createElement("h2");
          h2.textContent = heading2.textContent.trim();
          cells.push([h2]);
        }
        if (description) {
          const p = document2.createElement("p");
          p.textContent = description.textContent.trim();
          cells.push([p]);
        }
        if (cta2) {
          const link = document2.createElement("a");
          link.href = cta2.href || cta2.getAttribute("href") || "";
          const buttonText = cta2.querySelector(".cmp-button__text, .c-button__text");
          link.textContent = buttonText ? buttonText.textContent.trim() : cta2.textContent.trim();
          cells.push([link]);
        }
        return;
      }
      const featureItem = slide.querySelector(".c-feature-list__item");
      if (featureItem) {
        const image2 = featureItem.querySelector("img");
        const heading2 = featureItem.querySelector(".cmp-title__text");
        const description = featureItem.querySelector(".c-text-contents__bodycopy p, .c-text-contents__bodycopy");
        const cta2 = featureItem.querySelector("a[href]");
        if (image2) cells.push([image2]);
        if (heading2) {
          const h2 = document2.createElement("h2");
          h2.textContent = heading2.textContent.trim();
          cells.push([h2]);
        }
        if (description) {
          const p = document2.createElement("p");
          p.textContent = description.textContent.trim();
          cells.push([p]);
        }
        if (cta2) {
          const link = document2.createElement("a");
          link.href = cta2.href || cta2.getAttribute("href") || "";
          link.textContent = cta2.textContent.trim();
          cells.push([link]);
        }
        return;
      }
      const image = slide.querySelector("img");
      const heading = slide.querySelector('h3, h2, .cmp-title__text, [class*="product-name"]');
      const cta = slide.querySelector("a[href]");
      if (image) cells.push([image]);
      if (heading) {
        const h2 = document2.createElement("h2");
        h2.textContent = heading.textContent.trim();
        cells.push([h2]);
      }
      if (cta) {
        const link = document2.createElement("a");
        link.href = cta.href || cta.getAttribute("href") || "";
        link.textContent = cta.textContent.trim() || (heading == null ? void 0 : heading.textContent.trim()) || "";
        cells.push([link]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-icon.js
  function parse2(element, { document: document2 }) {
    const cells = [];
    const quickLinkItems = element.querySelectorAll("li.c-quick-links__item, .c-quick-links__list > li");
    if (quickLinkItems.length > 0) {
      quickLinkItems.forEach((item) => {
        const img = item.querySelector("img");
        const link = item.querySelector("a");
        const textEl = item.querySelector(".c-quick-links__name, span");
        const iconCell = [];
        if (img) iconCell.push(img.cloneNode(true));
        const textCell = [];
        if (link && textEl) {
          const a = document2.createElement("a");
          a.href = link.href || link.getAttribute("href") || "";
          a.textContent = textEl.textContent.trim();
          textCell.push(a);
        } else if (textEl) {
          const p = document2.createElement("p");
          p.textContent = textEl.textContent.trim();
          textCell.push(p);
        }
        if (iconCell.length > 0 || textCell.length > 0) {
          cells.push([iconCell, textCell]);
        }
      });
    }
    if (cells.length === 0) {
      const listItems = element.querySelectorAll(".c-list__item");
      if (listItems.length > 0) {
        listItems.forEach((item) => {
          const img = item.querySelector("img");
          const title = item.querySelector(".cmp-title__text, h2, h3, h4");
          const desc = item.querySelector(".cmp-text p, .c-text-contents__bodycopy p");
          const link = item.querySelector("a");
          const iconCell = [];
          if (img) iconCell.push(img.cloneNode(true));
          const textCell = [];
          if (title) {
            if (link) {
              const a = document2.createElement("a");
              a.href = link.href || link.getAttribute("href") || "";
              a.textContent = title.textContent.trim();
              textCell.push(a);
            } else {
              const strong = document2.createElement("strong");
              strong.textContent = title.textContent.trim();
              textCell.push(strong);
            }
          }
          if (desc) {
            const p = document2.createElement("p");
            p.textContent = desc.textContent.trim();
            textCell.push(p);
          }
          if (iconCell.length > 0 || textCell.length > 0) {
            cells.push([iconCell, textCell]);
          }
        });
      }
    }
    if (cells.length === 0) {
      const textContents = element.querySelectorAll(".c-text-contents");
      if (textContents.length > 0) {
        textContents.forEach((tc) => {
          const title = tc.querySelector(".cmp-title__text, h2, h3, h4");
          const desc = tc.querySelector(".cmp-text p, .c-text-contents__bodycopy p");
          let img = tc.querySelector("img");
          if (!img) {
            const parent = tc.parentElement;
            if (parent) {
              img = parent.querySelector(".c-image img, .cmp-image img");
            }
          }
          if (title || desc) {
            const iconCell = [];
            if (img) iconCell.push(img.cloneNode(true));
            const textCell = [];
            if (title) {
              const strong = document2.createElement("strong");
              strong.textContent = title.textContent.trim();
              textCell.push(strong);
            }
            if (desc) {
              const p = document2.createElement("p");
              p.textContent = desc.textContent.trim();
              textCell.push(p);
            }
            cells.push([iconCell, textCell]);
          }
        });
      }
    }
    if (cells.length === 0) {
      const items = element.querySelectorAll('li, [class*="item"]');
      if (items.length > 0) {
        items.forEach((item) => {
          const img = item.querySelector("img");
          const link = item.querySelector("a");
          const textEl = item.querySelector("span, p, h3, h4, strong");
          const iconCell = [];
          if (img) iconCell.push(img.cloneNode(true));
          const textCell = [];
          if (link) {
            const a = document2.createElement("a");
            a.href = link.href || link.getAttribute("href") || "";
            a.textContent = (textEl || link).textContent.trim();
            textCell.push(a);
          } else if (textEl) {
            const p = document2.createElement("p");
            p.textContent = textEl.textContent.trim();
            textCell.push(p);
          }
          if (iconCell.length > 0 || textCell.length > 0) {
            cells.push([iconCell, textCell]);
          }
        });
      }
    }
    if (cells.length === 0) {
      const img = element.querySelector("img");
      const link = element.querySelector("a");
      const textEl = element.querySelector("span, p, h3, h4, strong");
      const iconCell = [];
      if (img) iconCell.push(img.cloneNode(true));
      const textCell = [];
      if (link) {
        const a = document2.createElement("a");
        a.href = link.href || link.getAttribute("href") || "";
        a.textContent = (textEl || link).textContent.trim();
        textCell.push(a);
      } else if (textEl) {
        const p = document2.createElement("p");
        p.textContent = textEl.textContent.trim();
        textCell.push(p);
      }
      if (iconCell.length > 0 || textCell.length > 0) {
        cells.push([iconCell, textCell]);
      }
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-icon", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-promo.js
  function parse3(element, { document: document2 }) {
    const items = element.querySelectorAll(".cmp-carousel__item");
    const cells = [];
    items.forEach((item) => {
      var _a;
      const link = item.querySelector("a.c-floating-contents");
      const href = link ? link.getAttribute("href") : "";
      const bgImageDiv = item.querySelector(".c-hero-banner__bg-image");
      let image = null;
      if (bgImageDiv) {
        const imgEl = bgImageDiv.querySelector("img");
        if (imgEl) {
          image = imgEl;
        } else {
          const style = bgImageDiv.getAttribute("style") || "";
          const bgMatch = style.match(/background-image\s*:\s*url\(\s*["']?(.+?)["']?\s*\)/);
          if (bgMatch) {
            let imgUrl = bgMatch[1].replace(/\\2f\s*/gi, "/").replace(/\\([0-9a-fA-F]+)\s*/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
            imgUrl = imgUrl.trim();
            if (imgUrl.startsWith("/")) {
              imgUrl = new URL(imgUrl, ((_a = document2.location) == null ? void 0 : _a.href) || "https://www.lg.com").href;
            }
            image = document2.createElement("img");
            image.src = imgUrl;
            const altSpan = bgImageDiv.querySelector(".sr-only");
            image.alt = altSpan ? altSpan.textContent.trim() : "";
          }
        }
      }
      const titleEl = item.querySelector(".c-text-contents__headline .cmp-title");
      const title = titleEl ? titleEl.textContent.trim() : "";
      const bodyEl = item.querySelector(".c-text-contents__bodycopy .cmp-text");
      const description = bodyEl ? bodyEl.textContent.trim() : "";
      const ctaTextEl = item.querySelector(".cmp-button__text, .c-button__text");
      const ctaText = ctaTextEl ? ctaTextEl.textContent.trim() : "Mehr erfahren";
      const cardContent = [];
      if (image) {
        cardContent.push(image);
      }
      if (title) {
        const strong = document2.createElement("strong");
        strong.textContent = title;
        cardContent.push(strong);
      }
      if (description) {
        const p = document2.createElement("p");
        p.textContent = description;
        cardContent.push(p);
      }
      if (href) {
        const a = document2.createElement("a");
        a.href = href;
        a.textContent = ctaText;
        cardContent.push(a);
      }
      if (cardContent.length > 0) {
        cells.push(cardContent);
      }
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse4(element, { document: document2 }) {
    const bgImage = element.querySelector(".trdBanner-v1__bg img") || element.querySelector(".cmp-image__image") || element.querySelector("img");
    const titleEl = element.querySelector(".trdBanner-v1__title") || element.querySelector('[class*="title"]');
    let heading = null;
    if (titleEl) {
      const titleText = titleEl.textContent.trim();
      if (titleText) {
        heading = document2.createElement("h1");
        heading.textContent = titleText;
      }
    }
    const descEl = element.querySelector(".trdBanner-v1__desc--text") || element.querySelector(".trdBanner-v1__desc") || element.querySelector('[class*="desc"]');
    let description = null;
    if (descEl) {
      const descText = descEl.textContent.trim();
      if (descText) {
        description = document2.createElement("p");
        description.textContent = descText;
      }
    }
    const ctaAnchor = element.querySelector("a.trdBanner-v1__item") || element.querySelector("a[href]");
    let ctaLink = null;
    if (ctaAnchor && ctaAnchor.getAttribute("href")) {
      ctaLink = document2.createElement("a");
      ctaLink.href = ctaAnchor.getAttribute("href");
      const linkText = descEl ? descEl.textContent.trim() : "Learn more";
      ctaLink.textContent = linkText || "Learn more";
    }
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
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-newsletter.js
  function parse5(element, { document: document2 }) {
    const isSectionTitle = element.classList && element.classList.contains("ST0003");
    if (isSectionTitle) {
      const sectionTitle = element.querySelector(".cmp-title__text, h2, h3");
      const cells2 = [];
      if (sectionTitle) {
        cells2.push([sectionTitle, ""]);
      }
      const block2 = WebImporter.Blocks.createBlock(document2, { name: "columns-newsletter", cells: cells2 });
      element.replaceWith(block2);
      return;
    }
    const heroBanner = element.querySelector(".c-hero-banner");
    const contentRoot = heroBanner || element;
    const leftContent = [];
    const floorImage = contentRoot.querySelector(
      ".c-floating-contents__floor img, .c-hero-banner__image img"
    );
    if (floorImage) {
      leftContent.push(floorImage);
    }
    const subContents = contentRoot.querySelector(".c-floating-contents__sub-contents");
    if (subContents) {
      const benefitItems = subContents.querySelectorAll(".cmp-carousel__item");
      Array.from(benefitItems).forEach((item) => {
        const iconImg = item.querySelector("img");
        const iconTitle = item.querySelector(".cmp-title__text, h3, h4");
        if (iconImg) leftContent.push(iconImg);
        if (iconTitle) leftContent.push(iconTitle);
      });
    }
    const rightContent = [];
    const mainContents = contentRoot.querySelector(".c-floating-contents__main-contents");
    if (mainContents) {
      const heading = mainContents.querySelector(".cmp-title__text, h2, h3");
      if (heading) {
        rightContent.push(heading);
      }
      const bodyText = mainContents.querySelector(".c-text-contents__bodycopy .cmp-text");
      if (bodyText) {
        Array.from(bodyText.querySelectorAll("p")).forEach((p) => {
          const text = p.textContent.trim();
          if (text && text !== "\xA0") {
            rightContent.push(p);
          }
        });
      }
    } else {
      const heading = contentRoot.querySelector(".cmp-title__text, h2, h3");
      if (heading) rightContent.push(heading);
      const bodyText = contentRoot.querySelector(".c-text-contents__bodycopy .cmp-text");
      if (bodyText) {
        Array.from(bodyText.querySelectorAll("p")).forEach((p) => {
          const text = p.textContent.trim();
          if (text && text !== "\xA0") {
            rightContent.push(p);
          }
        });
      }
    }
    const ctaLinks = contentRoot.querySelectorAll(
      'a.c-btn, a[class*="button"], a[class*="cta"]'
    );
    Array.from(ctaLinks).forEach((link) => {
      rightContent.push(link);
    });
    const cells = [];
    cells.push([
      leftContent.length > 0 ? leftContent : "",
      rightContent.length > 0 ? rightContent : ""
    ]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-newsletter", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/lg-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [".c-pop-msg"]);
      WebImporter.DOMUtils.remove(element, [".swiper-slide-duplicate"]);
      WebImporter.DOMUtils.remove(element, [".smartcapture-content-wrapper", '[id^="smartcapture-"]']);
      WebImporter.DOMUtils.remove(element, [".swiper-notification"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".c-carousel-controls",
        ".c-carousel__handler"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".neo-carousel--handler",
        ".neo-carousel--pagination"
      ]);
      WebImporter.DOMUtils.remove(element, ['[class*="bv_"]']);
      WebImporter.DOMUtils.remove(element, [".c-product-item__download"]);
      WebImporter.DOMUtils.remove(element, [".embed"]);
      WebImporter.DOMUtils.remove(element, [".camarker-inner", ".stylingblock-content-wrapper:not(.camarker-inner)"]);
      WebImporter.DOMUtils.remove(element, [".c-required-area"]);
      const dateRanges = element.querySelectorAll(".js-date-range");
      dateRanges.forEach((el) => {
        if (!el.textContent.trim()) el.remove();
      });
      element.querySelectorAll('[class*="aem-Grid"]').forEach((el) => {
        const classes = el.className.split(" ").filter((c) => !c.startsWith("aem-Grid"));
        el.className = classes.join(" ").trim();
      });
    }
  }

  // tools/importer/transformers/lg-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function findSectionElement(element, selector) {
    const selectors = Array.isArray(selector) ? selector : [selector];
    for (const sel of selectors) {
      const found = element.querySelector(sel);
      if (found) return found;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const doc = element.ownerDocument || document;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionEl = findSectionElement(element, section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (i > 0) {
          const hr = doc.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "carousel-promo": parse,
    "cards-icon": parse2,
    "cards-promo": parse3,
    "hero-banner": parse4,
    "columns-newsletter": parse5
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "LG Germany homepage with hero banners, product categories, and promotional content",
    urls: [
      "https://www.lg.com/de/"
    ],
    blocks: [
      {
        name: "carousel-promo",
        instances: [
          ".component.ST0048 .cmp-carousel.c-carousel",
          ".c-wrapper.PD0002 .cmp-carousel.c-carousel",
          ".c-wrapper.PD0046 .cmp-carousel.c-carousel"
        ]
      },
      {
        name: "cards-icon",
        instances: [
          ".c-wrapper.CM0014 .c-quick-links",
          ".c-wrapper.ST0020 .c-spec-info",
          "#experiencefragment-c148a9d37d .CM0010",
          ".c-support--card"
        ]
      },
      {
        name: "cards-promo",
        instances: [
          ".c-wrapper.PD0041"
        ]
      },
      {
        name: "hero-banner",
        instances: [
          ".trdBanner-v1"
        ]
      },
      {
        name: "columns-newsletter",
        instances: [
          ".c-wrapper.ST0003",
          ".c-wrapper.ST0001.width-content"
        ]
      }
    ],
    sections: [
      {
        id: "section-hero-carousel",
        name: "Hero Carousel",
        selector: ".component.ST0048",
        style: null,
        blocks: ["carousel-promo"],
        defaultContent: []
      },
      {
        id: "section-quick-links",
        name: "Quick Links Bar",
        selector: ".c-wrapper.CM0014",
        style: null,
        blocks: ["cards-icon"],
        defaultContent: []
      },
      {
        id: "section-promo-tiles",
        name: "Promotional Tiles",
        selector: ".c-wrapper.PD0041",
        style: null,
        blocks: ["cards-promo"],
        defaultContent: []
      },
      {
        id: "section-trending-banner",
        name: "Trending Product Banner",
        selector: "#experiencefragment-8d48ec26cc",
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-member-benefits",
        name: "Member Benefits",
        selector: [".c-wrapper.ST0020.shape-horizontal:nth-of-type(1)"],
        style: null,
        blocks: ["cards-icon"],
        defaultContent: []
      },
      {
        id: "section-service-features",
        name: "Service Features",
        selector: [".c-wrapper.ST0020.shape-horizontal:nth-of-type(2)"],
        style: null,
        blocks: ["cards-icon"],
        defaultContent: []
      },
      {
        id: "section-membership",
        name: "LG Membership",
        selector: "#experiencefragment-c148a9d37d",
        style: null,
        blocks: ["cards-icon"],
        defaultContent: [".c-region-header__headline", ".c-region-header__text"]
      },
      {
        id: "section-product-recs",
        name: "Product Recommendations",
        selector: ".c-wrapper.PD0002",
        style: "border-top",
        blocks: ["carousel-promo"],
        defaultContent: [".c-region-header__headline"]
      },
      {
        id: "section-highlight-stories",
        name: "Highlight Stories",
        selector: ".c-wrapper.PD0046",
        style: null,
        blocks: ["carousel-promo"],
        defaultContent: [".c-region-header__headline", ".c-region-header__text"]
      },
      {
        id: "section-newsletter",
        name: "Newsletter",
        selector: [".c-wrapper.ST0003.align-left", ".c-wrapper.ST0001.width-content"],
        style: null,
        blocks: ["columns-newsletter"],
        defaultContent: [".c-text-contents__eyebrow"]
      },
      {
        id: "section-support",
        name: "Support Section",
        selector: ".container.responsivegrid.margin-top.margin-bottom",
        style: null,
        blocks: ["cards-icon"],
        defaultContent: [".c-region-header__headline", ".c-region-header__text"]
      },
      {
        id: "section-disclaimer",
        name: "Disclaimer",
        selector: ".c-wrapper.ST0003.type-section-title",
        style: null,
        blocks: [],
        defaultContent: [".cmp-text"]
      }
    ]
  };
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
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
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
  var import_homepage_default = {
    transform: (payload) => {
      const { document: document2, url, html, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
