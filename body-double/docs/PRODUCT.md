# Sidequest — product strategy & competitive landscape

Distilled from a mid-2026 sweep of body-doubling products, ADHD apps, AI
companions, and voice-agent HCI research. Sources: vendor sites/pricing pages,
app-store review aggregates, Trustpilot/G2, published papers, and community
sentiment (r/ADHD, r/adhdwomen — paraphrased).

## The white space

The ADHD-support market splits into three camps, and each fails at a
different point in the loop:

| Camp | Examples | Where they fail |
| --- | --- | --- |
| **Planners** | Tiimo ($7–12/mo, Apple's 2025 iPhone App of the Year), Owaves, Amazing Marvin | Great at *seeing* the day; no support during execution |
| **Breaker-downers** | Goblin Tools (beloved, $3.99 one-time) | "Generates a beautiful list of steps and then walks away" — the #1 documented complaint; no timer, no presence, no follow-through |
| **Presence** | Focusmate ($8/mo), Flow Club ($40/mo), Deepwrk ($12–19/mo), Dubbii (~$40/yr), Caveday ($30–40/mo) | Great during execution; no capture/breakdown, and the human ones no-show, need scheduling, and can judge you |

**Nobody owns the full loop: capture → break down → be present during
execution → celebrate.** That loop is Sidequest's product definition.
Additionally, no shipping product uses the user's *current hyperfixation* as
a reward feed (Dodson's interest-based nervous system — Interest, Novelty,
Challenge, Urgency — is canonical in the ADHD community and essentially
unexploited commercially). Closest analog is Dubbii (pre-recorded
follow-along chore videos by ADHD Love, 500k+ users) — validation that people
pay for chore-specific presence, limited by a finite static library.
Sidequest is that, live, generative, and personalized.

## What the incumbents prove

- **Focusmate** (Trustpilot 4.9): the ritual works — *declare the goal aloud →
  witnessed work → debrief*. Its top complaints are human failure modes:
  no-shows, failed rematches, judgment anxiety. An AI double structurally
  can't no-show. Keep the ritual, delete the human failure modes.
- **Flow Club at $40/mo and Caveday's facilitated tiers**: people pay a
  premium for a *guide who runs the ritual*, not just co-presence. The
  persona should own the facilitator role.
- **Finch** (never-dying pet, restorable streaks): the no-punishment
  architecture is why it retains ADHD users — "I do it for the bird."
- **Zombies, Run!**: narrative wrapped around a boring physical task extends
  sessions and long-term retention (100% retention in an 8-week RCT arm) —
  the quest framing has direct precedent.
- **Character.ai** (~92 min/day engagement): persona variety is the strongest
  engagement engine in consumer AI. **Replika's 2023 update revolt**: users
  grieve a changed persona like a lost friend — persona *identity* is sacred;
  rotate among stable characters, never silently rewrite one.
- **Tolan** ($12M ARR, alien companion): deliberately non-human embodiment
  dodges the uncanny valley and romantic drift. **Friend pendant** backlash:
  always-listening ambient hardware + a needy, negative persona is
  radioactive. Cartoonish, affectionate, willing-to-tease is the lane;
  sycophancy reads as fake (and an IJHCI 2026 study links it to worse
  well-being).
- **Dot's shutdown** (Oct 2025): users lost months of context — full data
  export is a trust requirement, not a feature.
- **OpenAI/MIT affective-use RCT** (~1,000 users): voice companions correlate
  with *better* well-being at brief bounded use and *worse* at prolonged
  heavy use. Sidequest's sessions are bounded by design — the task ending
  ends the session. We optimize quests finished, never minutes listened.

## Voice interjection etiquette (make-or-break #1)

- Interrupt at **task boundaries**, never mid-subtask (Iqbal & Bailey:
  boundary interruptions measurably cheaper in resumption time, frustration,
  errors; boundaries predictable from activity signals at 69–87%).
- Agents that gate themselves on "do I actually have something worth saying?"
  beat both silent and chatty agents (CHI '25 "Inner Thoughts"); scheduled
  same-time nudges read as "boring and mechanical" (ComPeer).
- Barge-in is mandatory: user speech instantly halts TTS, and the agent
  resumes gracefully ("where were we — right, the recycling").
- Offer the **full mutuality dial** (Eagle et al.'s continuum): from silent
  ambient presence (the free, massively popular end — Lofi Girl, muted
  Discord co-working) to active coaching. Commercial tools cluster at
  high-intensity; ambient is underserved. → shipped as *quiet mode*.

## Shame-free failure path (make-or-break #2)

Every graveyarded ADHD app died on one of two hills: it became another chore
(Amazing Marvin's 300 settings, Habitica's game-administration, "tiring on
the long term"), or it shamed the user (Routinery's punitive timers,
streak-shame → avoidance → uninstall). Standing rules:

- Zero-config capture: say the task, everything else is automatic.
- Nothing turns red, nothing dies, nothing decays. Streaks break silently
  and restore cheaply. Missed days cost nothing.
- The feed pausing is framed as "pause *with* me," warm not punitive.
- Notifications/cues rotate voice, wording, and timing — ADHD brains
  habituate to identical stimuli unusually fast; novelty is a maintenance
  budget, not a launch feature.

## Hyperfixation-aware content

ADHD **hyperfixations** are novelty-driven and short-lived (hours–weeks) —
distinct from stable autistic special interests (relevant for AuDHD users).
The feed must detect cooling interests and ask what's hot now; a static
interest list goes stale in weeks. (This is why the generative brain matters:
a fixed content library is Dubbii's ceiling.)

## Pricing & trust posture

- Target **$8–15/mo** — the accepted band (Focusmate $8, Sukha $10, Deepwrk
  $12) vs. the resented band (Flow Club $40, Numo $15–16 with churn).
- Real trial before any paywall (Tolan's pre-relationship paywall is its top
  complaint).
- Full data export, always (Dot's lesson).
- Glasses posture: visibly user-initiated, session-scoped listening with
  on-device inference — the Friend pendant showed what happens otherwise.

## Wearable precedent

Research devices validate the category (Empowered Brain AR glasses improved
attention outcomes in coached school-age tasks; Revibe Connect's
vibrate-and-tap-back check-ins significantly improved on-task attention and
self-monitoring) — but nothing consumer-grade, voice-first, or adult-focused
ships today. Sidequest's glasses-native angle has research precedent and no
commercial incumbent.

## Top 5 traps (each traceable to a documented failure)

1. **Becoming another chore** — required setup/admin kills ADHD retention
   (Marvin, Habitica, Numo).
2. **Shame mechanics in any disguise** — punitive timers, decaying anything,
   guilt copy (Routinery, Duolingo's sad owl).
3. **Surveillance framing** — always-on listening without visible user
   initiation (Friend pendant).
4. **Static content / fixed patterns** — habituation within weeks (Dubbii's
   library ceiling, ComPeer's scheduled nudges).
5. **Exploiting the dependency knife-edge** — variable rewards + emotional
   attachment + heavy voice use is the regulator-flagged cocktail; bounded
   task-anchored sessions, no sycophancy, persona stability, export, and the
   transparency modal are the guardrails (see `SCIENCE.md` §7).
