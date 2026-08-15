# ROADMAP: Janitor of Tomorrow

The game that ships today is **complete**: 8 boards, 3 endings, a tabletop finale, and big dumb fun. Nothing
below is needed to make it good. The dominant risk to this project is no longer missing features — it is
**regression**. Read the verification gate before you read anything else.

This document was rewritten on 2026-08-15 after an outage postmortem. The previous version was written without
reading `index.html`, so it specified rebuilding systems that already worked. Three phases of code were written
against it, shipped broken, and reverted. See [Tracking](#tracking) for the full account.

---

## Verification gate

**Run this before every commit. It is not optional, and it is not slow.**

```bash
node tools/check.mjs index.html && node tools/smoke.mjs "$PWD/index.html"
```

`tools/install-hooks.sh` wires this into `pre-commit` and `pre-push`. Re-run it after a fresh clone — git never
tracks `.git/hooks/`.

### Why this comes first

All of the game's JavaScript lives in **one** `<script>` block, starting at `index.html:350`. A SyntaxError
anywhere in it means **zero JavaScript executes**. But the HTML and CSS title screen still paints — so the page
looks perfectly loaded, and every tap does nothing. It presents as broken touch input, not as a parse error.

On 2026-08-15 a single missing comma did exactly that, survived **eleven consecutive commits**, and consumed an
eight-commit bisection that was hunting an iPhone touch bug that never existed. The syntax gate flags all
eleven in milliseconds.

### Testing notes

| Surface | How |
|---|---|
| **Primary target** | Landscape iPhone, Safari, on the deployed URL. The last outage was only ever seen on a phone. |
| **Secondary** | Desktop Chrome. |
| **Local** | `.claude/launch.json` serves the `game` config on `:4173`. |
| **Deploy** | GitHub Pages serves `main:/` directly. **A push is a release.** There is no staging. |

The in-app Browser pane reports `document.hidden === true`, and the main loop is gated on it
(`index.html:2597`). A working game looks frozen there. Drive `update(dt)` / `draw()` synchronously to test
gameplay in that pane rather than waiting on `requestAnimationFrame`.

---

## Already built (verified at HEAD)

**Read this before specifying anything.** Roughly 80% of the old Phase 0 and 60% of the old Phase 2 were
already shipped and working. Specifying them again is what produced a `ParticleEmitter` that was never
instantiated sitting next to four functioning particle pools.

### Audio — a complete procedural engine, zero audio asset bytes

| What | Where |
|---|---|
| `AU` — AudioContext with `webkitAudioContext` fallback, gain bus, 10 named SFX | `:569`, SFX at `:584-589` |
| `SONGS` — **10** sequenced tracks (title, chip, punk, drive, boss, dnd, race, war, fight, end) | `:594-654` |
| `MUS` — sequencer with a 90ms lookahead scheduler | `:655`, `_tick` at `:669` |
| **7** procedural ambient beds (lab, engine, crowd, mall, shaft, vat, table) — `shaft` is LFO-modulated | `_ambStart` `:668`, kinds `:715-724` |
| 3-voice drum kit (kick / snare / hat) | `_drum` `:692` |
| Per-stage track selection, already automatic | `startStage` |
| Per-note ADSR, optional lowpass, detuned second oscillator (`tr.det`) | `_note` |

New music = **a `SONGS` entry**. New ambience = **an `_ambStart` branch**. No new capability is needed.

> ⚠️ **Never set `bpm:0`.** `spb = 60/bpm/4` becomes `Infinity`, `_note` computes an infinite duration, and
> `exponentialRampToValueAtTime` throws — silently killing the sequencer. The reverted Phase 0 shipped two
> tracks with `bpm:0`. For a drone, use a real bpm with long note `len` values.

### Visual juice — already in every mode

| What | Where |
|---|---|
| Screen shake, canvas-space, in **all 5 update and 6 draw paths** | `S.shake`, set at 6 sites |
| Particle pool with gravity and alpha falloff | `boom()` `:1282` |
| Shock rings, drawn additively | `S.rings` `:1288` |
| Hit-stop, applied to every mode | `S.freeze` `:1287` |
| White-flash hit silhouettes, pre-baked per sprite | `mkArt` `:526`, `source-in` at `:529` |
| Hand-rolled multi-layer parallax | in `topDraw` and `draw` |
| Score + combo with up-to-×10 multiplier, `comboBest` | `:557`, `:822` |
| Vignette + scanline DOM overlays (z 54 / z 56), GPU-composited | `#vig`, `#fx` at `:346` |

### Systems

| What | Where |
|---|---|
| `WMAP` — a 7-node adjacency graph with dice combat, its own music and win/lose exits | `:827`, `renderWar` `:847` |
| Trust already affects gameplay: `G.vex` is a d20 modifier; trust scales the tabletop companion | `:877`, `:1106` |
| Ending selection — a one-line ternary plus an independent companion axis | `:808` |
| `TUNING` centralised knobs / `WEAPONS` / `STAGES` / `ENDINGS` / `ART` | `:353` / `:354` / `:371` / `:440` / `:470` |
| Safe-area vars `--sat/--sar/--sab/--sal`, consumed by every screen and pad | `:19-20` |
| Pointer-event input with `setPointerCapture`; **no touch-event handlers anywhere** | `bindPad` `:1203` |

### What genuinely does NOT exist yet

Persistence of any kind (no `localStorage`, `sessionStorage`, or `indexedDB` at HEAD) · a taquito currency
(taquitos are a per-stage pickup, not a ledger) · an inventory · a pause menu · a settings screen · a hub /
world map · difficulty tiers · stat counters.

---

## Platform constraints

- **Design target: ~844×390 CSS px**, landscape phone. Portrait is gated by the `#rot` overlay at z 90, so no
  screen beneath it is reachable in portrait.
- **44px minimum touch target.** The reverted settings screen used 4px-tall range inputs.
- **Nothing may depend on `:hover`.** The reverted map used `:hover` scaling as its only affordance.
- **No fixed pixel heights on screens.** `.screen` centres inside `overflow:hidden` ancestors with no scroll
  container, so an overflowing panel is clipped at *both* ends with no way to reach it. The reverted map used a
  fixed `height:500px` inside a 390px viewport. Use `min(…, Nvh)` and aspect ratios.
- **Reuse the safe-area vars** (`:19-20`) rather than reinventing padding.
- DPR is capped at 2 in `fit()` (`:1197`).

## Size budget

`index.html` is **623,069 bytes / 2,607 lines**, of which **468,369 bytes (75.3%)** is already-compressed
base64 PNG/WebP across 52 `data:` URIs. GitHub Pages gzips it to **400,533 bytes** automatically.

**No change may grow the file by more than 50 KB without a written case.** For reference, the three reverted
phases added ~31 KB combined. If image bytes ever need cutting, re-encode the remaining PNGs to WebP — that is
the only lever with real headroom.

> **Two ideas from the old roadmap are permanently rejected, on measurement:**
>
> - ~~*"Audio: Base64-encoded WAV/MP3"*~~ — the game synthesises **all** audio procedurally with zero asset
>   bytes. One 30-second 128 kbps MP3 as base64 is ~625 KiB, **larger than the entire current file**. The four
>   layers the old table wanted would push it past 3 MiB. Extend `SONGS` instead.
> - ~~*"Compression: LZMA for assets, runtime decompression"*~~ — LZMA over the payload yields **98.7% of
>   original**, because the bytes are already PNG/WebP. Pages already gzips for free. It would also force the
>   synchronous `mkArt` boot (`:526`) to become async for no gain, and add a decompressor to a
>   zero-dependency project.

---

## Phases

Ordered by dependency and payoff, not by ambition. Each phase is its own commit series, each behind the gate.
Hours assume a solo hobbyist at ~5 productive hours/week.

### Phase A — Persistence & the ledger · ~10–14h · depends on: nothing

The keystone. Seven later phases need it, and the old roadmap had it at position six — which is why the
reverted code improvised three separate storage schemes and an ad-hoc inventory.

- **One** `localStorage` key. Plain JSON only — **no `Set` or `Map` in the payload**. The reverted Phase 1
  stored `new Set()` through `JSON.stringify`, which yields `{}`; nothing was ever saved and every load threw.
  Hydrate arrays into Sets *after* parsing.
- A `ver` integer with an explicit migration `switch`.
- **Every** read and write in `try/catch`, returning a default on failure — and **never called at top-level
  script scope**. In a single-`<script>` page a top-level throw is nearly as fatal as a SyntaxError: it kills
  every listener registered after it. The reverted Phase 0 called `loadSettings()` at top level on line 959
  while the touch pads bound at 1394 and the loop started at 2800, so one throw on an iPhone with "Block All
  Cookies" produced the *same* dead-tap symptom as the comma.
- Define once here, since four phases spend them: **`G.taquitos`** as a real ledger separate from `G.score`,
  with earn/spend helpers and a HUD readout; an **inventory array** with `hasItem`/`addItem`; a
  **`bumpStat(key)`** counter called alongside each existing `G.score +=` site; **per-board personal bests**.
- Add a **Continue** button that actually routes to the restored screen.

*Done when:* clear a board, reload the page, and your taquitos, unlocks and best score are still there — and
the game still boots with storage disabled in Safari settings.

### Phase B — Gameplay refinement · ~8–12h · depends on: A

The old Phase 2, labelled "High Impact, Low Effort" and then scheduled tenth. Most of it already exists; this
is about finishing and exposing it.

| Item | Reality |
|---|---|
| **Difficulty tiers** | Genuinely new. Add a real picker. Scale *enemy* damage, never the player's own bullets — the reverted version multiplied player damage, so `easy` made the pistol do `Math.floor(1×0.8) = 0`. And note `G.spawnMul` scales the *interval*, so a larger value means **fewer** enemies; the reverted tiers had it backwards. |
| **Mid-board checkpoints** | Genuinely new, and the best frustration fix available. |
| **Weapon feedback** | ~90% exists (shake, hit-stop, particles, white flash). Remaining work: promote the scattered magic numbers into `TUNING`. |
| **Trust affects gameplay** | Two hooks already live (`:877`, `:1106`). Extend rather than rebuild. Meters are 0–10, **not** 0–100 — the reverted code compared against 75 and 25, so one branch could never fire and the other always did. |
| **Score attack** | Renamed to **personal bests** and delivered in Phase A. A leaderboard needs a backend this project does not have. |

### Phase C — Pause & menu shell · ~4–6h · depends on: A

Small, and it unblocks three later phases that all assume a menu that does not exist. An in-action pause that
sets `S.paused`, with tabs for settings, character bios, and later achievements.

### Phase D — Audio/visual settings & real mixing · ~6–8h · depends on: C

The one genuinely-new piece of the old Phase 0.

- Do the routing change **once**: a single master `GainNode`, with `AU.g`, `MUS.g` and `MUS.ag` rerouted into
  it, then expose master/music/ambient/sfx over that graph. The reverted version created an sfx bus, connected
  it to the destination, gave it a slider — and never routed a single source into it, so three of four sliders
  were silent no-ops.
- **Verify each slider by ear before committing.**
- Stage settings must not clobber user preferences: gate the stage decision on the preference
  (`enabled = !!st.top && prefs.flicker`), don't overwrite it.
- Make `prefs` the single source of truth and render the UI from it — **never** read state back out of a
  button's `textContent`.

### Phase E — Story depth · ~10–16h · depends on: A

Highest narrative payoff per hour, because the engine work is nearly nil.

- **Endings 3 → 6**: the selector is one ternary at `:808` plus an existing independent companion axis. This is
  rows and prose, not engine work.
- Companion dialogue for Glaze and K.E.V.I.N. keyed to locations and choices.
- K.E.V.I.N. backstory drops between boss phases.
- Environmental lore notes (persisted via Phase A). **Six good ones beat twenty filler ones.**
- Character bios in the Phase C menu.

### Phase F — Quality of life & accessibility · ~8–12h · depends on: A, C

- **Adjustable pad size and position** — a few CSS custom properties, and the accessibility win that actually
  matters on the target device.
- Colourblind-safe palette options, text scaling.
- Move the tutorial gate out of `pickChoice` into `startStage`, keyed on the stage's mode flag. Today the race,
  kumite and dungeon control schemes are **never explained**, because only three story scenes can reach a
  tutorial card.
- *Remappable controls* needs a prerequisite: analog movement is read straight out of the raw `KEYS` map inside
  three separate update functions rather than through `IN`. Normalise input through `IN` first, as its own
  change with an identical-behaviour invariant, then remap on top.

### Phase G — The hub screen · ~25–40h · depends on: A, F

**The highest-risk item in this document.** It rewrites the navigation spine, and it is the change most likely
to break everything. Do it once the safety net is mature, not before.

- It is a **new** screen. **Do not** transform Operation: Floor Plan into it — that is a finished set piece the
  README advertises, with its own d20 mechanics, its own `war` track and its own win/lose exits. Floor Plan
  becomes **one node on the hub**.
- Reuse `WMAP` (`:827`) and `renderWar` (`:847`) as the pattern to copy: percentage-positioned nodes, SVG
  connector lines, per-node state classes.
- **Address boards by string id, never by `STAGES` array index.** The reverted version stored numeric
  `stageIndex` in each node, so any reorder of `STAGES` silently reroutes the map to the wrong board.
- Ship it behind a `?hub=1` flag so a half-built hub cannot break the normal path.
- Gate nodes on prerequisites the player can actually earn. The reverted version gated all three new boards
  behind the item each board itself awarded — unreachable by construction.
- Set `MODE` back on every exit path. The reverted version left a live keydown handler bound over the title
  screen.
- Fog of war: paint the fog `source-over`, *then* punch holes with `destination-out`. The reverted version had
  it inverted and erased the entire map.
- Canvas needs explicit `width`/`height` attributes — the reverted map drew an 800×500 coordinate space into a
  default 300×150 backing store.

*Done when:* every one of the existing 8 boards is reachable from the hub, on a landscape iPhone, and the
linear path still works with the flag off.

### Phase H — New boards · ~12–20h each · depends on: G

Ventilation Shafts (stealth), Custard Storage (puzzle), Time Warp Zone (CH.1 remix). **One board per commit
series.** A stealth mode and a puzzle mode are new mechanics, not navigation — which is why bundling them into
a "foundation" phase hid their real cost. Each new stage needs an explicit `st.music`; the track selector falls
back to a two-element array indexed by stage number, so stage 8 gets `undefined` and crashes.

---

## Cut line — maybe never

Everything below is **recorded as an idea, not planned**. Each is of the same order of scope as the entire
existing game: an NPC quest system, crafting with three stations, four faction reputations with tiered
outcomes, 51 achievements and 4 challenge modes. Together they are roughly 8 months of evenings, and they pull
directly against "big dumb fun."

If one survives, pick **one**, and scope it to a single concrete deliverable — e.g. one NPC in the Supply
Dungeon with one three-step quest — rather than a systemic layer.

- **NPCs & side quests** — Marge, Dr. Quark, Rusty, Goo King, Sarge; journal with waypoints.
- **Crafting & inventory** — Janitor's Workbench, Future Forge, Goo Lab; recipes like CHONKY SMASHER.
- **Dynamic world & faction reputation** — random map events, four factions.
- **Achievements & challenge modes** — Iron Janitor, Minimalist, Pacifist, Speedrun.

Note: "goo zones" are referenced by several of these ideas but **do not exist**. At HEAD, "goo" means goo
critter enemies. Either create the location or rewrite the references.

---

## Design principles

1. **Tone:** "Big dumb fun" stays central. Depth enhances; it never replaces.
2. **Constraint:** one HTML file, one `<script>` block of ~598K chars. **Consequence:** any SyntaxError or
   top-level throw is a *total* outage that still paints the title screen — so it looks like the game loaded
   and reads as an input bug. Therefore: gate every commit; never do risky work at top-level scope; wrap every
   storage access in `try/catch`.
3. **Scope:** if a phase is not plausibly a 1–2 week slice, decompose it until it is.
4. **Verify before you commit.** Every phase has a "done when" written as an observable outcome, and no phase is
   done until it has been seen working on a landscape iPhone.
5. **Read the code before planning against it.** This document's predecessor did not, and that cost three
   phases.
6. **Modular:** features should be independently testable, and shippable behind a flag when risky.

---

## Tracking

| Phase | Status | Notes |
|---|---|---|
| Verification gate | ✅ **Done** `72ec6cd` | `tools/check.mjs` + `tools/smoke.mjs` + hooks. Verified against known-good and known-broken commits. |
| HEAD defect fixes | ✅ **Done** `d75d25f` | Non-negative `dt` clamp; sequencer no longer schedules notes in the past after a throttle stall. |
| A — Persistence & ledger | ✅ **Done** | One guarded key (`jot.save`, ver 1), taquito wallet + HUD, inventory, stats, per-board bests keyed by new `STAGES[].id`, CONTINUE with a deep-copied checkpoint, erase-save. Verified against 12 hostile save payloads and a storage-denied boot. `spendTaquitos`/`hasItem` are in place but unspent until the shop phase. |
| B — Gameplay refinement | ✅ **Done** | Four difficulty tiers (picker on the title, persisted) scaling spawn interval, mercy window and regen — never player damage. Mid-board checkpoints on the three timed boards and the race. Trust now pays off in action boards (Torque ≥7 regen, Vex ≥7 mercy). Juice constants gathered into `TUNING.juice`. |
| C — Pause & menu shell | ✅ **Done** | In-board pause (⏸ button + Esc/P) reusing `S.paused`, with STATS / DOSSIERS / OPTIONS tabs, resume and quit-to-title. Dossiers unlock off the Phase A stats. OPTIONS holds the difficulty cycler and sound toggle — Phase D drops volume sliders in the same panel, Phase E fills out the dossier text. |
| D — AV settings & mixing | ✅ **Done** | One master `GainNode` with the SFX, music and ambience buses routed into it, driven by four persisted sliders in the pause OPTIONS panel. Timeline decay now flickers the existing `#fx` scanline layer via CSS (no `ctx.filter` anywhere), with an off switch and `prefers-reduced-motion` respected. Defaults reproduce the pre-phase mix exactly. |
| E — Story depth | ⬜ Not started | |
| F — QOL & accessibility | ⬜ Not started | |
| G — Hub screen | ⬜ Not started | Highest risk. Behind `?hub=1`. |
| H — New boards | ⬜ Not started | |
| Old Phases 7–10 | ✂️ Below cut line | Recorded as ideas, not planned. |

### Postmortem: Phases 0–2 (2026-08-15) — ATTEMPTED, REVERTED

**Attempted:** `731c338` (Phase 0), `9ffb146` (Phase 1), `fe196b1` (Phase 2). **Reverted:** `ecc598f`.

**Root cause — a single missing comma.** In the `CanvasFilters` object literal, `apply(ctx){…}` was not
followed by a comma before `clear(ctx){…}`. Because the file has exactly one `<script>`, that SyntaxError meant
**zero JavaScript executed** in all eleven commits from `731c338` through `3d1d313`, while the HTML/CSS title
screen kept painting. Every tap did nothing, so it was diagnosed as an iPhone touch bug and chased through an
eight-commit bisection — but the comma survived every test commit, so no test could ever pass. The `v0.2`/`v0.4`
version indicators confirmed fresh content was loading, which reinforced the wrong conclusion. The
`touchstart` listener removed at `3d1d313` could never have mattered: the game uses Pointer Events exclusively.

> ### ⛔ The reverted commits are DESIGN SKETCHES CONTAINING KNOWN-BROKEN CODE
>
> ~1200 lines are sitting in git history looking like completed work. **Do not revive them on the assumption
> that only the comma was wrong.** An audit confirmed **7 blockers and 30 major defects** beyond it. If you
> want an idea from there, re-implement it small and verify it. Confirmed defects included:
>
> **Phase 0** — every one of the three `ctx.filter` effects was dead code three ways over: a dangling `else`
> bound to the `timeWarp` `if` unconditionally erased the flicker filter set two lines above; the JS referenced
> `url(#timeWarpFilter)` while the SVG filter's id was `timeWarpSvg`; and `intensity`/`distortion` were never
> assigned a nonzero value · the goo tint was painted *before* every draw path's `clearRect`, so it was erased
> on the same frame · `ParticleEmitter` was never instantiated (and `Math.floor(rate × dt)` with `rate:10` at
> 60fps is `0` **every frame**, with no fractional accumulator — it could never emit) · `ParallaxBg` was never
> init'd, never given a layer, never drawn · the sfx gain bus had nothing routed into it, so three of four
> volume sliders were silent · `crossfade()` ramped music to zero and never restored it · two `SONGS` entries
> had `bpm:0` → `Infinity` → a throw ~11×/second · two `_ambStart` branches called `setValueAtTime` with the
> required `startTime` argument missing · `AU.init()` ran on *every* pointerdown, leaking a listener each time,
> and listened for a `suspend` event that AudioContext does not have · unguarded top-level `localStorage` +
> `JSON.parse` (a second, independent cause of the identical dead-tap symptom) · the settings screen overflowed
> every landscape phone with no way to scroll and no way back.
>
> **Phase 1** — `MAP_STATE` used `Set`s persisted via `JSON.stringify`, so nothing ever saved and every load
> threw · unlock rules read `G` keys nothing ever wrote · all three new boards were gated behind the item each
> awarded itself · fog of war was inverted and erased the map · the map canvas had no `width`/`height` · `BOSS`
> and `SECRET` nodes had no dispatch branch, so GLAZE and K.E.V.I.N. were inert · new stages got no music ·
> `MODE` was never restored on exit · `openShop` played a nonexistent track · fast travel referenced
> `G.taquitos` and `updateHUD()`, neither of which existed.
>
> **Phase 2** — save was write-only (`loadGame` had no caller and there was no Continue button) · the
> difficulty system was unreachable and always resolved to `normal` · `damageMul` was applied to the *player's*
> bullets, so `easy` made the pistol do zero damage · `spawnMul` was inverted, so `hell` spawned fewer enemies ·
> the weapon emitter burst in the shmup but was only drawn in the kumite, so the feedback was invisible.

**Process changes made as a result:** the verification gate at the top of this document; the "Already built"
inventory; a stated size budget; platform constraints; and this table, which can now express failure instead of
only silence. The old checklist showed Phases 0–2 unchecked while all three had been written, deployed broken,
and reverted.

---

*Last updated: 2026-08-15*
