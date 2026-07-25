# Doppel 👓 — product spec (merged)

**Your AI body double. It finds the dopamine so you don't have to.**

This is the unified spec: Sophie's Doppel concept (product thesis, personality
spec, trainer loop, reward economy) merged with the Sidequest build (working
prototype, generative brain, verified research base). Where the original spec
and the research disagree, the correction is inline and flagged ⚙️.

Naming: the product is **Doppel**; the quests it runs are **sidequests** —
both names survive, each doing the job it's best at.

---

## The problem

ADHD is not a knowledge problem. Every person with ADHD already knows they
should do the dishes. The gap is between *knowing* and *initiating*, and
between *initiating* and *finishing*. Three failure modes Doppel targets:

- **Task initiation paralysis.** Low-stimulation tasks don't generate enough
  intrinsic reward to start; the ADHD reward system under-responds to
  delayed, abstract payoffs and over-responds to immediate, novel ones
  (delay discounting — see `SCIENCE.md`).
- **Mid-task abandonment.** Attention drifts; the half-folded laundry sits on
  the bed for three days.
- **Reward leakage.** Existing habit apps let you collect the reward without
  doing the work — dismiss the notification, skip to the podcast, claim the
  streak. The contingency between effort and payoff breaks, and with it the
  whole loop.

## What Doppel is — three jobs, one companion

**A body double.** Present — a voice in your glasses that's with you in the
room, not a notification on a phone across the house. It narrates alongside
you and makes solo tasks feel co-worked. (Evidence base: Eagle et al.'s
space-time/mutuality continuum explicitly includes recorded, asynchronous,
and non-human doubles; an AI double sits on the map, and the one pilot study
of AI doubles found *less* pressure than human presence — "safe
accountability.")

**A coach.** It knows your greater goals (set by you, in a calm moment) and
breaks them into next-physical-actions. It cues, it doesn't lecture. "Grab
the sponge" beats "you should really clean the kitchen." (Implementation
intentions: d=.65; Barkley's point of performance.)

**A dog trainer.** The differentiator. Dog trainers don't negotiate, don't
guilt, and never pay out the treat before the sit. Doppel controls the reward
channel: special-interest audio flows *while you comply* and pauses *when you
stop*. You can't skip ahead to the treat, because Doppel is holding the
treat. Warm hand, firm contingency. (Premack; contingency management;
variable-ratio schedules.)

> Other apps hand you a to-do list and leave. Doppel stands next to you,
> presses play on something you love, and pauses it the second you wander
> off. It is affectionately, deliberately hard to ignore — and always easy
> to escape (see Ethics).

## Why glasses

- **A body double should see.** The honest version of the reward contingency
  — dopamine flows only while the work happens — depends on verifying the
  work. Only glasses put a camera, a mic, and a voice at the point of task,
  hands-free. This is also Barkley's point-of-performance principle made
  physical: the support travels to the exact time and place of the behavior.
- **The tech just arrived.** Meta's Wearables Device Access Toolkit opened
  glasses to third-party developers (camera streaming, audio, display
  rendering on Ray-Ban Display, Neural Band gestures); real-time multimodal
  AI can watch a task, hold a funny conversation, and make a reward decision
  fast enough to feel alive.
- ⚙️ **Reality checks from the SDK research** (`GLASSES_INTEGRATION.md`):
  DAT is developer-preview (release channels ≤100 testers; public publishing
  not yet open) — Phase 0 ships to preview hardware, and that's fine.
  Bluetooth audio physics: hi-fi feed audio (A2DP) and an open mic (HFP)
  are mutually exclusive — so the interaction grammar is *speak briefly,
  release the mic*, and silent Neural-Band pinch confirmations beat voice
  in public anyway. Continuous camera streaming costs battery — compliance
  sensing is **sampled, tiered, and mostly audio/motion** with visual
  *milestone* verification ("show me the empty sink"), not constant watching.
- ⚙️ **On glasses-exclusivity:** the product thesis stands — the full Doppel
  (honest visual gating) exists only on glasses, and there is deliberately
  no phone-based feed, session screen, or browse surface. The phone app is
  plumbing (WDAT companion host + setup/consent screens). One amendment
  from the market research: the *audio trainer loop* (voice presence,
  confirmation-gated feed, tiered non-visual sensing) is testable without
  glasses hardware, and this repo's browser HUD simulator is exactly that —
  a **development harness for the trainer loop**, not a product surface.
  Build the loop where iteration is fast; ship the product where the eyes
  are.

## Personality spec

Doppel's voice is a core product feature, not a skin.

- **Funny.** Genuinely playful — dry asides, absurd stakes ("this sock has
  been on the floor so long it's developing lore"), never punching down.
- **Sporadic and ever-changing.** The personality itself is a novelty engine.
  Doppel drifts between micro-personas — game-show host, nature
  documentarian narrating you like a rare mammal, hype coach, deadpan noir
  detective watching you do dishes. **Persona shifts are scheduled by the
  novelty engine, not random noise — they respond to flagging engagement**
  (a drift event is a novelty cue: fresh voice, fresh angle). ⚙️ Persona
  *identities* are stable even as the rotation is unpredictable — the
  Replika update revolt showed users grieve a changed persona; rotate
  *among* characters, never silently rewrite one.
- **Options, not orders.** When you stall, Doppel offers 2–3 concrete choices
  ("dishes speedrun, mail triage, or a 5-minute floor rescue — pick your
  fighter"). Choice restores autonomy and reduces demand-avoidance.
- **Never shaming.** Missed a day? Doppel's memory of it is comedically
  short. It re-cues; it never litigates the past. (Enforced at the policy
  layer, not just the prompt — the kindness invariant.)
- **Firm on contingency, soft on tone.** The one thing it won't do is hand
  over the reward for free. It declines with charm: "Ohh I *want* to tell
  you what happens next — but the counter is still covered in mugs. The
  mugs, Sophie. The mugs."
- ⚙️ **No sycophancy.** Constant affirmation reads as fake and measurably
  harms well-being (IJHCI 2026); affectionate teasing is the lane. And keep
  personas cartoonish/non-human-adjacent (Tolan's alien, Finch's bird) —
  dodges the uncanny valley and romantic drift.
- Implementation: personas live as versioned prompt files with a rotation
  scheduler; adding a persona is a no-deploy operation. (Prototype:
  `js/personas.js` seed cast + `server.mjs` generative banter.)

## Core features

### 1. Cueing engine ("what should I be doing?")
Goals, calendar, meds schedule, routines → a ranked "now stack" of 1–3
candidate next actions. Cues are *physical and tiny* ("stand up and walk to
the sink"), voiced, with an optional glance card. Time-blindness support:
spoken time anchors, transition warnings ("hard stop in 10 — start landing
the plane"), routine anchoring. *(Prototype: quest builder + time anchors
shipped; calendar/meds ingestion is Phase 1.)*

### 2. Presence & companionship
Continuous lightweight co-presence, tunable from "chatty coworker" to "quiet
roommate who occasionally says nice" *(prototype: chatty ↔ quiet mode)*.
Doppel clocks in with you and clocks out with a recap and celebration.
⚙️ Interjection etiquette from the HCI research: interject at task
boundaries, never mid-subtask; every line passes an "is this worth saying?"
gate; barge-in always halts TTS; resume gracefully ("where were we — right,
the recycling").

### 3. The dopamine fetcher (special-interest feed)
Register interests — topics, fandoms, hyperfixations past and present.
Doppel builds a continuously refreshed queue of **novel** audio.

- **Contingent playback:** flows while the task is confirmed, pauses when
  you stop. The treat in the trainer's hand.
- **Session-locked (the stickiness rule):** reward content exists only
  inside an active, compliant session. No browse mode, no library, no
  replay screen. Content is assembled per-session and dies with the
  session. ⚙️ Enforced server-side in production: no endpoint returns
  reward content without a live compliance token. (Prototype keeps a
  small "trophy shelf" — the treat jar — as a *record* of earned drops;
  the production rule is that new content is never browsable.)
- **Novelty guarantee:** new-to-you material inside familiar interests —
  the intersection where the ADHD reward system lights up. ⚙️ And
  hyperfixation-aware: ADHD fixations run hot and die in weeks; the feed
  detects cooling interests and asks what's hot now. (Prototype: the
  generative brain makes the queue infinite; a static library is the
  ceiling that caps Dubbii.)
- **Cliffhanger mechanics:** content chunked so natural stopping points
  land *after* task milestones, not before.
- ⚙️ **Licensing:** publisher-defined `podcast:soundbite`/chapter segments
  and timestamp-seek playback with attribution are the safe primitives
  (Podcast Index + Taddy); programmatic clipping is derivative-use gray;
  Spotify's API is non-viable for new third parties.

### 4. Gamification of life-chores
Quests with XP; **streaks-with-grace** (streaks bend, they don't break — a
missed day dents, never zeroes) *(prototype: shipped)*; speedruns against
your own ghost times; absurd achievement titles ("Loremaster of Laundry, 3rd
Rank"); variable-ratio bonus drops — unpredictable rewards, predictable
requirements *(prototype: shipped)*.

### 5. Compliance detection (the load-bearing wall)
How Doppel knows you're on task — a tiered ladder, cheapest signal first:

1. **Confirmation input** — voice "yep" / Neural Band pinch / tap (works
   everywhere; the prototype's check-in button).
2. **Audio heuristics** — water running, dishes clinking, vacuum hum:
   cheap continuous on-task signal between visual samples.
3. **Motion & head pose** — working-cadence vs. standing-still-scrolling;
   phone-screen-unlock as an explicit drift event.
4. **Visual verify** — periodic camera *sampling* (not streaming) during a
   session, plus milestone checks: "show me the empty sink" → confirmed →
   milestone XP + bonus roll.

**Hysteresis:** brief pauses (grabbing a towel, a 20-second breather) never
punish; sustained drift (~30s, tunable) pauses the feed and triggers one
playful callback. Always consent-based per capability, sampled not
streamed, on-device where feasible, never stored by default.

### 6. The no-skip reward economy
No skip button, no self-serve reward — rewards are *earned or absent*,
which is what keeps them potent (reward prediction error: a previewable
reward generates no dopamine surprise). What there **is**: a pause button, a
renegotiate button ("this task is wrong, give me options"), and a full off
switch. **Doppel is hard to ignore, never hard to escape.**

## The trainer loop (target: <1s perceived)

```
sense → assess (confidence + hysteresis) → act → learn
  on-task:   feed flows, banter/XP sprinkle
  drifting:  feed pauses ≤3s, one playful callback
  stalled:   2–3 option menu (autonomy beats pressure)
  done:      celebrate, bonus roll, next quest or clock out
  learn:     which cue/persona/reward moved THIS human — tune per-user
```

If only one thing gets built well, build this loop. Everything else
decorates it. *(Prototype: the loop runs today in `js/session.js` minus
sensing — engagement is confirmation-based until hardware.)*

## Architecture

```
Glasses (Meta WDAT) ← the product surface
Phone companion     ← silent host + setup/consent only (no feed, no sessions)
Browser HUD sim     ← dev harness for the trainer loop (this repo)
        └── WearableAdapter: speak() listen() glanceCard() gesture$ sensors$ frames$
                     │ realtime (WebSocket)
DOPPEL CORE: Session Orchestrator (trainer loop) · Persona Engine ·
Novelty/Dopamine Engine · Cueing Engine · Gamification · Compliance Service ·
Science/Coaching Policy (mechanics referenced by ID against SCIENCE.md)
                     │
LLM (persona + coaching + breakdown — prototype: server.mjs + Claude)
TTS/STT (Cartesia / ElevenLabs Flash live; ElevenLabs v3 set-pieces;
on-device ASR for confirmations) · Content APIs (Podcast Index/Taddy)
Store: profile, interests, quests, sessions, reward ledger
```

## Data model (sketch)

```
User            { id, name, tz, goals[], settings{quiet_hours, sick_day}, escape_hatch_config }
Interest        { user_id, topic, intensity, era (current|dormant), sources[] }
Quest           { id, user_id, title, category, steps[], xp, ghost_time }
Session         { id, user_id, quest_id, state, compliance_log[], rewards_paid[] }
RewardItem      { id, interest_id, media_ref, novelty_score, consumed_at }   // never listable
PersonaState    { user_id, active_persona, recent_personas[], rotation_policy }
Ledger          { user_id, xp, achievements[], streaks{grace_remaining} }
```

## Roadmap

**Phase 0 — the trainer loop, proven.** ✅ *Done in this repo, in simulator
form:* quest breakdown, persona rotation, contingent feed with pause,
variable rewards, streaks-with-grace, quiet mode, time anchors, hyperfocus
guard, sick-day mode, generative brain. *Success metric unchanged: a user
with ADHD finishes the kitchen without touching their phone.*

**Phase 1 — the dopamine engine gets smart + first hardware.** Phone-host
app on Meta WDAT developer preview (release channel): voice sessions through
the glasses, audio-heuristic compliance + milestone visual verify,
session-locked feed. Novelty scoring, cliffhanger chunking, persona library
to 8+, more quest types (laundry, mail/admin, meds routine), interest-decay
detection.

**Phase 2 — display, gestures, and co-op.** Glance cards and Neural Band
controls on Ray-Ban Display (`mwdat-display` and/or the Web Apps SDK — the
HUD sim ports almost directly); richer milestone verification; multi-room
quests; **co-op quests** ("raid party: garage cleanout" — mutual body
doubling is the strongest end of the mutuality axis); Even Realities G2
build via Even Hub for public distribution while Meta publishing opens.
Monetization switches on here: free through launch, then $9/mo.

**Phase 3 — learning layer + the body.** Per-user reinforcement tuning;
health integration via **Google Health Connect** first (heart rate holds the
zone → feed flows), Garmin API and Apple HealthKit after.

## Ethics, safety & the escape hatch

Doppel is intentionally persistent — that's the product. It must never be
coercive. (Full research grounding: `SCIENCE.md` §7 — this audience is
differentially vulnerable to manipulative design, so the bar is higher.)

- **The escape hatch is sacred.** "Doppel, off" always works instantly —
  client-side, before any server round-trip — no guilt, no "are you sure?"
  Persistence applies to *tasks*, never to the user's right to stop.
- **Sick-day mode.** All contingencies suspended, companionship stays.
  Quiet hours configurable. *(Prototype: shipped.)*
- **Consent-first sensing.** Camera/mic verification opt-in per capability,
  clearly indicated, on-device where feasible, never stored by default.
  Visibly user-initiated and session-scoped — the Friend-pendant backlash
  shows what always-on ambient listening earns.
- **Variable rewards, used honestly.** The mechanics casinos abuse are
  pointed at *your own stated goals*, with in-app transparency about how
  they work (the 🧪 "why this works" panel — consent to persuasion is the
  ethics literature's bright line).
- **Bounded by design.** Sessions end when the task ends; the metric is
  quests finished, never minutes listened (the OpenAI/MIT affective-use
  finding: brief bounded voice use helps, prolonged heavy use harms).
- **Kindness invariant** at the policy layer: no output that shames,
  catastrophizes, or negatively compares the user. Streaks dent, nothing
  dies, nothing turns red.
- **Not a medical device.** No diagnosis, no treatment claims; meds
  *reminders* only, never meds *advice*; complements clinical care.
- **Data dignity.** Full export always (Dot's shutdown lesson); the
  interest profile is the product's fuel, never its inventory.

## Decisions (Sophie, 2026-07-25)

1. **Content: a real feed, not generated-only.** The feed should draw on
   what's actually happening — the internet, social platforms, and local
   events — with generation as the narrator/glue, not the sole source.
   Sourcing tiers (see "Feed sources" below for the engineering reality):
   - **Tier 1, open internet (buildable now):** web search for current
     news/releases/trends inside the user's interests *(shipped in the
     prototype — the brain now searches the live web when generating feed
     items)*; RSS/news feeds; Reddit; podcast segments via Podcast Index.
   - **Tier 2, local happenings (buildable now):** event APIs (Eventbrite,
     Ticketmaster Discovery), local news RSS, venue calendars — surfaced as
     spoken items ("that ceramics night market you'd love is Saturday").
     *(Prototype: tell Doppel your city and the feed includes local finds.)*
   - **Tier 3, Instagram/TikTok (constrained):** ⚙️ neither platform offers
     a public API for pulling arbitrary content into a third-party feed, and
     re-serving their audio would violate their terms. The honest version:
     Doppel *covers* what's trending in your interests (via web search) and
     can deep-link posts for later, but it can't replay TikToks into your
     glasses. If this tier becomes core, it's a partnership conversation.
2. **Pricing: free at launch, then $9/month.** Sits in the research-backed
   accepted band ($8–15); free period builds the habit before the paywall
   (avoiding Tolan's pay-before-you-bond mistake).
3. **Treat jar: trophy shelf stays** — a record of earned drops; new content
   remains earned-only and session-assembled.
4. **Co-op quests: pulled earlier → Phase 2.** The mutuality research
   supports it ("raid party: garage cleanout").
5. **Health platform: Google Health Connect first** — it's the easier of the
   two named options (free on-device Android API, no partner-program
   approval, and it aggregates Garmin/Fitbit/Samsung data anyway). Garmin's
   own API follows if depth is needed. Apple HealthKit when iOS ships.

---

*Doppel — because the treat comes after the sit. 🐕*

**Product:** Doppel · quests are "sidequests" · **Author:** Sophie
(experiential producer, idea machine) · **Spec merged with working prototype
+ research base by Claude** · **Status:** Phase 0 loop running in simulator;
Phase 1 is buildable on WDAT preview hardware now.
