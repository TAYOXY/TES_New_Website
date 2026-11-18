/**
 * Removes the hardcoded <nav> and <footer> that site-chrome.js throws away at
 * runtime, replacing them with lightweight placeholders. That removes ~12 KB
 * of dead markup per page and leaves one source of truth for navigation.
 *
 * 404.html is skipped: its <nav> is a list of suggested pages, not site chrome.
 *
 * Usage: node tools/dedupe-chrome.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SKIP = new Set(['404.html', 'classes-and-teachers.html', 'TES-Registration-Form.html']);

const NOSCRIPT = `<noscript>
    <p class="bg-[#0a473a] text-white text-center text-sm py-3 px-4">
        This site needs JavaScript for navigation. Call <a class="underline font-semibold" href="tel:+2348074552156">+234 807 455 2156</a>.
    </p>
</noscript>`;

let changed = 0;
let navsRemoved = 0;
let footersRemoved = 0;

for (const name of fs.readdirSync(ROOT).filter((f) => f.endsWith('.html'))) {
  if (SKIP.has(name)) continue;
  const file = path.join(ROOT, name);
  let html = fs.readFileSync(file, 'utf8');
  const before = html.length;

  if (/<nav\b[\s\S]*?<\/nav>/.test(html)) {
    html = html.replace(/<nav\b[\s\S]*?<\/nav>/, `<nav id="site-nav" aria-label="Main navigation"></nav>\n${NOSCRIPT}`);
    navsRemoved++;
  }

  if (/<footer\b[\s\S]*?<\/footer>/.test(html)) {
    html = html.replace(/<footer\b[\s\S]*?<\/footer>/, '<footer id="site-footer" class="tes-footer"></footer>');
    footersRemoved++;
  }

  if (html.length !== before) {
    fs.writeFileSync(file, html);
    changed++;
  }
}

console.log(`Updated ${changed} pages: removed ${navsRemoved} navs and ${footersRemoved} footers.`);
