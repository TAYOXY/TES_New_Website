/**
 * Create a .webp sibling for any raster image that does not have one yet.
 * Does not modify the original file. Skips if the WebP would be larger.
 *
 * Usage: node tools/add-webp.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..', 'assets', 'images');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

(async () => {
  const files = walk(ROOT).filter((f) => /\.(jpe?g|png)$/i.test(f));
  let created = 0;
  let saved = 0;

  for (const file of files) {
    const out = file.replace(/\.(jpe?g|png)$/i, '.webp');
    if (fs.existsSync(out)) continue;
    await sharp(file).webp({ quality: 68, effort: 5 }).toFile(out);
    const a = fs.statSync(file).size;
    const b = fs.statSync(out).size;
    if (b >= a) {
      fs.unlinkSync(out);
      continue;
    }
    created++;
    saved += a - b;
  }

  console.log(`Created ${created} WebP files, saving ${(saved / 1024 / 1024).toFixed(1)} MB.`);
})();
