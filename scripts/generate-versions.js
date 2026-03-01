/**
 * Build-time script to generate a versions list from docs/version-* folders
 * This runs during Docusaurus build and creates a versions.json file
 */

const fs = require('fs');
const path = require('path');

const docsPath = path.join(__dirname, '../docs');
const outputPath = path.join(__dirname, '../static/versions.json');

function getVersionFolders() {
  if (!fs.existsSync(docsPath)) {
    return [];
  }
  
  const folders = fs.readdirSync(docsPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name.startsWith('version-'))
    .map(dirent => dirent.name)
    .sort((a, b) => {
      // Sort versions: version-0-0-8 comes before version-0-1 (newest first)
      const aParts = a.replace('version-', '').split('-').map(Number);
      const bParts = b.replace('version-', '').split('-').map(Number);
      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aVal = aParts[i] || 0;
        const bVal = bParts[i] || 0;
        if (aVal !== bVal) return bVal - aVal; // Descending (newest first)
      }
      return 0;
    });
  
  return folders.map(folder => ({
    id: folder,
    path: `/docs/${folder}`,
    label: folder.replace('version-', '').replace(/-/g, '.'),
  }));
}

const versions = getVersionFolders();

// Ensure static directory exists
const staticDir = path.dirname(outputPath);
if (!fs.existsSync(staticDir)) {
  fs.mkdirSync(staticDir, { recursive: true });
}

// Write versions.json
fs.writeFileSync(outputPath, JSON.stringify(versions, null, 2));
console.log(`Generated versions.json with ${versions.length} versions:`, versions.map(v => v.id).join(', '));
