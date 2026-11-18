/**
 * Adds spam protection and a privacy note to every Formspree form.
 *
 *  - `_gotcha` is Formspree's honeypot: submissions with this field filled are
 *    silently discarded, so bots are filtered without a CAPTCHA.
 *  - The privacy line links to privacy.html, which must exist for consent to be
 *    meaningful (especially on the registration form, which collects a child's
 *    name).
 *
 * Usage: node tools/harden-forms.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const HONEYPOT =
  '\n      <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" style="display:none" aria-hidden="true">';

const PRIVACY = `
      <div class="sm:col-span-2 text-xs leading-6 text-slate-500">
        We use these details only to respond to your enquiry. Read our
        <a class="underline" href="privacy.html">Privacy Policy</a>. We never sell or share your information.
      </div>`;

let forms = 0;
let files = 0;

for (const name of fs.readdirSync(ROOT).filter((f) => f.endsWith('.html'))) {
  const file = path.join(ROOT, name);
  let html = fs.readFileSync(file, 'utf8');
  const before = html;

  html = html.replace(/<form\b[\s\S]*?<\/form>/g, (block) => {
    let out = block;
    if (!out.includes('name="_gotcha"')) {
      out = out.replace(/<form\b[^>]*>/, (open) => open + HONEYPOT);
    }
    if (!out.includes('href="privacy.html"')) {
      if (/<button[^>]*type="submit"/i.test(out)) {
        out = out.replace(/(\s*)<button[^>]*type="submit"/i, (m) => PRIVACY + m);
      } else {
        out = out.replace(/<\/form>/, PRIVACY + '\n    </form>');
      }
    }
    forms++;
    return out;
  });

  if (html !== before) {
    fs.writeFileSync(file, html);
    files++;
  }
}

console.log(`Hardened ${forms} forms across ${files} pages.`);
