// Keep assets.html honest against index.html.
//
// assets.html is a second, hand-maintained copy of every sprite — the public reskin catalog the README
// links to. Nothing regenerated it when the art changed, so it silently drifted: 11 of 52 sprites were
// showing the pre-PixelLab vehicle art while the game shipped the new ones. A catalog that lies about
// what is in the game is worse than no catalog.
//
// Usage:
//   node tools/sync-assets.mjs           # report drift, exit 1 if any  (use in the pre-push hook)
//   node tools/sync-assets.mjs --fix     # rewrite the stale entries in place
//
// It only ever touches the src="data:…" of a card whose <code>ART.key</code> disagrees with index.html,
// and it also reports native pixel dimensions so the card captions can be checked by eye.

import { readFileSync, writeFileSync } from 'node:fs';

const fix = process.argv.includes('--fix');
const IDX = 'index.html', CAT = 'assets.html';

const idx = readFileSync(IDX, 'utf8');
let cat = readFileSync(CAT, 'utf8');

// --- index.html is the source of truth: key -> data URI, from the ART block only ---
const artBlock = idx.slice(idx.indexOf('const ART={'), idx.indexOf('\nconst AIMG'));
const art = {};
for (const m of artBlock.matchAll(/([a-z0-9_]+):\s*'(data:image\/[a-z]+;base64,[A-Za-z0-9+/=]+)'/gi)) {
  art[m[1]] = m[2];
}
if (!Object.keys(art).length) {
  console.error('SYNC: found no ART entries in index.html — has the ART block moved?');
  process.exit(2);
}

// --- assets.html: one card per sprite, keyed by <code>ART.key</code> ---
const CARD = /<div class="card">[\s\S]*?<code>ART\.([a-z0-9_]+)<\/code>/g;
const cards = [];
for (const m of cat.matchAll(CARD)) cards.push({ key: m[1], start: m.index, block: m[0] });

const missing = Object.keys(art).filter(k => !cards.some(c => c.key === k));
const orphan = cards.filter(c => !(c.key in art)).map(c => c.key);

// native size straight out of the bytes, so a caption claiming 64x64 can be spot-checked
function dims(uri) {
  const b = Buffer.from(uri.slice(uri.indexOf(',') + 1), 'base64');
  if (b.slice(1, 4).toString() === 'PNG') return b.readUInt32BE(16) + 'x' + b.readUInt32BE(20);
  if (b.slice(0, 4).toString() === 'RIFF' && b.slice(8, 12).toString() === 'WEBP') {
    const t = b.slice(12, 16).toString();
    if (t === 'VP8X') return ((b.readUIntLE(24, 3) & 0xffffff) + 1) + 'x' + ((b.readUIntLE(27, 3) & 0xffffff) + 1);
    if (t === 'VP8 ') return (b.readUInt16LE(26) & 0x3fff) + 'x' + (b.readUInt16LE(28) & 0x3fff);
    if (t === 'VP8L') { const n = b.readUInt32LE(21);
      return ((n & 0x3fff) + 1) + 'x' + (((n >> 14) & 0x3fff) + 1); }
  }
  return '?';
}

const stale = [];
for (const c of cards) {
  const want = art[c.key];
  if (!want) continue;
  const have = (/src="(data:image\/[a-z]+;base64,[A-Za-z0-9+/=]+)"/.exec(c.block) || [])[1];
  if (have && have !== want) stale.push({ ...c, have, want });
}

if (missing.length) console.error('SYNC: in ART but absent from the catalog: ' + missing.join(', '));
if (orphan.length) console.error('SYNC: in the catalog but not in ART: ' + orphan.join(', '));

if (!stale.length && !missing.length && !orphan.length) {
  console.log(`SYNC OK  assets.html matches all ${Object.keys(art).length} ART sprites`);
  process.exit(0);
}

for (const s of stale) {
  console.log(`  ${s.key.padEnd(14)} catalog ${dims(s.have).padEnd(9)} -> index ${dims(s.want)}`);
}

if (!fix) {
  console.error(`\nSYNC DRIFT: ${stale.length} stale sprite(s) in assets.html. Run: node tools/sync-assets.mjs --fix`);
  process.exit(1);
}

// Replace only the src of each stale card. Longest-offset-first so earlier edits cannot shift later ones.
for (const s of [...stale].sort((a, b) => b.start - a.start)) {
  const fixedBlock = s.block.replace(s.have, s.want);
  cat = cat.slice(0, s.start) + fixedBlock + cat.slice(s.start + s.block.length);
}
writeFileSync(CAT, cat);
console.log(`\nSYNC FIXED  rewrote ${stale.length} sprite(s) in assets.html`);
