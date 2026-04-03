/**
 * Giscus (GitHub Discussions) — https://giscus.app
 * Theme follows site data-theme (dark/light).
 */
(function () {
  'use strict';

  var REPO = 'khaledweka/khaledweka.github.io';
  var REPO_ID = '1181965214';
  var CATEGORY = 'Announcements';
  var CATEGORY_ID = 'DIC_kwDORnNbns4C5_B5';

  function giscusTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function sendThemeToGiscus(theme) {
    var iframe = document.querySelector('iframe.giscus-frame');
    if (!iframe || !iframe.contentWindow) return;
    try {
      iframe.contentWindow.postMessage({ giscus: { setConfig: { theme: theme } } }, 'https://giscus.app');
    } catch (e) {
      /* ignore cross-origin edge cases */
    }
  }

  function inject() {
    var container = document.getElementById('giscus-container');
    if (!container) return;

    var s = document.createElement('script');
    s.src = 'https://giscus.app/client.js';
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.setAttribute('data-repo', REPO);
    s.setAttribute('data-repo-id', REPO_ID);
    s.setAttribute('data-category', CATEGORY);
    s.setAttribute('data-category-id', CATEGORY_ID);
    s.setAttribute('data-mapping', 'pathname');
    s.setAttribute('data-strict', '0');
    s.setAttribute('data-reactions-enabled', '1');
    s.setAttribute('data-emit-metadata', '0');
    s.setAttribute('data-input-position', 'bottom');
    s.setAttribute('data-theme', giscusTheme());
    s.setAttribute('data-lang', 'en');
    container.appendChild(s);

    var mo = new MutationObserver(function () {
      if (document.querySelector('iframe.giscus-frame')) {
        sendThemeToGiscus(giscusTheme());
        mo.disconnect();
      }
    });
    mo.observe(container, { childList: true, subtree: true });
  }

  function watchSiteTheme() {
    new MutationObserver(function () {
      sendThemeToGiscus(giscusTheme());
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      inject();
      watchSiteTheme();
    });
  } else {
    inject();
    watchSiteTheme();
  }
})();
