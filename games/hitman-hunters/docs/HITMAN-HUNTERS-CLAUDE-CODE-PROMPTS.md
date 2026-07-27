# HITMAN HUNTERS 3D — Claude Code Prompt Pack (v8.1 "REAL TREES")

Two ways to get the game into a new Claude Code session:

- **PATH A — EXACT (recommended):** Copy `hitman-hunters-3d-v8-1.html` into your project folder, then paste **PROMPT 0**. This is the only way to get *the exact game to the finest detail*, because the file IS the finest detail. This is how real studios do it — you hand over the code, not a description of the code.
- **PATH B — REBUILD FROM SCRATCH:** No file, just prompts 1→9 in order, one message each, playtest between prompts. You'll get a ~95% identical twin (all the same systems, numbers, and feel — tiny generated details may differ).

Paste the **GOLDEN RULES** block at the start of the session either way.

---

## GOLDEN RULES (paste once, first message of the session)

```
You are my game-dev partner on HITMAN HUNTERS 3D, a single-file browser game. Non-negotiable engineering rules for this whole session:

1. ONE self-contained HTML file. No build step, no assets, no external files.
2. three.js r128 ONLY, loaded from: https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js
   r128 gotchas: NO CapsuleGeometry, NO OrbitControls import — never use them.
3. NEVER use localStorage/sessionStorage/IndexedDB. Persistence uses the artifact
   storage API `window.storage.get/set` guarded with try/catch, PLUS text "save codes"
   as a universal fallback. The game must run fine when no storage exists.
4. All textures are procedural (canvas-drawn). All sounds are synthesized with
   WebAudio oscillators/noise — no audio files.
5. Violence stays cartoon-stylized: colored particle bursts, fall-over deaths,
   red arc slashes. No blood pools, no gore, no dismemberment.
6. Kid-friendly, hype tone in all UI text and changelogs (emoji encouraged).
7. Versioning workflow: before each feature update, copy the current file to a new
   name (v9, v9-1, ...). Edit the copy. Never destroy a working version.
8. After EVERY edit: extract the <script> and run `node --check` on it. Fix before replying.
9. Every reply to me = a short changelog with headers per feature, ONE game-dev
   concept taught in plain words, and ends by asking what the next version should be.
10. Never break an existing feature to add a new one. Tree climbing, saves, and the
    roguelite loop are sacred.
```

---

# PATH A — PROMPT 0: Exact handoff (file present in folder)

```
The file hitman-hunters-3d-v8-1.html in this folder is the CURRENT LIVE BUILD of my
game HITMAN HUNTERS 3D v8.1. Read the ENTIRE file top to bottom before doing anything.
Do not rewrite it, do not "clean it up", do not change any behavior. Your job is to
maintain and extend THIS exact build.

Architecture map (the file is organized in this order — learn it):
1. CSS: HUD pills, hp bars, weapon bar, shop modals (#shopcard gold, #skincard purple),
   home screen (#overlay) with stat cards, panels (upgrades/paint/map/save), CAUGHT flash.
2. HTML: HUD elements, minimap canvas, Black Market + Style Shop modals, home screen.
3. JS sections, in order:
   - PROFILE/SAVE: defaultProfile(), window.storage load/save with 800ms debounced
     markDirty(), probeStorage(), save codes 'HH1.'+base64 encode/decode.
   - GLOBALS: MAP/ROADS/FORESTS/LAKE chosen at boot; HIDEOUT{-45,-58,r14},
     HELIPAD{52,-40}, DOCKZ=-30; obstacles/treePos/treeScale(=perch heights)/cars/
     wallRefs/peds/waveStripes/skids.
   - RENDERER: ACES tonemap, sRGB, PCF shadows; day+night sky textures on one skyMat;
     sun + hemi + sunGlow + moonGlow; canvasTex() helper; facadeTex() with storefronts.
   - SOUND: sfx object, all WebAudio synth (tone(), noiseBurst()); shared engine osc.
   - WEAPONS table + state + bountyLv()=min(5,1+floor(kills/8)) + dmgMul/rateMul/luck
     + earn()/spend() wrappers (they call markDirty).
   - SKINS: WEAPON_SKINS recolor the SHARED gun materials dark/mid/wood/bladeMat
     (that's why one skin recolors every gun); FRIEND_SKINS recolor userData.mats;
     custom skins from profile.customW/customF registered at boot.
   - GUN MODELS incl. the curved kukri knife (THREE.Shape extrude, phong blade) with
     red RingGeometry swipe arcs driven by knifeState{t,dir}, SW_DUR=.22, alternating.
   - makePerson(opt): blocky people; opt.unarmed for civilians/captain;
     userData.parts for leg animation, userData.mats/capM for reskinning.
   - WORLD (initWorld): grass, ONE-texture road network overlay (z-fighting fix),
     rounded buildings via rboxGeo() cache + storefront awnings + parapets + water
     towers/antennas, LAKE, 4-species instanced trees with GPU wind (windify()),
     lamps + night glow pools, walls (wallRefs so harbor can carve a gap), plazas,
     hideout/helipad/harbor if owned, spawnPeds(), cars from carSpots, crates/meds.
   - CARS: accel 22, clamp -10..38, hp 320, explode at 0, skid marks (black on-road,
     tan off-road + dust), MPH = |speed|*3.5.
   - HIDEOUT/NIGHT/HELI section: playerSafe(), buildHideout(), applyNight(on) live
     lighting swap, buildHelipad/spawnHeli, enterHeli/exitHeli/explodeHeli,
     updateHeli (look-direction flight, alt 0-60, door-gunner shooting, fall damage).
   - SKIDS/PEDS/HARBOR: dropSkid pool 260, pedestrians that scatter from gunfire,
     buildHarbor (east wall gap at DOCKZ, ocean, islands, pier, ferry with captain),
     updateFerry waypoint loop, boarding via F while docked.
   - ENTITIES: spawnEnemy(forcePos,forceAmbush) — elites at bounty>=3 14%;
     forest loot gem (150, 2 max, 40s) spawns 3 tree ambush guards within 30.
   - AI: states ambush/chase/seekcover/cover with 2.2s peek cycles; hit chances
     .62 ground / .35 tree / .5 car / .18-.4 heli / .45 ferry; safe zone blocks all.
   - LOOP: tick() renders always (home screen = orbiting idle camera), update() only
     in-run; branch order flying > driving > riding > climbing > on-foot.
   - DEATH: gameOver() saves profile then resetRun() SOFT reset — never location.reload.
   - HOME: refreshHome() renders stats, permanent upgrades (bounty-gated), Paint
     Studio (custom skins, weapon 400 / crew 300), MAP & PROPERTY (mega 1500 ★★,
     hideout 800, night 600, harbor 1200 ★★, heli 2000 ★★★), save panel.
   - BOOT: async — load profile, pick map size, build world, apply skins/night, probe
     storage, start tick.

Confirm you've read it by listing: (a) the five weapon names with damage numbers,
(b) the five MAP & PROPERTY purchases with prices, (c) the function that prevents
z-fighting on roads, and (d) what treeScale actually stores in v8.1. Then wait for
my next feature request. Follow the GOLDEN RULES for all future edits.
```

---

# PATH B — Rebuild from scratch (prompts 1→9)

Run in order. Playtest after each. Keep every number exactly as written.

## PROMPT 1 — Foundation: renderer, sky, sound, weapons data

```
Create hitman-hunters.html — a single-file three.js r128 FPS called HITMAN HUNTERS 3D.
This prompt is foundations only (no gameplay yet):

RENDERER: antialias, pixelRatio min(devicePixelRatio,2), PCFSoft shadows, sRGB output,
ACESFilmic tonemapping exposure 1.12. Fog 0xc3ddf0 from 110. Camera fov 75.
canvasTex(w,h,drawFn) helper returning sRGB CanvasTexture.

SKY: one sky sphere (r=1000, BackSide, fog:false) with a swappable material skyMat.
Day texture: vertical gradient #2f6fce → #7db4e6 → #cfe4f2 → #f4e6c8.
Night texture (build now, use later): #050914 → #0a1430 → #141a33 with 240 star pixels.
Lights: hemi (0xcfe8ff/0x3e5a34, .75) named `hemi`; directional sun 0xffe6b3 1.15 at
(170,220,100) with 2048 shadow map; sunGlow disc at (480,360,260); hidden moonGlow disc
r14 at (-420,380,-240).

SOUND: no files. audio() lazily creates AudioContext. tone(freq,dur,type,vol,slide) and
noiseBurst(dur,vol,highpass). Build an sfx object with: pistol, shotgun, smg, sniper,
knife, reload(2-click), enemyShoot, hit(1200 blip), kill(2 rising triangles), coin
(1046→1568 sine), buy(4-note 523/659/784/1046 arpeggio), hurt(140 saw), heal, alert,
bounty(2 low saws), thud, boom(.5s noise+48Hz saw), clang, climb, door.

WEAPONS table (exact):
knife  dmg 60 delay .42 melee range 2.7 — free
pistol dmg 25 delay .30 mag 12 reload 1.1 spread .012 — free
shotgun dmg 13 x7 pellets delay .85 mag 6 reload 1.9 spread .075 — cost 250
smg    dmg 11 delay .09 mag 32 reload 1.6 spread .032 AUTO — cost 450
sniper dmg 160 delay 1.4 mag 5 reload 2.3 spread 0 zoom(fov 22) — cost 700
Crits: 15% chance, x1.8. Run damage multiplier 1.15^(level-1). Fire-rate .9^(level-1).

HUD skeleton (hidden until body has class "playing"): top pills 💰/🚨 bounty stars/🤝/💀,
center ◎ crosshair + ✕ hitmark, bottom hp bar (green→red under 35%), car/heli hull bar
(hidden), weapon slots 1-5 bottom-right, msg banner, hint bar, kill feed (max 4), 150px
minimap canvas top-right, red vignette damage flash, sniper scope overlay (radial black
mask + crosshair lines).
```

## PROMPT 2 — World generation

```
Build the world in an initWorld() function (globals MAP/ROADS/FORESTS/LAKE are set
BEFORE it runs — default MAP=150, ROADS=[-80,0,80], one forest {x0:50,x1:MAP-8,
z0:-(MAP-8),z1:-50}, LAKE at (round(MAP*.62), -round(MAP*.62)) r 22).

ROADS — CRITICAL TECHNIQUE: paint the ENTIRE road network onto ONE 2048px canvas
texture on ONE transparent plane at y=.05 with polygonOffset(-2,-2). Never stack
road planes (z-fighting). Sidewalk strips 20m wide #9aa0a6, asphalt 12m #3a3f46,
14000 wear speckles, dashed #e8d44d center lines every 11m that SKIP intersections.
nearRoad(x,z,pad) checks both axes.

BUILDINGS: rboxGeo(w,h,d,r) helper — rounded-rect THREE.Shape extruded with bevel
.09 x2 segments, rotated upright, CACHED by size key. 42 buildings (72 on mega map):
downtown = |x|,|z| < MAP*.46 (bigger, some glass towers 18-44 tall, 40% glass).
facadeTex(base,floors,cols,glass,awning): window grid with lit windows (45% glass /
26% normal), white sills, brick noise, and for 60% of non-glass buildings a ground
floor STOREFRONT: big glass band, dark door, striped colored awning from
['#c0392b','#2471a3','#1e8449','#b7950b','#7d3c98']. Texture wrap Repeat with
repeat.set(1/w, 1/h) so windows wrap the rounded walls. Materials [roofM, facade].
Every building: parapet lip (rbox w+.5 x .4) on the roof. 45% get a rounded AC unit;
h>8 → 30% water tower (4 legs + tank + cone cap); else h>14 → 35% antenna with
red emissive tip. Buildings register axis-aligned obstacles {x,z,hw,hd,h}.

TREES — 4 species, 8 draw calls total, all InstancedMesh, deterministic via
hash(i,k)=(((i+7)*k)%97)/97:
types: r<.35 OAK, <.6 BIRCH, <.85 PINE, else CYPRESS.
Shared tapered trunk cylinder(.26,.5,3.8,7) with per-species xz/y scale
[1,1]/[.62,1.25]/[.9,1]/[.7,1.2] and per-instance trunk colors via setColorAt:
0x5e3d23 / 0xbfb49e pale birch / 0x4e3016 / 0x6a4a2a (±.05 lightness jitter).
Every tree: random LEAN (Euler ±.08 rad on x and z) + random yaw; the ENTIRE tree
(trunk, branches, canopy) shares one lean quaternion — rotate each part's local
offset through it so the tree leans as one piece.
OAK: 3 sphere blobs (r 1.9/1.4/1.15) at offsets [0,4.9,0],[~.95,5.6,.4],[~-.85,5.25,
-.55] with jitter, scales [1.25,1,1.25]/[.85,.8,.85]/[.75,.72,.75] × s, greens
0x3e7c3f/0x4f9350/0x2f6a35 (±.09 jitter), TWO branches. BIRCH: smaller higher blobs,
yellow-greens 0x7fae4e/0x93c25e/0x6a9a40, ONE branch. PINE: THREE offset cones
(2.1x4.2 / 1.55x3.1 / 1.0x2.0), colors 0x2d6a4f/0x40916c/0x235743. CYPRESS: columnar
stretched blobs scales like [.6,1.7,.6], deep greens 0x2c5f3a/0x35704a/0x244f30.
Branches: cylinder(.07,.13,1.7) with pivot moved to its base, random azimuth + ~.95rad
outward tilt, attached at trunk y≈2.3.
Per-tree size s = .85 + hash(i,37)*.45. Store a PERCH HEIGHT per tree in treeScale[]:
pine 6.6+1.1s, oak 6.6+.9s, birch 7.2+.8s, cypress 7.9+.9s.
GPU WIND: windify(mat,strength) uses onBeforeCompile to inject into begin_vertex:
wpos = instanceMatrix*vec4(transformed,1); transformed.x += sin(uTime*1.7+wpos.x*.13+
wpos.z*.11)*uStr; transformed.z += cos(uTime*1.1+wpos.z*.17+wpos.x*.09)*uStr*.7;
shared uniform windU updated to elapsed time each frame; strengths blobs .10/.14/.12,
pines .05/.06/.08; set customProgramCacheKey so materials share one program.
Trees register skinny obstacles (hw .55, h 3) and their [x,z] in treePos.

ALSO: tiled grass ground (speckled 512 canvas), lake circle, streetlamps every 80m
along roads (instanced poles + shared emissive head material lampHeadM) each with a
hidden additive glow circle r3.4 at y.08 pushed into lampGlows[], boundary walls at
±MAP stored in wallRefs[{mesh,obs,x,z}], drifting cloud blobs, and two shop plazas:
BLACK MARKET gold pad+ring+spinning sign at (20,20), STYLE SHOP purple set at (-26,-26).
```

## PROMPT 3 — Player, weapons in hand, climbing

```
PLAYER: pos y 1.7, radius .55, yaw/pitch pointer-lock mouselook (sens .0023, .0009
zoomed). WASD, Shift sprint x1.55, speed 8.6, head-bob. SPACE = jump (vy 5.8, gravity
14) OR climb a tree when within 1.9 of a trunk: lerp up to that tree's stored perch
height (treeScale[i]), locked until SPACE drops you. Landing with vy < -13 deals fall
damage (|vy|-13)*5 with thud + red flash. Circle-vs-AABB collide() against obstacles,
clamp to ±(MAP-2).

VIEWMODEL: shared gun materials — const dark(0x23272e), mid(0x3b414b), wood(0x5b4636),
and bladeMat (phong 0xdfe6ec shininess 120 specular 0xaad4ff). Build 5 models:
pistol/shotgun(double barrel)/smg/sniper(with scope tube) from boxes+cylinders, and the
KNIFE: a curved kukri blade drawn as a THREE.Shape (hooked silhouette, tip curving
inward) extruded .022 with bevel, plus a visible gripping hand (skin 0xd9a066 palm,
4 knuckle cubes, angled thumb, sleeve cube). Weapon slot keys 1-5, R reload, recoil
kick + muzzle flash plane + point light, idle sway.

KNIFE ATTACK: one parametric timer knifeState{t,dir}, SW_DUR .22, direction alternates
every swing. During swing, drive position/rotation with sin-eased t AND show two
additive RingGeometry arcs attached to the camera (outer .5-.92 color 0xff2d20, core
.62-.8 color 0xff9c92, renderOrder 999, depthTest false) that sweep, scale 0.9→1.3,
and fade. Hits: enemies within range 2.7 and facing dot > .6 — spawn crossing red slash
tracers + red burst on the victim.

SHOOTING: raycast from player.pos along camera dir vs enemy Box3s. Yellow tracers
(cyan for sniper), impact sparks, floating damage numbers (orange, bigger red for
crits), ✕ hitmark flash, kill feed entries. Auto weapons fire while mouse held.
Sniper zoom: right-click HOLD and E toggles (fov 22 + scope overlay + slow walk .45).
Out of ammo auto-reloads.
```

## PROMPT 4 — Enemies, bounty system, AI

```
No waves — an open-world BOUNTY system: bountyLv() = min(5, 1 + floor(kills/8)).
HUD shows ★★☆☆☆. Each new level: alarm sfx + "🚨 BOUNTY LEVEL X" banner.

ENEMIES: blocky suit guys (black suits, red ties, fedoras, shades) via makePerson()
(userData.parts for walk animation; death = fall over rotation, sink, remove).
spawnEnemy(forcePos, forceAmbush): cap 3+bounty*2, interval max(1.6, 4.5-.5*bounty),
spawn 60-110m away clamped in-map. HP (52 base) * (1+(bounty-1)*.35 + kills*.004).
Speed (3.1+rand 1.3) + bounty*.18. ELITES at bounty>=3, 14%: scale 1.6, gold tie,
HP base 380, speed 2.7, reward 120 + three 30-coins.

AI STATE MACHINE:
- ambush (35% spawn at a random tree): hide, spot player at dist<22 with line-of-sight
  → ❗ floats up, alert sfx, "⚠️ Ambush in the trees!"
- chase: zigzag approach — perpendicular sin(t*2.6+seed)*.55 added to direction.
- seekcover (30% chance when shot, or randomly while 10<dist<30): run to nearest big
  obstacle's far side.
- cover: 2.2s cycles, peeking the last .9s to shoot (sidestep 1.6), abandon after 6.6s
  or if player closes within 8.
Enemy fire: tracers, hit chances .62 on foot / .35 vs tree-climber (and range drops
to 16) / elite dmg 13 else 5, +bounty*2. Player regen 1.1 hp/s, hurt cooldown .25s.
lineOfSight() samples obstacles every 1.6m, ignores the climbed tree.
Kill reward luck(10 + bounty*4 + rand 6) dropped as spinning coin.
MINIMAP: forests, roads, lake, buildings, gold crates, green meds, enemies red (elites
bigger orange), friends blue, player as rotating arrow.
```

## PROMPT 5 — Economy, pickups, shops

```
PICKUPS: gold crates 💰20 (cap 26, respawn 9s), spinning bobbing coins from kills,
medkits +50 hp (cap 8, 16s). FOREST LOOT: every 40s (max 2 alive) a purple spinning
octahedron GEM worth 💰150 drops deep in a forest AND spawns 3 ambush guards at trees
within 30m of it. Announce it, purple diamond on minimap. luck() multiplies crate/gem
rewards. Pickup radius 1.7 on foot, 2.9 driving, 0 while climbing.

BLACK MARKET (gold pad, E to open, pauses game, tabs WEAPONS/UPGRADES/CREW):
weapons at their listed costs; run upgrades — dmg +15% cost 60*lv, fire rate +10%
70*lv, max hp +30 45*lv, speed +1 55*lv; CREW — recruit friend 100+70*perFriend
(blue-cap allies that orbit you, shoot nearest enemy every .8s for 12+8*(lvl-1),
teleport if left 55m behind), crew damage +8 cost 80*lv. These RESET every run.

STYLE SHOP (purple pad, E, tabs WEAPON SKINS / CREW SKINS) — PERSISTENT purchases:
Weapon skins recolor the SHARED materials dark/mid/wood/bladeMat(+emissive) so one
purchase reskins the whole arsenal: Factory(free) / Crimson Fang 250 / 24K Gold 300 /
Neon Toxin 350 / Glacier 350 / Galaxy 500 (each defines dark/mid/wood/blade/emissive
hexes). Crew skins recolor every friend's suit/tie/cap live: Blue Crew free /
Men in Black 200 / Pink Drip 250 / Toxic Squad 300 / Royal Guard 400.
E also closes shops; menuOpen() gates input+update while any shop is open.
```

## PROMPT 6 — Cars with skids, trails, explosions

```
CARS: 12 parked spots (filter to inside map). Rounded bodies (rboxGeo), colored, one
taxi, wheels, head/tail lights. F within 4.4 enters (chase cam behind+above, engine =
sawtooth osc, pitch 55+|speed|*7). Physics: accel 22 (reverse -13), drag .95, clamp
-10..38, steering 2.45 scaled by speed, MPH readout = |speed|*3.5.
Cars have 320 HP: enemies target the car (dmg x2.2, clang, sparks, 25% window leak
hits you for 40%), crashes at speed>6 cost 8 hull + bounce -.22, smoke under 40%,
at 0 → EXPLOSION: boom, fireball+smoke bursts, 180 dmg to enemies within 7, blackened
wreck, you're ejected with 35 dmg. Ramming enemies at speed>7 = 300 dmg.
SKID MARKS: pooled dark plane strips (1.15x.34 at y.085, max 260, fade over 6s).
On asphalt: hard steering above speed 16 or braking above 10 lays BLACK rubber
(0x161616, .5). OFF-ROAD (outside nearRoad pad 6.4) above speed 8: TAN dirt trail
(0x7a6a4a, .42) + brown dust bursts behind the car — you carve a visible trail
through the grass.
```

## PROMPT 7 — Home screen, saves, roguelite meta

```
Restructure into a persistent roguelite. PROFILE (single JSON): {money, totalKills,
bestBounty, bestKills, wOwned[], fOwned[], wSkin, fSkin, customW[], customF[],
up:{hp,dmg,luck,spd,crew}, hideout, nightUnlocked, night, heli, harbor, bigMap,
lastRun}. Storage: window.storage key 'hh_profile' (try/catch everywhere, works
without it), markDirty() debounce 800ms via earn()/spend() wrappers, save on
visibilitychange hidden. probeStorage() writes/reads 'hh_probe' to set autoSaveOK.
SAVE CODES: 'HH1.' + btoa(unescape(encodeURIComponent(JSON))) with decoder; SAVE panel
shows live auto-updating code + COPY, and a paste box + LOAD (rebuild owned property,
reapply skins; if map size differs, prompt reopen).

HOME SCREEN overlay (semi-transparent over the world; when not started the camera
slowly ORBITS the city at radius MAP*.45, height ~34): title, bank/lifetime kills/best
bounty stat cards, PLAY, and panels:
UPGRADES (permanent, cost base*(lv+1)): ❤️ start HP +20 (200, max5) · 🔥 all damage
+10% (250, max5, needs ★★) · 🍀 coin luck +10% (300, max5) · 👟 speed +.5 (200, max4)
· 🤝 start with a friend (400, max3, needs ★★).
PAINT STUDIO: design-your-own skins with <input type=color> — weapon (Body/Frame/
Grip/Blade/Glow + name, 💰400) and crew (Suit/Tie/Cap + name, 💰300); creations are
registered, equipped, listed with EQUIP buttons, and persist.
DEATH FLOW — CRITICAL: no page reload EVER. gameOver() saves totals + lastRun, flashes
"YOU GOT CAUGHT" 1.4s, then resetRun() soft-resets: despawn everything, rebuild cars,
rescatter pickups, reset weapons to knife+pistol and run-upgrades to 1, back to home
showing a one-time last-run summary banner. Black Market resets per run; money, skins,
permanent upgrades, and property persist. PLAY applies home upgrades + spawns crew.
```

## PROMPT 8 — MAP & PROPERTY: mega city, hideout, night, helicopter, harbor

```
MAP & PROPERTY panel (all persistent, buildable LIVE without reload except map size):
🌆 MEGA CITY 💰1500 needs ★★ — MAP 240, ROADS [-160,-80,0,80,160], 72 buildings,
   two forests, 12 cars (map size applies on reload/reopen).
🏠 HIDEOUT 💰800 — rounded house + pyramid roof + glowing windows at (-45,-58), green
   ring radius 14: enemies physically pushed out and CANNOT shoot you inside, heal
   8 hp/s, and you spawn there each run.
🌙 NIGHT MODE 💰600 unlock then free toggle — LIVE lighting swap, no world rebuild:
   night sky+stars, moonGlow on/sunGlow off, fog 0x0a1226, hemi .22 blue, sun .16
   0x9db8ff, exposure .9, lamp heads go bright emissive and their ground glow pools
   turn on, hideout windows glow warm. Persists.
🛳️ HARBOR & FERRY 💰1200 needs ★★ — carve a gap in the east wall at z=-30 (wallRefs),
   add a real OCEAN plane 0x2f6db8 with light shore strip, 4 drifting white wave
   stripes, two palm islands at (MAP+95,15) and (MAP+185,-70), a wooden pier, and a
   white ferry (red stripe, cabin, smokestack, UNARMED NPC CAPTAIN at the wheel).
   Ferry loop waypoints [[M+9,-30],[M+55,-36],[M+95,-6],[M+120,40],[M+85,66],
   [M+45,34],back], speed 7.5, docks 5-6s, bobs on sin(t*1.4)*.12. F while docked
   boards you (you stand on deck, free mouselook, can shoot — enemy accuracy .45);
   F when docked again steps off. It sails behind the home menu too.
🚁 HELICOPTER 💰2000 needs ★★★ — spawns on an H-helipad at (52,-40) each run. F to
   enter. Creative-mode flight: WASD moves where you LOOK, SPACE/SHIFT alt 0-60
   (climb 10/s), accel 26 cap 24 drag 1.6, body lerps to face travel with bank/tilt,
   rotor spin scales with speed, engine pitch 95+4v. You stay DOOR GUNNER: your
   equipped weapon still aims and fires (knife blocked above alt 4). Hull 600 HP:
   enemy accuracy .18 above alt 10 else .4, hits x1.8 to hull with 20% leak; building
   bonks at v>7 cost 14; below alt 3.6 the ROTOR deals 200 to enemies within 3.4.
   Hull 0 → mid-air explosion (200 dmg r8, you take 25) and you SKYDIVE — fall damage
   applies. F bails out anytime, same physics.
Minimap icons: ⭐🎨🏠🚁⚓ + purple gem diamonds.
```

## PROMPT 9 — City life polish

```
PEDESTRIANS: 10 (16 on mega) unarmed civilians in varied suit/skin colors strolling
the sidewalks (offset ±8.2 from road centers) at 1.5-2.4 speed, turning at map edges,
legs animating. Gunfire within 20 or explosions within 30 → they PANIC and scatter
away for 2.6s, then drift back to their lane. They cannot be hurt (bullets, blades,
cars, and rotors only affect hitmen).
FINAL PASS: verify every hint string (climb/drive/fly/ferry/shops/hideout/scope),
weapon-slot lock icons, feed messages, home ctl line mentions save codes, version
label v8.1 REAL TREES, and run the full test checklist:
[ ] climb each species (different perch heights) [ ] gem heist loop with guards
[ ] car skids on road + dirt trail off road [ ] car & heli explosions + fall damage
[ ] ferry round trip with captain [ ] night toggle live [ ] die → soft reset → home
summary [ ] save code round-trips the whole profile [ ] 60fps with 300+ trees swaying.
```

---

## Why Path B still won't be bit-identical (the honest footnote)

Same prompts, different session → the AI re-rolls every detail you *didn't* pin down:
exact building placements come from a seeded RNG it may write differently, helper
names shift, tiny constants drift. That's not failure — that's why studios keep the
CODE in git and use specs to describe *intent*. Path A hands over the code. Path B
hands over the intent, at maximum resolution. Use A to continue; use B to learn how
much design lives inside "one little game." (Answer: a lot. You built all of it.)
