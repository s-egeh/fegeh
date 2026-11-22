# Handover — Fegeh Logistics website

This site was built by rebranding an existing logistics website onto a new company. Nothing from
the previous company has been carried over as a fact about Fegeh Logistics: its agencies, clients,
staff, community programmes, milestones, statistics and company profile were removed, not
reworded. Where Fegeh Logistics has not yet supplied something, the site either shows nothing or shows
copy that describes capability and intent in general terms — never an invented number, name,
client, date or certification.

Everything below is waiting on the client or on whoever deploys the site. Work down the list and
delete rows as they close. Every item is also marked `[TODO-CLIENT]` in the source, so
`grep -rn "TODO-CLIENT" src` finds the place to make each change.

---

## 1. Open before launch

| # | Item | Where to change it |
|---|---|---|
| 1 | **A working mailbox for `info@fegehlogistics.com`, or a different address.** The address was assumed from the new domain; it was not supplied and no mailbox exists for it yet. It appears on every page and receives the contact and quote forms, so until the mailbox exists every enquiry sent to it is lost. It is held out of the structured data until confirmed. | `COMPANY.email` in `src/data/company.ts`; `CONTACT_TO_EMAIL` in the host env; then `CONFIRMED.email` in `src/lib/schema.ts` |
| 2 | **Confirmation of the operations phone number — currently 9 digits.** The site shows `024 454 668` and dials `+23324454668`; WhatsApp uses `23324454668`. Ghanaian mobile numbers are normally 10 digits (`0XX XXX XXXX`), so a digit may be missing. Every `tel:` link, the WhatsApp button and the structured data read this one value. | `COMPANY.phones` and the `COMPANY.whatsapp` fallback in `src/data/company.ts`; `NEXT_PUBLIC_WHATSAPP` in the host env |
| 3 | **Canonical host — apex or www on fegehlogistics.com, the other redirected.** The code defaults to `https://fegehlogistics.com` (the apex). Decide which host serves the site, redirect the other one to it, and **set `SITE_URL` and `NEXT_PUBLIC_SITE_URL` on the host to that same value.** If the two variables disagree, or name a host that redirects, every canonical, sitemap URL, `robots.txt` Host line and share-card URL points at a redirect — the mistake that affected the site this codebase came from. If www is chosen, also change the default in both files listed here so a missing variable cannot fall back to the wrong host. | Host env; `DEFAULT_SITE_URL` in `src/lib/utils.ts` and `next-sitemap.config.js` |
| 4 | **Business hours.** The hours shown are placeholders, and are held out of the structured data because of it. | `COMPANY.hours` in `src/data/company.ts`; then `CONFIRMED.hours` in `src/lib/schema.ts` |
| 5 | **A vector master of the logo (SVG, AI or PDF).** The supplied PNG is adequate at current sizes — every output is a downscale — but it is raster, so large-format print and any future upscale are limited by it. See section 4. | Export a large transparent PNG to `assets/brand/fegeh-logo-source.png` and run `npm run build:brand` |
| 6 | **Photography.** Every image under `public/images/` is temporary stock standing in for the client's own, as recorded in `docs/image-credits.md`. See section 4. | `public/images/`; alt text in `src/data`; `docs/image-credits.md` |
| 7 | **Mail delivery.** Create a Resend account, verify the sending domain, and set `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` and `CONTACT_TO_EMAIL`. Then send one test from each of the three forms. See section 6. | Host env |
| 8 | **Service set sign-off.** The four services — Freight & Haulage, Warehousing & Storage, Distribution, Freight Forwarding — and their slugs were proposed, not supplied. Confirm the set, the names, every capability, and both columns of every "what's included / what isn't" block. | `src/data/services.ts` |
| 9 | **Customs and forwarding position.** The freight-forwarding page describes coordination and documentation *support* only, and lists customs declarations as a licensed broker under "not included". Confirm whether Fegeh Logistics holds a customs broker licence, works through a partner, or neither, before the page is published. | `src/data/services.ts`, `src/data/faq.ts` |
| 10 | **Copy review.** All marketing copy is drafted, not supplied. Every block marked `[TODO-CLIENT: review wording]` must be read and approved, or replaced, by the client: vision, mission, governance, company overview, core values, the "why us" points, the hero slides, the FAQ, safety and compliance, the fleet page and coverage. | See the files listed in section 3 |
| 11 | **Legal review of `/privacy` and `/terms`.** Both are readable, specific documents, but neither has been checked by a lawyer. Check the privacy policy against Ghana's Data Protection Act, 2012 (Act 843), confirm whether the business must register with the Data Protection Commission, and set a retention period. Set `COMPANY.policiesUpdated` to the date the reviewed versions are published. | `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`, `src/data/company.ts` |

---

## 2. What the client must supply

Numbered in the order they matter for launch.

The legal name (Fegeh Logistics) and the WhatsApp line (the operations number) are confirmed and no
longer listed.

1. Email address(es): a working mailbox for the public address, and where form enquiries should be delivered.
2. Confirmation of the operations number, `024 454 668` — nine digits, where Ghanaian mobile numbers are normally ten — plus any other numbers and what each is for.
3. Business hours (the current hours are a placeholder default).
4. Precise directions to the office in the Free Zone Enclave — the gate, the building, a landmark.
5. Social media accounts, if any.
6. Sign-off on the four services and their slugs.
7. Customs broker licence status, or the clearing partner used.
8. Which vehicle and equipment types are actually operated, whether they are owned, hired or subcontracted, and any publishable capacities or unit counts.
9. The regular routes, and whether any cross-border routes are actively served.
10. The goods handled, and any refused (for example chilled, frozen or hazardous goods).
11. Whether vehicle tracking is offered to clients.
12. Typical lead time for a consignment.
13. Any minimum storage period or quantity.
14. Insurance and liability position — for goods in transit and goods in storage — and what cover may be named publicly.
15. Payment terms and accepted payment methods.
16. Whether cash-on-delivery collection is offered.
17. Whether ports or airports other than Tema are handled.
18. Which compliance documents can be offered to procurement teams.
19. Confirmation of every safety and maintenance practice described on `/safety-compliance` and `/fleet`.
20. The documentation a client receives (quote, goods-received record, delivery documents, records, invoice) — confirm or correct the list.
21. Approval of all drafted copy (section 1, item 10).
22. Department contact routing (operations, warehouse, accounts), if enquiries should go to different people.
23. The management team: names, roles, biographies, credentials, portraits, and each person's permission to publish. Optionally a chief executive's statement in their own words.
24. Company structure: departments and what each owns.
25. Clients that may be named publicly, with their permission; logos only if supplied by the client.
26. Testimonials with named people, companies and written permission.
27. Community and sustainability work, with photographs.
28. Company milestones with dates.
29. Strategic pillars, market drivers and future plans, if the client wants those sections.
30. Careers: roles hired for and how to apply.
31. Photography — see section 4. Reconcile the slot list in section 4 against the client's own shot list.
32. A vector master of the logo (SVG, AI or PDF) — see section 4.
33. A company profile PDF, if one should be downloadable. The download button was removed and returns only when a real file exists.
34. Standard terms of carriage or storage, if they exist, so `/terms` can link to them.
35. Registration details (business registration number, TIN), if the client wants them shown.

Where each one goes:

| Item(s) | File |
|---|---|
| 1–5 | `src/data/company.ts` (the hours in `COMPANY.hours`), and flip the matching flag in `CONFIRMED` in `src/lib/schema.ts` once email and hours are confirmed |
| 6, 7, 13 | `src/data/services.ts`, `src/data/faq.ts` |
| 8 | `src/data/fleet.ts` |
| 9 | `COMPANY.routes` in `src/data/company.ts` and `CORRIDORS` in `src/data/coverage.ts`; for a new place, add it to `PLACES` in both `src/data/coverage.ts` and `scripts/build-coverage-map.mjs`, then run `npm run build:map` |
| 10–20 | `src/data/faq.ts`, `src/data/safety.ts`, `src/data/operations.ts` (each has a `pending` note naming the question — never rendered) |
| 22 | `src/app/contact/page.tsx` |
| 23 | `TEAM` and `CEO_STATEMENT` in `src/data/team.ts` |
| 24 | `DIVISIONS`, `ORG_INTRO` and `GOVERNANCE_PRACTICE` in `src/data/org.ts` |
| 25, 26 | `CLIENTS` and `TESTIMONIALS` in `src/data/clients.ts`; logos in `public/images/clients/` |
| 27 | `src/data/csr.ts` |
| 28 | `src/data/milestones.ts` |
| 29 | `STRATEGIC_PILLARS`, `MARKET_DRIVERS` and `FUTURE_PLANS` in `src/data/company.ts` |
| 30 | `CAREERS_COPY` and `CAREERS_BLOCKS` in `src/data/org.ts` |

---

## 3. Sections and pages switched off until the content exists

The codebase renders nothing when a list is empty, so each of these switches back on by supplying
its data — no component needs editing.

| Content | Empty today | What is hidden while empty |
|---|---|---|
| `TEAM` (`src/data/team.ts`) | Yes | `/team` (404 page, `noindex`), its nav and footer links, the homepage leadership preview, the "Meet the management team" link on `/about` |
| `CEO_STATEMENT` + a featured team member | Yes | The chief executive statement on `/about` |
| `CLIENTS` (`src/data/clients.ts`) | Yes | `/clients` (404 page, `noindex`), the Clients nav item and footer link, the homepage clients marquee |
| `TESTIMONIALS` | Yes | The testimonial rail on `/clients` |
| `CSR_INITIATIVES` (`src/data/csr.ts`) | Yes | `/csr` (404 page, `noindex`), its nav and footer links, the homepage CSR band |
| `DIVISIONS` (`src/data/org.ts`) | Yes | The structure diagram on `/about` and `/team` |
| `STRATEGIC_PILLARS`, `FUTURE_PLANS` | Yes | Those two sections on `/about` |
| `MARKET_DRIVERS` | Yes | The market-outlook band on the homepage |
| `MILESTONES` | Yes | The timeline on `/about` |
| `COMPANY.socials` | Yes | Social links in the top bar, footer and drawer; `sameAs` in the structured data |
| `GALLERY_PUBLISHED` (`src/data/gallery.ts`) | `false` | `/gallery` builds and renders but is unlinked and `noindex` |

**One manual step per page.** The sitemap config is CommonJS and cannot read the TypeScript data,
so `/team`, `/clients`, `/csr` and `/gallery` are listed in the `exclude` array of
`next-sitemap.config.js`. When one of them is published, delete it from that array. The browser
test scripts (`scripts/audit.mjs`, `verify.mjs`, `verify-mobile.mjs`) leave the three 404 routes
out of their route lists for the same reason — add each back when it goes live.

**A note on the 404 status.** While switched off, `/team`, `/clients` and `/csr` render the 404
page with `noindex`, but the HTTP status is 200, not 404. The root `src/app/loading.tsx` wraps every
page in a Suspense boundary, so Next.js starts streaming before the page calls `notFound()` and the
status can no longer change. Unknown service slugs (`/services/anything`) behave the same way, as
they did before the rebrand. The routes are not linked, not in the sitemap and marked `noindex`, so
this is a soft 404, not a crawlable page. Removing `loading.tsx` would give a true 404 at the cost
of the navigation skeleton.

---

## 4. Assets

### Brand — `/public/brand/` and `/src/app/` — generated, one thing outstanding

Every brand file is generated from the client's logo by two committed scripts, so nothing is
hand-made and everything can be regenerated when the artwork changes:

```bash
npm run build:brand   # = node scripts/build-logo-variants.mjs && node scripts/build-og-image.mjs
```

The source is `assets/brand/fegeh-logo-source.png` — the 1536×1024 transparent PNG the client
supplied, kept outside `public/` so it is never served. It is a horizontal lockup in three parts:
the gold FL monogram and its swoosh, a gold vertical divider bar, and a wordmark block of "FEGEH" in
navy `#112C6E` over "LOGISTICS" in gold `#FDC007`.

| File | What it is |
|---|---|
| `fegeh-logo-full.png` | Full horizontal lockup — mark, divider, "FEGEH" over "LOGISTICS" — as supplied, in its original navy and gold, transparent. For light surfaces and print; also the logo in the structured data. |
| `fegeh-logo-full-white.png` | The same lockup with "FEGEH" in white. Used in the ink footer and on the share card. |
| `fegeh-wordmark-white.png` | The wordmark block alone, "FEGEH" in white over the gold "LOGISTICS", for the horizontal header and drawer lockup beside the mark. |
| `fegeh-logo-mark.png` | The FL monogram and swoosh alone, on a square transparent canvas. |
| `fegeh-logo-mark-dark.png` | The mark for dark surfaces. Used in the header, drawer, preloader and icons. The mark is entirely gold (7.90:1 on navy), so this file is byte-identical to `fegeh-logo-mark.png`; both are kept because `Logo.tsx` names them separately, and revised artwork with navy in the mark would be handled with no code change. |
| `icon-192.png`, `icon-512.png` | PWA icons: the mark on an opaque `#112C6E` plate at 80%. |
| `icon-maskable.png` | 512px, the mark scaled until its farthest painted pixel sits just inside the 80% safe circle, so it survives Android's launcher crop. |
| `og-image.jpg` | 1200×630 share card: `#112C6E` ground, white lockup centred, gold rule, the tagline set in Archivo. Rendered in Chrome by `scripts/build-og-image.mjs` so the type is the site's own font, not a fallback. |
| `src/app/favicon.ico` | A real ICO holding 16, 32 and 48px frames. The 16px frame draws the mark at 92% so it keeps every pixel it can. |
| `src/app/icon.png`, `src/app/apple-icon.png` | 192 and 180px, Next file-convention names, so Next emits the `<link>` tags itself. |

How the script works: the source is already transparent, so nothing is cut out. Its alpha runs
0–254 and is normalised so the artwork is fully opaque, and about 69,000 near-invisible haze pixels
(under 4% opacity) scattered across the canvas are cleared. The three parts are found by scanning
for empty columns, and "FEGEH" and "LOGISTICS" by scanning the wordmark's rows. Each detected box is
checked against its measured position (±3px) and each part's colour against its ink, and the script
stops if either has drifted — revised artwork in the same layout re-runs, artwork in a different
layout fails rather than shipping a bad crop. The white variants replace only pixels nearest the
navy, keeping their alpha so the anti-aliased edges survive; gold is never recoloured.

**Outstanding — a vector master.** The supplied PNG is adequate at current sizes: the mark is 452×348
in the source, so every output, including `icon-512.png` and the maskable icon, is a downscale. It
is still raster, so large-format print and any future upscale are limited by it. Ask the client for
the logo as SVG, AI or PDF, export a large transparent PNG from it to the same path in the same
layout, and re-run `npm run build:brand`.

### Photography — `/public/images/`

**Temporary stock photography — undo this when the client's photographs arrive.** 20 of the 27
photographs used by published pages are temporary public-domain stock images (CC0 or the Public
Domain Mark), added on 2026-11-08 so the site does not go live on placeholders. They show other
companies' trucks, equipment and ports, not Fegeh Logistics'. For that reason every alt text was
neutralised to say only what is in the picture — "A tanker truck on a mountain highway", not "A
loaded Fegeh Logistics truck on a Ghanaian highway" — and so were the four `/gallery` captions that
described a stock photograph. Both must be reversed as each client photograph lands: replace the
file at the same path, rewrite its alt text in `src/data` (and in the page file, for a page hero)
to describe the client's own photograph, and delete its row from `docs/image-credits.md`. That file
lists every stock image with its source, photographer and licence, and the seven slots that are
still empty. Three shots the table below gives as 4:5 (`gallery-multi-drop-loading`,
`gallery-import-documents`, `gallery-export-cargo`) were cropped 16:10 for now, because published
pages only show them in 16:10 frames; the client's photographs should follow the table.

Every path below is referenced in code and shows a branded placeholder until its file lands.
Missing photographs are detected **at build time**:
`scripts/build-image-manifest.mjs` runs before every `dev` and `build`, lists what is in
`public/images`, and any slot not on that list renders its placeholder in the server HTML with no
request for the missing file. Lightboxes skip missing photographs, and thumbnails are not
clickable until their photograph exists. Drop a file in and rebuild — no code change.

**Each filename names what the photograph shows.** Service and fleet photographs are named after
their page's address: the photograph for `/services/distribution` is `service-distribution.jpg`,
and the rigid truck on `/fleet` is `fleet-rigid-truck.jpg`. Hero and gallery photographs are
named after their subject, because several of them are reused across pages. If the client's
shot list changes what a slot shows, rename the file, its reference in `src/data` and its row
here together, so that a name never describes a different picture. The subjects below are a
proposal for Fegeh Logistics' operations — reconcile them with the client's own shot list before
commissioning.

The ratio is enforced by the layout, so a photograph delivered at the stated ratio drops in without
any cropping decisions being made later.

| Path | Ratio | Suggested px | What the photograph should show |
|---|---|---|---|
| `hero/hero-highway-truck.jpg` | 16:10 | 2400×1500 | A loaded Fegeh Logistics truck on a Ghanaian highway, shot low, early light. Homepage slide 1, `/about`, `/quote`. |
| `hero/hero-warehouse-storage.jpg` | 16:10 | 2400×1500 | Inside the warehouse: palletised goods in storage. Homepage slide 2, `/coverage`. |
| `hero/hero-vehicle-loading.jpg` | 16:10 | 2400×1500 | Vehicles loading at the warehouse in the Free Zone Enclave. Homepage slide 3, `/services`, the Services mega-menu. |
| `hero/hero-port-containers.jpg` | 16:10 | 2400×1500 | Containers at Tema Port. Homepage slide 4. |
| `services/service-freight-haulage.jpg` | 16:10 | 1600×1000 | **Freight & Haulage** — a loaded truck on a trunk road. |
| `services/service-warehousing-storage.jpg` | 16:10 | 1600×1000 | **Warehousing & Storage** — racked or stacked pallets in the warehouse. |
| `services/service-distribution.jpg` | 16:10 | 1600×1000 | **Distribution** — a delivery being unloaded at a retail outlet. |
| `services/service-freight-forwarding.jpg` | 16:10 | 1600×1000 | **Freight Forwarding** — containers at Tema Port awaiting collection. |
| `fleet/fleet-articulated-truck.jpg` | 4:3 | 1600×1200 | **Articulated truck** loaded for a long-haul delivery. Also the `/fleet` hero. |
| `fleet/fleet-rigid-truck.jpg` | 4:3 | 1600×1200 | **Rigid box or curtain-side truck** being loaded at the warehouse. |
| `fleet/fleet-delivery-vehicle.jpg` | 4:3 | 1600×1200 | **Light delivery vehicle** at a retail drop. |
| `fleet/fleet-container-trailer.jpg` | 4:3 | 1600×1200 | **Container trailer** leaving Tema Port. |
| `fleet/fleet-handling-equipment.jpg` | 4:3 | 1600×1200 | **Warehouse handling equipment** — a forklift moving pallets. |
| `gallery/gallery-morning-dispatch.jpg` | 16:10 | ≥1600 long edge | Trucks lined up in the Free Zone Enclave before morning dispatch. Also beside the homepage introduction. |
| `gallery/gallery-load-check.jpg` | 4:5 | ≥1600 long edge | A driver checking how a load is secured before departure. Also beside the homepage introduction. |
| `gallery/gallery-pallet-loading.jpg` | 16:10 | ≥1600 long edge | Palletised goods being loaded for a nationwide delivery. |
| `gallery/gallery-rigid-truck-accra.jpg` | 4:5 | ≥1600 long edge | A rigid truck on a delivery route in Greater Accra. |
| `gallery/gallery-goods-receiving.jpg` | 16:10 | ≥1600 long edge | Goods being received into the warehouse. |
| `gallery/gallery-pallet-put-away.jpg` | 4:5 | ≥1600 long edge | Pallets being moved inside the warehouse. |
| `gallery/gallery-loading-bay.jpg` | 16:10 | ≥1600 long edge | Goods staged at the loading bay for dispatch. Also the `/faq` hero. |
| `gallery/gallery-dispatch-planning.jpg` | 4:5 | ≥1600 long edge | The operations team planning the day's dispatches. |
| `gallery/gallery-retail-delivery.jpg` | 16:10 | ≥1600 long edge | Cartons handed over at a retail delivery point. |
| `gallery/gallery-multi-drop-loading.jpg` | 4:5 | ≥1600 long edge | A delivery vehicle loaded in drop order for a multi-drop run. |
| `gallery/gallery-delivery-signed.jpg` | 16:10 | ≥1600 long edge | A delivery being signed for at a trade customer. |
| `gallery/gallery-highway-dusk.jpg` | 16:10 | ≥1600 long edge | A truck on a national highway at dusk. Also the `/gallery` hero. |
| `gallery/gallery-import-documents.jpg` | 4:5 | ≥1600 long edge | Shipping documents being checked for an import. |
| `gallery/gallery-port-collection.jpg` | 16:10 | ≥1600 long edge | A container being collected at Tema Port. |
| `gallery/gallery-export-cargo.jpg` | 4:5 | ≥1600 long edge | Export cargo being prepared for the port. |
| `gallery/gallery-driver-briefing.jpg` | 16:10 | ≥1600 long edge | Drivers being briefed before departure. Also the `/safety-compliance` hero. |
| `gallery/gallery-stock-check.jpg` | 4:5 | ≥1600 long edge | Stock records being checked in the warehouse. |
| `gallery/gallery-distributor-unloading.jpg` | 16:10 | ≥1600 long edge | A delivery being unloaded at a distributor's warehouse. Also the `/clients` hero. |
| `gallery/gallery-cross-docking.jpg` | 16:10 | ≥1600 long edge | Cross-docking: goods moving straight from an inbound to an outbound vehicle. |
| `gallery/gallery-pallet-wrapping.jpg` | 4:5 | ≥1600 long edge | Goods being wrapped and secured on a pallet. |
| `gallery/gallery-container-unloading.jpg` | 16:10 | ≥1600 long edge | A container being unloaded at the warehouse. |
| `gallery/gallery-last-mile-tema.jpg` | 4:5 | ≥1600 long edge | A light delivery vehicle in Tema. |
| `gallery/gallery-head-office.jpg` | 16:10 | ≥1600 long edge | The office in the Free Zone Enclave. Also the `/contact` and `/team` heroes and the About mega-menu. |
| `gallery/gallery-first-light-departure.jpg` | 4:5 | ≥1600 long edge | A loaded truck leaving the Free Zone Enclave at first light. |
| `team/team-<name>.jpg` | 4:5 | 800×1000 | One portrait per team member, path set in `src/data/team.ts`. Until supplied, a monogram tile shows. |
| `csr/…` | 16:10 | 1600×1000 | One per community initiative, path set in `src/data/csr.ts`. |
| `clients/client-*.png` | — | max height 48px | Transparent logos, **supplied by the client only** and only with each company's permission. Never sourced from the web. |
| `textures/truck-silhouette.png` | — | — | Optional faint backdrop for the pre-footer CTA band at 8%. Renders nothing if absent. |

### `/gallery` is built but unpublished

The route renders but is not linked anywhere and carries `noindex`; `GALLERY_PUBLISHED` is
`false`. A grid of placeholders undersells the business, and a grid of other companies' vehicles
misrepresents it — so do not publish it while the temporary stock images above are in place. To
publish once real photographs exist: set `GALLERY_PUBLISHED` to `true` in
`src/data/gallery.ts` and delete `'/gallery'` from the `exclude` array in `next-sitemap.config.js`.

### Bringing in photography

`scripts/ingest-image.mjs` takes a supplied file to a live image:

```bash
node scripts/ingest-image.mjs <source> <slot> --alt "…" \
  --source-url <url> --credit "…" --licence "…"
```

It checks the source resolution and **refuses to upscale**, crops to the slot's ratio, applies the
house grade, exports AVIF, WebP and a JPG fallback with metadata stripped, and records the
provenance in `docs/image-credits.md`. Minimum source widths: hero 2000px; service, fleet, CSR and
gallery 1400px; team portraits 800px. **Every image needs a recorded licence.**

### Documents and video

`/public/docs/` is empty. The company-profile download was removed with the previous company's
content and returns only with a real file. `/public/video/` is unused; ask before adding a hero
video, since it is a meaningful data cost on Ghanaian mobile connections.

---

## 5. Answers drafted for the client to confirm

Every FAQ answer and safety block whose truth depends on information not yet supplied carries a
`pending` note in its data file. The drafted answer is what renders, so a visitor never sees a
placeholder. Where a fact such as a lead time or minimum is not known, the copy says what is true —
that it is agreed case by case — rather than inventing a number. The questions to put to the client
are items 7–20 in section 2; find each one with:

```bash
grep -rn "pending:" src/data
```

---

## 6. Email delivery

The contact, enquiry and quote forms POST to `/api/contact`, which validates server-side with the
same Zod schemas the client uses, checks a honeypot field and a two-second timing floor,
rate-limits by IP (8 per hour) and sends a plain-text email through Resend with every field
labelled.

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | From the Resend dashboard |
| `CONTACT_FROM_EMAIL` | An address on a domain **verified in Resend**, for example `website@fegehlogistics.com`. A bare address is sent with the display name "Fegeh Logistics website". |
| `CONTACT_TO_EMAIL` | Where enquiries are delivered. Falls back to `COMPANY.email` if unset. |

Without the key and sender, the route returns a 500 and the visitor sees a failure message that
always includes the operations phone number and email, so nobody hits a dead end — but the enquiry
is lost. **After setting them, send one test from each of the three forms and confirm it arrives.**

The rate limiter holds its state in memory, which is correct for a single Vercel region. If the
site is ever scaled across regions, move it to a shared store (Upstash or Vercel KV); the comment
marking this is in `src/app/api/contact/route.api.ts`.

On the static-export target there is no API route; the forms post to `NEXT_PUBLIC_FORM_ENDPOINT`
(Web3Forms or Formspree) instead. See the README.

---

## 7. Analytics and consent

`NEXT_PUBLIC_GA_ID` is empty, so there is no analytics and no cookie notice. Set the measurement ID
and both switch on together: the analytics script loads only after the visitor accepts, and
Decline stores the choice and loads nothing. Five events are wired: `quote_submit`,
`contact_submit`, `enquiry_submit`, `phone_click` and `whatsapp_click`.

---

## 8. Colour and accessibility

The palette is measured from the logo: navy `#112C6E` (`--ink-900`, the "FEGEH" wordmark) and gold
`#FDC007` (`--gold`, the monogram, swoosh, divider and "LOGISTICS"). The rest of the ink scale —
`#1C397F`, `#2C4A93`, `#5973B2` — and the two darker golds are derived from those. Bone `#F7F7F4`,
paper `#FFFFFF` and slate `#686C6F` are neutrals the logo does not dictate. There is no crimson
accent — the logo has no red — so gold is the only accent: emphasis is gold, solid fills are ink.

| Pair | Ratio | Use |
|---|---|---|
| White on `--ink-900` | 13.05:1 | AAA |
| Bone on `--ink-900`, and `--ink-900` on bone | 12.16:1 | AAA |
| `--gold` on `--ink-900` | 7.90:1 | AAA — gold carries text on dark surfaces |
| `--gold` on bone | 1.54:1 | Decorative only — rules, `aria-hidden` icons, underlines — never type |
| `--gold-d` `#B58801` on bone | 3.02:1 | Fills and hover states, not type |
| `--gold-ink` `#866501` on bone | 5.05:1 | AA — the text-safe gold for light surfaces |
| `--gold-ink` on white | 5.42:1 | AA |
| `--slate-600` on bone | 4.94:1 | AA |

Four adjustments sit on top of the palette:

| Pair | Measured | Change |
|---|---|---|
| `--slate-400` on `--ink-800` (CTA band, placeholders) | 4.39:1 — fails | Lifted from `#A0A6AA` to `#A5ABAF` (4.66:1 on `--ink-800`, 5.62:1 on `--ink-900`). Visually indistinguishable. |
| `--ink-500` on bone (client wordmark tiles, 11px) | 4.33:1 — fails | `WordmarkTile` set in `--ink-700` instead (7.80:1 on bone). `--ink-500` is not a text colour on light surfaces. |
| Primary button hover — ink on `--gold-d` | 4.03:1 — fails | Hover inverts to an ink fill with a white label (13.05:1) inside a gold border instead. |
| Focus ring — gold on bone | 1.54:1 — under the 3:1 minimum | Two-tone ring: an ink ring tight to the element and a gold outline outside it, so one is always visible on light and dark surfaces. |

**Form validation uses a red, `--danger` (`#B3261E`, 6.09:1 on bone).** It is not a brand colour
and appears only on invalid fields, error messages and the form-failure alert. Errors are the one
place where a conventional red does real work for the reader. If the client prefers no red
anywhere, point `danger` at `var(--gold-ink)` in `tailwind.config.ts` — it passes AA as text.

---

## 9. Verification status

Run on the Fegeh Logistics build, 2026-11-22 (Next.js 14.2.35, Node 24):

| Check | Scope | Result |
|---|---|---|
| `npm run typecheck` | Whole codebase | Clean |
| `npm run lint` | Whole codebase | Clean |
| `npm run build:brand` | Every logo, icon and the share card | Clean; every crop inspected by eye |
| `npm run build` | 27 static outputs incl. 4 service pages | Clean |
| `scripts/audit.mjs` | 17 routes | Pass |
| `scripts/verify.mjs` | 16 routes × 8 widths, incl. header nav contrast | Pass |
| `scripts/verify-mobile.mjs` | 16 routes × 5 widths, touch | Pass |
| `scripts/verify-menu.mjs` | 18 mega-menu checks | Pass |

Two build-environment problems came up during that run. Neither is in the code, but both look
like site faults:

- **Build from a clean `.next`.** One build reused a stale cached font stylesheet, so the
  prerendered HTML and the client CSS disagreed on IBM Plex Mono's class hash. Every mono label
  then fell back to Inter Tight, and `verify-mobile.mjs` reported it as 80 small-text failures.
  `rm -rf .next` and a fresh build fixed it. Check with: the three `__variable_*` classes on
  `<html>` must each appear in the built CSS.
- **The local image optimizer can wedge on a low-memory machine.** With a cold cache, several
  2400px AVIF encodes at once stalled one request indefinitely, and every later request for that
  image waited on it until the server restarted — so the browser scripts timed out on a different
  route each run. Restarting `npm start` and loading each image once before the scripts run avoids
  it. On Vercel, images are optimised by Vercel's own service, not inside this server process.

The sitemap generates 15 URLs on `https://fegehlogistics.com`; `/styleguide`, `/gallery`, `/team`,
`/clients` and `/csr` are excluded.

One build attempt failed inside `next/font` while fetching Google Fonts and passed on an identical
re-run. The fonts are fetched at build time, so a build host without access to
`fonts.googleapis.com` will fail the same way.

**Not yet done:** a Lighthouse run (meaningless until the photography is in place, since
placeholders weigh nothing); testing on real iOS Safari and Android Chrome devices; a static-export
build (`STATIC_EXPORT=true`) of the rebranded site; a live test of the contact form against Resend.

---

## 10. Known constraints

These describe the codebase and still apply.

**The mega-menu panel must not sit inside an element with `overflow-x: clip`.** Chromium paints an
overflowing descendant of a clipped box but excludes it from hit testing, so the panel renders and
nothing in it can be clicked. `scripts/verify-menu.mjs` guards this.

**Scripted scrolls must state their behaviour.** `<html>` carries `scroll-behavior: smooth`, and a
scripted scroll passing `behavior: 'auto'` defers to it. Anything that repositions rather than
travels must pass `behavior: 'instant'`.

**Tailwind opacity modifiers need channel values.** A colour defined as a plain `var(--x)` holding a
hex emits no rule at all for `bg-ink-900/70`. The ink scale is built from `--ink-900-rgb` and
friends for this reason; plain CSS uses `rgb(var(--ink-900-rgb) / 0.96)` so the palette has one
source.

**`src/data/coverage-map.ts` and `src/data/image-manifest.ts` are generated.** Edit `PLACES` in
`coverage.ts` (and its mirror in the script) and run `npm run build:map`; the script refuses to run
if the two copies of the coordinates disagree. The image manifest is rewritten on every dev start
and build.

**Lenis owns the scroller on a fine pointer** and ignores `window.scrollTo`. Tests that need the
page to move must use wheel events.
