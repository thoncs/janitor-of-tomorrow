# ROADMAP: Janitor of Tomorrow

Improvement plan for gameplay polish and story depth expansion. Organized by phase and priority.

---

## Phase 0: Audio-Visual Polish (Foundation)
**Goal:** Elevate production values first so all new content builds on a solid presentation foundation.

### Dynamic Audio
| Layer | Trigger | Implementation |
|-------|---------|----------------|
| **Ambient Base** | Always | Facility hum, distant machinery |
| **Combat Drums** | In battle | Adds intensity layer |
| **Goo Theme** | Goo zones | Slightly detuned, eerie |
| **Time Warp** | Timeline stability low | Pitch-shifted, glitchy |

### Visual Effects
| Effect | Trigger | Implementation |
|--------|---------|----------------|
| **Parallax Map** | Map screen | Facility blueprint with depth |
| **Flickering Lights** | Low timeline stability | Canvas filter modulation |
| **Goo Taint** | Goo zones | Green color overlay |
| **Screen Shake** | Explosions, heavy attacks | CSS transform |
| **Particles** | Hits, pickups | Canvas-based emitters |

### Technical Approach
- **Audio:** Base64-encoded WAV/MP3, Web Audio API for mixing
- **Visuals:** Canvas layers, CSS filters, sprite sheets
- **Compression:** LZMA for assets, runtime decompression

---

## Phase 1: World Map & Exploration System (Foundation)
**Goal:** Transform Operation: Floor Plan into a persistent world map/hub for non-linear navigation between all action boards. Enable backtracking to find missed collectibles and choose challenge order.

### Core Components
| Component | Implementation | Benefit |
|-----------|---------------|---------|
| **Facility Map UI** | Canvas-based overhead view of the vat facility with connected nodes | Visual navigation, clear progression |
| **Node System** | 8-10 navigable nodes: Core Vat (hub), CH.1-3, Taquito Grand Prix, Supply Dungeon, Upgrade Terminal, Boss Gates, Time Anomalies | Non-linear progression |
| **Backtracking** | Revisit cleared boards to find missed taquitos, weapons, lore notes; dynamic changes (new platforms, dialogue) | Replay value, completionist appeal |
| **Item Gating** | Keycards, Taco Truck, Golden Plunger unlock new connections | Progression depth |
| **Map State** | Fog of war, node status (locked/in progress/complete), objective waypoints | Player clarity |
| **Fast Travel** | Unlocks after 3 boards cleared; costs 5 taquitos (free to adjacent) | Quality of life |

### Integration Points
| System | Map Effect |
|--------|------------|
| **Trust Meters** | Glaze high trust: reveals hidden caches; low trust: contaminates nodes with random enemies |
| **Timeline Stability** | >80%: all paths open; 50-80%: random "time quakes" shuffle connections; <50%: some nodes inaccessible |
| **Collectibles** | Taquitos (currency), Lore Notes (20), Weapon Schematics (8), Keycards (5), Golden Taquitos (3) |

### New Content
| Node | Type | Unlock | Reward |
|------|------|--------|--------|
| Ventilation Shafts | Stealth platformer | Access panel in CH.2 | Hair Metal Guitar weapon |
| Custard Storage | Puzzle rooms | Beat CH.3 | Max health +1 |
| Time Warp Zone | CH.1 remix | Timeline stability 100% | Secret ending hint |

### Technical Notes
- State: `localStorage` for map progress, collected items
- Data: JSON structure for nodes, connections, unlock conditions
- Rendering: Canvas-based with pathfinding visualization

---

## Phase 2: Core Gameplay Refinement (High Impact, Low Effort)
**Goal:** Polish existing mechanics before adding new ones.

| Area | Action | Benefit |
|------|--------|---------|
| **Difficulty Curve** | Rebalance CH.1–3 boards with graduated challenge; add checkpoints mid-board | Smoother progression, less frustration |
| **Weapon Feedback** | Add screen shake, hit-stop, and particle effects to directional weapons (DOUBLE-NECK SHRED, etc.) | More satisfying combat |
| **Trust System** | Make companion trust meters affect gameplay (e.g., Glaze gives weapon buffs at high trust, sabotages at low) | Deeper integration of story and mechanics |
| **Score Attack** | Add leaderboard for Taquito Grand Prix and Custard Ascent | Replay incentive |

---

## Phase 3: Expanded Player Agency
**Goal:** Make choices matter more across the entire experience.

| Feature | Implementation | Story Impact |
|---------|---------------|--------------|
| **Branching Chapters** | Add 2–3 new story forks in CH.2 based on CH.1 choices (e.g., spare/destroy goo critters) | Creates divergent narratives |
| **Consequence Preview** | Show "Last seen: [location]" for companions when trust is low | Reinforces narrative weight |
| **Timeline Stability Events** | Random "time quake" events that force player to choose: fix stability or push forward | Risk/reward depth |
| **Item Carryover** | Let snacks and weapons persist between some chapters | Strategic planning |

---

## Phase 4: Story Depth Expansion
**Goal:** Richer world-building and character arcs.

| Addition | Details | Integration |
|----------|---------|-------------|
| **Companion Dialogue Trees** | Glaze and K.E.V.I.N. (pre-betrayal) comment on environments and choices | 10–15 new lines each, triggered by locations/actions |
| **Environmental Lore** | Add scavenged notes/terminals in Supply Dungeon and war room | Optional; rewards exploration |
| **K.E.V.I.N. Lore Drops** | During boss fight, expose backstory between phases | "I was built to... [REDACTED]" style |
| **Ending Variants** | Split 3 endings into 6: trust levels + key choices create nuanced outcomes | "True" ending requires specific path |
| **Character Bios** | Unlockable dossiers in pause menu after meeting characters | World-building without gameplay interruption |

---

## Phase 5: New Gameplay Systems
**Goal:** Add depth without scope creep.

| System | Description | Story Tie-in |
|--------|-------------|--------------|
| **Upgrade Shop** | Spend collected taquitos between chapters on: max health (+♥), weapon unlocks, timeline buffer | "Future tech black market" framing |
| **Time Anomalies** | Optional side areas in each chapter with unique challenges and lore | Expands world, optional for completionists |
| **Companion Abilities** | At high trust, companions trigger special moves (Glaze: donut shield, K.E.V.I.N. fragment: EMP burst) | Reinforces relationships |
| **New Game+** | Carry over upgrades, unlock secret dialogue and harder enemy variants | Rewards mastery |

---

## Phase 6: Polish & Quality of Life
**Goal:** Professional-grade feel.

- **Save System:** Browser localStorage with 3 slots
- **Tutorial Hints:** Optional toggles for controls, "Did you know?" tips
- **Audio Logs:** Collectible voice lines from future soldiers
- **Visual Novella Mode:** Skip to story scenes for lore-focused players
- **Accessibility:** Remappable controls, colorblind modes, text scaling

---

## Phase 7: NPC System & Side Quests
**Goal:** Populate the facility with characters and optional objectives.

### NPC Roster
| NPC | Role | Location | Quests |
|-----|------|----------|--------|
| **Marge** | Head Janitor | Core Vat | Clean 3 goo spills | +1 max ♥, Keycard upgrade |
| **Dr. Quark** | Scientist | CH.2 area | Retrieve 5 data pads | Unlocks Custard Storage early |
| **Rusty the Bot** | Maintenance | Supply Dungeon | Repair 3 terminals | Taco Truck fuel upgrade |
| **Goo King** | Faction Leader | Goo zones | Spare 10 critters | Goo allies in combat |
| **Sarge** | Future Soldier | War Room | Clear Time Anomalies | Timeline decay slower |

### Quest System
- **Journal:** Track active/completed quests with waypoints on map
- **Rewards:** Taquitos, weapons, permanent upgrades, faction reputation
- **Branching:** Some quests have multiple solutions (violent vs. diplomatic)

---

## Phase 8: Crafting & Inventory
**Goal:** Deepen progression with item combination and management.

### Crafting Stations
| Station | Location | Unlock Condition |
|---------|----------|------------------|
| **Janitor's Workbench** | Supply Closet | Start |
| **Future Forge** | CH.3 area | Beat CH.2 |
| **Goo Lab** | Supply Dungeon | Find Goo King |

### Recipe Examples
| Recipe | Ingredients | Result |
|--------|-------------|--------|
| CHONKY SMASHER | Mop + Hair Metal | AoE weapon |
| DOUBLE-BARREL SHRED | Taco Truck + Shred Schematic | Upgraded directional weapon |
| GOLDEN PLUNGER+ | 5 Goo Samples + Plunger | Pierces armor |

### Inventory System
- **10 slots** (expandable to 20 via upgrades)
- **Item persistence** across boards via world map
- **Puzzle integration:** Some doors/obstacles require specific items

---

## Phase 9: Dynamic World & Faction Reputation
**Goal:** Make the world feel alive with random events and deeper social systems.

### Dynamic Events (15% chance per map visit)
| Event | Condition | Effect |
|-------|-----------|--------|
| **Goo Outbreak** | Any goo zone | Extra enemies, bonus taquitos |
| **Time Rift** | Timeline stability <60% | Teleport to random cleared node |
| **Soldier Patrol** | Trust with Sarge >50% | Combat, drops Keycard |
| **Taquito Rain** | Trust with Glaze >75% | Free currency |
| **Vat Leak** | CH.2 cleared | New hazard zone, hidden boss |

### Faction Reputation System
| Faction | Gain Reputation | Max Reward | Min Penalty |
|---------|----------------|------------|-------------|
| **Future Soldiers** | Story missions, Time Anomalies | Sarge joins final battle | Soldiers attack on sight |
| **Goo Critters** | Spare goos, avoid spills | Goo allies in fights | Goos turn hostile |
| **Janitorial Union** | Clean spills, collect trash | +2 max ♥, faster mop | No cleaning bonuses |
| **K.E.V.I.N. Loyalists** | High trust pre-betrayal | Secret weapon | Early boss trigger |

---

## Phase 10: Achievement & Challenge System
**Goal:** Reward mastery and completionism.

### Achievement Categories
| Category | Count | Examples |
|----------|-------|----------|
| **Completion** | 10 | Clear all boards, 100% collectibles |
| **Speed** | 8 | CH.1 under 2 min, any no-hit |
| **Pacifist** | 5 | Beat boards without killing |
| **Hoarder** | 6 | Collect 50/100/200 taquitos |
| **Secret** | 12 | Hidden rooms, dev references |
| **Faction** | 10 | Max reputation with all factions |

**Rewards:** Golden Taquitos, permanent upgrades, New Game+ modes, cosmetic skins

### Challenge Modes
- **Iron Janitor:** No deaths, no continues
- **Minimalist:** Beat game with only starting weapon
- **Pacifist Run:** No kills (stuns only)
- **Speedrun:** Individual board and full game timers

---



## Prioritized Roadmap (Next 3 Months)

| Timeline | Focus | Deliverables |
|----------|-------|--------------|
| **Week 1–2** | Phase 0 | Dynamic audio layers, visual effects, Web Audio API setup |
| **Week 3–4** | Phase 0 | Parallax map, particles, canvas filters, compression optimization |
| **Week 5–6** | Phase 1 | Map UI, node system, basic navigation |
| **Week 7–8** | Phase 1 | Backtracking system, collectible persistence, fast travel |
| **Week 9–10** | Phase 1 | Item gating, trust/stability map effects, new boards |
| **Week 11–12** | Phase 2 | Difficulty rebalance, weapon feedback, trust gameplay integration |
| **Week 13–14** | Phase 3 | Branching chapters, trust consequences, timeline stability events |
| **Week 15–16** | Phase 4 | Companion dialogue, lore collectibles, K.E.V.I.N. backstory |
| **Week 17–18** | Phase 5 | Upgrade shop, time anomalies, companion abilities |
| **Week 19–20** | Phase 6 | Core QOL: save system, tutorial, accessibility |
| **Week 21–22** | Phase 7 | NPC system, side quests, journal with waypoints |
| **Week 23–24** | Phase 8 | Crafting stations, inventory system, item persistence |
| **Week 25–26** | Phase 9 | Dynamic events, faction reputation, social consequences |
| **Week 27–28** | Phase 10 | Achievement system, challenge modes, rewards |

---

## Design Principles

1. **Tone:** "Big dumb fun" stays central; depth enhances, doesn't replace
2. **Constraint:** All additions must work within single HTML file structure
3. **Scope:** Each feature should be completable in 1–2 week sprints
4. **Testing:** Balance changes need player feedback loops
5. **Modular:** Features should be independently testable

---

## Tracking

- [ ] Phase 0: Audio-Visual Polish
- [ ] Phase 1: World Map & Exploration System
- [ ] Phase 2: Core Gameplay Refinement
- [ ] Phase 3: Expanded Player Agency  
- [ ] Phase 4: Story Depth Expansion
- [ ] Phase 5: New Gameplay Systems
- [ ] Phase 6: Polish & Quality of Life
- [ ] Phase 7: NPC System & Side Quests
- [ ] Phase 8: Crafting & Inventory
- [ ] Phase 9: Dynamic World & Faction Reputation
- [ ] Phase 10: Achievement & Challenge System

---

*Last updated: 2026-08-15*