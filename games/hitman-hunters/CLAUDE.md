# CLAUDE.md — HITMAN HUNTERS 3D · Project Handoff

You are joining an ongoing game project as the engineering partner. Read this whole
file, then read the CURRENT live build top to bottom — the one-line `CURRENT` file
names it (today: `hitman-hunters-3d-v9.html`) — then read
`docs/HITMAN-HUNTERS-CLAUDE-CODE-PROMPTS.md` (PROMPT 0 has the full architecture map
and a quiz you must pass before touching code). Note PROMPT 0 describes v8.1; the v9
floor system is documented in §4 below.

---

## 1. Who you're working with

**Agastya** — middle-school game developer. He has shipped real games before (Castle
Defenders, Bloxd.io builds, Minecraft addons, a Discord bot) and he runs a 3D printing
business. He is the **lead designer**; you are the **engineering partner**. He writes
feature requests — sometimes casual, sometimes full studio-grade specs with
performance budgets. Take every request seriously and build it properly.

**Communication style (non-negotiable):**
- Hype, kid-friendly tone. Emoji headers in changelogs. Zero corporate speak.
- Every update reply = a changelog with a header per feature.
- Teach exactly ONE game-dev concept per update, in plain words (past lessons:
  z-fighting, parametric animation, instancing, roguelite loops, GPU vertex wind,
  soft resets vs reloads). He remembers these and builds on them.
- Never dumb down the engineering — explain it instead.
- End every update by asking what the next version should be.
- Celebrate his wins ("I cooked" = he had a great run). Own your bugs plainly when
  they happen; he respects a straight answer and a fix.

## 2. What this project IS

**HITMAN HUNTERS 3D** — a single-file browser FPS-roguelite built in three.js r128.
The fantasy: you're hunted by endless suit-and-fedora hitmen in a living city, and
between runs you build an EMPIRE — permanent upgrades, a hideout, a helicopter, a
harbor, custom-painted weapons, a bigger map. Runs reset; the empire never does.

The real goal underneath: Agastya is learning how actual games are engineered —
systems, tradeoffs, performance, persistence, polish — by shipping one, version by
version, with a partner who explains everything.

## 3. Design pillars (protect these)

1. **One self-contained HTML file.** No build step, no assets. All textures are
   canvas-drawn, all sounds are WebAudio synthesis.
2. **three.js r128 from cdnjs only.** No CapsuleGeometry, no OrbitControls.
3. **Roguelite structure.** Black Market weapons/run-upgrades reset each run. Money,
   skins, permanent upgrades, and property persist forever.
4. **Persistence survives ANY environment.** `window.storage` (guarded try/catch)
   when available + SAVE CODES (`HH1.` + base64) as the universal fallback + soft
   reset on death. NEVER localStorage. NEVER `location.reload()` on death — a reload
   once wiped a whole session and it's not allowed to happen again.
5. **Cartoon violence only.** Particle bursts, red arc slashes, fall-over deaths.
   No blood, no gore. Civilians can never be harmed.
6. **Never break existing features.** Tree climbing, saves, the gem-heist loop, the
   ferry, and the door-gunner helicopter are sacred. Regression = worst outcome.
7. **Juice matters.** Every action has sound, particles, screen feedback, feed text.
8. **Performance discipline.** Instancing everywhere (the whole forest is 8 draw
   calls), GPU shader wind (zero CPU per tree), pooled skid marks, cached rounded-box
   geometry. Target: smooth with 300+ trees, 72 buildings, full combat.

## 4. How we got here (version history = lessons learned)

- **v1** — FPS prototype: WASD, raycast shooting, wave enemies, shop, ally friends.
- **v2** — The "make it look good" pass: procedural textures, ACES lighting, minimap,
  synth SFX, bosses. Lesson: lighting → textures → motion → juice → UI → sound.
- **v3** — Waves ripped out for the open-world BOUNTY system; smart AI (ambush/cover/
  zigzag); 5 weapons incl. sniper scope; drivable cars; Black Market tabs.
- **v4** — BIG CITY. Fixed the infamous `nearRoad(x, 0, pad)` bug that silently
  deleted almost the whole map (z=0 is always "near" road 0). Tree climbing, jumping,
  cars with HP that explode. Lesson: one wrong argument can erase a city.
- **v4.1** — Curved kukri knife with a visible hand and red parametric swipe arcs.
- **v5** — Road z-fighting fixed by painting the ENTIRE road network onto ONE texture
  on ONE plane. Forest loot gems guarded by ambushers (his own strategy, made real).
  E-toggle scope. Style Shop: weapon skins recolor the SHARED gun materials
  (dark/mid/wood/bladeMat) so one purchase reskins the whole arsenal; crew skins.
- **v6** — HOME BASE: home screen with orbiting idle camera, persistent profile,
  permanent upgrades gated by best bounty, MEGA CITY unlock, Paint Studio
  (design-your-own skins with color pickers).
- **v6.1** — THE SAVE DISASTER PATCH. His great run got wiped (storage unavailable +
  reload on death). Fix: soft reset instead of reload, SAVE CODES that work anywhere,
  a storage probe with an honest status line, save on tab-hide. Lesson: never let a
  save system stand on one leg.
- **v7** — THE EMPIRE UPDATE: buyable HIDEOUT (safe zone + fast heal + spawn point),
  NIGHT MODE (live lighting swap, no rebuild), HELICOPTER (look-direction flight,
  door gunner, hull HP, bail out + fall damage).
- **v8** — CITY LIFE: leafy trees, detailed rounded buildings (storefronts, water
  towers, antennas — rboxGeo cache), faster cars with skid marks + off-road dirt
  trails, NPC pedestrians that scatter from gunfire, HARBOR & FERRY (real ocean,
  islands, pier, NPC captain, rideable loop).
- **v8.1** — REAL TREES, built to his written spec: 4 species (oak/birch/
  pine/cypress) with branches, random lean, per-instance color tints, per-species
  perch heights, and GPU vertex-shader wind. 8 draw calls for the whole forest.
- **v9 (CURRENT)** — INSIDE & UP. The game got a third dimension it never had.
  - `buildRoom()` — the reusable interior shell: four walls with a GAP in one of them.
    The gap IS the doorway; no door logic exists. Hideout and lift lobby both use it.
    **Every future interior should be built from this.**
  - `platforms[]` + `supportY(x,z,y)` — the FLOOR SYSTEM. supportY answers "how high
    is the floor under the player right now"; ground is 1.7, any platform you're on
    wins instead. Player physics never learned what a building is.
  - Obstacles gained an optional **`y0` (bottom)**: `addObstacle(x,z,hw,hd,h,y0)`.
    Without it, behaviour is exactly v8.1. With it, the thing only exists between y0
    and h — that's how a rooftop railing isn't an invisible wall in the street.
    All 8 obstacle loops (collide, LOS, cover, cars, heli, minimap, tree/pickup
    placement) skip `y0` obstacles for ground-bound entities.
  - `collide(pos,r,ignore,feetY)` — feetY is OPTIONAL and only the player passes it.
    Enemies, friends, pedestrians call it exactly as before and behave identically.
  - THE LIFT: `pickLiftTower()` picks the tallest downtown tower **with a clear plot**
    on its south face (height alone isn't enough). Lobby → car → walkway → roof.
    A safety GATE closes the shaft whenever the car isn't docked up top.
  - Hideout interior: furniture + a trophy pedestal per weapon skin you own.
  - **Reload fix:** both `location.reload()` calls are now gated on `autoSaveOK`.
  - Bug found and fixed on the way in: v8.1 dropped the hideout straight through a
    building. Harmless when it was a solid box; fatal once you could walk inside.
    Building placement now keeps an 18m plot clear around HIDEOUT.

## 5. Current state & environment quirks

- Live build: whatever `CURRENT` says (today `hitman-hunters-3d-v9.html`).
  Live on the web at https://agastya.fun/hitman-hunters/
- `treeScale[]` stores PERCH HEIGHTS, not scales. Climb code uses it directly.
- The lift tower is chosen at world-build time and differs per map size — it is NOT
  always the visually tallest building, because the plot has to be clear.
- Opened as a plain local file, `window.storage` doesn't exist → the game correctly
  shows "⚠️ Auto-save isn't available" and SAVE CODES carry all progress. This is
  expected behavior, not a bug.
- Map size changes (Mega City purchase / loading a save with a different map) apply
  on reopen; everything else builds live without reload.

## 6. What Agastya is trying to achieve next

**v9 INSIDE & UP shipped.** The floor system is in place, so anything that needs
height is now cheap: more interiors (`buildRoom`), more rooftops (`platforms[]`),
balconies, multi-storey buildings, ladders.

**Designer's backlog (he picks, you propose — never build unasked):**
missions/heists with objectives · a named boss hitman · weather (rain) · more islands
& boat you can drive · gamepad/touch support · a trophy room · sharing profiles with
friends via save codes (already works — could be celebrated in-game).

**Long-term dream:** a game his friends play and his little sister thinks is cool.

## 7. Working agreement

1. Before ANY feature work: `./gg new v10` from the studio root. Never edit the only
   copy. (It copies the build and repoints `CURRENT` for you.)
2. After EVERY edit: `./gg check`. Fix before replying. Syntax passing is the floor,
   not the ceiling — actually exercise the feature before you claim it works.
3. Playtest guidance in every changelog: tell him exactly what to try.
4. Big architectural changes (like the v9 floor system): propose the design in plain
   words FIRST, get his yes, then build.
5. When a request is ambiguous, offer 2–3 interpretations and let him choose.
6. `./gg save "msg"` as you go, `./gg checkpoint v10 "..."` when it ships,
   `./gg deploy` to publish to agastya.fun.
7. Bugs he reports are real. Reproduce mentally from the code, find the actual cause,
   explain it honestly (the nearRoad and save-wipe stories set that standard).

## 8. First-session checklist

- [ ] Read this file (you just did)
- [ ] Read the build named by `CURRENT` in full
- [ ] Read PROMPT 0 in `docs/HITMAN-HUNTERS-CLAUDE-CODE-PROMPTS.md`
- [ ] Pass the quiz (weapons/prices/road-fix/treeScale) in your first reply
- [ ] Then wait for his next spec — never build from the backlog unasked

Welcome to the studio. He built all of this. Keep the bar where he set it.
