# Giscus comments

The site embeds [Giscus](https://giscus.app) on all top-level HTML pages. Comments are backed by [GitHub Discussions](https://docs.github.com/en/discussions) on the published repository.

## Configuration

| Setting | Value |
|--------|--------|
| Repository | `khaledweka/khaledweka.github.io` (GitHub Pages source) |
| Discussion category | Announcements |
| Mapping | `pathname` (one thread per URL path) |

Script constants live in `js/giscus.js` (`REPO`, `REPO_ID`, `CATEGORY`, `CATEGORY_ID`). The category **node id** (`DIC_…`) comes from the GitHub API (`category.node_id` on a discussion in that category) or from the generator at [giscus.app](https://giscus.app).

## Theme

The embed uses the site’s `data-theme` (`light` / `dark`) and updates when the header theme toggle runs (`postMessage` to the giscus iframe).

## Changing category or repo

1. Enable **Discussions** on the GitHub repo and pick or create a category for giscus.
2. Update `js/giscus.js` with the new `data-repo`, `data-repo-id`, `data-category`, and `data-category-id` (see [giscus documentation](https://github.com/giscus/giscus)).
