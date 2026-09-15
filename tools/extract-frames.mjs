// Pull one animation out of a PixelLab character spritesheet, by the name it was given.
//
// A PixelLab sheet packs every state of a character into one grid: row 0 is the rotations, and each
// later row is one animation in one direction, padded out to the sheet's column count. The game
// wants a single pose (ART.h_hurt) or one tight horizontal strip (ART.h_die) — never the whole grid,
// which would inline tens of KB of frames nothing draws.
//
// Frame indices are 0-based within the row. --frame N writes that one cell; without it the whole
// row is written as a strip, trailing empty cells trimmed so the strip's width is frames*cell.
//
// Usage:
//   node tools/extract-frames.mjs <sheet-dir> <animation-name> [--frame N] [--out path.png]
//
// Examples:
//   node tools/extract-frames.mjs art/new/chars/doug h_hurt --frame 2   # one recoil pose
//   node tools/extract-frames.mjs art/new/chars/doug h_die              # the whole fall, as a strip

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { decodePNG, encodePNG, blank, blit, isEmpty } from './png.mjs';

const argv = process.argv.slice(2);
let frame = null, out = null;
const pos = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--frame') { frame = Number(argv[++i]); continue; }
  if (argv[i] === '--out') { out = argv[++i]; continue; }
  pos.push(argv[i]);
}
const [dir, name] = pos;
if (!dir || !name) {
  console.error('usage: node tools/extract-frames.mjs <sheet-dir> <animation-name> [--frame N] [--out path.png]');
  process.exit(2);
}

const jsonFile = readdirSync(dir).find(f => f.endsWith('.json'));
const meta = JSON.parse(readFileSync(join(dir, jsonFile), 'utf8'));
const sheet = decodePNG(readFileSync(join(dir, meta.spritesheet.path)));
const cw = meta.spritesheet.cell_size.width, ch = meta.spritesheet.cell_size.height;

const rows = meta.spritesheet.rows.filter(r => r.animation === name);
if (!rows.length) {
  const have = [...new Set(meta.spritesheet.rows.map(r => r.animation).filter(Boolean))];
  console.error(`FAIL: no animation named "${name}". This sheet has: ${have.join(', ') || '(none)'}`);
  process.exit(1);
}
if (rows.length > 1) {
  console.error(`FAIL: "${name}" spans ${rows.length} directions (${rows.map(r => r.direction).join(', ')}).`);
  console.error('      This tool writes one row; slice-character.mjs is the one that packs 8 directions.');
  process.exit(1);
}
const row = rows[0];

// trailing cells in a row are padding, not frames — never emit them
let n = row.frame_count;
while (n > 0 && isEmpty(sheet, (n - 1) * cw, row.row * ch, cw, ch)) n--;
if (n !== row.frame_count) console.log(`  (row declares ${row.frame_count} frames, ${n} are non-empty)`);

let img, label;
if (frame !== null) {
  if (frame < 0 || frame >= n) { console.error(`FAIL: frame ${frame} out of range 0..${n - 1}`); process.exit(1); }
  img = blank(cw, ch);
  blit(img, sheet, frame * cw, row.row * ch, cw, ch, 0, 0);
  label = `frame ${frame} of ${n}`;
} else {
  img = blank(cw * n, ch);
  for (let i = 0; i < n; i++) blit(img, sheet, i * cw, row.row * ch, cw, ch, i * cw, 0);
  label = `${n}-frame strip`;
}

const path = out || join(dir, `${name}${frame !== null ? '_' + frame : ''}.png`);
writeFileSync(path, encodePNG(img));
console.log(`${path}  ${img.w}x${img.h}  (${name}, ${row.direction}, ${label})`);
