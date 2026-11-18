# TES Website — Build Brief for the Agent

**Repo:** `TAYOXY/treasurelandschools.com` (branch `main`)
**Stack:** static HTML + Tailwind + vanilla JS. No bundler, no build step today.
**Deploy:** cPanel / LiteSpeed, files pushed to `public_html` (staging is a separate docroot).
**Goal of this pass:** make the site fast enough to be usable on Nigerian mobile data, fix the compliance gaps, and rewrite the top of the homepage so it converts.

---

## 0. How to use this document

- Work top to bottom. **P0 must be finished before the site is promoted to production.**
- **One task = one commit.** Commit message format: `P0-2: optimise gallery images`.
- Do **not** invent school facts. Anything marked `[[CONFIRM: ...]]` must be replaced with a value the school has confirmed. If it isn't confirmed, leave the section out rather than guessing.
- After each task, run the **Verify** line. If it fails, fix it before moving on.
- Do not redesign. Keep the existing palette, logo, fonts, section order and class names unless this brief says otherwise.

---

## 1. Architecture — read this before touching anything

There are **two copies of the header and footer** on every page:

1. Static HTML hardcoded in each `.html` file (`<nav id="navbar">`, `<footer class="tes-footer">`).
2. A JS-injected version in `assets/js/site-chrome.js` (`header()` / `footer()`), which **replaces** the static one at runtime (lines ~355–369).

**Only the injected version is what users actually see.** Confirmed in a live browser: `nav.tes-site-header`, `footer.tes-site-footer`, with address, Google Map embed and school hours.

Consequences the agent must respect:

- The static nav/footer in every page is **dead weight** — roughly 150 lines per page that is downloaded, parsed, then thrown away. Do not "improve" it; it will never be seen. See **P1-1**.
- The injected nav uses native `<details>/<summary>`, which is keyboard accessible. The static nav opens dropdowns on `:hover` only and is **not** keyboard reachable — another reason it must go.
- `site-chrome.js` bails out entirely if `window.TES_SITE_CONFIG` is missing (`assets/js/site-config.js`). If that script ever fails, visitors get the old static nav. This is a silent failure mode.
- Facts like school hours, address, phone and admissions status live in `assets/js/site-config.js` and are injected via `data-site-fact="..."` attributes. **Edit the config, not the HTML**, when changing those.

### Measured baseline (staging, desktop, warm cache)

| Metric | Current | Target |
|---|---|---|
| First Contentful Paint | **5.35 s** | < 1.8 s |
| `DOMContentLoaded` | 4.98 s | < 1.5 s |
| Load complete | 6.26 s | < 3.0 s |
| `cdn.tailwindcss.com` blocking request | **3.4 s** | 0 (removed) |
| Homepage transfer | ~1.7 MB | < 600 KB |
| `inter-house-sports.html` images | **236 MB** | < 12 MB |
| Largest single image | **11.4 MB** (6016×4016) | < 200 KB |
| Lighthouse a11y / SEO | 93 / 83 | 100 / 100 |

These numbers are the justification for P0. Don't skip P0-2 and P0-3 because they look like cleanup — they are the reason the site feels broken on a phone.

---

## 2. Guardrails

- Keep it a static site. No framework, no SSR. A local build step that outputs committed files is fine.
- Keep all existing URLs. `sitemap.xml` and inbound links point at `.html` paths.
- Keep `assets/js/site-config.js` as the single source of truth for contact details, hours and admissions state.
- Preserve existing `id` anchors — nav links depend on them. All of these currently resolve and must keep resolving:
  `#waiting-list`, `#academic-calendar`, `#creche`, `#primary-school`, `#after-school`, `#updates`, `#prefects`, `#campus-tours`, `#health-bay`, `#sports-games`.
- Don't add a cookie banner — there are no cookies or trackers. Adding one would be a lie.
- Don't add stock photography. Use only existing school images.

---

## 3. P0 — Blockers (do these first)

### P0-1 — Remove the preloader

**Why:** the overlay only clears on `window.load` (`assets/js/script.js`), so it covers the whole page until every image finishes. Measured load is 6.26 s, so visitors stare at a white screen with a pulsing logo. There is no timeout fallback — one slow image and the page stays blank.

**Do:**
1. Delete the preloader block in `index.html` (starts line 311, `<div id="preloader" ...>`, ends line 318).
2. Delete the matching block in `assets/js/script.js` (the `window.addEventListener('load', ...)` that removes `#preloader`).
3. Remove the now-unused `@keyframes loading`.

**Verify:** load the homepage on a throttled connection — content is visible immediately, no white overlay.

---

### P0-2 — Fix the images (the single biggest win)

**Why:** `inter-house-sports.html` references **86 images totalling 236 MB**. The worst offenders are full-resolution camera files:

| File | Size | Pixels |
|---|---|---|
| `assets/images/gallery/inter-house-sports/_DSC2441.JPG` | 11,409 KB | 6016×4016 |
| `_DSC2800.jpg` | 4,788 KB | — |
| `_DSC2840.jpg` | 4,606 KB | — |
| `Ogunbiyi Oluwabukola Esther.jpg` (staff) | 4,073 KB | — |
| `_DSC2436.jpg` | 3,357 KB | — |

`_DSC2436.jpg` is also used on the **homepage** as a small news-card thumbnail. A 3.3 MB file rendered at thumbnail size is pure waste.

**Do:**
1. Write `tools/optimize_images.py` (Python + Pillow) that, for every file under `assets/images/`:
   - resizes to the target width for its use, preserving aspect ratio
   - converts to **WebP, quality 72** (keep a JPEG fallback only where you add `<picture>`)
   - strips EXIF
   - writes alongside the original without changing filenames (or writes `.webp` siblings and updates `src` with a `<picture>` fallback)
2. Target budgets:
   - hero / full-width: **1600 px wide, ≤ 200 KB**
   - section images: **1000 px, ≤ 120 KB**
   - cards / thumbnails: **600 px, ≤ 60 KB**
   - gallery thumbnails: **400 px, ≤ 40 KB**
   - staff headshots: **400×400, ≤ 40 KB**
3. Add `srcset` + `sizes` for the main images (400 / 800 / 1600 variants).
4. Add `width` and `height` attributes to every `<img>` to stop layout shift.
5. Keep `loading="lazy" decoding="async"` on everything **except** the hero image and the first row of cards — those should be `loading="eager" fetchpriority="high"`.
6. Logo: `TES-Logo-nobg.png` is 475×346 / 146 KB and is used at ~40 px tall, twice on the homepage. Export a 2× WebP and a small PNG fallback, ≤ 20 KB each.
7. `inter-house-sports.html`: keep the gallery, but paginate or "load more" at ~24 images. 86 full-size images on one page is not a gallery, it's a download.

**Verify:**
```powershell
# total referenced image weight per page should be under budget
foreach($f in Get-ChildItem *.html){ $h=Get-Content $f.FullName -Raw; $s=0
  [regex]::Matches($h,'(?:src|data-src|srcset)="([^"]*assets/images/[^"]+)"') | ForEach-Object {
    $_.Groups[1].Value -split '[\s,]+' | ForEach-Object { if(Test-Path $_){ $s += (Get-Item $_).Length } } }
  "{0,-32} {1,7:N1} MB" -f $f.Name, ($s/1MB) }
```
Homepage < 1 MB, `inter-house-sports.html` < 12 MB.

---

### P0-3 — Remove the Tailwind Play CDN

**Why:** `https://cdn.tailwindcss.com` is loaded synchronously in `<head>` on **14 pages** (e.g. `index.html` line 14). It is a development-only build that downloads a large script and generates CSS in the browser. Measured: **3.4 s blocking request**, and it is the main reason FCP is 5.35 s. It also causes a flash of unstyled content.

**Do:**
1. `npm init -y`, then add `tailwindcss` (v3.4.x — your arbitrary values like `bg-[#0e5d46]` rely on JIT) as a dev dependency.
2. Create `tailwind.config.js` with:
   ```js
   module.exports = {
     content: ["./*.html", "./assets/js/*.js"],
     theme: { extend: { colors: {
       'tes-green': '#0e5d46', 'tes-slate': '#0f493a', 'tes-gold': '#d7b15d'
     }}},
     corePlugins: { preflight: true }
   }
   ```
3. Create `src/tailwind.css` with `@tailwind base; @tailwind components; @tailwind utilities;`
4. Add scripts: `"build:css": "tailwindcss -i src/tailwind.css -o assets/css/tailwind.min.css --minify"`.
5. Run it, **commit `assets/css/tailwind.min.css`** (production has no Node — this must be a committed artifact).
6. In all 14 pages, replace the CDN `<script>` with `<link rel="stylesheet" href="assets/css/tailwind.min.css">` **before** the other stylesheets.
7. Rebuild the CSS after any HTML class change. Add a note to `README.md`.

**Verify:** no request to `cdn.tailwindcss.com`; FCP under 1.8 s; visual diff shows no styling regressions.

---

### P0-4 — Make staging non-indexable

**Why:** staging is publicly reachable, serves `robots: index, follow`, `robots.txt` says `Allow: /`, and production is already live at the same content. That is a duplicate-content risk and lets anyone (parents, competitors) browse an unfinished build.

**Do:** in the **staging docroot only** (never commit this to the production branch), add `.htaccess`:
```apache
Header set X-Robots-Tag "noindex, nofollow, noarchive"
```
Optionally also password-protect:
```apache
AuthType Basic
AuthName "Staging"
AuthUserFile /home/USER/.htpasswd-staging
Require valid-user
```
Also add a `<meta name="robots" content="noindex, nofollow">` to staging templates **only if** you have a separate staging build/branch. If you don't, use `.htaccess` alone so production is never affected.

**Verify:** `curl -I https://staging.treasurelandschools.com/` shows `x-robots-tag: noindex`.

---

### P0-5 — Privacy notice, consent and form hardening

**Why:** the site collects guardian names, phone numbers, emails and **children's names** (`registration-form.html`), with no privacy policy anywhere on the site. `contactConsent` exists on the registration form, but there is no policy for it to point at. Every form also posts to a public Formspree endpoint with **no spam protection**, so the school's inbox is open to bots.

**Do:**
1. Create `privacy.html` covering: what is collected, why, who sees it, how long it is kept, how to request deletion, and a contact address. Keep it plain-English and specific to this school — no template legalese. Add it to `sitemap.xml`.
2. Add a link to it in **both** footers (the injected `footer()` in `site-chrome.js` **and** the static footers until P1-1 removes them).
3. Under every form, add one line:
   > We use these details only to respond to your enquiry. Read our [Privacy Policy](privacy.html).
4. On `registration-form.html`, extend the consent label to mention the child's data explicitly:
   > I agree that Treasureland Elementary School may store these details to process this application, as described in the Privacy Policy.
5. Add a Formspree honeypot to every form (Formspree ignores submissions where `_gotcha` is filled):
   ```html
   <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" style="display:none" aria-hidden="true">
   ```
6. Add a hidden `_subject` so the school can tell enquiries apart, e.g. `<input type="hidden" name="_subject" value="Campus tour request">`.

**Verify:** submit each form with `_gotcha` filled → no email arrives. Submit normally → email arrives. Privacy link resolves from every page footer.

---

## 4. P1 — Credibility and conversion

### P1-1 — One header/footer, not two

Pick the injected chrome in `site-chrome.js` as the single source of truth (it is accessible, has the real address and map, and already works). Then:
- Delete the static `<nav id="navbar">…</nav>` and `<footer class="tes-footer">…</footer>` blocks from every `.html` file.
- Leave a minimal placeholder so the document stays valid and the injector has a target:
  ```html
  <nav id="site-nav" aria-label="Main navigation"></nav>
  ...
  <footer id="site-footer"></footer>
  ```
- Update `site-chrome.js` to replace those placeholders.
- Add a `<noscript>` line above the placeholder: "This site needs JavaScript for navigation. Call +234 807 455 2156."

**Verify:** every page has exactly one `<nav>` and one `<footer>`; no visual change; no ~150 lines of dead markup per page.

### P1-2 — Rewrite the top of the homepage

Use the copy in **§6** below. This is the highest-leverage content change: right now the first thing a parent reads is "Admissions are closed", and the hero asks them to register for a session that isn't open.

### P1-3 — Add the "essentials" facts panel

Add a compact facts block directly under the hero. Parents scan for these before anything else, and right now they are either missing or buried:

| Label | Value |
|---|---|
| Ages | `[[CONFIRM: e.g. 18 months – 11 years]]` |
| Class size | `[[CONFIRM: max pupils per class]]` |
| School day | 7:30 am – 3:00 pm *(already in `site-config.js`)* |
| After-school | 3:00 pm – 5:00 pm *(already in `site-config.js`)* |
| Term dates | link → `news-and-events.html#academic-calendar` |
| Fees | link → `admissions.html` |

Pull hours from `TES_SITE_CONFIG.schoolHours` — don't hardcode them.

### P1-4 — Fix the Lighthouse failures

Confirmed failures: `color-contrast`, `label-content-name-mismatch`, `target-size`, `link-text`.

- **Contrast:** the gold `#d7b15d` on white and `slate-300` on the dark footer both fail. Darken gold text to `#8a6a1f` on light backgrounds; raise footer body text to `rgba(255,255,255,0.85)`.
- **Target size:** nav dropdown links and social icons need ≥ 44×44 px tap areas. Add vertical padding, not just height.
- **Link text (SEO 83):** replace "Read more", "Learn more", "View gallery" with descriptive text — e.g. "Read about our 2027/2028 prefects", "See inter-house sports photos", "See how admissions work".
- **Label/content mismatch:** icon-only buttons need their accessible name to match visible text, or an `aria-label` that *contains* the visible text.

**Verify:** Lighthouse accessibility and SEO both 100.

### P1-5 — Structured data

Add JSON-LD to `index.html` and `contact.html` (an `EducationalOrganization` with `name`, `url`, `logo`, `telephone`, `email`, `address` (`PostalAddress`), `geo`, `openingHours`, `sameAs` for the three social profiles). This is what makes the school show up properly for "school in Ijebu Ode".

Do not add `aggregateRating` unless the survey methodology (sample size, date, question) is documented — an unsupported rating is a Google penalty risk.

### P1-6 — Naming consistency

Lock to **"Treasureland Elementary School"** in body copy, **"TES"** for the logo lockup, and `treasurelandschools.com` for the domain. Fix the drift:
- "TreasureLandSchools" (social handle) — keep the handle, but don't use it in copy.
- "Programmes" vs `#programs` anchor — anchor id can stay, copy stays British.
- "Extra-curricular" vs "Extracurricular" — standardise on **"Extracurricular"**.
- "Register interest" vs "Join the waiting list" vs "Apply now" — one phrase: **"Join the interest list"**.

### P1-7 — Small but visible

- `href="index.html"` on logo → `href="/"`.
- `contact.html` has **no canonical tag**. Add it (it's the only content page missing one).
- Add `<meta name="theme-color" content="#0e5d46">`.
- Replace the OG image (currently the 475 px logo) with a 1200×630 campus photo.
- Add a "We reply within one school day" line under the tour form, so the promise is concrete.
- Show a real map link on `contact.html` (the footer has one; the contact page should too).

---

## 5. P2 — Cleanup

- `index.html` lines 22–288: a ~5 KB stylesheet wrapped in a broken HTML comment (`<!--` … `</style> -->`, with no `<style>` opener). It is dead code — delete it. (`.btn-premium`, `.stat-number`, `.section-heading` are also defined in the external CSS files, so nothing breaks.)
- `assets/css/navigation.css` is **39 bytes**. Either fill it or delete it and its `<link>`.
- `assets/css/all.min.css` (Font Awesome) is 102 KB for roughly a dozen icons. Replace with inline SVG for the icons actually used and drop the CDN.
- Google Fonts loads Cormorant Garamond in 8 weights and Inter in 6. Trim to the weights actually used (likely 400/600/700) and add `&display=swap` (already present).
- Minify HTML/CSS/JS at deploy time.
- Staff images total **30.5 MB**; resize to 400×400 WebP.
- Add `preload` for the hero image only.

---

## 6. Homepage copy (drop-in)

Replace the corresponding blocks in `index.html`. Voice: warm, concrete, British spelling. Keep the existing markup and classes; swap the text.

### 6.1 Announcement bar (line ~320)

```html
<div class="bg-[#0a473a] text-white text-center text-sm font-medium py-2 px-4">
  2026/2027 admissions are closed · 2027/2028 applications open June 2027 ·
  <a href="admissions.html#waiting-list" class="underline font-semibold">Join the interest list</a>
  or <a href="#campus-visit" class="underline font-semibold">book a campus tour</a>
</div>
```

Why: the current bar leads with "closed" at full size. Keep the fact, shrink its weight, and put a live next step at the end of the sentence.

### 6.2 Hero

- **Eyebrow:** `Montessori-inspired · Creche to Primary 6 · Ijebu Ode`
- **H1:** keep — *"A thoughtful education for extraordinary beginnings."*
- **Subhead:** replace with:

> Small classes, caring teachers and room to explore. From creche through Primary 6, we help children grow in knowledge, confidence and character.

- **Primary CTA:** `Book a campus tour` → `#campus-visit`
- **Secondary CTA:** `Explore our programmes` → `our-programs.html`
- **Tertiary text link:** `or join the 2027/2028 interest list →` → `admissions.html#waiting-list`

Why: one clear conversion action (the tour), with the waiting list demoted to a text link. Right now there are five competing asks in the first screen.

### 6.3 Proof strip (replaces the four floating benefit cards)

Keep it to facts you can defend:

- **Founded 2011**
- **550+ pupils**
- **`[[CONFIRM: max class size]]` pupils per class**
- **Creche → Primary 6**

**Remove** `100% Child-centred values` (meaningless) and `15+ Academic disciplines` (reads as padding for a primary school).

Keep `4.9/5 parent satisfaction` **only if** the survey is documented — sample size, date, and question. Otherwise replace with a quoted testimonial, which is more credible anyway.

### 6.4 "The essentials" (new section, after the hero)

```html
<section id="essentials" class="py-16 bg-white">
  <div class="container mx-auto px-6">
    <h2 class="section-heading">The essentials</h2>
    <dl class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
      <div><dt class="text-sm uppercase tracking-wider text-slate-500">Ages</dt>
           <dd class="text-lg font-semibold">[[CONFIRM]]</dd></div>
      <div><dt class="text-sm uppercase tracking-wider text-slate-500">Class size</dt>
           <dd class="text-lg font-semibold">[[CONFIRM]]</dd></div>
      <div><dt class="text-sm uppercase tracking-wider text-slate-500">School day</dt>
           <dd class="text-lg font-semibold" data-site-fact="school-hours">7:30 am – 3:00 pm</dd></div>
      <div><dt class="text-sm uppercase tracking-wider text-slate-500">After-school</dt>
           <dd class="text-lg font-semibold" data-site-fact="after-school-hours">3:00 pm – 5:00 pm</dd></div>
      <div><dt class="text-sm uppercase tracking-wider text-slate-500">Term dates</dt>
           <dd class="text-lg font-semibold"><a class="underline" href="news-and-events.html#academic-calendar">View the academic calendar</a></dd></div>
      <div><dt class="text-sm uppercase tracking-wider text-slate-500">Fees</dt>
           <dd class="text-lg font-semibold"><a class="underline" href="admissions.html">See admissions and fees</a></dd></div>
    </dl>
  </div>
</section>
```

### 6.5 "A future-focused school experience…" section

- **Heading:** `What makes a TES education different`
- **Subheading:** `Three things we do deliberately, every day.`
- **Card 1 — Thinking, not memorising.** "Children explain their reasoning, ask questions, and work through problems instead of copying answers."
- **Card 2 — Character alongside academics.** "Respect, responsibility and resilience are taught explicitly, not left to chance."
- **Card 3 — Learning by doing.** "Hands-on projects and real materials — Montessori apparatus in Early Years, coding and robotics in Primary."

Why: "Redefining education in Africa" and "world-class" are claims every school makes. These are three specific things a parent can picture.

### 6.6 Testimonials

Keep the four quotes — they're specific and good. Add a line under each name with the child's class, e.g. `Parent, Primary 3`. That single detail converts the quote from anonymous praise into verifiable evidence.

### 6.7 Final CTA / tour section

- Heading: keep — *"Give your child a school where they can truly grow."*
- Add under the form: `We reply within one school day.` and the privacy line from **P0-5**.
- Remove the duplicate "Register your interest" button; keep **one** primary action (book a visit) and one WhatsApp fallback.

### 6.8 Sitemap / footer additions

Add `privacy.html` to `sitemap.xml`. In the injected footer (`site-chrome.js` → `footer()`), add a `Privacy Policy` link to the bottom bar next to the copyright.

---

## 7. Definition of done

- [ ] No `cdn.tailwindcss.com` request on any page
- [ ] No preloader; content visible immediately
- [ ] Homepage < 1 MB; `inter-house-sports.html` < 12 MB
- [ ] FCP < 1.8 s, load < 3 s on throttled 3G
- [ ] Lighthouse: Accessibility 100, SEO 100, Best Practices 100
- [ ] Staging returns `x-robots-tag: noindex`
- [ ] `privacy.html` exists, linked from every footer, referenced under every form
- [ ] All forms have `_gotcha` honeypot; test submission with it filled produces no email
- [ ] Exactly one `<nav>` and one `<footer>` per page
- [ ] Every `[[CONFIRM]]` placeholder replaced or its section removed
- [ ] All anchor ids in §2 still resolve
- [ ] No page has a canonical pointing at the staging host

---

## 8. Suggested commit order

```
P0-4: make staging non-indexable
P0-1: remove preloader
P0-2: optimise and resize all images
P0-3: replace Tailwind CDN with compiled CSS
P0-5: add privacy policy, consent copy and form honeypots
P1-1: remove duplicate static nav and footer
P1-2: rewrite homepage hero and announcement bar
P1-3: add essentials facts panel
P1-4: fix accessibility and SEO audit failures
P1-5: add EducationalOrganization structured data
P1-6: standardise naming across pages
P2: remove dead CSS, trim fonts and icons
```
