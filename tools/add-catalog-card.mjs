// Add a card to assets.html for a sprite that is already in the ART block.
//
// sync-assets.mjs deliberately only repairs STALE cards — it will not invent one, because a card
// needs a human-written title and caption that no script can guess. But it exits 1 on a missing
// card, and that check runs in pre-push, so a new sprite blocks the push until its card exists.
// This is the other half of that contract.
//
// The image data is read from index.html, so the card cannot disagree with the game on day one.
//
// Usage:
//   node tools/add-catalog-card.mjs <key> "<title>" "<meta html>" [--after <existingKey>]

import { readFileSync, writeFileSync } from 'node:fs';

const argv = process.argv.slice(2);
let after = null;
const pos = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--after') { after = argv[++i]; continue; }
  pos.push(argv[i]);
}
const [key, title, meta] = pos;
if (!key || !title || !meta) {
  console.error('usage: node tools/add-catalog-card.mjs <key> "<title>" "<meta html>" [--after <key>]');
  process.exit(2);
}

const idx = readFileSync('index.html', 'utf8');
const block = idx.slice(idx.indexOf('const ART={'), idx.indexOf('\nconst AIMG'));
const m = new RegExp(`^${key}:'(data:image/[a-z]+;base64,[A-Za-z0-9+/=]+)',$`, 'm').exec(block);
if (!m) { console.error(`FAIL: ${key} is not in the ART block — import it first`); process.exit(1); }

let cat = readFileSync('assets.html', 'utf8');
if (cat.includes(`<code>ART.${key}</code>`)) { console.log(`${key}: card already present`); process.exit(0); }

const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const card = `<div class="card"><div class="imgbox"><img class="pix" src="${m[1]}" alt="${esc(title)}"></div>` +
  `<h3>${title}</h3><code>ART.${key}</code><div class="meta">${meta}</div></div>`;

let at;
if (after) {
  const anchor = cat.indexOf(`<code>ART.${after}</code>`);
  if (anchor < 0) { console.error(`FAIL: no card for anchor "${after}"`); process.exit(1); }
  at = cat.indexOf('</div></div>', anchor) + '</div></div>'.length;
} else {
  const lastCard = cat.lastIndexOf('<div class="card">');
  at = cat.indexOf('</div></div>', lastCard) + '</div></div>'.length;
}
writeFileSync('assets.html', cat.slice(0, at) + card + cat.slice(at));
console.log(`  + card for ART.${key}`);
