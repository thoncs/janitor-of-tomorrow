// Add a generated sprite to the ART block in index.html as a base64 data URI.
//
// ART is the game's only asset store — every sprite is inlined there, because index.html ships as a
// single self-contained file. Hand-pasting a 30KB base64 string is how you end up with the kind of
// one-character syntax error that survived eleven commits in the 2026-08-15 outage, so this does the
// splice mechanically and re-reads its own work.
//
// It refuses to add a key that already exists (re-running is a no-op, not a duplicate), and inserts
// after a named anchor key so related sheets stay next to each other in the block.
//
// Usage:
//   node tools/import-sprite.mjs --after dd_idle pg_idle=art/.../guard_idle.webp pg_walk=...
//
// Run the gate afterwards. Then `node tools/sync-assets.mjs --fix` to catalogue it in assets.html.

import { readFileSync, writeFileSync } from 'node:fs';
import { extname } from 'node:path';

const argv = process.argv.slice(2);
let after = null;
const pairs = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--after') { after = argv[++i]; continue; }
  const eq = argv[i].indexOf('=');
  if (eq < 0) { console.error(`bad argument "${argv[i]}" — expected key=path`); process.exit(2); }
  pairs.push([argv[i].slice(0, eq), argv[i].slice(eq + 1)]);
}
if (!pairs.length) { console.error('usage: node tools/import-sprite.mjs [--after <key>] key=file [key=file ...]'); process.exit(2); }

const MIME = { '.png': 'image/png', '.webp': 'image/webp' };
const FILE = 'index.html';
let idx = readFileSync(FILE, 'utf8');

const before = idx.length;
const added = [];
for (const [key, path] of pairs) {
  if (new RegExp(`^${key}:`, 'm').test(idx)) { console.log(`  ${key}: already present, skipped`); continue; }
  const mime = MIME[extname(path).toLowerCase()];
  if (!mime) { console.error(`FAIL: ${path} — only .png and .webp are supported`); process.exit(1); }
  const uri = `data:${mime};base64,${readFileSync(path).toString('base64')}`;
  const line = `${key}:'${uri}',`;

  if (after) {
    const anchor = new RegExp(`^${after}:'[^']+',$`, 'm');
    if (!anchor.test(idx)) { console.error(`FAIL: no anchor line for "${after}" in the ART block`); process.exit(1); }
    idx = idx.replace(anchor, m => `${m}\n${line}`);
    after = key; // chain, so a multi-sprite import keeps the given order
  } else {
    const open = idx.indexOf('const ART={');
    if (open < 0) { console.error('FAIL: could not find the ART block'); process.exit(1); }
    const nl = idx.indexOf('\n', open) + 1;
    idx = idx.slice(0, nl) + line + '\n' + idx.slice(nl);
  }
  added.push([key, uri.length]);
}

if (!added.length) { console.log('nothing to do'); process.exit(0); }
writeFileSync(FILE, idx);

// read back rather than trusting the splice
const check = readFileSync(FILE, 'utf8');
for (const [key] of added)
  if (!new RegExp(`^${key}:'data:image/(png|webp);base64,[A-Za-z0-9+/=]+',$`, 'm').test(check)) {
    console.error(`FAIL: ${key} did not round-trip cleanly — inspect index.html`);
    process.exit(1);
  }

for (const [key, n] of added) console.log(`  + ${key}  ${(n / 1024).toFixed(1)}KB`);
console.log(`index.html ${before} -> ${check.length} chars (+${check.length - before})`);
