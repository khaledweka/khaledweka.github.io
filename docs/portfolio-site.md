# Portfolio Site Documentation

GitHub Pages portfolio and blog for Khaled Alwakeel. Plain HTML, CSS, and JavaScript—no build step.

## Site Structure

```
khaledweka.github.io/
├── index.html          # Home (English): CV sections (About, Experience, Skills, Certifications)
├── blog/
│   ├── index.html      # Blog listing (English)
│   ├── fintech-logistics-architecture.html
│   ├── welcome-post.html
│   └── restful-api-design.html
├── ar/                 # Arabic mirror of the site chrome (RTL)
│   ├── index.html      # Home (Arabic)
│   └── blog/
│       └── index.html  # Blog listing (Arabic)
├── css/
│   └── styles.css
├── js/
│   └── main.js
└── docs/
    ├── portfolio-site.md
    └── fintech-logistics-architecture.md   # Reference architecture summary
```

Post **bodies** are not translated — only the site chrome and the blog listings.
`/ar/` contains no post files; its listing links back into `/blog/` and each entry
carries a `.post-lang-badge` naming the language the article is actually written in.

## How to Add Blog Posts

There is no build step, so a new post must be registered in **four** places. Keep the
title, date, and excerpt identical across all of them — they have drifted before.

1. Create a new HTML file in `blog/`, e.g. `blog/my-new-post.html`.
2. Copy the structure from `blog/welcome-post.html` (header, nav, language switch,
   `hreflang` block, the inline language-redirect script, footer, theme toggle).
3. Update the `<title>`, `<meta name="description">`, the three `hreflang` URLs,
   the post header, and the content.
4. Add an entry to **`blog/index.html`** in the `<ul class="post-list">`:

```html
<li class="post-item">
  <a href="my-new-post.html" class="post-link">
    <h2 class="post-title">Your Post Title</h2>
    <p class="post-meta">Month Day, Year</p>
    <p class="post-excerpt">Short excerpt...</p>
  </a>
</li>
```

Then add the same entry to **`index.html`** (`<ul class="post-list post-list-home">`),
using `<h3>` instead of `<h2>` and an `href` of `blog/my-new-post.html`.

Next, add an Arabic entry to **`ar/blog/index.html`**, linking back out to the English
file and marking the article's language:

```html
<li class="post-item">
  <a href="../../blog/my-new-post.html" class="post-link">
    <h2 class="post-title">العنوان بالعربية</h2>
    <p class="post-meta">٢٠ مارس ٢٠٢٦ <span class="post-lang-badge" lang="ar">المقال بالإنجليزية</span></p>
    <p class="post-excerpt">مقتطف قصير...</p>
  </a>
</li>
```

Mirror that entry into **`ar/index.html`** (`<h3>`, `href="../blog/my-new-post.html"`),
and bump the **Blog posts** count in both `index.html` and `ar/index.html`.

## Languages (AR / EN) and RTL

English is served from the root; Arabic from `/ar/`. Both trees share one stylesheet.

- **Direction** — Arabic pages set `<html lang="ar" dir="rtl">`. `css/styles.css` uses
  CSS **logical properties** (`padding-inline-start`, `border-inline-start`,
  `inset-inline-start`, `text-align: start`) so the layout mirrors automatically.
  When adding CSS, prefer logical properties over `left`/`right` — physical ones do
  not mirror and will break the Arabic layout.
- **Fonts** — DM Sans has no Arabic glyphs, so `IBM Plex Sans Arabic` is loaded and
  applied under `[lang="ar"]` / `[dir="rtl"]`. Code blocks are pinned to `direction: ltr`.
- **Language detection** — a small inline script in each page's `<head>` (it must run
  before render to avoid a flash of the wrong language) reads `localStorage.lang`;
  with no stored value it falls back to `navigator.languages` and redirects to the
  counterpart URL. It stores the detected value **before** redirecting, so a visitor
  never bounces more than once.
- **Manual switch** — the `.lang-switch` control in the header stores an explicit
  choice in `localStorage.lang`, which always wins over browser detection.
  `counterpartPath()` in `js/main.js` maps a URL to its twin; the inline head script
  duplicates that logic, so **keep the two in sync** if the URL scheme changes.
- **Known limitation** — an English-browser visitor who opens a shared `/ar/` link
  with no stored preference is redirected to the English page. Clicking the switcher
  once makes the choice sticky.
- **Comments** — `js/giscus.js` reads `document.documentElement.lang`, so the widget
  renders in Arabic on `/ar/` pages. Since giscus maps threads by `pathname`,
  `/blog/x.html` and `/ar/blog/x.html` have separate discussion threads.
- **`hreflang`** — each page declares `en`, `ar`, and `x-default` absolute URLs.
  These assume the site is served from `https://khaledalwakeel.github.io/`. If you
  deploy under a subpath (see *Option B* below), update those URLs.
- **Not mirrored** — `blog/ghost-row-problem-laravel-octane-swoole-kubernetes.html`
  is a self-contained page with its own inline CSS and no site chrome. It has no
  Arabic counterpart and no language switch.

## Profile Photo

Place your profile image at `assets/profile.png`.

## Blog Images (Singleton Post)

For the "Why Servers Crash" blog post, copy your two slide images to:
- `assets/blog/singleton-problem.png` (first slide: problem & solution)
- `assets/blog/singleton-solution.png` (second slide: problem → solution → considerations) Recommended size: 400x400px or larger (square). If the image is missing, a fallback with initials "KA" is shown.

## How to Update CV Content

- **About**: Edit the `.about-text` paragraph and `.contact-list` in `index.html`.
- **Experience**: Edit the `.timeline` section; each `.timeline-item` is one role.
- **Skills**: Edit the `.skills-grid`; each `.skill-category` has a title and `.skill-tags`.
- **Certifications**: Edit the `.cert-list` in `index.html`.

## Homepage stats bar (under hero)

`index.html` includes a slim **Site statistics** strip below the hero and above **About**. Constants live at the top of `js/main.js` (`GITHUB_PAGES_*`, `COUNT_API_BASE`, `COUNT_*`). Counters use [Abacus](https://abacus.jasoncameron.dev/) (same `/hit` and `/get` shape as the old CountAPI); the former `api.countapi.xyz` host no longer resolves.

| Stat | Source |
|------|--------|
| **Page views** | Abacus `hit` key `homepage` on each home load (`initVisitorCounter`). Shown with a pill style (`.site-stat-value--pill`). External hit-badge images (e.g. hits.seeyoufarm) were removed: they often fail due to ad blockers, **503** responses, or third-party outages. |
| **Blog views** | Abacus key `blog-views-total`: `get` on the home page (`initBlogViewsDisplay`); `hit` on every load of a URL whose path matches `/blog` (`initBlogViewsIncrement`). Counts aggregate blog section page loads, not uniques. Before any blog page has loaded, `get` returns 404 and the UI shows **0**. |
| **Blog posts** | Static number in `index.html` **and** `ar/index.html` linking to the blog listing — update both when you add posts. |
| **Experience** | Static text in `index.html` / `ar/index.html` (e.g. `12+ yrs`, `+12 سنة`). |
| **Stars / Forks** | GitHub `GET /repos/{owner}/{repo}` once (`initGithubRepoStats`); values link to the repo. Default: [`khaledweka/khaledalwakeel.github.io`](https://github.com/khaledweka/khaledalwakeel.github.io). |
| **Site updated** | Same GitHub response: `pushed_at`. |

If Abacus or GitHub fails, the affected stat shows **—**. Abacus rate limit: **30 requests per 10 seconds per IP**. GitHub unauthenticated limit is about **60 requests/hour per IP**. Change `GITHUB_PAGES_OWNER` / `GITHUB_PAGES_REPO` in `main.js` if the repo moves.

**Other ideas:** privacy-friendly analytics (e.g. GoatCounter) in `<head>`, or Shields.io badges instead of live API calls.

## Theme System

- Dark/light mode toggle in the header.
- Preference stored in `localStorage` under key `theme` (language uses a separate
  `lang` key, so switching language preserves the chosen theme).
- First visit uses `prefers-color-scheme` if no stored preference.
- CSS variables in `css/styles.css` under `[data-theme="dark"]` and `[data-theme="light"]`.

## Deployment to khaledweka.github.io

For the site to be live at **https://khaledweka.github.io**, the repository must be under the GitHub account `khaledweka` and named `khaledweka.github.io`.

### Option A: Repo already under khaledweka

1. Push to `main`:
   ```bash
   git push origin main
   ```
2. On GitHub: **Settings** → **Pages**
3. Under "Build and deployment":
   - **Source**: Deploy from a branch
   - **Branch**: `main` / `/(root)`
4. Save. The site will be live at https://khaledweka.github.io within a few minutes.

### Option B: Keep current repo name (khaledalwakeel.github.io)

If you keep the repo at `khaledweka/khaledalwakeel.github.io`, the site will be at:

**https://khaledweka.github.io/khaledalwakeel.github.io/**

Enable Pages in **Settings** → **Pages** → Source: `main` / `/(root)`.

## Custom Domain

Create a `CNAME` file in the repo root with your custom domain, then configure DNS to point to GitHub Pages.
