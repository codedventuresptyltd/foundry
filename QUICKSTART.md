# Foundry Quick Start

Get Foundry running in 5 minutes.

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The site opens at `http://localhost:3000` with hot-reloading enabled.

## Project Structure

```
foundry/
├── docs/              # Documentation pages (markdown/MDX)
├── fieldnotes/        # Blog posts
├── src/css/           # Custom theme
├── static/            # Images and assets
├── docusaurus.config.js  # Configuration
└── sidebars.js        # Navigation structure
```

## Common Tasks

### Add a New Documentation Page

1. Create a markdown file in the appropriate `docs/` subdirectory
2. Add frontmatter:
   ```markdown
   ---
   sidebar_position: 1
   title: Page Title
   ---
   ```
3. Write your content
4. The page automatically appears in the sidebar

### Write a Field Note

1. Create `fieldnotes/YYYY-MM-DD-slug.md`
2. Add frontmatter:
   ```markdown
   ---
   slug: post-slug
   title: Post Title
   authors: [codedventures]
   tags: [tag1, tag2]
   ---
   ```
3. Write content
4. Add `<!-- truncate -->` for preview cutoff

### Customize Theme

Edit `src/css/custom.css` to adjust colors and styling.

### Update Navigation

Edit `sidebars.js` to modify sidebar structure.

## Build Commands

```bash
npm start       # Development server
npm run build   # Production build
npm run serve   # Preview production build
npm run clear   # Clear cache
```

## Deploy

Push to `main` branch → automatic deployment via GitHub Actions to Cloudflare Pages.

## Need Help?

- [Full Setup Guide](./SETUP.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
- [Docusaurus Docs](https://docusaurus.io/docs)

---

**Happy documenting!** 🔨

