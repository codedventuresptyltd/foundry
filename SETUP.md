# Foundry Setup Guide

This guide will help you get Foundry up and running, both locally and deployed to Cloudflare Pages.

## Prerequisites

- **Node.js 20+** - [Download here](https://nodejs.org/)
  - Required by Docusaurus 3.9.1
- **npm** - Comes with Node.js
- **Git** - For version control

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/codedventuresptyltd/foundry.git
cd foundry
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including Docusaurus and its dependencies.

### 3. Start Development Server

```bash
npm start
```

This starts the development server at `http://localhost:3000` and opens it in your browser.

The development server has hot-reloading, so most changes will appear immediately without restarting.

### 4. Build for Production

To test a production build locally:

```bash
npm run build
npm run serve
```

This builds the static site into the `build/` directory and serves it locally.

---

## Deployment Setup (Cloudflare Pages)

### 1. Create Cloudflare Pages Project

1. Log in to your Cloudflare dashboard
2. Go to **Pages** → **Create a project**
3. Connect your GitHub repository (`codedventuresptyltd/foundry`)
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `build`
   - **Root directory:** `/`
   - **Node version:** `20`

### 2. Configure GitHub Secrets

In your GitHub repository settings, add these secrets:

- **`CLOUDFLARE_API_TOKEN`**
  - Go to Cloudflare dashboard → My Profile → API Tokens
  - Create token with "Cloudflare Pages - Edit" permissions
  - Copy the token value

- **`CLOUDFLARE_ACCOUNT_ID`**
  - Found in Cloudflare dashboard → Workers & Pages → Overview
  - Copy your account ID from the right sidebar

### 3. Configure Custom Domain

1. In Cloudflare Pages project settings
2. Go to **Custom domains**
3. Add `foundry.codedventures.io`
4. Cloudflare will automatically configure DNS

### 4. Configure Analytics (Optional)

**Cloudflare Web Analytics:**

1. Go to Cloudflare dashboard → Web Analytics
2. Create a site for `foundry.codedventures.com.au`
3. Copy the token
4. Update `docusaurus.config.js`:

```javascript
'data-cf-beacon': '{"token": "YOUR_ACTUAL_TOKEN"}',
```

**Plausible Analytics (Alternative):**

If you prefer Plausible:

1. Sign up at [plausible.io](https://plausible.io)
2. Add your domain
3. Add to `docusaurus.config.js`:

```javascript
scripts: [
  {
    src: 'https://plausible.io/js/script.js',
    defer: true,
    'data-domain': 'foundry.codedventures.com.au',
  },
],
```

### 5. Enable Search (Optional)

**Algolia DocSearch:**

1. Apply for DocSearch at [docsearch.algolia.com](https://docsearch.algolia.com/)
2. Once approved, you'll receive app credentials
3. Update `docusaurus.config.js`:

```javascript
algolia: {
  appId: 'YOUR_APP_ID',
  apiKey: 'YOUR_SEARCH_API_KEY',
  indexName: 'foundry',
},
```

---

## Environment Variables

Create a `.env.local` file for local development (not committed to git):

```bash
# Optional: Algolia search credentials
ALGOLIA_APP_ID=your_app_id
ALGOLIA_API_KEY=your_api_key

# Optional: Analytics token
CLOUDFLARE_ANALYTICS_TOKEN=your_token
```

---

## Workflow

### Daily Development

```bash
npm start          # Start dev server
npm run build      # Build for production
npm run serve      # Serve production build locally
npm run clear      # Clear Docusaurus cache (if needed)
```

### Deployment

Deployment is automatic via GitHub Actions:

1. Make changes on a feature branch
2. Open a pull request
3. GitHub Actions builds a preview
4. Merge to `main` → automatic production deployment

---

## Project Structure

```
foundry/
├── docs/                      # Documentation pages
│   ├── index.mdx             # Home page
│   ├── commercebridge/       # CommerceBridge docs
│   ├── touchpoint/           # Touchpoint docs
│   ├── eidos/                # Eidos docs
│   └── core/                 # Core concepts
├── fieldnotes/               # Blog posts (Field Notes)
├── src/
│   └── css/
│       └── custom.css        # Custom theme
├── static/
│   ├── img/                  # Images and assets
│   ├── CNAME                 # Custom domain config
│   └── robots.txt            # SEO robots file
├── .github/
│   └── workflows/
│       └── deploy-cloudflare-pages.yml  # CI/CD
├── docusaurus.config.js      # Main config
├── sidebars.js               # Sidebar structure
└── package.json              # Dependencies
```

---

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
npm run clear
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port 3000 Already in Use

```bash
# Use a different port
npm start -- --port 3001
```

### Changes Not Appearing

- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Clear cache: `npm run clear`
- Restart dev server

---

## Next Steps

1. **Customize branding** - Replace placeholder images in `static/img/`
2. **Add content** - Fill in documentation sections
3. **Configure analytics** - Set up Cloudflare or Plausible
4. **Enable search** - Apply for Algolia DocSearch
5. **Custom domain** - Configure DNS for `foundry.codedventures.io`

---

## Support

For questions or issues:

- Check the [Docusaurus documentation](https://docusaurus.io/docs)
- Review [Cloudflare Pages docs](https://developers.cloudflare.com/pages/)
- Open an issue in the repository

---

**Happy documenting!** 🔨

