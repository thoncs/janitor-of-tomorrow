// Headless smoke test for index.html. Zero dependencies (system Chrome + Node's built-in
// WebSocket/fetch over the Chrome DevTools Protocol). Takes ~4 seconds.
//
// tools/check.mjs proves the script PARSES. This proves it RUNS and that the game responds
// to input. The gap is real: injecting `notAFunction();` at the top of the script passes the
// syntax gate and is caught only here.
//
// The load-bearing assertion is the last one. Against the broken Phase 0 commit (731c338)
// this reports:
//     PASS  #bStart exists in DOM
//     PASS  starts on #title
//     FAIL  START MISSION click changed the active screen   [title -> title]
// which is precisely the "iPhone touch is broken" symptom, reproduced on the desktop.
//
// Usage: node tools/smoke.mjs "$PWD/index.html"     (absolute path — it loads via file://)

import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const target = process.argv[2];
if (!target) {
  console.error('usage: node tools/smoke.mjs /absolute/path/to/index.html');
  process.exit(2);
}

const port = 9333;
const profile = mkdtempSync(join(tmpdir(), 'jot-smoke-'));
const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--remote-debugging-port=' + port, '--user-data-dir=' + profile, '--window-size=1280,720',
  'file://' + target,
], { stdio: 'ignore' });

const sleep = ms => new Promise(r => setTimeout(r, ms));
let ws, id = 0;
const pending = new Map();
const pageErrors = [];
const send = (method, params = {}) => {
  const n = ++id;
  ws.send(JSON.stringify({ id: n, method, params }));
  return new Promise((res, rej) => pending.set(n, { res, rej }));
};
async function ev(expression) {
  const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) {
    throw new Error('page threw: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
  }
  return r.result.value;
}

const fails = [];
const check = (ok, label, extra = '') => {
  console.log((ok ? 'PASS  ' : 'FAIL  ') + label + (extra ? '   [' + extra + ']' : ''));
  if (!ok) fails.push(label);
};

try {
  let wsUrl;
  for (let i = 0; i < 80 && !wsUrl; i++) {
    try {
      const l = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      wsUrl = l.find(t => t.type === 'page' && t.url.startsWith('file://'))?.webSocketDebuggerUrl;
    } catch {}
    if (!wsUrl) await sleep(100);
  }
  if (!wsUrl) throw new Error('Chrome CDP target never appeared');

  ws = new WebSocket(wsUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  ws.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      const p = pending.get(m.id);
      pending.delete(m.id);
      m.error ? p.rej(new Error(m.error.message)) : p.res(m.result);
    } else if (m.method === 'Runtime.exceptionThrown') {
      pageErrors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
    }
  };
  await send('Runtime.enable');
  await sleep(1500);

  // 1. The inline script actually executed. ART is built at module scope from the 52 base64 sprites.
  //    Probed inside a try/catch in the page: if boot threw partway, `const ART` is stranded in the
  //    temporal dead zone and a bare `typeof ART` would throw, aborting the run instead of failing here.
  const artKeys = await ev(
    '(()=>{try{return typeof ART==="object"?Object.keys(ART).length:"ART undefined"}' +
    'catch(e){return "ART unreachable ("+e.name+") — boot threw before ART was initialised"}})()'
  );
  check(artKeys === 52, 'inline script executed (ART has 52 sprites)', 'keys=' + artKeys);

  // 2. Nothing threw during boot. Catches the class the syntax gate cannot see.
  check(pageErrors.length === 0, 'no uncaught page errors', pageErrors.slice(0, 2).join(' | ') || 'none');

  // 3-5. The game responds to input. This is the assertion that would have caught the outage.
  check(await ev('!!document.getElementById("bStart")'), '#bStart exists in DOM');
  const before = await ev('(document.querySelector(".screen.on")||{}).id || "none"');
  await ev('document.getElementById("bStart").click()');
  await sleep(800);
  const after = await ev('(document.querySelector(".screen.on")||{}).id || "none"');
  check(before === 'title', 'starts on #title', 'before=' + before);
  check(before !== after, 'START MISSION click changed the active screen', before + ' -> ' + after);
} catch (e) {
  console.log('FAIL  harness: ' + e.message);
  fails.push('harness');
} finally {
  try { ws?.close(); } catch {}
  chrome.kill();
  try { rmSync(profile, { recursive: true, force: true }); } catch {}
}

console.log(fails.length ? '\nSMOKE FAILED: ' + fails.join(', ') : '\nSMOKE OK');
process.exit(fails.length ? 1 : 0);
