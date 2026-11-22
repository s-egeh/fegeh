/**
 * Generates every brand asset from the single supplied logo file.
 *
 * Run: node scripts/build-logo-variants.mjs   (npm run build:brand runs this,
 *      then the share card)
 * Source: assets/brand/fegeh-logo-source.png   Output: public/brand/, src/app/
 *
 * Committed so it can be re-run when the client supplies revised artwork. The
 * share card is built separately by scripts/build-og-image.mjs, because it sets
 * type and needs a browser to do that in the site's own typeface.
 *
 * THE SOURCE
 * ----------
 * The client supplied a 1536x1024 RGBA PNG on a transparent ground. It is a
 * HORIZONTAL lockup: three bands of artwork side by side, separated by empty
 * columns.
 *
 *   1. the FL monogram and its swoosh — gold
 *   2. a vertical divider bar — gold
 *   3. the wordmark block: "FEGEH" in navy over "LOGISTICS" in gold
 *
 * There is no separate descriptor line: "LOGISTICS" is part of the wordmark.
 *
 * The bands are found by scanning for empty columns, and the wordmark is split
 * into its two lines by scanning its rows. The detected boxes are then checked
 * against EXPECTED below. If they drift by more than TOLERANCE pixels, or the
 * column scan does not find exactly three bands, or a part is not in the ink it
 * should be, the script stops. Revised artwork in the same layout re-runs
 * without edits; artwork in a different layout fails loudly here instead of
 * shipping a bad crop.
 *
 * ALPHA
 * -----
 * The source's alpha runs 0-254 and never reaches 255, so it is normalised
 * (scaled so the maximum becomes 255). Otherwise the artwork would sit at 99.6%
 * opacity on every surface.
 *
 * The file also carries a faint haze. About 69,000 pixels at alpha 1-9 (under
 * 4% opacity) are scattered across the canvas, some hundreds of pixels from the
 * artwork. They cannot be seen, but they stretch any bounding box out to most
 * of the canvas and lay a faint tint over the icon plates, so anything below
 * ALPHA_FLOOR is cleared. The anti-aliased edges of the artwork itself run from
 * the floor up, and are kept.
 *
 * The RGB under fully transparent pixels holds a blurred glow of the artwork.
 * It is never visible, but it is zeroed so that nothing can bleed through a
 * resampler and the files compress properly.
 *
 * RECOLOURING
 * -----------
 * The white variants for dark surfaces replace the navy of "FEGEH" with white
 * and keep each pixel's alpha, so the anti-aliased edges survive. Every pixel
 * is classified against the two inks by nearest RGB distance, and only navy
 * pixels are rewritten. Gold is never recoloured: it reads at 7.90:1 on the
 * site's navy as drawn.
 *
 * RESOLUTION
 * ----------
 * The mark is about 451x348 in the source. Every output is a downscale,
 * including icon-512 (mark ~410px wide) and the maskable icon. A vector master
 * (SVG, AI or PDF) is still worth asking for — see HANDOVER.md.
 */
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE = path.join('assets', 'brand', 'fegeh-logo-source.png');
const BRAND_DIR = path.join('public', 'brand');
const APP_DIR = path.join('src', 'app');

/** Logo navy. Every icon plate and dark surface uses it. */
const INK = { r: 17, g: 44, b: 110, alpha: 1 };
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

/** The two inks of the artwork, as measured from the supplied file. */
const NAVY = [17, 44, 110]; // #112C6E
const GOLD = [253, 192, 7]; // #FDC007
const WHITE = [255, 255, 255];

/** Source alpha below this (out of 254) is haze, not artwork. */
const ALPHA_FLOOR = 10;

/** A run of occupied columns or rows narrower than this is a speck, not a band. */
const MIN_BAND = 4;

/** Measured part boxes, inclusive, in source pixels. */
const EXPECTED = {
  mark: { x0: 93, y0: 284, x1: 543, y1: 631 },
  divider: { x0: 590, y0: 338, x1: 605, y1: 647 },
  wordmark: { x0: 641, y0: 341, x1: 1450, y1: 636 },
  fegeh: { y0: 341, y1: 509 },
  logistics: { y0: 524, y1: 636 },
};
const TOLERANCE = 3;

/**
 * How far a part's median solid colour may sit from the ink it is meant to be,
 * and how far an edge pixel may sit from navy and still be recoloured.
 */
const INK_TOLERANCE = 30;
const NAVY_MATCH = 150;

const fail = (message) => {
  console.error(`\n${message}\nThe source artwork has changed; this script needs revisiting.`);
  process.exit(1);
};

if (!existsSync(SOURCE)) fail(`Source not found: ${SOURCE}`);

await mkdir(BRAND_DIR, { recursive: true });

/* ------------------------------------------------------------------ *
 * 1. Read the source and normalise its alpha.
 * ------------------------------------------------------------------ */

const { data: px, info } = await sharp(SOURCE)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;
if (info.channels !== 4) fail(`Expected RGBA, got ${info.channels} channels.`);

let maxAlpha = 0;
for (let i = 3; i < px.length; i += 4) if (px[i] > maxAlpha) maxAlpha = px[i];
if (maxAlpha < ALPHA_FLOOR) fail('The source is fully transparent.');

let cleared = 0;
for (let i = 0; i < px.length; i += 4) {
  const a = px[i + 3];
  if (a < ALPHA_FLOOR) {
    if (a > 0) cleared += 1;
    px[i] = 0;
    px[i + 1] = 0;
    px[i + 2] = 0;
    px[i + 3] = 0;
  } else {
    px[i + 3] = Math.min(255, Math.round((a * 255) / maxAlpha));
  }
}
console.log(
  `source ${W}x${H}, alpha max ${maxAlpha} normalised to 255, ${cleared} haze pixels under ${ALPHA_FLOOR} cleared`,
);

const alphaAt = (x, y) => px[(y * W + x) * 4 + 3];

/* ------------------------------------------------------------------ *
 * 2. Find the parts: column bands, then the wordmark's two rows.
 * ------------------------------------------------------------------ */

/** Runs of `true` in a boolean array, dropping runs narrower than MIN_BAND. */
function runs(occupied) {
  const found = [];
  let open = -1;
  for (let i = 0; i <= occupied.length; i += 1) {
    const on = i < occupied.length && occupied[i];
    if (on && open < 0) open = i;
    if (!on && open >= 0) {
      if (i - open >= MIN_BAND) found.push([open, i - 1]);
      open = -1;
    }
  }
  return found;
}

/** Tight bounding box of the artwork inside a region. */
function bbox(x0, y0, x1, y1) {
  let bx0 = x1;
  let by0 = y1;
  let bx1 = x0;
  let by1 = y0;
  for (let y = y0; y <= y1; y += 1) {
    for (let x = x0; x <= x1; x += 1) {
      if (alphaAt(x, y) === 0) continue;
      if (x < bx0) bx0 = x;
      if (x > bx1) bx1 = x;
      if (y < by0) by0 = y;
      if (y > by1) by1 = y;
    }
  }
  return { x0: bx0, y0: by0, x1: bx1, y1: by1 };
}

const columnOccupied = Array.from({ length: W }, (_, x) => {
  for (let y = 0; y < H; y += 1) if (alphaAt(x, y) > 0) return true;
  return false;
});
const columns = runs(columnOccupied);
if (columns.length !== 3) {
  fail(
    `Expected 3 column bands (mark, divider, wordmark), found ${columns.length}: ` +
      JSON.stringify(columns),
  );
}
const [MARK, DIVIDER, WORDMARK] = columns.map(([x0, x1]) => bbox(x0, 0, x1, H - 1));

const rowOccupied = Array.from({ length: H }, (_, y) => {
  for (let x = WORDMARK.x0; x <= WORDMARK.x1; x += 1) if (alphaAt(x, y) > 0) return true;
  return false;
});
const rows = runs(rowOccupied);
if (rows.length !== 2) {
  fail(`Expected the wordmark to split into 2 rows (FEGEH, LOGISTICS), found ${rows.length}: ${JSON.stringify(rows)}`);
}
const [FEGEH, LOGISTICS] = rows.map(([y0, y1]) => bbox(WORDMARK.x0, y0, WORDMARK.x1, y1));
const FULL = {
  x0: Math.min(MARK.x0, DIVIDER.x0, WORDMARK.x0),
  y0: Math.min(MARK.y0, DIVIDER.y0, WORDMARK.y0),
  x1: Math.max(MARK.x1, DIVIDER.x1, WORDMARK.x1),
  y1: Math.max(MARK.y1, DIVIDER.y1, WORDMARK.y1),
};

const size = (b) => `${b.x1 - b.x0 + 1}x${b.y1 - b.y0 + 1}`;
const show = (b) => `(${b.x0}, ${b.y0})-(${b.x1}, ${b.y1}) ${size(b)}`;
const detected = { mark: MARK, divider: DIVIDER, wordmark: WORDMARK, fegeh: FEGEH, logistics: LOGISTICS };
for (const [name, box] of Object.entries(detected)) {
  console.log(`  ${name.padEnd(10)} ${show(box)}`);
  for (const [edge, want] of Object.entries(EXPECTED[name])) {
    if (Math.abs(box[edge] - want) > TOLERANCE) {
      fail(`${name}.${edge} detected at ${box[edge]}, expected ${want} ± ${TOLERANCE}.`);
    }
  }
}
console.log(`  full lockup ${show(FULL)}`);

/* ------------------------------------------------------------------ *
 * 3. Check each part is in the ink the recolouring assumes.
 * ------------------------------------------------------------------ */

const distance = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
const median = (values) => values.slice().sort((a, b) => a - b)[Math.floor(values.length / 2)];
const hex = (c) => `#${c.map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase()}`;

/** Median colour of a part's fully opaque pixels. */
function measure(b) {
  const channels = [[], [], []];
  for (let y = b.y0; y <= b.y1; y += 1) {
    for (let x = b.x0; x <= b.x1; x += 1) {
      const i = (y * W + x) * 4;
      if (px[i + 3] < 250) continue;
      for (let c = 0; c < 3; c += 1) channels[c].push(px[i + c]);
    }
  }
  if (channels[0].length < 50) fail(`Too few solid pixels to measure in ${show(b)}.`);
  return channels.map(median);
}

for (const [name, box, ink, inkName] of [
  ['mark', MARK, GOLD, 'gold'],
  ['divider', DIVIDER, GOLD, 'gold'],
  ['FEGEH', FEGEH, NAVY, 'navy'],
  ['LOGISTICS', LOGISTICS, GOLD, 'gold'],
]) {
  const measured = measure(box);
  const off = distance(measured, ink);
  console.log(`  ${name.padEnd(10)} measures ${hex(measured)} (${inkName} ${hex(ink)}, off by ${off.toFixed(1)})`);
  if (off > INK_TOLERANCE) fail(`${name} should be ${inkName} ${hex(ink)} but measures ${hex(measured)}.`);
}

/* ------------------------------------------------------------------ *
 * 4. Crops and the navy-to-white recolour.
 * ------------------------------------------------------------------ */

const isNavy = (p) => {
  const toNavy = distance(p, NAVY);
  return toNavy < distance(p, GOLD) && toNavy <= NAVY_MATCH;
};

/** The whole canvas with navy rewritten as white, alpha untouched. */
const pxWhite = Buffer.from(px);
let recoloured = 0;
const recolouredBox = { x0: W, y0: H, x1: -1, y1: -1 };
for (let y = 0; y < H; y += 1) {
  for (let x = 0; x < W; x += 1) {
    const i = (y * W + x) * 4;
    if (pxWhite[i + 3] === 0 || !isNavy([pxWhite[i], pxWhite[i + 1], pxWhite[i + 2]])) continue;
    [pxWhite[i], pxWhite[i + 1], pxWhite[i + 2]] = WHITE;
    recoloured += 1;
    recolouredBox.x0 = Math.min(recolouredBox.x0, x);
    recolouredBox.y0 = Math.min(recolouredBox.y0, y);
    recolouredBox.x1 = Math.max(recolouredBox.x1, x);
    recolouredBox.y1 = Math.max(recolouredBox.y1, y);
  }
}
console.log(`  recoloured ${recoloured} navy pixels to white, all within ${show(recolouredBox)}`);
if (
  recolouredBox.x0 < FEGEH.x0 ||
  recolouredBox.y0 < FEGEH.y0 ||
  recolouredBox.x1 > FEGEH.x1 ||
  recolouredBox.y1 > FEGEH.y1
) {
  fail('Navy pixels were found outside "FEGEH"; the recolour would touch the wrong part.');
}

const PNG_OPTIONS = { compressionLevel: 9, adaptiveFiltering: true };

const crop = (buffer, b) =>
  sharp(buffer, { raw: { width: W, height: H, channels: 4 } })
    .extract({ left: b.x0, top: b.y0, width: b.x1 - b.x0 + 1, height: b.y1 - b.y0 + 1 })
    .png(PNG_OPTIONS)
    .toBuffer();

/** Centre a part on a transparent square canvas. */
async function square(input) {
  const meta = await sharp(input).metadata();
  const side = Math.max(meta.width, meta.height);
  return sharp({ create: { width: side, height: side, channels: 4, background: TRANSPARENT } })
    .composite([
      {
        input,
        left: Math.round((side - meta.width) / 2),
        top: Math.round((side - meta.height) / 2),
      },
    ])
    .png(PNG_OPTIONS)
    .toBuffer();
}

const written = async (file, buffer) => {
  await writeFile(file, buffer);
  const meta = await sharp(buffer).metadata();
  console.log(`wrote ${file.replace(/\\/g, '/')} (${meta.width} x ${meta.height})`);
};

/* ------------------------------------------------------------------ *
 * 5. Lockups and the wordmark.
 * ------------------------------------------------------------------ */

console.log('');

// Full lockup as supplied, for light surfaces and print; also the logo in the
// structured data.
await written(path.join(BRAND_DIR, 'fegeh-logo-full.png'), await crop(px, FULL));

// Full lockup with "FEGEH" in white, for the ink footer and the share card.
await written(path.join(BRAND_DIR, 'fegeh-logo-full-white.png'), await crop(pxWhite, FULL));

/*
 * The wordmark block alone — "FEGEH" in white over the gold "LOGISTICS" — for
 * the header and the mobile drawer, which set the mark and the wordmark side by
 * side and drop the wordmark on the narrowest phones.
 */
await written(path.join(BRAND_DIR, 'fegeh-wordmark-white.png'), await crop(pxWhite, WORDMARK));

/* ------------------------------------------------------------------ *
 * 6. The mark alone, square.
 *
 *    The mark is entirely gold, so the dark-surface version goes through the
 *    same recolour as everything else and comes out unchanged. Both files are
 *    kept because Logo.tsx names them separately; if revised artwork ever
 *    puts navy in the mark, the dark version picks that up with no edit here.
 * ------------------------------------------------------------------ */

const markSquare = await square(await crop(px, MARK));
const markDarkSquare = await square(await crop(pxWhite, MARK));
await written(path.join(BRAND_DIR, 'fegeh-logo-mark.png'), markSquare);
await written(path.join(BRAND_DIR, 'fegeh-logo-mark-dark.png'), markDarkSquare);
console.log(
  markSquare.equals(markDarkSquare)
    ? '  fegeh-logo-mark-dark.png is byte-identical to fegeh-logo-mark.png (the mark has no navy in it)'
    : '  fegeh-logo-mark-dark.png differs from fegeh-logo-mark.png (navy in the mark was lifted to white)',
);

/* ------------------------------------------------------------------ *
 * 7. Icons — the dark-surface mark on an opaque navy plate.
 *
 *    Mark only, never the lockup: squared into a favicon the wordmark is an
 *    illegible smear. The plate is opaque because a transparent favicon
 *    inherits the browser chrome and has to work on light and dark tab bars.
 * ------------------------------------------------------------------ */

const ICON_FILL = 0.8;
const MARK_SIDE = (await sharp(markDarkSquare).metadata()).width;

async function icon(size, fill = ICON_FILL) {
  const art = Math.round(size * fill);
  const resized = await sharp(markDarkSquare)
    .resize(art, art, { fit: 'contain', background: TRANSPARENT, kernel: 'lanczos3' })
    .toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: INK } })
    .composite([{ input: resized, left: Math.round((size - art) / 2), top: Math.round((size - art) / 2) }])
    .png(PNG_OPTIONS)
    .toBuffer();
}

console.log('');
await written(path.join(APP_DIR, 'icon.png'), await icon(192));
await written(path.join(APP_DIR, 'apple-icon.png'), await icon(180));
await written(path.join(BRAND_DIR, 'icon-192.png'), await icon(192));
await written(path.join(BRAND_DIR, 'icon-512.png'), await icon(512));

/*
 * Maskable: Android crops an installed icon to the launcher's shape, and only
 * the circle of 80% diameter at the centre is guaranteed to survive. The swoosh
 * leaves the corners of the mark's box empty, so rather than fitting the box,
 * the mark is scaled until its farthest painted pixel from the centre lands
 * just inside that circle.
 */
const { data: markPx } = await sharp(markDarkSquare).raw().toBuffer({ resolveWithObject: true });
const centre = (MARK_SIDE - 1) / 2;
let reach = 0;
for (let y = 0; y < MARK_SIDE; y += 1) {
  for (let x = 0; x < MARK_SIDE; x += 1) {
    if (markPx[(y * MARK_SIDE + x) * 4 + 3] === 0) continue;
    reach = Math.max(reach, Math.hypot(x - centre, y - centre));
  }
}
const MASKABLE = 512;
const SAFE_MARGIN = 4;
const SAFE_RADIUS = MASKABLE * 0.4;
const maskableFill = ((SAFE_RADIUS - SAFE_MARGIN) / reach) * (MARK_SIDE / MASKABLE);
await written(path.join(BRAND_DIR, 'icon-maskable.png'), await icon(MASKABLE, maskableFill));
console.log(
  `  maskable: the mark reaches ${reach.toFixed(0)}px from the centre of its ${MARK_SIDE}px square; drawn ` +
    `${Math.round(MASKABLE * maskableFill)}px square, it ends ${SAFE_MARGIN}px inside the ` +
    `${SAFE_RADIUS}px safe radius`,
);

/*
 * favicon.ico — a real ICO container holding 16, 32 and 48px PNG frames.
 *
 * The 16px frame is drawn at 92% rather than 80%: at that size every pixel of
 * margin is a pixel the mark does not get, and the browser tab already frames
 * the icon. PNG-in-ICO is read by every browser in current use, so no BMP
 * encoder is needed.
 */
const frames = [
  { size: 16, png: await icon(16, 0.92) },
  { size: 32, png: await icon(32) },
  { size: 48, png: await icon(48) },
];
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(frames.length, 4);
let offset = 6 + frames.length * 16;
const entries = frames.map(({ size: frameSize, png }) => {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(frameSize, 0); // width
  entry.writeUInt8(frameSize, 1); // height
  entry.writeUInt8(0, 2); // palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // colour planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(offset, 12);
  offset += png.length;
  return entry;
});
await writeFile(
  path.join(APP_DIR, 'favicon.ico'),
  Buffer.concat([header, ...entries, ...frames.map((f) => f.png)]),
);
console.log('wrote src/app/favicon.ico (16, 32, 48)');

console.log('\nDone. Run scripts/build-og-image.mjs next for the share card.');
