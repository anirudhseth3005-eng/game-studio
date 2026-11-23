# CLAUDE.md — TOP CITY · Game Handoff

Read the build named by `CURRENT` before touching anything. Studio-wide rules are in
the root `CLAUDE.md`; this file covers what's specific to TOP CITY.

## What it is

TOP CITY is an open-city driving game — jobs, heists, police chases and a credits economy. Built on **three.js r170, minified and INLINED** into the file
(~680KB of the ~1.5MB). That is deliberate — it keeps the "one self-contained file"
rule with no CDN dependency. Do not replace it with a script tag.

**TOP CITY and TOP RACE are siblings** — same engine, same multiplayer stack, same save
format. A fix to one is very often a fix to the other. Check before you only patch one.

## File shape

- Line ~370: `<script>` #1 — the inlined three.js r170 bundle (MIT licensed, header intact).
- Line ~384: `<script>` #2 — the entire game, ~8–10k readable commented lines.
- `#nogl` element shows a friendly message if WebGL won't start.

## Saves — localStorage, deliberately

Save slots live in `localStorage` under `topcity.v1.slot.N`. The root CLAUDE.md bans
localStorage; that ban exists because the *Claude artifact sandbox* blocks it. On
agastya.fun localStorage is the correct and only working option, so this is a
documented exception (same as REBOUND). There is also an export/import-to-file path
("Open a save file from another computer"), which is this game's answer to save codes.

## Multiplayer — READ BEFORE CHANGING

Real peer-to-peer racing, no game server:

- **Discovery** goes through free public MQTT brokers over WSS:
  `broker.emqx.io`, `broker.hivemq.com`, `test.mosquitto.org` (first to answer wins).
- **Gameplay** goes direct between players via WebRTC, falling back to broker relay
  when a network blocks a direct link.
- **STUN** servers for NAT traversal: `stun.cloudflare.com`, `stun.l.google.com`.
- **Connectivity probe**: `no-cors` fetches to `google.com/generate_204` and
  `cloudflare.com/cdn-cgi/trace` just to answer "is there internet?".

Those brokers are **public** — anyone can subscribe. What is published: room name,
player display names, player counts, and (when relaying) car positions. What is NOT
published: a private room's code. Players prove they know it with a one-time
hashed nonce challenge (`hash(nonce + ':' + code)`), which is a genuinely good design —
don't weaken it. The lobby UI tells players plainly whether a room is 🌐 Public or 🔒 Private.

`NET_VER` / `NET_TOPIC` gate compatibility. **Bump `NET_VER` whenever you change the
wire format**, or old and new builds will try to race each other and desync.

## Gotchas

- Both script blocks must pass `./gg check top-city` — the checker handles multiple blocks.
- The file is ~1.5MB, so the Claude preview pane can't open it as a local file
  (it inlines local files as data: URLs). Serve it over HTTP to test:
  `python3 -m http.server 8777` from `games/`, then open `http://127.0.0.1:8777/top-city/`.
