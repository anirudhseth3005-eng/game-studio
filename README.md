# 🎮 Agastya's Game Studio

Games by **Agastya Seth** — playable at **[agastya.fun](https://agastya.fun)**.

Every game here is **one self-contained HTML file**. No build step, no downloads,
no assets folder. Textures are drawn with canvas code, sounds are synthesized with
WebAudio, and the whole thing runs by opening the file in a browser.

## The games

| Game | What it is | Play |
|---|---|---|
| 🕴️ **Hitman Hunters 3D** | A browser FPS-roguelite. Endless suit-and-fedora hitmen hunt you through a living city while you build an empire between runs — hideout, helicopter, harbor, custom-painted weapons. Built in three.js. | *(deploying soon)* |

## Working in here

Everything goes through `./gg`:

```bash
./gg status              # what's built, what's saved, what's live
./gg new v9              # start a new version (copies the current build)
./gg check               # syntax-check the build's JavaScript
./gg save "what I did"   # save + push to GitHub
./gg checkpoint v9 "…"   # plant a flag you can always come back to
./gg list                # see every checkpoint
./gg back v8.1           # rewind to a checkpoint (auto-saves first)
./gg play                # open the current build in your browser
./gg deploy              # syntax-check, then publish to agastya.fun
```

### How versions work

Each game folder keeps **every version it has ever had** as its own file
(`hitman-hunters-3d-v8-1.html`, `-v9.html`, …). A one-line `CURRENT` file names
which one is live. Nothing is ever overwritten, so a broken experiment can never
cost you a working game.

### How checkpoints work

A checkpoint is a **git tag** — a permanent bookmark on the whole studio at one
moment in time. `./gg back <name>` restores the files from that moment, and it
auto-saves whatever you had first, so going back is never destructive.

## Layout

```
gg              the studio tool
studio.json     deploy config
tools/          the syntax checker
site/           the agastya.fun hub page
games/          one folder per game
```
