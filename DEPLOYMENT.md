# Deployment guide

Static HTML + compiled Tailwind + vanilla JS. No build step is required on the
server; `assets/css/tailwind.min.css` is committed.

## Upload set

Upload these to the target docroot:

- `*.html` (all pages, including `404.html`)
- `assets/` (CSS, JS, images)
- `robots.txt`
- `sitemap.xml`

Do **not** upload:

- `.git/`, `node_modules/`, `src/`, `tools/`
- `package.json`, `package-lock.json`, `tailwind.config.js`
- `README.md`, `AGENT_BRIEF.md`, `DEPLOYMENT.md`
- `.htaccess.staging`, `.htaccess.production`
- `extracurricular activities/`, `open day/` (source material, not referenced)
- Unreferenced `.webp` siblings under `assets/images/` (optional; they add ~20 MB)

Total upload is roughly 36 MB with the unused assets removed, about 56 MB with
every image included.

## Staging

1. Upload the set above to the staging docroot
   (`/home/<cpanel-user>/staging.treasurelandschools.com/`).
2. Upload `.htaccess.staging` as `.htaccess` in that docroot.
3. Verify: `curl.exe -sSI https://staging.treasurelandschools.com/` must return
   `x-robots-tag: noindex, nofollow, noarchive, nosnippet`.
4. Smoke test: open every page, submit each form once, check the map iframe and
   the TES Portal login links.

## Production

The production domain currently serves a WordPress 7.1.4 install
(`/wp-content/...`, `/new-admission-registration/`). Replacing
`public_html` with this static build is a cutover, not a normal deploy.

Before cutover:

1. Back up the WordPress files and database.
2. Decide the URL map for existing WordPress pages, for example:
   - `/new-admission-registration/` → `/registration-form.html`
   - `/wp-content/uploads/2024/07/TES-Registration-form.pdf` → `/TES-Registration-Form.html`
3. Keep the WordPress install reachable at a temporary hostname until the new
   site has been checked in production.

Cutover:

1. Upload the set above to `public_html`.
2. Upload `.htaccess.production` as `.htaccess` (optional but recommended for
   404 handling and compression).
3. Request a Let's Encrypt/cPanel SSL reissue if the docroot changed.
4. Submit `https://treasurelandschools.com/sitemap.xml` in Google Search Console
   and request indexing for the homepage.

## Post-deploy checks

- `https://treasurelandschools.com/404.html` returns the branded page.
- HTTPS works without mixed-content warnings.
- `https://treasurelandschools.com/robots.txt` and `/sitemap.xml` load.
- Formspree: submit each form with `_gotcha` filled (no email), then normally
  (email arrives).
- Lighthouse on the homepage, admissions and contact: 100 accessibility,
  best practices and SEO.
- Canonical URLs point at `https://treasurelandschools.com/...`, not staging.

## Local development

```powershell
npm install
npm run build:css      # rebuild assets/css/tailwind.min.css after class changes
node tools/check-links.js
```

Serve the folder over HTTP (not `file://`) so the injected header/footer and
relative image paths behave like production.
