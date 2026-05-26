/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: LG Germany site-wide cleanup.
 * Removes non-authorable content from the page DOM.
 * All selectors validated against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove popup/modal dialogs (found: class="c-pop-msg medium")
    WebImporter.DOMUtils.remove(element, ['.c-pop-msg']);

    // Remove Swiper duplicate slides (cloned by Swiper.js, not authorable)
    WebImporter.DOMUtils.remove(element, ['.swiper-slide-duplicate']);

    // Remove smartcapture marketing widgets (found: id="smartcapture-block-2ocz55s01hi")
    WebImporter.DOMUtils.remove(element, ['.smartcapture-content-wrapper', '[id^="smartcapture-"]']);

    // Remove swiper accessibility notification divs (found: class="swiper-notification")
    WebImporter.DOMUtils.remove(element, ['.swiper-notification']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove carousel UI controls (found: class="c-carousel-controls")
    WebImporter.DOMUtils.remove(element, [
      '.c-carousel-controls',
      '.c-carousel__handler',
    ]);

    // Remove product carousel navigation (found: class="neo-carousel--handler", "neo-carousel--pagination")
    WebImporter.DOMUtils.remove(element, [
      '.neo-carousel--handler',
      '.neo-carousel--pagination',
    ]);

    // Remove BazaarVoice rating widgets (found: class="bv_main_container ...")
    WebImporter.DOMUtils.remove(element, ['[class*="bv_"]']);

    // Remove product download click elements (found: class="c-product-item__download")
    WebImporter.DOMUtils.remove(element, ['.c-product-item__download']);

    // Remove embed containers that hold third-party scripts (found: class="embed aem-GridColumn...")
    WebImporter.DOMUtils.remove(element, ['.embed']);

    // Remove analytics/styling markers (found: class="camarker-inner", "stylingblock-content-wrapper")
    WebImporter.DOMUtils.remove(element, ['.camarker-inner', '.stylingblock-content-wrapper:not(.camarker-inner)']);

    // Remove form required area indicators (found: class="c-required-area")
    WebImporter.DOMUtils.remove(element, ['.c-required-area']);

    // Remove empty date range elements (found: class="text c-text-contents__date js-date-range")
    const dateRanges = element.querySelectorAll('.js-date-range');
    dateRanges.forEach((el) => {
      if (!el.textContent.trim()) el.remove();
    });

    // Clean up AEM Grid layout classes that are not authorable
    element.querySelectorAll('[class*="aem-Grid"]').forEach((el) => {
      const classes = el.className.split(' ').filter((c) => !c.startsWith('aem-Grid'));
      el.className = classes.join(' ').trim();
    });
  }
}
