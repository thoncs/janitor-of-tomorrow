// Repack a PixelLab character spritesheet into the two shapes the dungeon rig already draws.
//
// PixelLab hands back one 512x576 sheet: row 0 is the 8 rotations, rows 1-8 are a 4-frame walk,
// one row per direction, on an 8-column grid (columns 4-7 of the walk rows are empty).
//
// The dungeon wants two different sheets, and it is picky about both:
//   idle  512x64   — 8 rotations across, read as sBlit(img, row*64, 0, 64,64, ...)   (cf. dd_idle)
//   walk  256x512  — 4 frames across, 8 direction rows down, sBlit(img, f*64, row*64) (cf. gd_walk)
//
// Direction order is the part that will silently ruin a sprite: the game derives its row order from
// DROW=[2,1,0,7,6,5,4,3] with octant 0 = east, which works out to S,SE,E,NE,N,NW,W,SW down the
// sheet. PixelLab happens to emit exactly that order — so this script ASSERTS it from the sheet's
// own JSON rather than trusting it. A future sheet in a different order fails loudly here instead
// of shipping a guard who moonwalks north.
//
// Usage:
//   node tools/slice-character.mjs art/new/chars/puddco_guard guard
// Writes <dir>/<name>_idle.png and <dir>/<name>_walk.png.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { inflateSync, deflateSync } from 'node:zlib';

const SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const CELL = 64;
// the order the dungeon's DROW table expects, top to bottom
const ORDER = ['south', 'south-east', 'east', 'north-east', 'north', 'north-west', 'west', 'south-west'];

const CRC = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c; }
  return t;
})();
const crc32 = b => { let c = -1; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };

function decodePNG(buf) {
  if (!buf.subarray(0, 8).equals(SIG)) throw new Error('not a PNG');
  let p = 8, w, h, bd, ct, il; const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), type = buf.toString('ascii', p + 4, p + 8);
    const data = buf.subarray(p + 8, p + 8 + len);
    if (type === 'IHDR') { w = data.readUInt32BE(0); h = data.readUInt32BE(4); bd = data[8]; ct = data[9]; il = data[12]; }
    else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    p += 12 + len;
  }
  if (bd !== 8 || ct !== 6) throw new Error(`need 8-bit RGBA, got bitDepth=${bd} colorType=${ct}`);
  if (il) throw new Error('interlaced PNG unsupported');
  const raw = inflateSync(Buffer.concat(idat)), stride = w * 4, out = Buffer.alloc(h * stride);
  let ro = 0;
  for (let y = 0; y < h; y++) {
    const f = raw[ro++], line = raw.subarray(ro, ro + stride); ro += stride;
    const cur = out.subarray(y * stride, (y + 1) * stride);
    const prev = y > 0 ? out.subarray((y - 1) * stride, y * stride) : null;
    for (let x = 0; x < stride; x++) {
      const a = x >= 4 ? cur[x - 4] : 0, b = prev ? prev[x] : 0, c = prev && x >= 4 ? prev[x - 4] : 0;
      let v = line[x];
      if (f === 1) v = (v + a) & 255;
      else if (f === 2) v = (v + b) & 255;
      else if (f === 3) v = (v + ((a + b) >> 1)) & 255;
      else if (f === 4) {
        const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c);
        v = (v + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255;
      } else if (f !== 0) throw new Error('bad filter ' + f);
      cur[x] = v;
    }
  }
  return { w, h, data: out };
}

function encodePNG({ w, h, data }) {
  const stride = w * 4, raw = Buffer.alloc(h * (stride + 1));
  for (let y = 0; y < h; y++) { raw[y * (stride + 1)] = 0; data.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride); }
  const chunk = (type, d) => {
    const b = Buffer.alloc(12 + d.length);
    b.writeUInt32BE(d.length, 0); b.write(type, 4, 'ascii'); d.copy(b, 8);
    b.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type, 'ascii'), d])), 8 + d.length);
    return b;
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([SIG, chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

const blank = (w, h) => ({ w, h, data: Buffer.alloc(w * h * 4) });
function blit(dst, src, sx, sy, w, h, dx, dy) {
  for (let y = 0; y < h; y++)
    src.data.copy(dst.data, ((dy + y) * dst.w + dx) * 4, ((sy + y) * src.w + sx) * 4, ((sy + y) * src.w + sx + w) * 4);
}

// --- main ---
const [dir, name] = process.argv.slice(2);
if (!dir || !name) { console.error('usage: node tools/slice-character.mjs <sheet-dir> <name>'); process.exit(2); }

const jsonFile = readdirSync(dir).find(f => f.endsWith('.json'));
const meta = JSON.parse(readFileSync(join(dir, jsonFile), 'utf8'));
const sheet = decodePNG(readFileSync(join(dir, meta.spritesheet.path)));

const rots = meta.spritesheet.rows.find(r => r.type === 'rotations');
const walks = meta.spritesheet.rows.filter(r => r.type === 'animation');
if (!rots) throw new Error('sheet has no rotations row');
if (walks.length !== 8) throw new Error(`expected 8 walk rows, found ${walks.length} — animation incomplete?`);

// assert both orderings match what the dungeon's DROW table assumes
const check = (got, what) => {
  if (got.join() !== ORDER.join())
    throw new Error(`${what} direction order is ${got.join(',')}\n  expected ${ORDER.join(',')} (the order DROW assumes) — remap before slicing`);
};
check(rots.directions, 'rotations');
check(walks.map(r => r.direction), 'walk rows');

const frames = walks[0].frame_count;
if (frames !== 4) throw new Error(`walk has ${frames} frames; the dungeon draws 4`);

// idle: row 0 straight across, already in the right order and shape
const idle = blank(CELL * 8, CELL);
blit(idle, sheet, 0, 0, CELL * 8, CELL, 0, 0);

// walk: each animation row's first 4 frames, stacked in ORDER
const walk = blank(CELL * frames, CELL * 8);
walks.forEach((r, i) => blit(walk, sheet, 0, r.row * CELL, CELL * frames, CELL, 0, i * CELL));

writeFileSync(join(dir, `${name}_idle.png`), encodePNG(idle));
writeFileSync(join(dir, `${name}_walk.png`), encodePNG(walk));
console.log(`${name}_idle.png  ${idle.w}x${idle.h}`);
console.log(`${name}_walk.png  ${walk.w}x${walk.h}`);
