/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Cohesity site-wide cleanup.
 * Removes non-authorable content from Cohesity pages.
 * All selectors verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Cookie consent banner (found at line 2655: <div id="consent_blackbar">)
    // TrustE consent track (found at line 2656: <div id="truste-consent-track">)
    // Loading spinners (found at line 4: <div class="cmp-loading ...">)
    // Video overlay popup (found at line 2602: <div class="video-overlay" id="videoplayer-popup">)
    // Search overlay (found at line 2619: <div class="overlay-search" id="search-overlay-item">)
    // ShareThis inline buttons (found at line 2642: <div class="sharethis-inline-share-buttons">)
    // ShareThis sticky buttons (found at line 2664: <div id="st-2" class="st-sticky-share-buttons ...">)
    WebImporter.DOMUtils.remove(element, [
      '#consent_blackbar',
      '#truste-consent-track',
      '.cmp-loading',
      '#videoplayer-popup',
      '.video-overlay',
      '#search-overlay-item',
      '.overlay-search',
      '.sharethis-inline-share-buttons',
      '[class*="st-sticky-share-buttons"]',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Header / Navigation (found at line 15: <header class="experiencefragment ... sticky-nav">)
    // Footer (found at line 2420: <footer class="experiencefragment ...">)
    // Violator bar (found at line 13: <div class="violatorbar ...">)
    // Noscript tags (comments at lines 8-9)
    // Iframes (found at lines 2607-2610: video player iframes)
    // Link elements
    // Bizible tracking pixels (found at lines 2661-2662, 2686: <img alt="" src="https://cdn.bizible.com/...">)
    WebImporter.DOMUtils.remove(element, [
      'header.experiencefragment',
      'header.sticky-nav',
      'header.navigation-top',
      'header.navigation-top--mobile',
      'footer.experiencefragment',
      '.violatorbar',
      'noscript',
      'iframe',
      'link',
    ]);

    // Remove tracking pixels (Bizible and similar) - identified by src containing tracking domains
    element.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (src.includes('cdn.bizible.com')
        || src.includes('cdn.bizibly.com')
        || src.includes('segments.company-target.com')
        || src.includes('i.liadm.com')
        || src.includes('sync.sharethis.com')) {
        img.remove();
      }
    });

    // Remove data-layer and tracking attributes from all elements
    element.querySelectorAll('[data-cmp-data-layer]').forEach((el) => {
      el.removeAttribute('data-cmp-data-layer');
    });
    element.querySelectorAll('[data-cmp-clickable]').forEach((el) => {
      el.removeAttribute('data-cmp-clickable');
    });
  }
}
