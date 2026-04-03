# Portfolio Site Documentation

GitHub Pages portfolio and blog for Khaled Alwakeel. Plain HTML, CSS, and JavaScript—no build step.

## Site Structure

```
khaledweka.github.io/
├── index.html          # Home: CV sections (About, Experience, Skills, Certifications)
├── blog/
│   ├── index.html      # Blog listing
│   ├── fintech-logistics-architecture.html
│   ├── welcome-post.html
│   └── restful-api-design.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
└── docs/
    ├── portfolio-site.md
    └── fintech-logistics-architecture.md   # Reference architecture summary
```

## How to Add Blog Posts

1. Create a new HTML file in `blog/`, e.g. `blog/my-new-post.html`.
2. Copy the structure from `blog/welcome-post.html` (header, footer, theme toggle).
3. Update the `<title>`, `<meta name="description">`, post header, and content.
4. Add an entry to `blog/index.html` in the `<ul class="post-list">`:

```html
<li class="post-item">
  <a href="my-new-post.html" class="post-link">
    <h2 class="post-title">Your Post Title</h2>
    <p class="post-meta">Month Day, Year</p>
    <p class="post-excerpt">Short excerpt...</p>
  </a>
</li>
```

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
| **Page views** | Abacus `hit` key `homepage` on each home load (`initVisitorCounter`). |
| **Blog views** | Abacus key `blog-views-total`: `get` on the home page (`initBlogViewsDisplay`); `hit` on every load of a URL whose path matches `/blog` (`initBlogViewsIncrement`). Counts aggregate blog section page loads, not uniques. Before any blog page has loaded, `get` returns 404 and the UI shows **0**. |
| **Blog posts** | Static number in `index.html` linking to `blog/index.html` — update when you add posts. |
| **Experience** | Static text in `index.html` (e.g. `12+ yrs`). |
| **Stars / Forks** | GitHub `GET /repos/{owner}/{repo}` once (`initGithubRepoStats`); values link to the repo. Default: [`khaledweka/khaledalwakeel.github.io`](https://github.com/khaledweka/khaledalwakeel.github.io). |
| **Site updated** | Same GitHub response: `pushed_at`. |

If Abacus or GitHub fails, the affected stat shows **—**. Abacus rate limit: **30 requests per 10 seconds per IP**. GitHub unauthenticated limit is about **60 requests/hour per IP**. Change `GITHUB_PAGES_OWNER` / `GITHUB_PAGES_REPO` in `main.js` if the repo moves.

**Other ideas:** privacy-friendly analytics (e.g. GoatCounter) in `<head>`, or Shields.io badges instead of live API calls.

## Theme System

- Dark/light mode toggle in the header.
- Preference stored in `localStorage` under key `theme`.
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
