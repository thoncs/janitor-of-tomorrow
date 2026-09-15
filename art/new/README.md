# New art — PixelLab batch, 2026-09-14

Raw generated art, staged here **deliberately unintegrated**, and drawn down one sprite at a time as
the code that uses it gets written.

**Landed so far:** `chars/puddco_guard/` → `ART.pg_idle` + `ART.pg_walk`, the Supply Dungeon's
security guard. Everything else in this folder is still staged.

## Why this is staged and not merged

`ROADMAP.md` records what happens when assets and systems land ahead of the code that uses them — a
`ParticleEmitter` that was never instantiated, sitting next to four working particle pools. A sprite
added to the `ART` block that nothing draws is the same mistake in cheaper form: it inflates the one
file the whole game parses, and it reads as "done" in the catalog while changing nothing on screen.

So each sprite should move into `ART` **together with the draw code that uses it**, one at a time,
behind the usual gate:

```bash
node tools/check.mjs index.html && node tools/smoke.mjs "$PWD/index.html"
```

Then `node tools/sync-assets.mjs --fix` to add its card to `assets.html`, which is checked in
`pre-push`.

## Preview

```bash
node tools/contact-sheet.mjs > art/new/CONTACT_SHEET.html
```

Renders everything below at 3× nearest-neighbour with native sizes, so a sprite that fails at
gameplay scale is obvious before it reaches the game.

## Character sheets — `chars/`

Generated at 64px, 8 directions, `low top-down`, which is the Supply Dungeon's camera. Each sheet is
**512×576**: row 0 is the 8 rotations, rows 1–8 are a 4-frame walk per direction.

This matches the existing dungeon rig exactly — `dd_idle` is 512×64 (8 rotations) and `dd_walk` is
256×512 (4 frames × 8 directions). Slicing row 0 and rows 1–8 out of these sheets yields those two
shapes with no resampling.

(The goo rig is the same two shapes but only ever uses the walk sheet — `gd_idle` was deleted as
dead weight once nothing was found to read it.)

`slice-character.mjs` does this repack and asserts the direction order rather than trusting it:

```bash
node tools/slice-character.mjs art/new/chars/puddco_guard guard
cwebp -lossless -z 9 -alpha_filter best guard_walk.png -o guard_walk.webp
node tools/import-sprite.mjs --after dd_idle pg_walk=art/new/chars/puddco_guard/guard_walk.webp
```

| Sheet | Who | Intended use |
|---|---|---|
| `puddco_guard/` | PUDD-CO security guard, navy uniform, baton | **Landed** — dungeon enemy, `ART.pg_*` |
| `custard_cultist/` | Hooded cultist, yellow robe | Dungeon enemy, Project Custard faction |
| `rival_janitor/` | Grey coveralls, sunglasses, push broom | NPC or rival encounter |

## Sprites & props

| File | Size | Intended use |
|---|---|---|
| `taquito.png` | 64×56 | Currency pickup |
| `nachos.png` | 64×64 | Snack health pickup |
| `energy_drink.png` | 48×64 | Powerup |
| `custard_can.png` | 48×72 | Hazard / objective prop |
| `lore_disk.png` | 56×56 | Collectible lore note |
| `plunger_red.png` | 64×80 | The GOLDEN PLUNGER — see note below |
| `mop_bucket.png` | 64×64 | Prop / pickup |
| `guitar.png` | 96×64 | Hair-metal weapon system |
| `amp.png` | 64×80 | Hair-metal weapon system |
| `vending_machine.png` | 80×128 | Set dressing, mall boards |
| `freight_elevator.png` | 128×128 | SUMMON: FREIGHT ELEVATOR, tabletop finale |
| `die_d20.png` | 64×64 | Tabletop finale |
| `die_d6.png` | 64×64 | Spare — came back d6 when a d20 was asked for |
| `goo_brute.png` | 104×104 | Heavy goo tier |
| `boss_mech.png` | 200×160 | Boss — see note below |
| `race_monster_truck.png` | 160×112 | Grand Prix opponent (rear view) |
| `race_muscle_car.png` | 160×112 | Grand Prix opponent (rear view) |
| `icecream_van_rear.png` | 160×112 | Oncoming traffic — see note below |
| `scr_donut_drone.png` | 80×80 | Custard Ascent enemy |
| `scr_bomber.png` | 96×88 | Custard Ascent enemy |
| `scr_eclair.png` | 72×40 | Projectile |
| `port_guard.png` | 128×128 | Pause-menu dossier portrait |
| `port_rival.png` | 128×128 | Pause-menu dossier portrait |
| `port_cultist.png` | 128×128 | Pause-menu dossier portrait |

Portraits are 128×128 to match the existing `port_doug` / `port_torq` / `port_vex`.

## Tilesets — `tilesets/`

| File | Size | Notes |
|---|---|---|
| `mall_floor.png` | 128×128 | 16 wang tiles @32px, cracked mall ceramic with custard creeping over the top edge. `.json` carries the edge-matching data. |

128×128 is the same footprint as the existing `dtiles` atlas, but the **tile layout is wang-style and
does not match `dtiles`' indexing** — using it means reading `mall_floor.json` for edge matching, not
swapping the atlas.

## Honest notes on what came back

- **`plunger_red.png` is red, not gold.** The gold attempts lost the plunger silhouette and read as a
  trophy or lamp, which kills the joke. The red one is the better *plunger*; tint it at draw time if
  the GOLDEN PLUNGER needs to be gold. Two generations were spent confirming this.
- **`boss_mech.png` is a mech, not a vacuum.** Asked for a giant robot vacuum cleaner; got a good
  generic mech boss with a red core. Kept because it works as a boss, not because it matched.
- **`icecream_van_rear.png` faces the camera**, not away. It is filed as oncoming traffic rather than
  a Grand Prix opponent, which needs a rear view.
- **`die_d6.png`** is the first d20 attempt. `die_d20.png` is the re-roll and reads as polyhedral,
  though the face count is not literally 20.

## Prompt notes for next time

- Simple, shape-explicit prompts beat evocative ones. "toilet plunger standing upright, red rubber
  suction cup, long wooden handle" worked; "golden plunger, ornate jeweled handle" produced a pillar.
- Rear-view vehicles need the framing named: "back of X driving away, rear doors, taillights". Saying
  "seen from behind" alone returned side and front views about half the time.
- `text_guidance_scale` 12–14 noticeably helps when the shape matters more than the mood.
- img2img recolour is unreliable for palette swaps — `init_image_strength` 260 preserved the original
  colours along with the shape. Recolour in code instead.
- The concurrent job cap is **8**. An 8-direction animation reserves all 8, so animations run one at
  a time and cannot overlap with image jobs.
