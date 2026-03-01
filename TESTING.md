# Testing Foundry Documentation Locally

This guide explains how to test both the public Foundry site and container-pinned docs locally.

## Testing the Public Foundry Site (`foundry/`)

The public Docusaurus site in this repository (`foundry/`).

### Prerequisites

- Node.js 20 or higher
- npm

### Quick Start

```bash
cd /Users/johncorlett/dev/coded-ventures/foundry

# Install dependencies (first time only)
npm install

# Start development server
npm start
```

This will:
- Start a local development server at `http://localhost:3000`
- Automatically open your browser
- Watch for file changes and hot-reload

### Build for Production Testing

```bash
# Generate versions.json (auto-runs before build via prebuild script)
npm run prebuild

# Build the site
npm run build

# Serve the built site locally
npm run serve
```

### Version Selector

Access the version selector page:
- **URL**: http://localhost:3000/versions
- **Purpose**: Browse all version folders (`docs/version-*/`)

### Available Pages

- **Home**: http://localhost:3000/
- **Versions**: http://localhost:3000/versions
- **Version Docs**: http://localhost:3000/docs/version-X-X-X/ (for each version folder)
- **Field Notes**: http://localhost:3000/fieldnotes

### Testing Version Folders

1. **Check existing versions**:
   ```bash
   ls docs/version-*
   ```

2. **Verify versions.json is generated**:
   ```bash
   cat static/versions.json
   ```

3. **Add a test version folder** (if needed):
   ```bash
   mkdir -p docs/version-0-0-9
   # Copy some docs to test
   cp -r docs/version-0-1/* docs/version-0-0-9/
   ```

4. **Rebuild**:
   ```bash
   npm run build
   ```

5. **Verify new version appears**:
   - Visit http://localhost:3000/versions
   - New version should appear in the list

---

## Testing Container-Pinned Docs (`morphogenic-commerce/docs/foundry/`)

Container-pinned docs are served via the Version API in the morphogenic-commerce repository.

### Prerequisites

- Docker
- Built services container

### Option 1: Run via Docker Container (Recommended)

This tests the docs as they will appear in production (built into the container).

```bash
cd /Users/johncorlett/dev/coded-ventures/morphogenic-commerce

# Build the container (if not already built)
./release/release.sh containers

# Run the version API container
docker run -d \
  --name version-api \
  -p 3100:3000 \
  -e SERVICE=version \
  -e API_MESH_DEV_PORT=3000 \
  -e NODE_ENV=development \
  services:0.0.8-dev  # Replace with your version tag
```

**Access the Version API**:
- **Home**: http://localhost:3100/
- **Foundry Docs**: http://localhost:3100/docs/foundry
- **Developer Docs**: http://localhost:3100/docs/developer
- **Version Info**: http://localhost:3100/version

**View logs**:
```bash
docker logs -f version-api
```

**Stop container**:
```bash
docker stop version-api
docker rm version-api
```

### Option 2: Run Version API Locally (Development)

This runs the Version API directly from source (faster for development).

```bash
cd /Users/johncorlett/dev/coded-ventures/morphogenic-commerce

# Build the experience layer
cd experienceLayer
pnpm install
pnpm run build

# Start the version API
pnpm run start-version
```

**Note**: The API will run on port `3100` (or `API_MESH_DEV_PORT`).

### Testing Container Docs Workflow

1. **Edit docs** in `morphogenic-commerce/docs/foundry/`

2. **Rebuild container** (to include updated docs):
   ```bash
   cd morphogenic-commerce
   ./release/release.sh containers
   ```

3. **Restart container**:
   ```bash
   docker stop version-api && docker rm version-api
   docker run -d \
     --name version-api \
     -p 3100:3000 \
     -e SERVICE=version \
     -e API_MESH_DEV_PORT=3000 \
     services:0.0.8-dev
   ```

4. **Verify changes**:
   - Visit http://localhost:3100/docs/foundry
   - Check that your edits are visible

---

## Testing the Full Workflow

### 1. Edit Container-Pinned Docs

```bash
cd /Users/johncorlett/dev/coded-ventures/morphogenic-commerce
# Edit files in docs/foundry/
vim docs/foundry/core/index.mdx
```

### 2. Test in Container (Version API)

```bash
# Rebuild and run container
./release/release.sh containers
docker run -d --name version-api -p 3100:3000 -e SERVICE=version -e API_MESH_DEV_PORT=3000 services:0.0.8-dev

# Visit http://localhost:3100/docs/foundry
```

### 3. Sync to Foundry (Manual Test)

```bash
# Copy container docs to foundry version folder (manual for testing)
VERSION="0.0.8"
VERSION_FOLDER="version-$(echo $VERSION | sed 's/\./-/g' | sed 's/-.*$//')"

mkdir -p ../foundry/docs/${VERSION_FOLDER}
cp -r docs/foundry/* ../foundry/docs/${VERSION_FOLDER}/
```

### 4. Test Public Foundry Site

```bash
cd ../foundry
npm start
# Visit http://localhost:3000/versions
# Click on your version to view docs
```

---

## Common Issues

### Versions page shows no versions

**Solution**: Run `npm run prebuild` to generate `versions.json`:
```bash
cd foundry
npm run prebuild
```

### Container docs not updating

**Solution**: Rebuild the container after editing docs:
```bash
cd morphogenic-commerce
./release/release.sh containers
# Restart container with new image
```

### Version API shows "docs/foundry not found"

**Solution**: Check that docs were copied during build:
```bash
docker exec version-api ls -la /usr/src/app/docs/foundry
```

### Version folder not appearing in Foundry

**Solution**: 
1. Verify folder exists: `ls ../foundry/docs/version-*`
2. Rebuild foundry: `cd foundry && npm run build`
3. Check `static/versions.json` was generated

---

## Quick Reference

### Public Foundry Site
- **Location**: `/Users/johncorlett/dev/coded-ventures/foundry/`
- **Dev Server**: `npm start` → http://localhost:3000
- **Build**: `npm run build`
- **Versions**: `http://localhost:3000/versions`

### Container-Pinned Docs
- **Location**: `/Users/johncorlett/dev/coded-ventures/morphogenic-commerce/docs/foundry/`
- **Container URL**: `http://localhost:3100/docs/foundry`
- **Build**: `./release/release.sh containers`
- **Run**: `docker run -d --name version-api -p 3100:3000 -e SERVICE=version services:VERSION`
