# Foundry Deployment Checklist

Use this checklist to ensure Foundry is properly configured before going live.

## Pre-Deployment

### 1. Branding & Assets

- [ ] Replace placeholder logo (`static/img/logo.svg`) with actual Foundry logo
- [ ] Create and add `favicon.ico` to `static/img/`
- [ ] Create social media card image (`static/img/foundry-social-card.jpg`)
- [ ] Update logo references in `docusaurus.config.js` if needed
- [ ] Review and adjust color palette in `src/css/custom.css` if needed

### 2. Configuration

- [ ] Update site URL in `docusaurus.config.js` (should be `https://foundry.codedventures.io`)
- [ ] Update GitHub organization/repo URLs in `docusaurus.config.js`
- [ ] Update footer copyright year if needed
- [ ] Review and update footer links
- [ ] Verify CNAME file has correct domain (`static/CNAME`)

### 3. Content Review

- [ ] Review home page (`docs/index.mdx`) for accuracy
- [ ] Check all intro pages for each section
- [ ] Verify all internal links work
- [ ] Review Field Notes welcome post
- [ ] Check for any TODO or placeholder content

### 4. SEO Setup

- [ ] Update meta description in `docusaurus.config.js`
- [ ] Update meta keywords
- [ ] Verify Open Graph metadata
- [ ] Check robots.txt configuration
- [ ] Test sitemap generation (`npm run build` then check `build/sitemap.xml`)

---

## Cloudflare Setup

### 1. Cloudflare Pages Configuration

No GitHub secrets needed - Cloudflare Pages connects directly to GitHub:

### 2. Cloudflare Pages Project

- [ ] Create new Pages project in Cloudflare
- [ ] Connect to GitHub repository `codedventuresptyltd/foundry`
- [ ] Configure build settings:
  - Build command: `npm run build`
  - Build output directory: `build`
  - Root directory: `/`
  - Environment variables: `NODE_VERSION=20`
  - Node.js version: 20

### 3. Custom Domain

- [ ] Add custom domain `foundry.codedventures.com.au` in Pages settings
- [ ] Verify DNS configuration
- [ ] Enable "Always Use HTTPS"
- [ ] Wait for SSL certificate provisioning

### 4. Deploy Settings

- [ ] Set production branch to `main`
- [ ] Enable automatic deployments on push to `main`
- [ ] Configure preview deployments for pull requests (automatic)
- [ ] Set up deployment notifications (optional)
- [ ] Enable "Always Use HTTPS"

---

## Analytics Setup

### Option A: Cloudflare Web Analytics

- [ ] Enable Web Analytics in Cloudflare dashboard
- [ ] Add site: `foundry.codedventures.com.au`
- [ ] Copy the analytics token
- [ ] Update `docusaurus.config.js`:
  ```javascript
  'data-cf-beacon': '{"token": "YOUR_ACTUAL_TOKEN"}',
  ```

### Option B: Plausible Analytics

- [ ] Sign up at plausible.io
- [ ] Add your domain
- [ ] Update `docusaurus.config.js` with Plausible script
- [ ] Test that analytics are working

### Google Analytics (Optional)

- [ ] Create GA4 property
- [ ] Get measurement ID
- [ ] Add to `docusaurus.config.js`:
  ```javascript
  gtag: {
    trackingID: 'G-XXXXXXXXXX',
  },
  ```

---

## Search Setup (Optional)

### Algolia DocSearch

- [ ] Apply at [docsearch.algolia.com](https://docsearch.algolia.com/)
- [ ] Wait for approval (can take a few days)
- [ ] Add credentials to `docusaurus.config.js`
- [ ] Test search functionality

---

## Post-Deployment

### 1. Verification

- [ ] Visit `https://foundry.codedventures.com.au` and verify it loads
- [ ] Test all navigation links
- [ ] Check mobile responsiveness
- [ ] Test dark/light mode toggle
- [ ] Verify analytics are tracking
- [ ] Check console for errors
- [ ] Test on different browsers (Chrome, Firefox, Safari, Edge)

### 2. Performance

- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Verify page load times
- [ ] Test on slow connections

### 3. SEO

- [ ] Submit sitemap to Google Search Console
- [ ] Verify robots.txt is accessible
- [ ] Check Open Graph preview with [metatags.io](https://metatags.io/)
- [ ] Verify Twitter Card preview

### 4. Social Media

- [ ] Share on company social media
- [ ] Update company website with link to Foundry
- [ ] Add to email signatures (optional)

---

## Monitoring

### Ongoing

- [ ] Set up uptime monitoring (Cloudflare, UptimeRobot, etc.)
- [ ] Monitor analytics weekly
- [ ] Review search analytics (if using Algolia)
- [ ] Monitor GitHub Issues for documentation feedback
- [ ] Schedule quarterly content reviews

### Maintenance

- [ ] Update dependencies monthly: `npm update`
- [ ] Review and update outdated documentation
- [ ] Add new Field Notes regularly
- [ ] Respond to issues and pull requests

---

## Rollback Plan

If something goes wrong:

1. **Cloudflare Pages:** Use the "Rollback" button to revert to previous deployment
2. **GitHub:** Revert the problematic commit
3. **DNS:** Cloudflare manages this, but you can temporarily disable the custom domain

---

## Support Contacts

- **Cloudflare Support:** Via dashboard
- **Docusaurus:** [Discord](https://discord.gg/docusaurus)
- **GitHub:** Repository issues

---

## Completed Date

- [ ] Production deployment completed: _______________
- [ ] DNS propagation verified: _______________
- [ ] Analytics verified: _______________
- [ ] Team notified: _______________

---

**Ready to forge!** 🔨

