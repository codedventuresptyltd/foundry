# Coded Ventures Foundry

**The forge behind Coded Ventures frameworks**

Foundry is the public engineering forge for Coded Ventures — where we document our frameworks, share architectural insights, and provide integration guides.

🌐 **Live Site:** [foundry.codedventures.com.au](https://foundry.codedventures.com.au)

---

## What is Foundry?

Foundry is not just documentation — it's our public workshop where we:

- Explain how our systems work
- Document architectural decisions
- Share design patterns and principles
- Provide SDK references and integration guides
- Publish engineering narratives and insights

### Our Frameworks

- **[CommerceBridge](https://foundry.codedventures.io/commercebridge)** — The framework that orchestrates commerce
- **[Touchpoint](https://foundry.codedventures.io/touchpoint)** — Dynamic ordering experiences for trade & industry
- **[Eidos](https://foundry.codedventures.io/eidos)** — Structured knowledge for configurable products

---

## Local Development

### Prerequisites

- Node.js 20 or higher (required by Docusaurus 3.9.1)
- npm

### Installation

```bash
npm install
```

### Start Development Server

```bash
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

---

## Documentation Structure

```
foundry/
├── docs/
│   ├── index.mdx                 # Home page
│   ├── commercebridge/           # CommerceBridge docs
│   ├── touchpoint/               # Touchpoint docs
│   ├── eidos/                    # Eidos docs
│   └── core/                     # Core concepts
├── fieldnotes/                   # Blog posts / Field Notes
├── src/
│   └── css/
│       └── custom.css            # Custom theme (forge aesthetic)
├── static/
│   └── img/                      # Images and assets
├── docusaurus.config.js          # Docusaurus configuration
└── sidebars.js                   # Sidebar structure
```

---

## Theme

Foundry uses a custom **forge aesthetic**:

- **Base Color:** Dark graphite (#13151a)
- **Accent Colors:** Steel (#7a8599) and silver (#c5d1e5)
- **Typography:** Modern sans-serif with monospace accents
- **Tone:** Engineering craftsmanship meets design thinking

---

## Contributing

### Documentation Guidelines

- Write in clear, conversational language
- Use code examples where helpful
- Include diagrams for complex concepts
- Link between related topics
- Mark incomplete sections with `:::info Coming Soon` admonitions

### Field Notes

To publish a new Field Note:

1. Create a new markdown file in `fieldnotes/`
2. Follow the naming convention: `YYYY-MM-DD-slug.md`
3. Include frontmatter:

```markdown
---
slug: your-post-slug
title: Your Post Title
authors: [codedventures]
tags: [relevant, tags]
---
```

4. Use `<!-- truncate -->` to mark the preview cutoff point

---

## Deployment

Foundry is automatically deployed to Cloudflare Pages when changes are pushed to the `main` branch.

### Build Configuration

- **Build Command:** `npm run build`
- **Build Output:** `build/`
- **Node.js Version:** 20
- **Root Directory:** `/`

### Deployment Process

1. **Push to main** → Cloudflare Pages detects changes
2. **Build** → Cloudflare builds Docusaurus site with Node.js 20
3. **Deploy** → Site automatically deployed to global CDN
4. **Live** → Site available at `foundry.codedventures.com.au`

No GitHub secrets or complex configuration needed - Cloudflare Pages connects directly to GitHub.

---

## Built With

- [Docusaurus 2](https://docusaurus.io/) — Documentation framework
- [React](https://reactjs.org/) — UI library
- [Cloudflare Pages](https://pages.cloudflare.com/) — CI/CD & Hosting

---

## Philosophy

> **Engineering craftsmanship meets clear design thinking.**

We believe in:

- **Building in the open** — sharing the shape of our systems
- **Crafted precision** — thoughtful design over marketing hype
- **Calm confidence** — we don't need to shout about what we build
- **Learning in public** — documenting not just how, but why

---

## License

Documentation © 2025 Coded Ventures. All rights reserved.

---

**Welcome to the forge.**
