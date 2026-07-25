# Doppel 👓 — your AI body double

**It finds the dopamine so you don't have to.**

Doppel is a glasses-native AI body double for ADHD brains. It keeps you
company through the boring, invisible labor of taking care of yourself —
dishes, laundry, meds, mail — by doing what a great body double, a great
coach, and a great dog trainer all do: it stays present, it cues the next
tiny step (your **sidequests**), and it pays out novel, personalized dopamine
**only while you're actually doing the thing**.

> Other apps hand you a to-do list and leave. Doppel stands next to you,
> presses play on something you love, and pauses it the second you wander
> off. It is affectionately, deliberately hard to ignore — and always easy
> to escape.

Full product spec (the merged Doppel concept + research base):
[`docs/SPEC.md`](docs/SPEC.md). This repo contains the **Phase 0 trainer
loop**, running today as a browser HUD simulator with a generative AI brain.

## Try it now (browser HUD simulator)

**Offline mode** — no build step, no dependencies, no account:

```bash
cd body-double
python3 -m http.server 8080
# open http://localhost:8080
```

**AI mode** — the same app with a live brain (Claude + web search). Task
breakdowns and persona banter are generated fresh, and the dopamine feed is
**sourced from the live internet**: current news, releases, and trends inside
your interests, plus local happenings if you tell Doppel your city. Infinite
novelty, which for this product is the active ingredient:

```bash
cd body-double
npm install
ANTHROPIC_API_KEY=sk-ant-... npm start
# open http://localhost:8080
```

The key stays on the server (`server.mjs`); the browser only talks to
`/api/*`. If the brain is unreachable mid-session the app falls back to seed
content without blocking — the moment of motivation is perishable, so nothing
ever waits on the network.

The browser app simulates the monocular glasses HUD. Everything the agent says
is spoken aloud (Web Speech API) and mirrored in captions. Your profile and
progress stay in `localStorage` on your device.

## How a session works

1. **Name the dread.** Type the task you're avoiding. Sidequest shapes it into
   3–6 micro-steps, each startable in under a minute.
2. **A persona clocks in.** Coach Blitz 🐺, Professor Moth 🦋, Ziggy 🪩, or
   Captain Luna 🌙 — funny, sporadic, and they rotate mid-session without
   asking. Novelty is part of the product.
3. **The dopamine feed goes live.** While you work, the agent drips
   special-interest content (space, deep ocean, unsolved mysteries...) and
   companionship chatter into your ears.
4. **Check-ins.** Every so often: *"still with me?"* Confirm by tap (browser)
   or voice/head-nod (glasses). Go quiet past the grace period and **the feed
   pauses** — the entertainment is yoked to engagement, like a treadmill that
   only plays your show while you run.
5. **Variable rewards.** Steps pay XP; some steps pay a surprise treat for no
   announced reason (variable-ratio reinforcement — the strongest schedule
   there is). Finishing the quest rolls loot (common → legendary), rolls your
   streak, and unlocks a held-back, extra-juicy reward drop that goes into
   your 🫙 treat jar.
6. **Presence, tuned to you.** 🤫 quiet mode keeps the double there but
   nearly silent (ambient presence is the most-requested, least-served mode).
   The agent speaks time anchors every few minutes (ADHD time blindness is
   real — the clock gets externalized), and a gentle hyperfocus guard
   suggests a stretch on very long sessions. The 🧪 "why this works" button
   explains every mechanic — persuasion here is consented-to, never covert.
7. **Options, not orders.** Hitting 🧱 "I'm stuck" offers concrete choices —
   shrink the step, a 90-second deliberately-bad version, or swap quests —
   because choice restores autonomy and defuses demand-avoidance. If the
   same voice keeps losing you, the persona engine reads the drift and sends
   in a fresh character (novelty responds to flagging engagement, not a
   random timer).
8. **Grace built in.** Streaks bend, they don't break — a missed day dents
   the count by one, never zeroes it. And 🛌 sick-day mode suspends every
   contingency while the companionship stays: persistence applies to tasks,
   never to a person having a bad day.

## Why it works (the science, briefly)

Full primary-source citations, evidence tiers, and honest hedges in
[`docs/SCIENCE.md`](docs/SCIENCE.md).

| Mechanic | Research basis | Evidence |
| --- | --- | --- |
| Body doubling / presence | Eagle et al. 2023/2024 (ASSETS/TACCESS) continuum model; AI doubles pilot-validated (Ara et al. 2025) | emerging |
| Micro-steps at the point of performance | Implementation intentions, d=.65 (Gollwitzer & Sheeran 2006); Barkley 1997 | strong |
| Feed pauses when you stop | Premack principle; contingency management in ADHD | strong |
| Special-interest feed during chores | Temptation bundling (Milkman 2014; N=6,792 replication Kirgios 2020); delay-aversion mitigation (Antrop 2006) | strong |
| Background stimulation helps ADHD | Zentall 1983; Söderlund 2007; 2024 JAACAP meta-analysis (small effect, ADHD-specific) | moderate |
| Unpredictable, earned-only rewards | Variable-ratio schedules (Ferster & Skinner 1957); reward prediction error (Schultz 1997) | strong mechanism |
| Spoken time anchors, hyperfocus guard | ADHD time-perception meta-analysis 2024 (≈d 0.69); Ashinoff & Abu-Akel 2021 | moderate |

## Architecture

```
body-double/
├── index.html          HUD shell (glasses display simulation)
├── css/hud.css         glanceable dark waveguide-style UI
├── server.mjs          static host + AI brain proxy (Claude via @anthropic-ai/sdk)
├── js/
│   ├── main.js         screens & wiring
│   ├── session.js      body-double engine: cue → chatter → check-in → drift → reward
│   ├── brain.js        AI client: generative quests/feed/banter + prefetch queue
│   ├── personas.js     rotating personality engine (4 seed personas)
│   ├── interests.js    special-interest content packs + held-back reward pool
│   ├── tasks.js        quest builder (AI-first, playbook fallback)
│   ├── rewards.js      variable-ratio loot, XP, streaks, treat jar
│   ├── speech.js       TTS layer (Web Speech API ⇒ glasses audio session)
│   └── state.js        on-device persistence (localStorage)
└── docs/
    ├── SCIENCE.md              research grounding — primary-source citations, evidence tiers, ethics line
    ├── PRODUCT.md              competitive landscape, design principles, the 5 traps
    └── GLASSES_INTEGRATION.md  real SDK landscape: Meta DAT, Ray-Ban Display, Even G2, voice stack
```

The client is vanilla ES modules and runs fully offline; the Node server adds
the generative layer. Design notes on the AI seams:

- **LLM brain** — `server.mjs` holds one stable persona system prompt (prompt-
  cached) and three endpoints: `/api/quest` (structured-output task breakdown),
  `/api/feed` (batched dopamine content, prefetched ahead of need), and
  `/api/banter` (single persona lines). `brain.js` degrades to seed content on
  any failure — the app never blocks on the network.
- **Live audio clips** — `interests.js` seed packs and the generated feed stand
  in for licensed podcast/audio segments matched to niche interests.
- **Activity sensing** — the browser uses tap check-ins; glasses use voice,
  IMU head-gestures, and egocentric camera signals
  (see [`docs/GLASSES_INTEGRATION.md`](docs/GLASSES_INTEGRATION.md)).

## Design principles

- **Audio-first, never audio-only.** Every spoken line is captioned.
- **Glanceable.** One idea per screen, huge type, dark field (waveguide-legible).
- **Kind dog training.** The contingency is real but the tone never shames.
  Getting stuck triggers *shrink the step*, not guilt.
- **Private by default.** A device that hears your day keeps its data on-device.
- **The agent is never off, but it is pausable.** "Pause quest" is one tap —
  the friction is on skipping to rewards, not on stopping. This matters:
  coercive design and supportive contingency are different things, and the
  line is user consent + user control.
