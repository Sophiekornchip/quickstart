# 🪩 Sidequest — your AI body double

**An AI companion that finds the dopamine for you — but only if you do the thing.**

Sidequest is a voice-first AI body double for ADHD brains, designed natively for
smart glasses (Meta AI glasses and other audio-first wearables). It keeps you
company through the boring tasks of taking care of yourself, cues you on what
you should be doing, gamifies chores, and streams your special interests into
your ears **while you work — pausing the moment you stop.**

It is part coach, part dog trainer, part chaotic best friend. And unlike other
coaching tools, you can't skip ahead to the reward: the novel dopamine is
generated only on completion and banked in a vault you can't preload.

## Try it now (browser HUD simulator)

No build step, no dependencies:

```bash
cd body-double
python3 -m http.server 8080
# open http://localhost:8080
```

The browser app simulates the monocular glasses HUD. Everything the agent says
is spoken aloud (Web Speech API) and mirrored in captions. All state stays in
`localStorage` — nothing leaves your device.

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

## Why it works (the science, briefly)

Full citations in [`docs/SCIENCE.md`](docs/SCIENCE.md).

| Mechanic | Research basis |
| --- | --- |
| Body doubling / presence | Task initiation & persistence improve with a co-present other; the double doesn't help, it *witnesses* |
| Micro-steps ("shaping") | Implementation intentions (Gollwitzer 1999); successive approximation from behavioral training |
| Feed pauses when you stop | Contingent reinforcement — stimulation yoked to the target behavior |
| Special-interest feed during chores | Temptation bundling (Milkman et al. 2014); optimal-stimulation accounts of ADHD (Zentall) |
| Unpredictable loot & personas | Variable-ratio schedules (Ferster & Skinner 1957); novelty triggers dopaminergic response (Bunzeck & Düzel 2006) |
| No skipping to the reward | Precommitment devices; reward prediction error needs genuine contingency |

## Architecture

```
body-double/
├── index.html          HUD shell (glasses display simulation)
├── css/hud.css         glanceable dark waveguide-style UI
├── js/
│   ├── main.js         screens & wiring
│   ├── session.js      body-double engine: cue → chatter → check-in → drift → reward
│   ├── personas.js     rotating personality engine (4 seed personas)
│   ├── interests.js    special-interest content packs + held-back reward pool
│   ├── tasks.js        quest builder (task → micro-steps playbook)
│   ├── rewards.js      variable-ratio loot, XP, streaks, treat jar
│   ├── speech.js       TTS layer (Web Speech API ⇒ glasses audio session)
│   └── state.js        on-device persistence (localStorage)
└── docs/
    ├── SCIENCE.md              research grounding, with citations
    └── GLASSES_INTEGRATION.md  path to Meta AI glasses & other wearables
```

Everything is vanilla ES modules — the whole prototype runs offline. The seams
where a production build swaps in real services are marked in the code:

- **LLM brain** — `tasks.js` (task breakdown) and `personas.js` (line
  generation) currently use playbooks/seed content; both define the exact
  contract an LLM fills (e.g. Claude with a persona system prompt).
- **Live audio clips** — `interests.js` seed packs stand in for podcast
  segments / audio APIs matched to the user's niche interests.
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
