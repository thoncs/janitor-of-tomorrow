// Syntax gate for index.html. Zero dependencies, runs in milliseconds.
//
// index.html holds ALL of the game's JavaScript in a single <script> block. A SyntaxError
// anywhere in it means ZERO JavaScript executes — no listener binds, the rAF loop never
// starts — while the HTML/CSS title screen still paints. The page looks loaded and every
// tap does nothing, which reads as a broken input handler. On 2026-08-15 that exact failure
// (a missing comma) survived eleven commits and an eight-commit bisection. This gate exists
// so it can never happen silently again.
//
// Usage:
//   node tools/check.mjs index.html          # check a file
//   git show :index.html | node tools/check.mjs   # check STAGED content (used by pre-commit)
//
// Exit 0 = parses, 1 = SyntaxError, 2 = the file no longer has exactly one <script> block.
//
// Why vm.Script and not `node --check`: --check wraps input as a CommonJS module, which
// legalizes top-level `await` and bare `return`. Both are hard SyntaxErrors in a classic
// <script>. vm.Script compiles with classic-script semantics, matching the browser.

import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const src = process.argv[2] || 0; // 0 == stdin
const label = process.argv[2] || '<staged>';
const html = readFileSync(src, 'utf8');

const opens = (html.match(/<script\b/gi) || []).length;
const closes = (html.match(/<\/script\s*>/gi) || []).length;
if (opens !== 1 || closes !== 1) {
  console.error(`GATE: expected exactly one <script> block, found ${opens} open / ${closes} close.`);
  console.error('  If index.html was deliberately split, update this gate to check every block.');
  process.exit(2);
}

const i = html.indexOf('>', html.search(/<script\b/i)) + 1;
const j = html.search(/<\/script\s*>/i);
const body = html.slice(i, j);
const preLines = html.slice(0, i).split('\n').length - 1; // so reported lines match the HTML file

try {
  new vm.Script(body, { filename: label });
  console.log(`GATE OK  ${label}  ${body.length} chars, script starts at HTML line ${preLines + 1}`);
} catch (e) {
  const m = /^[^\n]*:(\d+)/.exec(e.stack);
  const htmlLine = m ? Number(m[1]) + preLines : '?';
  console.error(`GATE FAIL  ${label}: ${e.message}`);
  console.error(`  -> index.html line ~${htmlLine}`);
  console.error(e.stack.split('\n').slice(1, 4).join('\n'));
  process.exit(1);
}
