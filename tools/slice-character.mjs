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
import { decodePNG, encodePNG, blank, blit } from "./png.mjs";

const CELL = 64;
// the order the dungeon DROW table expects, top to bottom
const ORDER = ["south", "south-east", "east", "north-east", "north", "north-west", "west", "south-west"];

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
