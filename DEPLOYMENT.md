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
- `.htaccess.staging`, `.htaccess.production` (upload their *contents* as
  `.htaccess`, see below)
- `extracurricular activities/`, `open day/` (source material, not referenced)
- Unreferenced `.webp` siblings under `assets/images/` (optional; they add ~20 MB)

Total upload is roughly 36 MB with the unused assets removed, about 56 MB with
every image included. `C:\Users\DELL\Downloads\tes-static-site-2026-11-18.zip`
already contains the trimmed set.

## Staging

1. Upload the set above to the staging docroot
   (`/home/<cpanel-user>/staging.treasurelandschools.com/`).
2. Upload the contents of `.htaccess.staging` as `.htaccess` in that docroot.
3. Verify: `curl.exe -sSI https://staging.treasurelandschools.com/` must return
   `x-robots-tag: noindex, nofollow, noarchive, nosnippet`.
4. Smoke test: open every page, submit each form once, check the map iframe and
   the TES Portal login links.
5. Optional: paste the `<IfModule mod_rewrite.c>` block from
   `.htaccess.production` into the staging `.htaccess` to rehearse the 301s
   before the real cutover.

## Production

The production domain currently serves a WordPress 7.1.4 install
(`/wp-content/...`, `/new-admission-registration/`). Replacing `public_html`
with this static build is a cutover, not a normal deploy.

Before cutover:

1. Back up the WordPress files and database (cPanel → Backup, or
   `public_html` → Compress, plus a database dump).
2. Export the WordPress media library if any image is still linked from an old
   page or email.
3. Keep the WordPress install reachable at a temporary hostname until the new
   site has been checked in production.

Cutover:

1. Move the old `public_html` contents aside (or download the archive) rather
   than deleting them in place.
2. Upload the set above to `public_html`, so `/index.html` sits at the docroot.
3. Upload the contents of `.htaccess.production` as `.htaccess`. It adds
   `DirectoryIndex index.html`, the branded 404, compression/caching headers
   and the legacy redirects below.
4. Confirm HTTPS is still valid for the docroot (cPanel → SSL/TLS Status →
   Run AutoSSL if the certificate needs reissuing).
5. Submit `https://treasurelandschools.com/sitemap.xml` in Google Search
   Console, and use "Change of address" only if the domain changes (it has not).

### Legacy URL map (301)

These rules live in `.htaccess.production`:

| Old WordPress URL | New static URL |
| --- | --- |
| `/admissions/` | `/admissions.html` |
| `/contact-us/` | `/contact.html` |
| `/news-events/` | `/news-and-events.html` |
| `/school-calendar/` | `/news-and-events.html#academic-calendar` |
| `/our-history/`, `/about-us/` | `/our-history.html` |
| `/our-school/our-staff/` | `/our-staff.html` |
| `/our-school/our-facilities/` | `/campus-life.html` |
| `/our-school/founders-message/` | `/founders-message.html` |
| `/our-school/`, `/our-school/our-programs/`, `/academics/` | `/our-programs.html` |
| `/about-montessori-philosophy/` | `/montessori-philosophy.html` |
| `/gallery/`, `/community/`, `/community/partners/`, `/p-t-a/` | `/campus-life.html` |
| `/tes-portal/` | `/tes-portal.html` |
| `/classes-and-teachers/` | `/classes-and-teachers.html` |
| `/new-admission-registration/` | `/registration-form.html` |
| `/privacy-policy/` | `/privacy.html` |
| `/wpbc-booking/`, `/wpbc-booking-received/` | `/contact.html` |
| `/timetable/...` (events and columns) | `/news-and-events.html` |
| `/portfolio/...` (staff profiles) | `/our-staff.html` |
| `/index.php` | `/` |
| `/wp-admin/`, `/wp-content/`, `/wp-json/`, `/xmlrpc.php`, `/feed/` | 404 |

WordPress-only content that has no static equivalent (event timetable, portfolio
single pages, booking plugin) is redirected to the closest page instead of
returning a 404, so no indexed URL goes dead.

## Seasonal theme

The Christmas theme is switched on for every page by
`seasonOverride: 'festive'` in `assets/js/site-config.js`. Set it to `null` to
fall back to the calendar window in `seasonForDate()` (25 November – 10
January). The ambience toggle in the bottom-right corner plays a three-piece
string programme — The First Noel, Silent Night and In the Bleak Midwinter —
synthesised with the Web Audio API from public-domain melodies (Mutopia Project
engravings) using bowed violin, viola and cello voices. No audio file is
downloaded or streamed, and nothing plays until a visitor presses the button.

## Post-deploy checks

- `https://treasurelandschools.com/404.html` returns the branded page.
- A missing URL such as `/no-such-page` renders the branded 404, not a host
  error page.
- `https://treasurelandschools.com/admissions/` 301s to `/admissions.html`.
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
