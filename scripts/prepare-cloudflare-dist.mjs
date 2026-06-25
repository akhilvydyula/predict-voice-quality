/**
 * Wrangler Pages skips paths containing "node_modules". Expo web export
 * places fonts under dist/assets/node_modules/, so we relocate them and
 * patch bundle references before deploy.
 */
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const legacyAssetsRoot = path.join(distDir, 'assets', 'node_modules');
const deployAssetsRoot = path.join(distDir, 'assets', 'pkg');
const fromPrefix = '/assets/node_modules/';
const toPrefix = '/assets/pkg/';

function walkFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(fullPath, files);
    else files.push(fullPath);
  }
  return files;
}

function moveAssetTree() {
  if (!fs.existsSync(legacyAssetsRoot)) {
    console.log('prepare-cloudflare-dist: no assets/node_modules directory, skipping move');
    return;
  }

  fs.rmSync(deployAssetsRoot, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(deployAssetsRoot), { recursive: true });
  fs.renameSync(legacyAssetsRoot, deployAssetsRoot);
  console.log('prepare-cloudflare-dist: moved assets/node_modules -> assets/pkg');
}

function patchReferences() {
  const files = walkFiles(distDir).filter((file) => {
    const ext = path.extname(file);
    return ext === '.js' || ext === '.html' || ext === '.css' || ext === '.json';
  });

  let patchedFiles = 0;
  for (const file of files) {
    const original = fs.readFileSync(file, 'utf8');
    if (!original.includes(fromPrefix)) continue;
    fs.writeFileSync(file, original.split(fromPrefix).join(toPrefix));
    patchedFiles += 1;
  }

  console.log(`prepare-cloudflare-dist: patched ${patchedFiles} file(s)`);
}

function reportFileCount() {
  const count = walkFiles(distDir).length;
  console.log(`prepare-cloudflare-dist: ${count} deployable file(s) in dist/`);
}

moveAssetTree();
patchReferences();
reportFileCount();
