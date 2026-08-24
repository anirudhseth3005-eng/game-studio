# CLAUDE.md — REBOUND · Game Handoff

Read the build named by `CURRENT` before touching anything. Studio-wide rules live in
the root `CLAUDE.md`; this file covers what's specific to REBOUND.

## What it is

A 960x600 canvas twin-stick arena game. **You have no gun — you steal theirs.**
DASH through an enemy bullet and it flips to your side, retargets the nearest enemy,
and fires at 900px/s. That single mechanic is the whole game; protect it.

- **Waves** every 18s, three enemy types: `chaser` (rushes, unarmored — dash kills it),
  `shooter` (circles and leads its shots), `spinner` (6-way radial bursts).
  Shooters and spinners are `armored:true` — dashing into them BOUNCES, it does not kill.
- **Combo** decays over 2.6s; score is `100 * combo * (overcharge ? 2 : 1)`.
- **OVERCHARGE**: reflects charge a 12-point meter, `E` spends it for 8s of x2 score,
  faster dash cooldown, 4-pierce reflects, and a deliberately flooded arena.
- **8 ships**, cosmetic only — each has its own hand-written dash trail renderer in
  `drawDashTrail()`. That function is the personality of the game. Don't unify it.
- Death screen plays a **5-second replay** from a rolling 30fps buffer (`replay.buf`),
  slowing down for the final second.

## Persistence — READ THIS BEFORE EDITING SAVES

Written for the Claude artifact sandbox (`window.storage`), then adapted for
agastya.fun. `flushSave()` and `read()` now do BOTH:

1. `window.storage` when it exists (inside Claude)
2. **`localStorage` otherwise** — this is what actually runs on the website

The root CLAUDE.md bans localStorage. That ban exists because the *artifact sandbox*
blocks it. On a self-hosted real domain localStorage is the correct and only working
option, so REBOUND is a deliberate, documented exception. Every access is inside a
try/catch, so a blocked-storage environment degrades to session-only instead of
crashing — the title screen says "saves are session-only here" when that happens.

`saveWorks` is set by a separate write/read **probe**, not by whether data was found,
because a first-time visitor has no data yet but saving still works for them.

There are **no save codes** in this game (unlike Hitman Hunters). If storage breaks,
progress is genuinely gone. Worth adding if Agastya ever asks.

`commitRun()` banks only the DELTA since the last commit, so it's safe to call often
(it runs every 6s, on wave-up, on pagehide/blur/visibilitychange). Don't make it
absolute or career stats will multiply.

## Gotchas

- `loaded` gates all writes — nothing may overwrite a real save before the first read
  finishes. Keep that guard.
- The whole game is one `async` IIFE with a top-level `await read()` inside it.
- Canvas is a fixed 960x600 scaled by CSS in `fit()`. Don't switch to a fluid canvas —
  every draw call assumes those coordinates.
- Touch controls exist: left half = virtual stick, bottom-right corner = overcharge,
  anywhere else = dash.
