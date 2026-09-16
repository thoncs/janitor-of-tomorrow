# ART_QUEUE — the master firing order

_Written 2026-09-14. One document, one order, fire from the top._

## 0. THE SITUATION, PLAINLY

The brief this queue was written against says: **generation is blocked, the subscription has expired,
1385 generations are frozen (615 of 2000 used), credits $0.00, nothing runs until the plan is renewed
at pixellab.ai/account.**

**That premise is stale as of this writing.** A live `get_balance` on 2026-09-14 returns:

```
credits: $0.00
generations_remaining: 1938
generations_used: 62
generations_total: 2000
subscription: active (Tier 1: Pixel Apprentice)
generations_reset: 2026-10-15
```

So: the plan is **active**, the cycle has rolled, and there are **1,938 generations** available, not
1,385 — and they refill on **15 October 2026**. Credits are still $0.00, which only matters if the
subscription lapses again; with an active plan, generations are the currency.

**Before firing anything, run `get_balance` again and believe it over this paragraph.** If it comes
back expired, nothing below can run and the fix is renewal at pixellab.ai/account. If it comes back
like the above, start at row 1 and work down.

Two numbers to carry through the rest of this document:

- **1,385** — the old planning budget. It is marked in the queue, at row 136.
- **1,938** — what is actually there. The queue totals **1,885**, leaving 53 as re-roll reserve.

---

## 1. THE CRAZY PATH

Doug Pickles is not the chosen one. He is the one currently on shift.

Here is what happens if all of this lands. **The graphics budget stops being a joke in the dialogue
and becomes a thing you can watch escalate.** CH.1 stops flying a 64-bit saucer over a NES board and
gets a SUGAR GNAT instead, because the tier violation was a bug and the bug was visible. CH.2 — four
sprites and a rotation hack, the thinnest tier in a game whose entire premise is that the art gets
worse before it gets better — gets a real doodle rig, a named mid-boss called PRETZ, an escalator
in the level named ESCALATOR TO HELL, and sixteen biro props from a single call. CH.3 gets a truck
that shows damage. The kumite gets a vat door instead of a gradient. K.E.V.I.N. cracks on the exact
frame KEV_LORE says _"they gave me a networked mind and one job"_, and ruptures on _"I only wanted to
be finished"_.

**Doug learns to be hurt.** Right now he cannot be struck, cannot die, cannot win — he has a walk
and a jump, on every board, forever. Twelve generations give him a hurt frame, a death frame, a
stomp and a victory pose in two tiers, and drop them into animation windows the code has already
been leaving empty: the 500ms before `gameOver`, the 350ms before `showConsequence`, the 900ms
after a KO. **The dungeon's two unrendered verbs — the ZAP and the SCOOT — finally have bodies.**

**The three boards with no art get art.** The facility hub becomes a cutaway of Biocore Tower with
your node sitting on it. OPERATION: FLOOR PLAN becomes what the fiction always said it was: a napkin
Torque drew in seven marker colours with one line of Vex's immaculate handwriting at the bottom. The
tabletop finale gets graph paper, two character sheets that are Vex and Torque without ever saying
so, and a bowl of nachos that empties as you eat it.

**And the ending stops being a paragraph.** Six endings ship today as text. Three cards — golden
sunrise with a mop leaning on the pump; a seaside town where the seagulls have thumbs; a beige
pudding ocean with one small figure on a pier — plus six wax seals for the six send-offs, and the
last thing anyone sees after a full run is a picture instead of a font.

Snacks are still health. Hair metal is now literally a weapon you can see. The taquito is gold and
it is worth something. **And down in Sublevel C the Guild is still mopping, faceless under the cap,
because somebody was on shift before Doug and somebody will be on shift after.**

---

## 2. THE QUEUE

Fire from the top. **Stop anywhere and you have still spent well** — that is what the order is for.
Cumulative is the running spend if you have fired everything above.

Tier: **must** = fixes something the source code itself admits is broken, or gives a live mechanic
its first picture. **strong** = clear, hooked, worth it. **stretch** = indulgence, correctly priced.

Line numbers are verified against `index.html` at 3,841 lines (2026-09-14).

### ▶ WAVE 1 — rows 1-40, 201 generations. *The game is visibly better.*

Every tier violation fixed, every empty animation window filled, three art-less boards given art,
and the six endings given faces. 10% of the budget, most of the visible gain.

| # | Asset | ART key | Tool | Gens | Cum. | Tier | Hook |
|---|---|---|---|---|---|---|---|
| 1 | THE PRE-PAID PROP SHELF — 24 finished PNGs + 3 paid 8-dir sheets | `taquito, plunger_red, nachos, mop_bucket, die_d20, guitar, amp, vending_machine, lore_disk, energy_drink, custard_can, freight_elevator, goo_brute, boss_mech, scr_bomber, scr_donut_drone, scr_eclair, port_rival, port_cultist, port_guard, +4` | none — already paid for, sitting in art/new/ | 0 | **0** | must | Kills the emoji props: `'📦'`+`'🌮'` at 3441-3442, `'🪠'` in the dungeon, `'🌮'/'🌭'/'⚡'` at 2248 / 2713 / 3117 / 3618 / 3743-3744. One sprite per commit, each with its draw code. |
| 2 | DELETE gd_idle | `gd_idle (removed)` | none | 0 | **0** | must | 1 occurrence in 3841 lines — its own ART entry. drawGoo (3447) always uses gd_walk. 12KB and a catalog card for nothing. |
| 3 | SUGAR GNAT — the NES-tier flyer that does not exist | `gnat_fly` | create_character (v3) + animate_character (v3) | 4 | **4** | must | 3771 blits `AIMG.ufo` — a 64-bit sprite — on CH.1 and TIME WARP, with a source comment conceding it. Same 40x40 rect; drop the rotate, pass fx=true. |
| 4 | DOUG, STRUCK | `h_hurt` | animate_character (template) | 1 | **5** | must | 3794 `const a=!p.onG?AIMG.h_jump:DOUG_WALK[...]` gains `p.inv>0?AIMG.h_hurt:`. p.inv is already set on every hit. |
| 5 | TIMELINE SEVERED | `h_die` | animate_character (template) | 1 | **6** | must | The already-empty 500ms between hp<=0 and gameOver(). Doug has no death frame on any board. |
| 6 | THE STOMP | `h_stomp` | animate_character (template) | 1 | **7** | must | 3794, `p.vy>0` branch. The stomp check already tests `falling`; the state exists and is unrendered. |
| 7 | SHIFT COMPLETE | `h_win` | animate_character (v3, 6f) | 1 | **8** | strong | The already-empty 350ms before showConsequence(). Blit AIMG.mop rotated overhead, as fightDraw already does at 2460. |
| 8 | DOODLE DOUG — the notebook-tier rig | `scr_doug` | create_character (v3, 112px, 8dir) | 6 | **14** | must | REPLACES scr_doug (3800, 56x56). This one buy makes every doodle pose below cost 1-2 instead of 30. |
| 9 | DOODLE DOUG, AIRBORNE | `scr_doug_jump` | animate_character (template) | 1 | **15** | must | 3800's sibling branch fakes airborne with `cx.rotate(.16)`. Same 56x56 rect. |
| 10 | DOODLE DOUG, OW | `scr_doug_hurt` | animate_character (template) | 1 | **16** | strong | Same branch, `p.inv>0`. Ship with h_hurt or CH.2 reads as the cheap level. |
| 11 | DOODLE DOUG, STOMPING | `scr_doug_stomp` | animate_character (template) | 1 | **17** | strong | CH.2 carries stomp:true; the mechanic is live and unrendered. |
| 12 | DOODLE DOUG, VICTORIOUS | `scr_doug_win` | animate_character (v3, 8f) | 2 | **19** | strong | Same 350ms window as h_win, notebook branch. |
| 13 | MUCUS TURRET, FIRING | `t_fire0..2` | create_image_pixflux (img2img x3, +1 reroll) | 4 | **23** | must | 3767 and 3444 blink t_idle1/t_idle2 on a sine unrelated to firing — `f.fireT` already exists (set 2194, ticked in the foe update) and the renderer ignores it. |
| 14 | STRIPED SYNTH SUN | `sun_synth` | create_image_pixflux | 2 | **25** | must | Replaces the clipped arc + 5 fillRects in the CH.1 sky. One aBlit. |
| 15 | TWO SUNS, ONE SQUARE | `wrp_sun_two` | create_image_pixflux | 3 | **28** | must | Warp branch of the same blit. Best joke-per-generation in the plan. |
| 16 | CHONKEY BOY | `ec_chonky` | create_image_pixflux (img2img x3) | 3 | **31** | must | 3760 gains `S.st.id==='warp'?ec_chonky:chonky`; the banner string becomes per-board. TIME WARP's first unique art. |
| 17 | ECHO GOO | `ec_goo0..3` | create_image_pixflux (img2img x4) | 4 | **35** | must | GOO_WALK swap on the warp board, 1:1 frame replacements, no timing change. |
| 18 | DOUG ZAPS — 8 DIRECTIONS | `dd_zap` | animate_character (v3, 4f x8) | 8 | **43** | must | dg.zap fires a tracer at 3293 with no character animation behind it. Pack 256x512 like dd_walk; DROW and sBlit unchanged. |
| 19 | SCOOT — 8 DIRECTIONS | `dd_scoot` | animate_character (template x8) | 8 | **51** | must | `p.dashT=.22` at 3275; drawDoug already comments 'a SCOOT is not a wound' and has no dash art. |
| 20 | DUNGEON DOUG, HIT | `dd_hurt` | animate_character (template x8) | 8 | **59** | strong | drawDoug's existing `p.inv>0&&!(p.dashT>0)` test, free. |
| 21 | THE NAPKIN | `war_napkin` | create_image_pixflux (8 attempts) | 8 | **67** | must | CSS background on `#wmap` (469). OPERATION: FLOOR PLAN has zero sprites; this gives the whole board a voice in one image. |
| 22 | DISTRICT BADGES x7 | `war_icons` | create_image_pixflux x7 | 14 | **81** | must | WMAP (1599) maps 1:1 — dock, food, hr, closet, vent, server, core. background-image per button. |
| 23 | MOP-BUCKET ARMY TOKEN | `war_token_mop` | create_image_pixflux | 2 | **83** | must | Renders the army count as tokens instead of `🧹 ARMIES: 10`. |
| 24 | PUDDING GARRISON TOKEN | `war_token_pud` | create_image_pixflux | 2 | **85** | must | Enemy counterpart; pays off 'the pudding garrisons surrendered their tiny flags'. |
| 25 | BIOCORE TOWER CUTAWAY | `hub_bg` | create_image_pixflux (8 attempts) | 8 | **93** | must | CSS background on `#hmap` (460). The hub's node coordinates were already re-authored tall for a portrait tower. |
| 26 | HUB BOARD ICONS x8 | `hub_icons` | create_image_pixflux x8 | 16 | **109** | must | HUB (1312) gets an `ico` field. Race slot stays commented out and gets no icon. |
| 27 | HUB NODE FRAME (4 states) | `hub_ring` | create_ui_asset | 3 | **112** | must | renderHub (1335) already computes locked/open/next/cleared and says them in text. |
| 28 | ENDING CARD — GOLDEN | `end_gold` | create_image_pixflux (8 attempts) | 8 | **120** | must | ending() (1571) already tiers on G.timeline>=70. One `<img>` above #endtitle. All six endings ship as text today. |
| 29 | ENDING CARD — SIDEWAYS | `end_side` | create_image_pixflux (8 attempts) | 8 | **128** | must | tier 'side' (35-69). |
| 30 | ENDING CARD — BEIGE | `end_beige` | create_image_pixflux (8 attempts) | 8 | **136** | must | tier 'beige' (<35). The only sad image in the game, and it earns it. |
| 31 | HUD ICON SET (full/empty heart, cell, taquito chip) | `ui_hudset` | create_image_pixflux (sheet) | 6 | **142** | must | updateHearts (3035) sets textContent to `'♥'.repeat(hp)`. Highest-frequency pixel in the game. |
| 32 | INCOMING TELEGRAPH | `ui_warn` | create_image_pixflux | 2 | **144** | strong | spawnFoe gives gbmode a 110px lead (240 in the warp); on a 374px glass the player cannot see them coming. The mechanic matters more than the sprite. |
| 33 | THE OMEGA CROWN | `kev_crown` | create_image_pixflux | 2 | **146** | strong | `#kevcrown` (483) is the literal 👑 at 30px, on the game's final escalation. |
| 34 | THE PORTION CORE | `kev_core` | create_image_pixflux | 2 | **148** | strong | Boss-death beat (3005-3008): the thing that survives K.E.V.I.N. is the thing he kept saying he was. |
| 35 | GLAZE, BITTEN | `glz_hurt` | create_image_pixflux (img2img x3) | 3 | **151** | strong | 2383 is already a ternary; add `gz.hp<gz.max*.5`. Same 144x156 draw. |
| 36 | GLAZE, CRUMBLING | `glz_crumb0..3` | create_image_pixflux (img2img x4, +2) | 6 | **157** | strong | MOPTALITY currently slides an intact donut sideways under 70 particles. Frame index off fx.t. |
| 37 | FIGHT! word-art | `vs_fight` | create_image_pixflux (5 attempts) | 5 | **162** | must | Build the banner `img` path ONCE in drawBanner (2264); 2285 then becomes a one-line change and eight more assets land through it. |
| 38 | M O P T A L I T Y word-art | `vs_moptality` | create_image_pixflux (6 attempts) | 6 | **168** | must | 2292 sets letter-spaced sans-serif for the game's signature move. Check the spelling character by character. |
| 39 | MILESTONE BANNERS x5 | `ban_milestones` | create_image_pixflux x5 (5 attempts each) | 25 | **193** | must | MILESTONES (2205) fires at 2212 and 2594. The ×N multiplier stays live text. |
| 40 | ACT 1 ESTABLISHING SHOT | `sto_closet` | create_image_pixflux (8 attempts) | 8 | **201** | must | `<img>` on #story keyed on chap. Settle the phone layout on this card before generating the other two. |

### ▶ WAVE 2 — rows 41-90, to 605 cumulative. *Every board gets an environment and a face.*

Backgrounds stop being procedural everywhere, the tile-strip loop lands, the dossiers and portraits
get expressions, and the two villains get damage states.

| # | Asset | ART key | Tool | Gens | Cum. | Tier | Hook |
|---|---|---|---|---|---|---|---|
| 41 | ACT 2 ESTABLISHING SHOT | `sto_mall` | create_image_pixflux (8 attempts) | 8 | **209** | must | Generate AFTER scr_fountain/scr_jukebox so the establishing shot agrees with the props the player then meets. |
| 42 | ACT 3 ESTABLISHING SHOT | `sto_shaft` | create_image_pixflux (8 attempts) | 8 | **217** | must | Pass truck_top as reference so the truck they see parked is the truck they fly. |
| 43 | D-CELL, NOTEBOOK CUT | `en_cell_scr` | create_image_pixflux | 1 | **218** | strong | CH.2 branch of the pickup draw (3743-3744). |
| 44 | TAQUITO, NES CUT | `snk_taquito_pix` | create_image_pixflux | 1 | **219** | must | `S.st.pixel` branch — the tier gate already exists. |
| 45 | TAQUITO, NOTEBOOK CUT | `snk_taquito_scr` | create_image_pixflux | 1 | **220** | strong | Three-way skin switch. Two gens double CH.2's prop count. |
| 46 | GOLDEN TAQUITO, NES CUT | `taq_gold_pix` | create_image_pixflux | 1 | **221** | strong | 2248 / 3743, pixel branch. |
| 47 | TAQUITO CRATE, BURST | `dg_crate_open` | create_image_pixflux | 1 | **222** | strong | A 0.6s husk after the crate is spliced out at collect. |
| 48 | EXIT DOOR, NOTEBOOK | `scr_door_exit` | create_image_pixflux | 2 | **224** | strong | 3735's ternary. Hand-lettered EXIT is the one place baked text is SAFER. |
| 49 | THE DOOR BEHIND THE DOOR | `wrp_door_twice` | create_image_pixflux | 3 | **227** | strong | Third branch of the same ternary. Cheaper alternative: blit door_exit twice at alpha .5 for 0 gens. |
| 50 | SKYLINE FROM MEMORY | `wrp_skyline` | create_image_pixflux | 3 | **230** | must | Generate AFTER bg_lab_far and pass it as reference — 'the same buildings in the wrong order' IS the joke. |
| 51 | GHOST DOUG | `wrp_ghost` | create_image_pixflux | 3 | **233** | strong | Background actor one frame behind the player. Place him LEFT of the start or he reads as a threat. |
| 52 | MISSPELLED SIGNAGE | `wrp_sign_wrong` | create_image_pixflux | 4 | **237** | strong | BIOCORE SOLUTIONZ. The one asset where a text failure is indistinguishable from success. |
| 53 | PASSING GIRDER BAND | `shaft_girder` | create_image_pixflux (seamless) | 3 | **240** | must | Replaces the 3-stop gradient band in the CH.3 shaft; the 300px loop is untouched. |
| 54 | SHAFT PIPE COLUMN | `shaft_pipecol` | create_image_pixflux (seamless-y) | 3 | **243** | must | The far-pipe loop's 260 is already the tile pitch, so the seam period matches for free. |
| 55 | VAT FLOOR MACHINERY | `kev_bg_machines` | create_image_pixflux (seamless) | 3 | **246** | must | Replaces the seeded silhouette loop in the boss arena. KEEP the blinking lamps over it. |
| 56 | CEILING PIPE RUN | `kev_pipes_ceil` | create_image_pixflux (seamless) | 3 | **249** | strong | Band-for-band swap, 2x house ratio exactly. |
| 57 | SUBLEVEL B FAR PARALLAX | `bg_lab_far` | create_image_pixflux (seamless) | 3 | **252** | must | Replaces the seeded skyline rects. Keep the status lights procedural so they blink. |
| 58 | SUBLEVEL B MID PARALLAX | `bg_lab_mid` | create_image_pixflux (seamless) | 3 | **255** | strong | scroll*.45. Drop it if it muddies the goo silhouettes. |
| 59 | DEAD MALL STOREFRONTS | `scr_bg_far` | create_image_pixflux (seamless) | 3 | **258** | must | CH.2 currently borrows CH.1's procedural skyline at hue 315. |
| 60 | MALL CONCOURSE MID | `scr_bg_mid` | create_image_pixflux (seamless) | 3 | **261** | strong | scroll*.45, notebook tier. |
| 61 | VAT BLOOM CURTAIN (3 frames) | `bloom_curtain` | create_image_pixflux x3 | 6 | **267** | must | `S.bloomed` (2813) fires a banner and four spawns. Keep the top 60% transparent or it hides wasps. |
| 62 | FLOOR DECAL SET | `dg_decal` | create_image_pixflux (3-cell sheet) | 3 | **270** | strong | 8% of dungeon floor tiles. Stops dtiles reading as repetitive. |
| 63 | MOP RACK | `dg_moprack` | create_image_pixflux | 2 | **272** | strong | Wall decor; one hook conspicuously empty. Cheapest character beat in the dungeon. |
| 64 | EXIT HATCH (sealed + open) | `dg_hatch` | create_image_pixflux x2 (2 attempts) | 4 | **276** | must | Maps exactly onto the existing `dg.exit.on` boolean the plunger already flips. |
| 65 | SUBLEVEL B TILESET | `til_lab` | create_sidescroller_tileset (2 attempts) | 6 | **282** | must | BUILD THE STRIP LOOP FIRST — the side-scrollers have no tile engine, just one fillRect. ~15 lines, and it is the prerequisite for til_mall and til_warp. |
| 66 | DEAD MALL TILESET (doodle) | `til_mall` | create_sidescroller_tileset (2 attempts) | 6 | **288** | must | One-line skin switch on S.st.pixel once the loop exists. Judge candidates on wobble, not neatness. |
| 67 | SUBLEVEL B, REMEMBERED WRONG | `til_warp` | create_sidescroller_tileset (2 attempts) | 6 | **294** | must | Same loop, stage id 'warp'. Asking a generator for tiles that do NOT tile; expect to offset the source rect in code instead. |
| 68 | STOREROOM WANG SET | `til_store` | create_topdown_tileset (2 attempts) | 6 | **300** | strong | THE ONLY TRUE TILESET DROP-IN — the dungeon has a real WANG engine. Must be repacked to the existing 4x4 corner order. |
| 69 | STATUS CONDITION SHEET | `st_icons` | create_ui_asset | 2 | **302** | strong | SOGGY / HYPE / CARAMELIZED / GUARD exist in code and are announced only in log prose. Biggest legibility win in the finale. |
| 70 | TABLETOP ACTION ICONS | `tt_menu_icons` | create_ui_asset | 2 | **304** | strong | The six #bmenu buttons' emoji prefixes. Cleanest DOM hook in the plan. |
| 71 | LORE NOTE SET (8 frames) | `lore_icons` | create_ui_asset | 2 | **306** | strong | Exactly 7 LORE entries (683) + the locked state = 8 frames, frame index = array index. |
| 72 | TIMELINE METER (3 states) | `ui_timeline` | create_image_pixflux | 4 | **310** | strong | ending() already tiers on exactly 70 and 35 — the meter would finally telegraph which ending you are walking into. |
| 73 | TRUST METER PLATES | `ui_trust` | create_image_pixflux | 3 | **313** | strong | #mTor dented, #mVex ruled. Characterisation in the furniture. |
| 74 | LORE NOTE CARD (+ redacted) | `ui_lore_note` | create_image_pixflux x2 | 3 | **316** | strong | The pause LORE tab already renders found/unfound from PROF.notes. |
| 75 | DOSSIER BADGE FRAME | `dos_frame` | create_ui_asset | 3 | **319** | strong | Generate it OPAQUE with a solid window and position busts over it in CSS — no dependency on the model's geometry. |
| 76 | DOUG, FOUR MOODS | `port_doug_set` | create_image_pixflux (img2img x4) | 4 | **323** | strong | `PORT[s]` becomes `PORT[s+(mood?'_'+mood:'')]` with a fallback. One line; authoring which line gets which mood is the work. |
| 77 | TORQUE, FOUR MOODS | `port_torq_set` | create_image_pixflux (img2img x4) | 4 | **327** | strong | img2img at strength 150 GUARANTEES the bust framing matches the shipped portraits. That consistency is the real risk here. |
| 78 | VEX, FOUR MOODS | `port_vex_set` | create_image_pixflux (img2img x4) | 4 | **331** | strong | Same lookup change. A dialogue-heavy game with one expression per character reads as a slideshow. |
| 79 | VEX ALMOST SMILES | `port_vex_smile` | create_image_pixflux (img2img, strength 300) | 1 | **332** | strong | ENDING 5, bonded branch only. The whole joke is that it is one asset used once. |
| 80 | THE MANAGER | `port_manager` | create_image_pixflux | 1 | **333** | strong | One BIOS row gated on cleared.ch2 — he already exists in the CH.2 lore note. |
| 81 | ENDING BOND SEALS x6 | `end_seals` | create_image_pixflux x6 | 12 | **345** | strong | ending() already branches bond x buddy into exactly six send-offs. Verify the mapping before wiring six near-identical images. |
| 82 | GLAZE, DOSSIER PORTRAIT | `port_glaze` | create_portrait_character (result_size 128) | 25 | **370** | strong | BIOS (1404) crams a 288x312 fighter into a 128px bust slot next to three real portraits. One-line swap. |
| 83 | K.E.V.I.N., DOSSIER PORTRAIT | `port_kevin` | create_portrait_character (result_size 128) | 25 | **395** | strong | Same one-line swap; kev_a is a 576x468 boss sprite in a 52px card. |
| 84 | K.E.V.I.N., CRACKED | `kev_c` | edit_image (downscale to 512 first) | 30 | **425** | must | The finale boss's only damage signal today is a red fillRect over his eyes. Lands on the KEV_LORE .50 beat, so sprite and line break together. |
| 85 | K.E.V.I.N., RUPTURED | `kev_d` | edit_image (chained off kev_c) | 30 | **455** | strong | The .25 beat. Chain off kev_c so the cracks persist; gate the tentacle loop to 2 banks or he grows the arm back. |
| 86 | GLAZE, GUARDING | `glz_guard` | edit_image | 30 | **485** | must | The block state is a 30%-alpha circle with the word GUARD on it, beside a comment saying the previous attempt 'read as nothing'. |
| 87 | PRETZ, THE MALL MASCOT | `scr_pretz` | create_image_pro (136px, 4 candidates) | 30 | **515** | must | CH.2 already has a mid-boss slot (3762) — it just draws a recoloured CH.1 boss and calls it CHONKY BOY. One key swap, one string, zero new spawn code. |
| 88 | DOODLE PROP SHEET — 16 objects in one call | `scr_turret0/1, scr_spit0/1, scr_hp, scr_en, scr_taq +9` | create_1_direction_object (size 64, item_descriptions) | 30 | **545** | must | The single highest-leverage call in the plan: one invocation refills the game's thinnest tier. Use select_object_frames and keep only what reads as biro. |
| 89 | TAQUITO CRATE | `dg_crate` | create_1_direction_object | 30 | **575** | must | The five crates ARE the dungeon's objective (dg.got>=5 wakes the plunger) and they are drawn as `cx.fillText('📦')` at 3441. |
| 90 | PLUNGER SHRINE | `dg_shrine` | create_1_direction_object | 30 | **605** | strong | Replaces the two stroked ellipses under the pedestal. Leave the light beam OUT — it has to fade in when the fifth crate lands. |

### ▶ WAVE 3 — rows 91-110, to 1006 cumulative. *The hero objects and the set pieces.*

The mop upgrade tree, the vat door, the vat rig, the title screen, the tabletop table. This is where
the 20-40 generation band starts doing the work it is for.

| # | Asset | ART key | Tool | Gens | Cum. | Tier | Hook |
|---|---|---|---|---|---|---|---|
| 91 | EXIT DOOR — STEEL | `door_exit` | create_1_direction_object | 30 | **635** | strong | 3735's rect + stroke + fillText. Three boards from one asset. Ask for the sign BOX only and keep the live fillText over it. |
| 92 | FLYING TRUCK — CRITICAL | `truck_top_dmg` | create_object_state (128x132 exact) | 30 | **665** | must | First damage state on CH.3. G.hp<=1 gate at the existing blit; the rotate and invuln blink are untouched. Loose-alpha smoke only — the hit flash fills any solid mass white. |
| 93 | MOP RANK III — WET FLOOR GLAIVE | `mop_r3` | create_1_direction_object (116x36 MANDATORY) | 30 | **695** | must | AIMG.mop has exactly FOUR blit sites (2460, 2465, 2468, 3656), all at 3.22:1. Add a mopArt() helper and swap four tokens. |
| 94 | MOP RANK IV — SHRED-MOP 64 | `mop_r4` | create_1_direction_object (116x36) | 30 | **725** | must | mopArt() returns r4 when S.st.boss — the mop upgrades on the exact beat Vex 'reroutes the graphics budget'. |
| 95 | HAIR-METAL RAILGUN | `gun_railgun` | create_1_direction_object | 30 | **755** | must | DOM only — doug_boss has the gun baked into the torso. ACT 2 choice card + the tabletop RANGED button. Makes 'hair metal is a weapon system' literal. |
| 96 | PUDD-CO D-CELL | `en_cell` | create_1_direction_object | 30 | **785** | must | Replaces the ⚡ glyph at four draw sites. The cyan already matches the glow disc drawn behind it. |
| 97 | THE GOLDEN TAQUITO | `taq_gold` | create_1_direction_object (+1 alarm-red variant) | 31 | **816** | must | The game's most important pickup and its only guaranteed drop, currently 🌮 at 2248 / 3117 / 3743. |
| 98 | THE VAT DOOR (+ open state) | `glz_door, glz_door_open` | create_1_direction_object (40) + create_object_state (30) | 70 | **886** | must | Replaces the radial gradient + 8-bolt loop behind the kumite. The open state has a cue already written: 'The vat door, deeply unsettled, opens on its own' (589). |
| 99 | K.E.V.I.N. VAT RIG (static only) | `kev_vat_rig` | create_1_direction_object (hero, 40) | 40 | **926** | must | Gives the final boss a place to physically be — he floats in front of seeded rectangles today. Decide the composition BEFORE generating; make the gantry WIDER than the 288px boss. |
| 100 | ROUND 1 word-art | `vs_round1` | create_image_pixflux (5 attempts) | 5 | **931** | strong | Rides the banner img path built in WAVE 1. |
| 101 | K.O. word-art | `vs_ko` | create_image_pixflux (5 attempts) | 5 | **936** | strong | Needs a new cue at glz_dizzy, staggered against FINISH HIM — the banner code already comments that overlap bit once. |
| 102 | HUD FRAME | `ui_frame` | create_ui_asset | 3 | **939** | strong | #hud (376) already has the exact structure. Adjust CSS padding to the art, not the reverse — and check it against the whisper bezel. |
| 103 | DIFFICULTY TIER BADGES x5 | `ui_diff_badges` | create_image_pixflux x5 | 10 | **949** | strong | Let the DOM say the words, let the art carry the feeling — which is why these cost 2 attempts where word-art costs 5. |
| 104 | GRAPH PAPER BATTLE MAT | `tab_mat` | create_image_pixflux (seamless) | 3 | **952** | must | Repeating background on #bmain (479). The top rung of the style ladder is currently pure CSS colour. |
| 105 | CHARACTER SHEETS | `tab_sheet` | create_image_pixflux | 3 | **955** | strong | The two sheets ARE Vex and Torque and the game never has to say so. Judge candidates on the neat/messy contrast, not the detail. |
| 106 | SNACK BOWL | `tab_bowl` | create_image_pixflux | 2 | **957** | strong | Tied to a real mechanic — SNACK heals and revives. Snacks are health across the whole game; this is where that pillar gets a picture. |
| 107 | DM SCREEN | `tab_screen` | create_image_pixflux | 3 | **960** | strong | Behind #bfoe, low z-index; must not occlude the 148x132 boss img or the phase-2 swap. |
| 108 | TITLE BACKDROP | `ttl_bg` | create_image_pixflux (8 attempts) | 8 | **968** | must | Illustrates the ACT 1 opening verbatim. Prompt DARK and budget a CSS scrim — the title screen carries a lot of DOM. |
| 109 | MOP WAR OF 2076 LOGO | `ttl_logo` | create_ui_asset (4 attempts) | 8 | **976** | must | Replaces the .glitch h1 (384) — and KILLS its CSS animation unless you re-apply it to the img. Only ship if a candidate is clearly better than the h1, not merely different. |
| 110 | KUMITE DOUG — the fight-tier rig | `doug_fight` | create_character_state (128x128) | 30 | **1006** | strong | REPLACES doug_fight. NOT a pure drop-in: 88x124 drawn 44x62 becomes 64x64, and the three mop transforms at 2460-2468 need re-tuning. Budget an hour against the glass. |

### ▶ WAVE 4 — rows 111-153, to 1885 cumulative. *Surplus. New systems and pure indulgence.*

**Everything below this line needs new code, not a key swap.** New enemies, a companion in the
dungeon, the Guild, the garage, the fonts. Each row is honest about which it is. This is the wave to
cut from, in reverse order, if the band bills high.

| # | Asset | ART key | Tool | Gens | Cum. | Tier | Hook |
|---|---|---|---|---|---|---|---|
| 111 | KUMITE DOUG, STAGGERED | `doug_fight_hurt` | animate_character (template) | 1 | **1007** | strong | p.inv>0 at the fight blit. Suppress the guard-stance mop while hurt. |
| 112 | KUMITE DOUG, DOWN | `doug_fight_ko` | animate_character (template) | 1 | **1008** | strong | The 900ms before gameOver — the longest empty animation slot in the game. Drop the separate mop blit; it is in the pose. |
| 113 | M O P T A L I T Y (the move) | `doug_fight_mopt` | animate_character (v3 FIRST, pro only if it disappoints) | 30 | **1038** | strong | fightDraw already detects the phase and drives a procedural arc. Try v3 at 2 gens before spending pro; the tool docs recommend that ladder. |
| 114 | MOPNADO PRIME | `mop_r5` | create_object_pro_flash | 30 | **1068** | strong | DOM, not canvas — the LIMIT BREAK flash and the button background. Graph-paper grid must be ink, not a baked rectangle. |
| 115 | SPITTER GOO | `spit_walk` | create_character (v3) + animate_character (template x8) | 11 | **1079** | strong | New enemy: ENEMIES entry, ch1/warp mix, a fireT branch copied from the turret, one draw case. Pack 256x512 so the dungeon can read it later for free. |
| 116 | SPITTER GOO, SPITTING | `spit_fire` | animate_character (v3 x8) | 8 | **1087** | strong | The wind-up is the fairness. Inspect the middle frames specifically. |
| 117 | SPLITTER GOO | `split_walk` | create_character (v3) + animate_character (template x8) | 11 | **1098** | strong | killFoe gains topKill's split trick — that code is already written and proven on the shmup board. |
| 118 | GOO HALF | `half_hop` | create_character (v3, 48px) + animate_character (template x4) | 6 | **1104** | strong | Never spawned by the mix, only by splitting. Ship with split_walk or not at all. |
| 119 | ECHO DOUG | `ec_doug0..5 + ec_doug_jump` | create_image_pixflux (img2img x7) | 7 | **1111** | strong | The warp lore note already says it: 'The second ends: the janitor was present twice.' Fix the seed across all seven or the walk strobes. |
| 120 | THE SECOND JANITOR | `ec_janitor` | create_character (v3) + animate_character (template x8) | 11 | **1122** | strong | Canon hook written twice already — 'signed, a previous janitor, no name given'. Warp mid-boss + a standing dungeon cameo. |
| 121 | CLOSET BRUTE | `dg_brute` | create_character (v3, 96px) + animate_character (template x8) | 12 | **1134** | strong | The pedestal is unguarded. Reuses dgMove's axis-separated collision and the y-sorted ents array; 96px cells need their own blit constants. |
| 122 | CHONKY BOY, MIDDLE MANAGEMENT | `chonky_mgr` | create_image_pixflux (img2img x3) | 3 | **1137** | strong | A second rung on f.big. Test the hitbox before the art — 80x80 on a 374px glass can turn a joke into a wall. |
| 123 | SINKER, CRACKED | `sinker_crack` | create_image_pixflux (img2img x2) | 2 | **1139** | strong | Telegraphs a mechanic that already exists and is never announced: every dead sinker splits in two. Make the crack LEAK light, not draw a dark line. |
| 124 | PETAL POD | `pod_petal` | create_image_pro (84px, 16 candidates) | 30 | **1169** | strong | CH.3's 'pod' is the SECOND misuse of AIMG.ufo. Generate this BEFORE the queen and use it as her style reference. |
| 125 | VAT BLOOM QUEEN | `bloom_queen (+bloom_open0..2)` | create_image_pro (160px) + create_image_pixflux x3 | 33 | **1202** | strong | The name promises a boss; the board delivers a spawn wave. ~60-70 lines, all patterned on code that exists. |
| 126 | SWARM CARRIER | `wasp_carrier` | create_image_pro (120x112) | 30 | **1232** | strong | Ships beside two good PixelLab sprites, which is why it is 30 and not 3. topKill spawns three wasps — that loop is already written. |
| 127 | THE GUILD CUSTODIAN | `gj_idle + gj_walk` | create_character (pro, style_character_id Doug) + animate_character (template x8) | 38 | **1270** | strong | The Guild is what makes Doug 'the one currently on shift'. Render at globalAlpha .65 in code rather than asking the model for transparency. |
| 128 | THE GUILD OBJECTS | `gj_mop` | animate_character (v3 x8) | 8 | **1278** | strong | A guild ghost that only drifts is scenery; one that objects is a mechanic. The clean-floor ring is a composite op, not an asset. |
| 129 | SUBLEVEL C GUILD TILESET | `tiles_guild` | create_topdown_tileset (2 attempts) | 6 | **1284** | strong | Landing the Guild cast without a room that looks like theirs wastes them. Same 4x4 Wang packing as dtiles. |
| 130 | TORQUE, ON HER FEET | `td_idle` | create_character (pro, style_character_id Doug) | 30 | **1314** | strong | Companion mode. Generate Torque first and INSPECT before committing Vex's 30 — if style transfer fails on one it fails on both. |
| 131 | TORQUE WALKS | `td_walk` | animate_character (template x8) | 8 | **1322** | strong | Identical template to the one that made dd_walk, so the sheets match frame-for-frame. |
| 132 | VEX, ON HER FEET | `vd_idle` | create_character (pro, style_character_id Doug) | 30 | **1352** | strong | Same dependency. The dungeon's ents[] makes adding her to the render trivial; the behaviour is the work. |
| 133 | VEX MARCHES | `vd_walk` | animate_character (template x8) | 8 | **1360** | strong | Existing dungeon draw path, unchanged. |
| 134 | PILE-DRIVER | `td_slam` | animate_character (v3 x8) | 8 | **1368** | strong | Dungeon companion mode ONLY — the tabletop PILE-DRIVER is DOM and cannot use a sheet. Say so out loud before generating. |
| 135 | CALLED SHOT | `vd_shot` | animate_character (v3 x8) | 8 | **1376** | strong | Same caveat. The cyan targeting line is a stroke, same as dg.zap's tracer. |
| 136 | NES BITMAP FONT | `fnt_nes` | create_font (3 attempts) | 9 | **1385** | strong | Build ONE bmText() helper and use it on ~12 sites, not all 55 fillText calls. Inspect the sheet and hand-author the index map before wiring anything. |

**◆ THE OLD 1,385 CEILING FALLS HERE, at row 136.** Everything above this line fits inside the
budget the five lenses were costed against. Everything below is paid for by the extra 553 the live
balance turned out to have.

| # | Asset | ART key | Tool | Gens | Cum. | Tier | Hook |
|---|---|---|---|---|---|---|---|
| 137 | 64-BIT CHROME FONT | `fnt_chrome` | create_font (3 attempts) | 9 | **1394** | stretch | Tier ternary at the bmText call site. Land fnt_nes end-to-end on banners first. |
| 138 | TAQUITO TIME DOUG | `h_taq` | create_character_state + animate_character (template) | 31 | **1425** | strong | TAQUITO TIME is a live mechanic with zero art. Cheaper fallback if the gold state washes out the silhouette: pixflux img2img over h_w0..5 at 6 gens. |
| 139 | DOUG, REMEMBERED WRONG | `wrp_doug` | create_character_state + animate_character (template) | 31 | **1456** | strong | The warp board's whole identity. GENUINELY consider the 0-gen alternative first: a per-board hue-rotate filter on the existing sprites. |
| 140 | FLYING TRUCK — TIER 2 | `truck_top_t2` | create_1_direction_object (128x132 exact) | 30 | **1486** | stretch | Gives spendTaquitos() (948, zero callers in 3841 lines) something to buy. Cold nozzles only — the board draws its own thruster flames. |
| 141 | FLYING TRUCK — TIER 3 | `truck_top_t3` | create_1_direction_object (128x132 exact) | 30 | **1516** | stretch | The garage's top tier and the payoff for a wallet the game has tracked and never spent. |
| 142 | K.E.V.I.N.'S TREADS | `kev_treads` | create_1_direction_object (320x112) | 30 | **1546** | stretch | The 50% enrage changes his cadence and floods his eyes red; nothing changes his SHAPE. Do not wrap the treads in the wobble scale. |
| 143 | K.E.V.I.N. OMEGA — THE HAULER | `kev_hauler` | create_image_pro (296x264) | 30 | **1576** | stretch | One-line DOM src swap. Phase 2 is a caramel recolour today; this makes the OMEGA reveal an actual reveal. |
| 144 | TORQUE, HELMET OFF | `port_torq_reveal` | create_image_pro (2 labelled references) | 30 | **1606** | stretch | The one asset where labelled multi-reference is load-bearing: 'Torque, but with Doug's chin'. Ship with port_doug_2076 or neither. |
| 145 | DOUG PICKLES VII | `port_doug_2076` | create_image_pro | 30 | **1636** | stretch | The other half of the Pickles reveal. Pure DOM. |
| 146 | DR. MARGUERITE PUDD | `port_pudd` | create_image_pro (style_copy palette/outline/shading) | 30 | **1666** | stretch | The lore already establishes her: K.E.V.I.N. 'was built to PORTION'. Generate the portrait FIRST and reference it for the hologram. |
| 147 | THE PUDD RECORDING | `pudd_holo` | create_image_pro (128x160) | 30 | **1696** | stretch | CH.3 background ghost. Scanlines must be a procedural clip-rect, not baked — baked scanlines look dead. |
| 148 | THE SUPPLY CLOSET TIME MACHINE | `warp_closet` | create_1_direction_object | 30 | **1726** | stretch | Three call sites: the warp board, the ACT 1 scene, and both bonded endings, which describe the crew leaving through it with no picture of it. |
| 149 | RUNAWAY FLOOR BUFFER | `warp_buffer` | create_1_direction_object | 30 | **1756** | stretch | Moves faster than the 180 scroll so it closes on Doug — the only thing that makes TIME WARP feel like a remix rather than a repeat. |
| 150 | THE FIRST CUSTODIAN | `fc_idle + fc_walk` | create_character (pro, 96px) + animate_character (template x8) | 43 | **1799** | stretch | ~80 lines of boss code and a new 96px cell path. Cheaper beat that costs nothing: recolour CHONKY BOY as the pedestal guardian. |
| 151 | THE FIRST CUSTODIAN SLAMS | `fc_slam` | animate_character (v3, 12f x8) | 16 | **1815** | stretch | 12 frames because a slow telegraphed wind-up IS the fight. Generate only after fc_walk is inspected. |
| 152 | THE ESCALATOR TO HELL | `scr_escalator` | create_1_direction_object (top of band) | 40 | **1855** | stretch | THE BOARD IS NAMED AFTER IT AND IT DOES NOT EXIST. Re-roll on linework quality, not on the escalator. |
| 153 | SKELETON FOUNTAIN | `scr_fountain` | create_1_direction_object | 30 | **1885** | stretch | Named verbatim in ACT 2: 'The fountain is full of skeletons and one working jukebox.' The story says it; the screen never has. |

---

## 3. THE ARITHMETIC, HONESTLY

**Queue total: 1,885 generations across 153 line items.** Available: 1,938. **Reserve: 53.**

**The five lenses together proposed 4,724 generations** — 1,349 (CAST) + 1,110 (VEHICLES) + 786
(ARSENAL) + 354 (ENEMIES) + 1,125 (WORLD). That is 2.4x what exists. The queue above is the
deduplicated, de-conflicted subset. **2,839 generations of proposals did not make it.**

### The cost is a range, not a number

**40 of the 153 rows use a 20-40 generation band tool** (`create_1_direction_object`,
`create_image_pro`, `create_object_state`, `create_character_state`, `create_object_pro_flash`,
`edit_image`, pro-mode characters). Every "30" in this document is a **nominal midpoint**, not a
price. The true total:

| If every band call bills... | Queue total | Outcome |
|---|---|---|
| 20 (bottom of band) | **1,485** | 453 left over — fund the cut list below |
| 30 (nominal) | **1,885** | 53 reserve, the plan as written |
| 40 (top of band) | **2,285** | **you run out at row ~144**, mid-WAVE 4 |

So the plan is safe through WAVE 3 under any billing, and WAVE 4 is the shock absorber. Cut it from
the bottom up if the band runs hot.

### What got cut, and why

- **The entire TAQUITO GRAND PRIX block (~575 gens, 13 items).** `STAGES` has the race at
  `disabled:true`, it is off the hub, and `raceUpdate` only pushes one-shot obstacles that decrement
  z at the player's own speed. Rivals with their own velocity, lanes and a finish order are a NEW
  SYSTEM, not a sprite swap. **Do not spend here until the user reopens the board and the rival
  engine lands.** The one exception worth pulling forward if CH.2 needs a backdrop:
  `rd_billboard` doubles as the dead-mall parallax.
- **`dd_walk` pro remaster (240 gens).** 18% of the old budget for a 16-frame walk instead of a
  4-frame walk, on one board, at 48px on the glass. The v3 route is 8 gens for 97% of the benefit.
- **`dos_busts` x5 (125 gens as truly costed).** Two lenses priced `create_portrait_character`
  differently — 25 per subject vs 25 for five. The per-subject number is the one from the tool's own
  cost table. Doug, Torque and Vex already have portraits; the two missing cast cards are GLAZE and
  K.E.V.I.N., which rows 82-83 cover for 50.
- **Duplicate pixel-drone fixes.** Three lenses each proposed a fix for the same `AIMG.ufo` tier
  violation, at 4, 30 and 60 gens. Kept the 4.
- **The CAST lens's six pro ending cards (180 gens).** Rows 28-30 cover all six endings via the
  tier the code already computes, for 24. If WAVE 4 runs short, upgrading these three cards to six
  per-ending illustrations is the best place to put surplus.
- **The CAST lens's six napkin district tokens (36 gens).** Row 22 does the same job for 14.
- **~180 gens of ARSENAL props that are already sitting on disk.** `dg_plunger`, `snk_nachos`,
  `mop_bucket`, `tt_elevator`, `vend_machine`, `snk_lizard`, `snk_custard_can` and the d20 all exist
  as finished PNGs in `art/new/`. **That is row 1, and it costs nothing.**
- **`key_keyring`, `hub_fog`, `hub_conduit`, `gb_bezel`, `gb_grille`, `tentacle_bank`,
  `war_halo`, `war_flag`, `tab_pencil`, `shaft_fan`, `mirror_doug`, `mirror_mop`, `vs_belt`,
  `ttl_puddco`.** Each has no honest attachment point, duplicates another item, or would undo a
  design decision shipped three commits ago (the whisper bezel).

### If you finish and still have generations

In order: (1) upgrade the three ending cards to six per-ending illustrations; (2) re-roll whichever
hero assets came back weak — that is what the 53-generation reserve is really for; (3) the third and
fourth fonts; (4) the race block, if and only if the board reopens.

---

## 4. PASTE-READY CALLS — queue rows 1-15

Doug's character id — used by rows 4-7 and many below — is
**`91a30672-697d-48ad-81ab-8dbcec87f600`** (8 directions, 64x64, 10 animations). The Rival Janitor,
already generated, is `9f0ba5ec-79fc-4f52-b958-815a40f0c295`.

`create_image_pixflux` accepts a `data:` URL in `init_image_url`, so img2img over a shipped sprite
means pasting the ART value straight in — no upload step.

### Row 1 — THE PRE-PAID PROP SHELF (no PixelLab call) — ✅ DONE 2026-09-14

> **Landed 4, skipped 3.** Every sprite went in with the draw code that uses it, one commit each.
>
> | Sprite | Replaced | Where |
> |---|---|---|
> | `ART.plunger` | `🪠` | dungeon pedestal |
> | `ART.taquito` | `🌮` ×4 | wallet, crates, pickups, race |
> | `ART.nachos` | `🌭` | the `hp` heal pickup |
> | `ART.energy` | `⚡` | the `en` energy pickup |
>
> **Skipped, with reasons — these three have no call site and the queue was wrong to imply one:**
> - **`die_d20`** — "beside the existing die" does not exist. `ART.die` is already a purpose-built
>   d20 face used as the CSS background of the DOM `#die`, with the number live on top of it
>   (index.html:1770). The generated sprite is a 3/4 polyhedron with its own pips — strictly worse
>   for that job. Nothing to add it *beside*.
> - **`mop_bucket`** — no call site anywhere. Landing it means inventing dungeon set dressing, which
>   is new game code, not a prop swap.
> - **`guitar` + `amp`** — the hair-metal weapon system already ships sprites: `cass_shred` and
>   `cass_spread` are blitted for the `shred`/`spread` pickups. A guitar would be a *new* weapon
>   tier, i.e. new systems work.
>
> **Follow-up, +1 generation:** landing the taquito left it bobbing over a `📦` system emoji, so the
> crate was generated too — `ART.crate`, 2 candidates, 1 kept. **The dungeon now draws no emoji
> props at all.** The rejected candidate stencilled "SUPPLIE" on a wooden crate, which is section
> 6's baked-text failure mode arriving exactly on schedule; the cardboard box carries no text and
> reads at 30px.

```bash
# Nothing to generate. 24 finished PNGs + 3 paid character sheets are already in art/new/.
node tools/contact-sheet.mjs > art/new/CONTACT_SHEET.html   # eyeball at 3x first
# Then, ONE SPRITE PER COMMIT, each landed together with the draw code that uses it:
#   art/new/plunger_red.png     -> ART.plunger    replaces cx.fillText('🪠') in the dungeon
#   art/new/taquito.png         -> ART.taquito    replaces '🌮' at 2248 / 2713 / 3117 / 3743
#   art/new/die_d20.png         -> ART.die_d20    beside the existing die
#   art/new/nachos.png          -> ART.nachos     the tabletop snack bowl
#   art/new/mop_bucket.png      -> ART.mop_bucket dungeon prop + hub
#   art/new/guitar.png, amp.png -> the hair-metal weapon system
node tools/check.mjs index.html && node tools/smoke.mjs "$PWD/index.html"
node tools/sync-assets.mjs --fix
```

### Row 2 — DELETE gd_idle (no PixelLab call) — ✅ DONE 2026-09-14

> Landed. 16,083 chars out of `index.html`, catalog card removed, `ART_SPRITES` in `smoke.mjs`
> dropped to 53. Verified the goos still draw: 240 frames with a full spawn, no errors.

```bash
# gd_idle has exactly ONE occurrence in index.html: its own ART entry. drawGoo always uses gd_walk.
grep -c gd_idle index.html          # expect 1
# remove the ART.gd_idle line and its assets.html card, then:
node tools/check.mjs index.html && node tools/smoke.mjs "$PWD/index.html"
node tools/sync-assets.mjs
```

### Row 3 — SUGAR GNAT (2 calls) — ✅ DONE 2026-09-14, but not as specified

> **Fixed the bug, skipped the character rig.** The row asked for a v3 character plus a v3
> animation (4 gens) to get an animated NES-tier flyer. Shipped instead: `ART.px_drone`, a single
> static 64×64 sprite (2 gens — 2 candidates, 1 kept), because the draw site at the old 3771
> already animates what it is given — `cx.rotate(Math.sin(f.t*3)*.12)` — so a static sprite reads
> as hovering, and an 8-direction rig would have been thrown away by a call site that explicitly
> does not flip ("symmetric, no flip").
>
> Verified both directions, which is the part that matters for a *tier* bug: the tier-1 boards
> (`ch1`, `warp`) now blit `px_drone` and never `ufo`; CH.3 still blits `ufo` and never `px_drone`.
>
> **Row 124 is the other half of this** and is still open: CH.3's own `'pod'` foe is the second
> misuse of `AIMG.ufo`. That one is not a tier violation — the UFO is tier-correct there — so it is
> a lower priority than this was.

```json
mcp__pixellab__create_character {
  "mode": "v3",
  "view": "side",
  "size": 64,
  "name": "Sugar Gnat",
  "detail": "low detail",
  "outline": "single color black outline",
  "description": "tiny chunky flying pest made of hardened sugar with two blurred wings, a single angry eye and a needle proboscis, crystalline pale yellow body, NES-style chunky pixel art, hard limited palette, thick dark outline, transparent background"
}
```

```json
mcp__pixellab__animate_character {
  "character_id": "<sugar-gnat-id>",
  "mode": "v3",
  "directions": ["east"],
  "frame_count": 4,
  "animation_name": "gnat_hover",
  "action_description": "hovering with rapidly beating wings"
}
```

### Row 4 — DOUG, STRUCK — ✅ DONE 2026-09-14

> `ART.h_hurt`, 1 generation: template `taking-punch` on the existing Doug character, east only
> (the pixel Doug never flips). Honest note: on a character holding a mop, `taking-punch` mostly
> animates the mop coming *up*, so frame 1 — a stagger with the mop lowered — is the only frame that
> reads as hurt. It is a stagger, not a dramatic recoil. Paired with the blink the game already does,
> it reads fine; it is not the frame a hand animator would have drawn.

### Row 4 — DOUG, STRUCK (original spec)

```json
mcp__pixellab__animate_character {
  "character_id": "91a30672-697d-48ad-81ab-8dbcec87f600",
  "mode": "template",
  "template_animation_id": "taking-punch",
  "directions": ["east"],
  "animation_name": "doug_hurt_side"
}
```

### Row 5 — TIMELINE SEVERED — ✅ DONE 2026-09-14

> `ART.h_die`, 1 generation: template `falling-back-death`, kept as a **7-frame strip** rather than
> a single pose, because the 500ms gap the row identified is long enough to actually play a fall.
> `S.dieAt` is stamped where `gameOver()` is scheduled; the draw indexes the strip off it and holds
> the last frame. Death also bypasses the i-frame blink — a corpse that flickers reads as a bug.
> Verified: frames 0→1→3→5→6 across the window, then held.
>
> **Pixel tier only.** CH.2 scribble Doug still has no death pose; that is rows 8-12.

### Row 5 — TIMELINE SEVERED (original spec)

```json
mcp__pixellab__animate_character {
  "character_id": "91a30672-697d-48ad-81ab-8dbcec87f600",
  "mode": "template",
  "template_animation_id": "falling-back-death",
  "directions": ["east"],
  "animation_name": "doug_death_side"
}
```

### Row 6 — THE STOMP — ✅ DONE 2026-09-14 (2 generations, not 1)

> `ART.h_stomp`. Airborne now splits: rising and apex keep `h_jump`, falling gets the dive. The
> mechanic at 2987 already reads `falling` to decide a kill; this just draws what it was deciding.
>
> **Cost the row twice what it says, and the reason generalises:** template mode follows the
> skeleton rigidly, so a template whose motion is subtle produces near-static frames.
> `two-footed-jump` came back as seven standing poses and was deleted off the rig. `flying-kick`
> — extreme motion — gave a clean airborne frame on the first try. **Pick templates by how violent
> the pose is, not by what the name suggests.** Rows 9-12 should budget for one miss each.

### Row 6 — THE STOMP (original spec)

```json
mcp__pixellab__animate_character {
  "character_id": "91a30672-697d-48ad-81ab-8dbcec87f600",
  "mode": "template",
  "template_animation_id": "two-footed-jump",
  "directions": ["east"],
  "animation_name": "doug_stomp_side"
}
```

Harvest the descending frame only.

### Row 7 — SHIFT COMPLETE — ⏭️ SKIPPED 2026-09-14, and worth re-costing

> The 350ms window is real — `warp()` is only a white flash overlay, it does not switch screens,
> so the board stays visible and `showConsequence()` takes over 350ms later. But the flash is what
> fills that window: opacity .85 fading to 0 over .55s, so at 350ms it is still washing out roughly
> a third of the frame, and the player is looking at a white-out, not at Doug.
>
> A victory pose here buys a partly-obscured sprite in a moment nobody is reading. **Not worth a
> generation until the flash timing changes** — and if it is wanted, the cheaper fix is to shorten
> the flash or lengthen the gap first, which costs zero generations.

### Row 7 — SHIFT COMPLETE (original spec)

```json
mcp__pixellab__animate_character {
  "character_id": "91a30672-697d-48ad-81ab-8dbcec87f600",
  "mode": "v3",
  "directions": ["east"],
  "frame_count": 6,
  "animation_name": "doug_win_side",
  "action_description": "raising both arms straight overhead in exhausted triumph, chest puffed out, head tilted back"
}
```

Action only — no environment words; v3 rejects scene detail. The mop is NOT in this sprite: blit
`AIMG.mop` rotated -1.57 above his hands, as fightDraw already does at 2460.

### Row 8 — DOODLE DOUG — ⚠️ ATTEMPTED 2026-09-15. Rig built, premise disproved.

> **The rig cost 1 generation, not 6** — v3-from-reference at 56px is far cheaper than the
> from-scratch character the row priced. Eight rotations came back and the style genuinely held:
> thick outline, orange cap, grumpy face, stick legs intact. As a rotation job it worked.
>
> **But the row bought the wrong thing, twice over.**
>
> 1. **CH.2 never rotates.** It draws ONE sprite with no flip (3838), tilting it with `cx.rotate`.
>    Eight directions have no call site, now or plausibly.
> 2. **Template animations destroy the character.** `jumping-2` off this rig returned a featureless
>    yellow capsule — face gone, silhouette squashed to a pill. A humanoid skeleton has nothing to
>    grip on a legless blob, so the model reinterprets it rather than posing it. Deleted off the rig.
>
> **And img2img cannot substitute.** Two rolls, strength 190 and 115: the style survives both
> beautifully, and the pose does not move at either. That is not a tuning failure — the character is
> an oval with two 4px stick legs. There is no limb structure to re-pose. **The notebook tier has no
> pose space to buy.**
>
> Cost of finding out: 4 generations. The rig (`562a1df7`) is kept — good art, no call site.

### Row 8 — DOODLE DOUG (original spec)

```json
mcp__pixellab__create_character {
  "mode": "v3",
  "size": 112,
  "view": "side",
  "name": "Doodle Doug",
  "outline": "single color black outline",
  "detail": "low detail",
  "description": "ballpoint pen doodle of a rounded yellow blob man wearing an orange baseball cap, two thin stick legs, two dot eyes, wobbly hand-drawn black ink outline, flat yellow highlighter fill, sketchy pencil hatching, drawn on lined notebook paper"
}
```

**If it comes back as clean pixel art instead of biro, re-run with
`"reference_image_url": "<the existing ART.scr_doug data URI>"` so identity and doodle-ness are
copied rather than described.** This 6-generation buy is what makes rows 9-12 cost 1-2 each.

### Rows 9-12 — DOODLE DOUG poses — ❌ CLOSED as not buyable 2026-09-15

> All four (airborne, ow, stomping, victorious) depend on row 8's rig producing poses. It cannot —
> see row 8. **Do not spend generations here.**
>
> **The free alternative is better anyway.** CH.2 already fakes airborne with `cx.rotate(.16)`, and
> that is the correct technique for this character: a doodle that squashes, stretches and tilts is
> funnier than a doodle that is redrawn. Hurt = tilt plus flash. Stomp = vertical squash. Victory =
> a hop with rotation. Zero generations, no style risk, and it suits a tier whose whole joke is that
> someone drew it in a margin.

### Row 9 — DOODLE DOUG, AIRBORNE (original spec)

```json
mcp__pixellab__animate_character {
  "character_id": "<doodle-doug-id>",
  "mode": "template",
  "template_animation_id": "jumping-2",
  "directions": ["east"],
  "animation_name": "scr_jump"
}
```

### Row 10 — DOODLE DOUG, OW

```json
mcp__pixellab__animate_character {
  "character_id": "<doodle-doug-id>",
  "mode": "template",
  "template_animation_id": "taking-punch",
  "directions": ["east"],
  "animation_name": "scr_hurt"
}
```

### Row 11 — DOODLE DOUG, STOMPING

```json
mcp__pixellab__animate_character {
  "character_id": "<doodle-doug-id>",
  "mode": "template",
  "template_animation_id": "two-footed-jump",
  "directions": ["east"],
  "animation_name": "scr_stomp"
}
```

### Row 12 — DOODLE DOUG, VICTORIOUS

```json
mcp__pixellab__animate_character {
  "character_id": "<doodle-doug-id>",
  "mode": "v3",
  "directions": ["east"],
  "frame_count": 8,
  "animation_name": "scr_win",
  "action_description": "holding both stick arms straight overhead in celebration, bouncing"
}
```

112px x 8 frames / 65536 = 1.53, so this rounds to 2 generations for the one direction.

### Row 13 — MUCUS TURRET, FIRING — ✅ DONE 2026-09-15 (1 generation, not 4)

> **The bug was the timing, not the frame count.** Both draw sites blinked `t_idle1`/`t_idle2` on a
> sine with no relation to firing, so the turret told you nothing. `f.fireT` (side-scroller, reset
> to `ENEMIES.turret.fireEvery` = 2.3) and `t2.t` (dungeon, reset 2.2) are the real countdowns —
> the muzzle now lights on their last 0.45s. That half is **free**.
>
> One `t_fire` frame was bought instead of the row's three: the wind-up window is 0.45s, so three
> stages would blur past, and the existing pair already reads as bright-eye/dim-eye breathing which
> is worth keeping underneath.
>
> A turret whose timer sits negative (out of range, waiting) stays lit. That is honest — it is
> loaded and fires the instant you step in.
>
> Verified: fireT 2.0 → idle, 1.0 → idle, 0.40 → t_fire, −0.9 → t_fire.

### Row 13 — MUCUS TURRET, FIRING (original spec)

```json
mcp__pixellab__create_image_pixflux {
  "init_image_url": "<ART.t_idle1 data URI>",
  "width": 64, "height": 64,
  "init_image_strength": 200,
  "no_background": true,
  "outline": "single color black outline",
  "shading": "flat shading",
  "description": "squat mucus turret, eye widening and fleshy barrel drawing back to wind up, NES-style chunky pixel art, hard limited palette, thick dark outline, side view facing right, transparent background"
}
```

Then the same call twice more, changing only these two fields:

- `t_fire1` — `init_image_strength: 160`, `"...fleshy barrel bulging fat with green goo about to fire..."`
- `t_fire2` — `init_image_strength: 140`, `"...recoiling, barrel snapped back with a green muzzle splash..."`

**Demand "barrel moves, base does not" and check the base pixels across all three, or the turret
appears to slide on its mount.**

### Row 14 — STRIPED SYNTH SUN — ⏭️ SKIPPED 2026-09-15

> The row notes the sun is hue-tinted live and treats that as a reason to buy a second asset. It is
> actually the reason to buy **neither**. CH.1 reads purple and the warp reads teal off one
> `hsl(hue,...)` sun; a baked sprite is frozen at one colour and would clash with the sky gradient
> and skyline drawn around it, which stay procedural. The shipped sun is a clip path plus five
> `fillRect`s and it already looks right. Nothing to buy.

### Row 14 — STRIPED SYNTH SUN (original spec)

```json
mcp__pixellab__create_image_pixflux {
  "width": 128, "height": 128,
  "no_background": true,
  "description": "NES-style pixel art synthwave sun, large circle with horizontal bands cut out of the lower half, bands widening toward the bottom, hot magenta to amber gradient in limited colours, hard pixel edges, transparent background"
}
```

Blit at `(vw*.74-54, gY*.52-54, 108, 108)`. **The current sun is tinted live by the per-board hue, so
a baked sun cannot recolour — which is exactly why row 15 is a separate asset and not a tint.**

### Row 15 — TWO SUNS, ONE SQUARE — ✅ DONE 2026-09-15 in code, 0 generations

> **Not buyable, and it never needed to be.** Two attempts at a square sun both came back round —
> exactly the failure the row predicted, and re-rolling did not fix it; the model corrects the shape.
> 2 generations spent proving that.
>
> Then the obvious: the only difference between a round sun and a square one is the **clip path**.
> The shipped routine was already `arc` + clip + five bands, so `synthSun(x,y,r,square)` takes a
> flag, and the warp gets a second smaller square one. Free, and both suns keep the per-board hue
> tint that a sprite would have thrown away.
>
> Verified: warp sky draws one arc and two clip rects, CH.1 one arc and one.

### Row 15 — TWO SUNS, ONE SQUARE (original spec)

```json
mcp__pixellab__create_image_pixflux {
  "width": 192, "height": 128,
  "no_background": true,
  "text_guidance_scale": 12,
  "description": "NES-style pixel art of two synthwave suns in one sky, the left one a banded circle, the right one a banded square, their horizontal stripes running at different spacings, washed cyan and teal palette, hard pixel edges, transparent background"
}
```

The only failure mode is the model "correcting" the square sun into a circle. Re-roll on that.

---

## 5. INTEGRATION — the contract for landing new art

**Nothing enters `ART` without the draw code that uses it, in the same commit.** `art/new/README.md`
already states the rule and `ROADMAP.md` records what happened the last time assets landed ahead of
their systems. A sprite nothing draws inflates the one file the whole game parses and reads as
"done" in the catalog while changing nothing on screen.

**1. ART key convention.** Lowercase, underscores, no digits except frame indices:
`h_w0..h_w5` (frames), `dd_walk` (sheet), `scr_*` (notebook tier), `glz_*` (GLAZE), `kev_*`
(K.E.V.I.N.), `port_*` (portraits), `tt_*` (tabletop), `dg_*` (dungeon), `wm_*`/`war_*` (war room),
`ui_*` (HUD), `end_*` (endings). Base64 data URI, single-quoted, one entry per line inside
`const ART={...}` (line 779). Multi-frame assets may be an array — the loader's `Array.isArray`
branch already supports it.

**2. Native sizes are load-bearing.** Several blits hardcode their rects: `mop` is 116x36 at a 3.22:1
ratio across four call sites; `truck_top` is 128x132; `kev_a` is 576x468. Author at the native size
or the sprite distorts everywhere at once.

**3. Transparent alpha, no baked ground shadow, anywhere.** `mkArt` builds the hit-flash variant by
filling the sprite's own silhouette with white via `source-in`. **Any baked background, matte or
solid glow becomes a white slab on every hit.** This applies to the graph-paper tabletop cards and
the notebook-paper cuts especially — key out the card stock at bake time.

**4. The catalog must agree.** `assets.html` is a hand-maintained public catalog of every sprite.
Add a card for each new key, then:

```bash
node tools/sync-assets.mjs          # reports drift, exits 1 — this runs in pre-push
node tools/sync-assets.mjs --fix    # rewrites stale data URIs in place
```

**5. The verification gate. Every commit, no exceptions:**

```bash
node tools/check.mjs index.html && node tools/smoke.mjs "$PWD/index.html"
```

`check.mjs` proves the single `<script>` block still parses — a missing comma there means ZERO
JavaScript runs while the title screen still paints, which reads as broken touch input and once
survived eleven commits. `smoke.mjs` proves it still RUNS and still responds to a START click.

**6. Push each verified commit.** Art that sits unpushed cannot be play-tested on the phone, and
play-testing on the glass is the only test that matters for readability.

**7. File size is a real constraint.** `index.html` is **753KB** today. This queue adds ~100 sprites.
Prefer WebP, prefer the smallest native size that survives the glass, and land DOM-only assets
(portraits, cards, war-room tokens) knowing they are shown larger and can afford more bytes than a
48px canvas blit can.

---

## 6. HONEST RISKS

**Text is the number-one failure mode.** `MOPTALITY` is nine letters and not a real word, so the
model has no prior to lean on — expect `MOPTAILTY`. `JANITORIAL VIOLENCE` is 19 characters that must
be legible inside a 374px glass. Six attempts are budgeted for MOPTALITY and five each for the
milestones, and **you should still be willing to reject all of them and keep the current
letter-spaced sans-serif, which is honestly not bad.** Everywhere a sign or placard is the joke —
`PORTION CONTROL`, `LV 14 PUDDING DECANT`, the four highway signs — the right answer is a blank
plate plus `cx.fillText`, exactly as the tanker already stencils PUDD-CO. **Two exceptions where
baked text is safe: the doodle-tier EXIT (wobble is the intent) and BIOCORE SOLUTIONZ (a mangled
result is indistinguishable from success).**

**The notebook tier is the hardest style to buy.** PixelLab is a pixel-art service being asked for
ballpoint linework on lined paper. `scr_doug`, `til_mall`, `scr_pretz` and the 16-object doodle
sheet will all plausibly come back as clean coloured pixel art — which silently breaks the
escalation gag that README calls canon. Defences, in order: pass the existing `scr_blob`/`scr_drone`
as style references, use `select_object_frames` to keep only what reads as biro, and `reduce_colors`
to two inks. **If all of it fails, CH.2's four Doug poses alone still fix the thinnest tier.**

**The side-scrollers have no tile engine.** CH.1/CH.2/warp draw one `fillRect` for the floor. The
three `create_sidescroller_tileset` buys (rows 65-67, 18 gens) are **wasted unless the ~15-line
scrolling strip loop lands first.** Build the loop, verify it with `til_lab`, then buy the other two.

**Three items are pure code cost wearing an art costume.** `glz_door`'s open state, `bloom_queen`
and `dg_brute` each need 25-70 lines of new game logic before the sprite has anywhere to stand. The
Torque/Vex dungeon rigs (rows 130-135, 92 gens) need a companion entity that does not exist at all.
**Generate Torque, look at her, and only then commit Vex's 30** — if `style_character_id` transfer
fails on one it fails on both.

**`kev_a` is 576x468, over `edit_image`'s 512 input ceiling.** The damage states must be downscaled
first, and above 128px output the tool returns one frame — so **cracked K.E.V.I.N. loses the 2-frame
chomp cycle.** A cracked vat that stops chewing is arguably better storytelling, but it is a change,
not a freebie. The 2-generation alternative (two pixflux img2img passes at 384px) keeps the chomp
and loses fidelity on the most-looked-at sprite in the game.

**Three items are probably better done in code for zero generations, and you should try that first:**
`wrp_doug` (a per-board hue-rotate filter is more convincing than anything the model will draw for
"slightly wrong"), `ec_chonky`/`ec_goo` (a 2px channel offset plus a hue rotate IS misregistration,
drawn correctly), and `wrp_door_twice` (blit the door twice at alpha .5 with a drifting offset —
creepier, and it animates).

**The band is a range and the 30s are a fiction.** 40 rows use 20-40 generation tools. At the top of
the band you run out around row 144. Fire WAVE 4 bottom-up-cuttable and check `get_balance` every
ten rows.

**And the largest risk is not artistic at all: it is that the art lands and the code does not.**
Every row above names its hook because a sprite with no call site is worse than no sprite — it costs
file size, it costs a catalog card, and it reports as progress. **One sprite, one commit, one gate,
one push.**
