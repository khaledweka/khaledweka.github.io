/**
 * Portfolio site - Theme toggle, smooth scroll, nav behavior
 */

(function () {
  'use strict';

  const THEME_KEY = 'theme';
  const THEME_DARK = 'dark';
  const THEME_LIGHT = 'light';

  const LANG_KEY = 'lang';
  const LANG_AR = 'ar';
  const LANG_EN = 'en';

  const GITHUB_PAGES_OWNER = 'khaledweka';
  const GITHUB_PAGES_REPO = 'khaledweka.github.io';
  /** Abacus (CountAPI-compatible); original api.countapi.xyz no longer resolves */
  const COUNT_API_BASE = 'https://abacus.jasoncameron.dev';
  const COUNT_NS = 'khaledalwakeel-github-io';
  const COUNT_KEY_HOMEPAGE = 'homepage';
  const COUNT_KEY_BLOG_VIEWS = 'blog-views-total';

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
   * Language switch (AR <-> EN).
   *
   * The counterpart page is the same filename under (or outside) the /ar/ prefix,
   * so the mapping is a pure prefix add/strip. This mirrors the inline <head>
   * redirect script — keep the two in sync if the URL scheme ever changes.
   */
  function counterpartPath(pathname, targetLang) {
    // Site root varies: "/" on the custom domain, "/repo/" on project pages,
    // and a deep directory under file://. Derive it from the current page.
    const arMatch = pathname.match(/^(.*?)\/ar\/(.*)$/);

    if (targetLang === LANG_EN) {
      return arMatch ? arMatch[1] + '/' + arMatch[2] : pathname;
    }

    if (arMatch) return pathname;

    // Going EN -> AR: insert /ar/ before the trailing "blog/x.html" or "x.html".
    // Directory URLs ("/", "/blog/") have an empty last segment — treat as index.
    const parts = pathname.split('/');
    const file = parts.pop();
    const isBlog = parts[parts.length - 1] === 'blog';
    if (isBlog) parts.pop();
    return parts.join('/') + '/ar/' + (isBlog ? 'blog/' : '') + file;
  }

  function initLangSwitch() {
    const btn = document.querySelector('.lang-switch');
    if (!btn) return;

    const target = btn.getAttribute('data-lang-target') === LANG_AR ? LANG_AR : LANG_EN;

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      try {
        localStorage.setItem(LANG_KEY, target);
      } catch (err) {
        /* private mode — still navigate */
      }
      window.location.href = counterpartPath(window.location.pathname, target) + window.location.hash;
    });
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

  /**
   * Homepage page-view counter (Abacus — static-site friendly, no backend).
   * Increments once per full page load; not unique visitors.
   */
  function initVisitorCounter() {
    var wrap = document.getElementById('visitor-counter');
    if (!wrap) return;

    var valueEl = wrap.querySelector('.visitor-counter-value');
    if (!valueEl) return;

    var url =
      COUNT_API_BASE +
      '/hit/' +
      encodeURIComponent(COUNT_NS) +
      '/' +
      encodeURIComponent(COUNT_KEY_HOMEPAGE);

    fetch(url, { method: 'GET', cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) throw new Error('bad status');
        return res.json();
      })
      .then(function (data) {
        if (data && typeof data.value !== 'undefined') {
          valueEl.textContent = Number(data.value).toLocaleString();
        } else {
          valueEl.textContent = '—';
        }
      })
      .catch(function () {
        valueEl.textContent = '—';
      })
      .finally(function () {
        valueEl.removeAttribute('aria-busy');
      });
  }

  function isBlogSectionPath() {
    var p = window.location.pathname || '';
    return /\/blog(\/|$)/.test(p);
  }

  /**
   * Increment aggregate blog view counter on any /blog/ page load (Abacus hit).
   */
  function initBlogViewsIncrement() {
    if (!isBlogSectionPath()) return;
    var url =
      COUNT_API_BASE +
      '/hit/' +
      encodeURIComponent(COUNT_NS) +
      '/' +
      encodeURIComponent(COUNT_KEY_BLOG_VIEWS);
    fetch(url, { method: 'GET', cache: 'no-store' }).catch(function () {});
  }

  /**
   * Homepage: show blog view total without incrementing (Abacus get).
   * Abacus returns 404 until the blog counter exists (no visits yet).
   */
  function initBlogViewsDisplay() {
    var el = document.getElementById('blog-views-value');
    if (!el) return;

    var url =
      COUNT_API_BASE +
      '/get/' +
      encodeURIComponent(COUNT_NS) +
      '/' +
      encodeURIComponent(COUNT_KEY_BLOG_VIEWS);

    fetch(url, { method: 'GET', cache: 'no-store' })
      .then(function (res) {
        if (res.status === 404) return { value: 0 };
        if (!res.ok) throw new Error('bad status');
        return res.json();
      })
      .then(function (data) {
        if (data && typeof data.value !== 'undefined' && data.value !== null) {
          el.textContent = Number(data.value).toLocaleString();
        } else {
          el.textContent = '0';
        }
      })
      .catch(function () {
        el.textContent = '—';
      })
      .finally(function () {
        el.removeAttribute('aria-busy');
      });
  }

  /**
   * GitHub repo: last push, stars, forks (single request). Unauthenticated: 60 req/hr per IP.
   */
  function initGithubRepoStats() {
    var elDate = document.getElementById('repo-pushed-at');
    var elStars = document.getElementById('github-stars');
    var elForks = document.getElementById('github-forks');
    if (!elDate && !elStars && !elForks) return;

    var url =
      'https://api.github.com/repos/' +
      encodeURIComponent(GITHUB_PAGES_OWNER) +
      '/' +
      encodeURIComponent(GITHUB_PAGES_REPO);

    fetch(url, {
      headers: { Accept: 'application/vnd.github+json' },
      cache: 'no-store'
    })
      .then(function (res) {
        if (!res.ok) throw new Error('bad status');
        return res.json();
      })
      .then(function (data) {
        if (!data) return;

        if (elDate) {
          if (data.pushed_at) {
            var d = new Date(data.pushed_at);
            elDate.textContent = d.toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
          } else {
            elDate.textContent = '—';
          }
        }

        if (elStars && typeof data.stargazers_count === 'number') {
          elStars.textContent = data.stargazers_count.toLocaleString();
        } else if (elStars) {
          elStars.textContent = '—';
        }

        if (elForks && typeof data.forks_count === 'number') {
          elForks.textContent = data.forks_count.toLocaleString();
        } else if (elForks) {
          elForks.textContent = '—';
        }
      })
      .catch(function () {
        if (elDate) elDate.textContent = '—';
        if (elStars) elStars.textContent = '—';
        if (elForks) elForks.textContent = '—';
      })
      .finally(function () {
        if (elDate) elDate.removeAttribute('aria-busy');
        if (elStars) elStars.removeAttribute('aria-busy');
        if (elForks) elForks.removeAttribute('aria-busy');
      });
  }

  /**
   * UI enhancements: skip link, mobile nav, header shadow, reading progress,
   * back-to-top. All injected so no per-page HTML changes are needed.
   */
  function initSkipLink() {
    var main = document.querySelector('main');
    if (!main) return;
    if (!main.id) main.id = 'main-content';
    main.setAttribute('tabindex', '-1');
    var isAr = document.documentElement.lang === 'ar';
    var a = document.createElement('a');
    a.className = 'skip-link';
    a.href = '#' + main.id;
    a.textContent = isAr ? 'تخطي إلى المحتوى' : 'Skip to content';
    document.body.insertBefore(a, document.body.firstChild);
  }

  function initMobileNav() {
    var inner = document.querySelector('.header-inner');
    var nav = inner && inner.querySelector('nav');
    if (!nav) return;
    var isAr = document.documentElement.lang === 'ar';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nav-toggle';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', isAr ? 'القائمة' : 'Menu');
    btn.innerHTML =
      '<svg class="icon-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>' +
      '<svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    inner.appendChild(btn);

    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    btn.addEventListener('click', function () {
      setOpen(btn.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a[href^="#"]')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        btn.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (!inner.contains(e.target)) setOpen(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) setOpen(false);
    });
  }

  function initScrollUi() {
    var header = document.querySelector('.site-header');
    var isPost = !!document.querySelector('.post-content');
    var bar = null;
    if (isPost) {
      var wrap = document.createElement('div');
      wrap.className = 'reading-progress';
      wrap.setAttribute('aria-hidden', 'true');
      bar = document.createElement('span');
      wrap.appendChild(bar);
      document.body.appendChild(wrap);
    }

    var isAr = document.documentElement.lang === 'ar';
    var top = document.createElement('button');
    top.type = 'button';
    top.className = 'back-to-top';
    top.setAttribute('aria-label', isAr ? 'العودة للأعلى' : 'Back to top');
    top.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(top);
    top.addEventListener('click', function () {
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });

    var ticking = false;
    function update() {
      ticking = false;
      var y = window.scrollY;
      if (header) header.classList.toggle('is-scrolled', y > 8);
      top.classList.toggle('is-visible', y > 600);
      if (bar) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
      }
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
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
    initLangSwitch();
    initPostLangTabs();
    initBlogViewsIncrement();
    initVisitorCounter();
    initBlogViewsDisplay();
    initGithubRepoStats();
    initSmoothScroll();
    initRevealOnScroll();
    initBlogShare();
    initNavHighlight();
    initSkipLink();
    initMobileNav();
    initScrollUi();
  }
})();
