/**
 * Resize + recompress every raster image under assets/images.
 *
 * Writes the optimized file back to its original path (so no HTML changes are
 * needed) and also emits a .webp sibling for progressive enhancement.
 *
 * Originals are safe: every image here is committed to git, so
 * `git checkout -- assets/images` restores them.
 *
 * Usage: node tools/optimize-images.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..', 'assets', 'images');

const RULES = [
  { dir: 'staff',   width: 600,  quality: 78, jpegOpts: { mozjpeg: true } },
  { dir: 'gallery', width: 1600, quality: 72, jpegOpts: { mozjpeg: true, progressive: true } },
  { dir: 'campus',  width: 1400, quality: 72, jpegOpts: { mozjpeg: true, progressive: true } },
  { dir: 'brand',   width: 800,  quality: 80, jpegOpts: { mozjpeg: true } },
];
const DEFAULT_RULE = { width: 1600, quality: 72, jpegOpts: { mozjpeg: true, progressive: true } };

function ruleFor(rel) {
  const key = rel.split(path.sep)[0].toLowerCase();
  return RULES.find((r) => r.dir === key) || DEFAULT_RULE;
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

(async () => {
  const files = walk(ROOT).filter((f) => /\.(jpe?g|png)$/i.test(f));
  let before = 0;
  let after = 0;
  let skipped = 0;
  const rows = [];

  for (const file of files) {
    const rel = path.relative(ROOT, file);
    const rule = ruleFor(rel);
    const stats = fs.statSync(file);
    before += stats.size;

    const meta = await sharp(file).metadata();
    const longest = Math.max(meta.width || 0, meta.height || 0);

    // Leave already-small, already-small-dimension files alone.
    if (longest <= rule.width && stats.size < 90 * 1024) {
      after += stats.size;
      skipped++;
      continue;
    }

    const isPng = /\.png$/i.test(file);
    const pipeline = sharp(file).rotate().resize({ width: rule.width, height: rule.width, fit: 'inside', withoutEnlargement: true });

    const tmp = file + '.tmp';
    if (isPng) {
      await pipeline.png({ compressionLevel: 9, palette: true, quality: rule.quality }).toFile(tmp);
    } else {
      await pipeline.jpeg({ quality: rule.quality, ...rule.jpegOpts }).toFile(tmp);
    }
    fs.renameSync(tmp, file);
    const newSize = fs.statSync(file).size;
    after += newSize;

    // WebP sibling (lower quality is fine, WebP is more efficient).
    await sharp(file)
      .webp({ quality: Math.max(60, rule.quality - 6), effort: 5 })
      .toFile(file.replace(/\.(jpe?g|png)$/i, '.webp'));

    if (stats.size > 400 * 1024) {
      rows.push([rel, stats.size, newSize]);
    }
  }

  rows.sort((a, b) => b[1] - a[1]);
  console.log('\nBiggest reductions:');
  for (const [rel, b, a] of rows.slice(0, 20)) {
    console.log(`  ${(b / 1024).toFixed(0).padStart(7)} KB -> ${(a / 1024).toFixed(0).padStart(5)} KB   ${rel}`);
  }
  console.log(`\nFiles processed: ${files.length - skipped}   skipped (already small): ${skipped}`);
  console.log(`Total before: ${(before / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Total after:  ${(after / 1024 / 1024).toFixed(1)} MB`);
})();
