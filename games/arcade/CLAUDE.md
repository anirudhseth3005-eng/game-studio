# CLAUDE.md — THE ARCADE · Game Handoff

Read the build named by `CURRENT` before touching anything. Studio-wide rules live in
the root `CLAUDE.md`; this file covers what's specific to THE ARCADE.

## What it is

One page, public lobby, up to 8 players per arcade, mini-games voted on between rounds.
Plain 2D canvas (fixed 960x600, scaled by CSS in `fit()`), keyboard only, no storage at all.

- **Lobby**: lists open arcades (retained MQTT listings), host a new one, or join.
  Joining mid-round = spectator until the next round.
- **Room screen**: players + session totals, last round's results, game cards to VOTE on,
  quick-message buttons. First vote starts a 15s clock; everyone voted or time up →
  most votes wins, ties random. Places pay `PLACE_PTS` = 10/8/6/5/4/3/2/1 (ties share).
- **Mini-games** live in `GAMES`. Each is a class with the same interface:
  `update(dt, inp)`, `draw(ctx)`, `mineArr()` (my avatar → hub), `remote(pid, arr)` (hub),
  `snap()` / `applySnap(s)` (hub → everyone), `hostEvent(pid, e)` (hub validates a claim),
  `removePlayer(pid)`, `results()` → `[{pid,name,score,val}]`, `done`.
  1. `Arena` — Rebound Arena (from REBOUND). Dash through bullets to own them.
  2. `Race` — Mini Race (from TOP RACE). 3 tracks in `TRACKS`, flipped/reversed by seed.
  3. Cops and Robbers, Castle Clash — `soon: true` placeholders (cards locked).

## SAFETY DESIGN — do not weaken

Strangers can join, the players are kids. **No free text ever crosses the network and gets
displayed.** Names must match `NAME_RE` (built from the `ADJ`/`ANI` word lists); the hub
replaces a bad name, and every receiver runs `safeName()` again anyway. Quick messages are
an index into `SAY`. Results carry numbers, and each game's `fmt()` builds the text locally.
If you add a feature that shows something from another player, it must be an index or a number.
There's no typed chat, no name typing, no room names, and no private codes. Keep it that way.

## Netcode — READ BEFORE CHANGING

Same stack as TOP RACE (MiniMQTT + WebRTC with relay fallback), topic `agastyaarcade/v1/`.
**Bump `NET_VER` and the topic whenever the wire format changes.**

- One player's computer is the **hub** (`Net.role === 'host'`). The UI never calls it the host.
  It runs bullets/turrets/race clock and sends snapshots 20×/s (10×/s over relay).
- Each player is **authoritative over their own avatar** and *claims* interactions
  ("I stole bullet #id", "bullet #id hit me", "I finished"); the hub validates and applies.
  Bullet collisions are swept (`segD2`) — fast bullets tunnelled before that.
- **Host migration** (`Net.migrate`): when the hub says `hostleft` or goes silent for 9s,
  everyone independently picks the remaining player with the lowest `slot`. That player
  `takeOver()`s, the rest `follow()`. A round in progress is cancelled (no points), totals kept.
- Control messages use `m.i` as the dedupe sequence number. **Never use a field called `i`
  in a broadcast message** — quick messages were showing the wrong text because of this (fixed: `q`).
- A Web Worker timer (`beat`) drives `Net.pump()` and steps the game when rAF stalls,
  because browsers pause rAF in background tabs and the hub's game would freeze for everyone.

## Testing

Serve over HTTP (`.claude/launch.json` → "games", port 8777) and open
`http://localhost:8777/arcade/arcade-v1.html` in 2–3 tabs. They really talk through the
public brokers. Tested in v1: join, direct link, voting, quick messages, arena scoring,
race laps/finish, results/totals, graceful hub leave mid-round, and hub crash.
