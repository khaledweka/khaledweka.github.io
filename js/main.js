/**
 * Portfolio site - Theme toggle, smooth scroll, nav behavior
 */

(function () {
  'use strict';

  const THEME_KEY = 'theme';
  const THEME_DARK = 'dark';
  const THEME_LIGHT = 'light';

  /**
   * Get initial theme: stored preference, or system preference, or dark default
   */
  function getInitialTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === THEME_DARK || stored === THEME_LIGHT) return stored;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return THEME_LIGHT;
    }
    return THEME_DARK;
  }

  /**
   * Apply theme to document
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  /**
   * Toggle between dark and light
   */
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || THEME_DARK;
    const next = current === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    applyTheme(next);
  }

  /**
   * Initialize theme on load
   */
  function initTheme() {
    const theme = getInitialTheme();
    applyTheme(theme);
  }

  /**
   * Setup theme toggle button
   */
  function initThemeToggle() {
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
      btn.addEventListener('click', toggleTheme);
    }
  }

  /**
   * Smooth scroll for anchor links (native scroll-behavior handles most cases,
   * but we ensure hash links scroll smoothly)
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /**
   * Scroll-triggered reveal animations
   */
  function initRevealOnScroll() {
    const elements = document.querySelectorAll('.reveal-on-scroll');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { rootMargin: '0px 0px -80px 0px', threshold: 0 }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /**
   * Bilingual post language tabs (AR / EN)
   */
  function initPostLangTabs() {
    const root = document.querySelector('[data-post-lang-tabs]');
    if (!root) return;

    const tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    if (tabs.length < 2) return;

    const panels = tabs.map(function (tab) {
      const id = tab.getAttribute('aria-controls');
      return id ? document.getElementById(id) : null;
    });

    function selectTab(index, updateHash) {
      if (index < 0 || index >= tabs.length) return;

      tabs.forEach(function (tab, i) {
        const selected = i === index;
        tab.setAttribute('aria-selected', selected ? 'true' : 'false');
        tab.setAttribute('tabindex', selected ? '0' : '-1');
        if (panels[i]) {
          if (selected) {
            panels[i].removeAttribute('hidden');
          } else {
            panels[i].setAttribute('hidden', '');
          }
        }
      });

      if (updateHash && panels[index] && panels[index].id) {
        try {
          history.replaceState(null, '', '#' + panels[index].id);
        } catch (e) {
          /* ignore */
        }
      }
    }

    function indexFromHash() {
      const h = window.location.hash.slice(1);
      if (h === 'section-en') return 1;
      if (h === 'section-ar') return 0;
      return null;
    }

    const fromHash = indexFromHash();
    if (fromHash !== null) {
      selectTab(fromHash, false);
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () {
        selectTab(index, true);
      });
    });

    const tablist = root.querySelector('[role="tablist"]');
    if (tablist) {
      tablist.addEventListener('keydown', function (e) {
        const current = tabs.findIndex(function (t) {
          return t.getAttribute('aria-selected') === 'true';
        });
        if (current < 0) return;

        let next = current;
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          if (e.key === 'ArrowRight') {
            next = (current + 1) % tabs.length;
          } else {
            next = (current - 1 + tabs.length) % tabs.length;
          }
          selectTab(next, true);
          tabs[next].focus();
        } else if (e.key === 'Home') {
          e.preventDefault();
          selectTab(0, true);
          tabs[0].focus();
        } else if (e.key === 'End') {
          e.preventDefault();
          selectTab(tabs.length - 1, true);
          tabs[tabs.length - 1].focus();
        }
      });
    }

    window.addEventListener('hashchange', function () {
      const idx = indexFromHash();
      if (idx !== null) {
        selectTab(idx, false);
      }
    });
  }

  /**
   * Blog post share buttons
   */
  function initBlogShare() {
    const shareEl = document.querySelector('.post-share');
    if (!shareEl) return;

    const url = window.location.href;
    const title = document.querySelector('.post-title')?.textContent || document.title;

    const twitterBtn = shareEl.querySelector('.post-share-twitter');
    const linkedinBtn = shareEl.querySelector('.post-share-linkedin');
    const copyBtn = shareEl.querySelector('.post-share-copy');

    if (twitterBtn) {
      twitterBtn.href = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(title);
      twitterBtn.target = '_blank';
      twitterBtn.rel = 'noopener';
    }

    if (linkedinBtn) {
      linkedinBtn.href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url);
      linkedinBtn.target = '_blank';
      linkedinBtn.rel = 'noopener';
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        navigator.clipboard.writeText(url).then(function () {
          copyBtn.classList.add('copied');
          copyBtn.setAttribute('aria-label', 'Link copied!');
          copyBtn.setAttribute('title', 'Link copied!');
          setTimeout(function () {
            copyBtn.classList.remove('copied');
            copyBtn.setAttribute('aria-label', 'Copy link');
            copyBtn.setAttribute('title', 'Copy link');
          }, 2000);
        });
      });
    }
  }

  /**
   * Update nav active state on scroll (optional enhancement)
   */
  function initNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    if (!sections.length || !navLinks.length) return;

    function updateActive() {
      const scrollY = window.scrollY;
      let current = null;

      sections.forEach(function (section) {
        const top = section.offsetTop - 100;
        const height = section.offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(function (link) {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#') && href.slice(1) === current) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }

    window.addEventListener('scroll', function () {
      requestAnimationFrame(updateActive);
    });
    updateActive();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  function run() {
    initTheme();
    initThemeToggle();
    initPostLangTabs();
    initSmoothScroll();
    initRevealOnScroll();
    initBlogShare();
    initNavHighlight();
  }
})();
