// Build a visual contact sheet of newly generated PixelLab art.
//
// The game embeds sprites as base64 data URIs inside index.html, so new art has no natural place to
// be looked at as a set. This renders art/new/ (plus any 8-direction character sheets under
// art/new/chars/) into one page, at both native size and 3x nearest-neighbour, so a sprite that
// reads badly at gameplay scale is obvious before it ever reaches the ART block.
//
//   node tools/contact-sheet.mjs > art/new/CONTACT_SHEET.html

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'art/new', CHARS = join(DIR, 'chars'), TILES = join(DIR, 'tilesets');

function dims(b) {
  if (b.slice(1, 4).toString() === 'PNG') return [b.readUInt32BE(16), b.readUInt32BE(20)];
  return [0, 0];
}
const card = (label, file, buf, note = '') => {
  const [w, h] = dims(buf);
  const uri = `data:image/png;base64,${buf.toString('base64')}`;
  return `<figure>
  <div class="px"><img src="${uri}" style="width:${w * 3}px;height:${h * 3}px"></div>
  <figcaption><b>${label}</b><span>${w}×${h}${note ? ' · ' + note : ''}</span></figcaption>
</figure>`;
};

const sprites = readdirSync(DIR).filter(f => f.endsWith('.png')).sort()
  .map(f => card(f.replace(/\.png$/, ''), f, readFileSync(join(DIR, f))));

const sheets = [];
if (existsSync(CHARS)) {
  for (const d of readdirSync(CHARS).filter(f => !f.endsWith('.zip'))) {
    for (const f of readdirSync(join(CHARS, d)).filter(f => f.endsWith('.png'))) {
      const buf = readFileSync(join(CHARS, d, f));
      const [w] = dims(buf);
      sheets.push(card(f.replace(/\.png$/, ''), f, buf, `${w / 64} frames`));
    }
  }
}

const tiles = [];
if (existsSync(TILES)) {
  for (const f of readdirSync(TILES).filter(f => f.endsWith('.png'))) {
    const buf = readFileSync(join(TILES, f));
    const [w, h] = dims(buf);
    tiles.push(card(f.replace(/\.png$/, ''), f, buf, `${(w / 32) * (h / 32)} tiles @32px`));
  }
}

process.stdout.write(`<!doctype html><meta charset="utf-8"><title>Mop War — new art</title>
<style>
 body{background:#14161c;color:#e8e6e3;font:14px/1.5 ui-monospace,Menlo,monospace;margin:0;padding:32px}
 h1{font-size:18px;letter-spacing:.14em;text-transform:uppercase;margin:0 0 4px}
 h2{font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#7ee081;margin:40px 0 16px;
    border-bottom:1px solid #2a2f3a;padding-bottom:8px}
 p.sub{color:#8b93a7;margin:0 0 8px}
 .grid{display:flex;flex-wrap:wrap;gap:20px;align-items:flex-end}
 figure{margin:0;background:#1c1f28;border:1px solid #2a2f3a;border-radius:8px;padding:14px;
        display:flex;flex-direction:column;gap:10px;align-items:center}
 .px{display:flex;align-items:flex-end;justify-content:center;min-height:60px}
 img{image-rendering:pixelated;display:block}
 figcaption{display:flex;flex-direction:column;align-items:center;gap:2px;font-size:11px}
 figcaption span{color:#8b93a7}
 .wide figure{width:100%;align-items:flex-start}
 .wide .px{overflow-x:auto;max-width:100%}
</style>
<h1>🧹 Mop War of 2076 — new art</h1>
<p class="sub">Generated with PixelLab. Shown at 3× nearest-neighbour; caption gives native size.</p>
<h2>Sprites &amp; props (${sprites.length})</h2>
<div class="grid">${sprites.join('')}</div>
<h2>8-direction character sheets (${sheets.length})</h2>
<p class="sub">Row 0 is the 8 rotations; rows 1–8 are a 4-frame walk per direction.</p>
<div class="grid wide">${sheets.join('')}</div>
<h2>Tilesets (${tiles.length})</h2>
<div class="grid">${tiles.join('')}</div>
`);
