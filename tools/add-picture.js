/**
 * Progressive-enhance every <img> that points at a local raster image with a
 * <picture>/<source type="image/webp"> wrapper, keeping the original JPEG/PNG
 * as the fallback.
 *
 * Skips:
 *  - tags that already have a srcset (they are already responsive)
 *  - the homepage carousel images, whose src is swapped by JS
 *    (a <source> would override the swapped src and show the wrong photo)
 *  - anything without an existing .webp sibling
 *
 * Depends on `picture { display: contents; }` in school-luxury.css so the
 * <img> keeps behaving as a direct child of its parent's flex/grid layout.
 *
 * Usage: node tools/add-picture.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CAROUSEL_IDS = ['home-carousel-image-a', 'home-carousel-image-b'];

const pages = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html'));
let wrapped = 0;
let touchedFiles = 0;

for (const page of pages) {
  const file = path.join(ROOT, page);
  let html = fs.readFileSync(file, 'utf8');
  let changed = false;

  html = html.replace(/<img\b[^>]*>/g, (tag) => {
    if (/\bsrcset=/.test(tag)) return tag;
    if (CAROUSEL_IDS.some((id) => tag.includes(`id="${id}"`))) return tag;

    const srcMatch = tag.match(/\bsrc="([^"]+)"/);
    if (!srcMatch) return tag;
    const src = srcMatch[1];
    if (!/^assets\/images\/.+\.(jpe?g|png)$/i.test(src)) return tag;

    const abs = path.join(ROOT, src);
    const webpRel = src.replace(/\.(jpe?g|png)$/i, '.webp');
    const webpAbs = path.join(ROOT, webpRel);
    if (!fs.existsSync(abs) || !fs.existsSync(webpAbs)) return tag;

    // Lazy-load anything that is not explicitly high priority.
    let out = tag;
    if (!/\bloading=/.test(out) && !/\bfetchpriority=/.test(out)) {
      out = out.replace(/\s*\/?>$/, (m) => ` loading="lazy" decoding="async"${m}`);
    } else if (!/\bdecoding=/.test(out)) {
      out = out.replace(/\s*\/?>$/, (m) => ` decoding="async"${m}`);
    }

    wrapped++;
    return `<picture><source srcset="${webpRel}" type="image/webp">${out}</picture>`;
  });

  if (html !== fs.readFileSync(file, 'utf8')) {
    fs.writeFileSync(file, html);
    changed = true;
    touchedFiles++;
  }
}

console.log(`Wrapped ${wrapped} images in <picture> across ${touchedFiles} pages.`);
