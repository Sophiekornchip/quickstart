# The science behind Sidequest

Every mechanic in Sidequest is anchored to a specific finding, and this
document maps feature → evidence with primary-source citations. Just as
important, it is honest about **strength of evidence**: some mechanics rest on
large replicated trials, others on emerging community-validated practice. An
ADHD audience has been over-promised at before; we earn trust by hedging where
the science hedges.

Evidence tiers used below:
**[STRONG]** replicated RCTs / meta-analyses · **[MODERATE]** solid single
studies or meta-analyses with caveats · **[EMERGING]** qualitative, pilot, or
community evidence.

## 1. Body doubling — the core metaphor **[EMERGING]**

**Feature:** the always-present companion that witnesses your work.

Body doubling — using the presence of another to start, sustain, or complete
a task — is a community-originated ADHD strategy that research is now
characterizing:

- Eagle, Baltaxe-Admony & Ringland (2023), *"Proposing Body Doubling as a
  Continuum of Space/Time and Mutuality"*, ASSETS '23; extended as Eagle,
  Baltaxe-Admony, Taber & Ringland (2024), *ACM TACCESS* 17(3). Survey of
  ~220 neurodivergent people. Key model: body doubling spans a **space/time
  axis** (co-located ↔ remote, live ↔ *recorded/asynchronous*) and a
  **mutuality axis** (both working ↔ one observing). The double can be a
  stranger, a recording — even a parasocial presence. An audio-first AI
  companion sits squarely on this continuum.
- Ara et al. (2025), *"You Are Not Alone: Designing Body Doubling for ADHD in
  Virtual Reality"* (arXiv:2509.12153): N=12 pilot; participants completed a
  task faster and reported better sustained attention with a human **or AI**
  double vs. working alone, and preferred doubling to working alone. A pilot,
  not proof — but the first experimental signal that an artificial double works.
- Proposed mechanisms (participant-reported, not causally isolated):
  accountability, social presence, "not being alone," externalized structure.
  Related: social facilitation (Zajonc, 1965) — co-presence improves
  performance on simple/routine tasks, exactly the boring maintenance work
  ADHD'ers stall on.

**Honesty note:** there is no large RCT of body doubling yet, and commercial
claims in this space (e.g. Focusmate's "143% productivity" figure) are company
self-reports, not peer-reviewed. We describe body doubling as strongly
community-validated and mechanistically plausible — not "proven."

**Design consequence:** the agent's job is *presence*, not instruction — it
says "I'm here" far more than "do this," and it acknowledges rather than
supervises.

## 2. Micro-steps and task initiation **[STRONG]**

**Feature:** every quest becomes 3–6 steps, each startable in under a minute,
cued at the moment of action; "stuck" triggers *shrink the step*.

- **Implementation intentions** — Gollwitzer (1999), *American Psychologist*;
  meta-analysis Gollwitzer & Sheeran (2006), *Adv. Exp. Soc. Psych.* 38:
  **94 independent tests, d = 0.65** on goal attainment. Concrete if-then
  plans ("when you reach the sink, wash five things") dramatically outperform
  abstract intentions, specifically helping initiation and shielding pursuit
  from distraction.
- **Point of performance** — Barkley (1997), *Psychological Bulletin* 121(1):
  ADHD's inhibition/executive profile means internally-held intentions fail;
  supports must be **externalized at the exact time and place the behavior
  must occur**. This is Sidequest's single most important design law — and
  the reason glasses are the right body: the cue physically travels to the
  point of performance.
- **Shaping** (Skinner): reinforce successive approximations. Steps sized
  "almost silly" get under the initiation threshold.

## 3. The feed that pauses — contingent stimulation **[STRONG mechanics, applied carefully]**

**Feature:** the dopamine feed streams while you work and pauses when you stop.

- **Premack principle** (Premack, 1959; review: Herrod et al. 2023, *Behavior
  Modification*): access to a high-probability behavior (consuming your
  special interest) reinforces a low-probability behavior (the dishes) when
  made contingent on it.
- **Contingency management** is among the best-established behavioral
  techniques in ADHD treatment (consequent-based methods are especially
  effective for attention-lapse-prone profiles; cf. *Research on Child and
  Adolescent Psychopathology*, 2019).
- **Ethics matter here** — see §7. The pause is immediate, matter-of-fact,
  reversible the moment you re-engage, and quitting the session is always one
  tap with zero penalty. Contingency, never captivity.

## 4. Special-interest audio during boring tasks **[STRONG for bundling · MODERATE for stimulation]**

**Feature:** interest-matched content drips into your ears while you work.

- **Temptation bundling** — Milkman, Minson & Volpp (2014), *Management
  Science* 60(2): restricting tempting audiobooks to the gym raised visits
  **51%** (full treatment) and 29% (intermediate)… with effects that
  **decayed over weeks**. The large replication — Kirgios et al. (2020),
  *OBHDP*, **N=6,792** with 24 Hour Fitness — found teaching temptation
  bundling raised workout rates 10–14% with effects persisting ~17 weeks.
  Two lessons: it works, and it wears off without novelty — which is why
  Sidequest's feed is generative rather than a fixed playlist.
- **Optimal stimulation theory** — Zentall & Zentall (1983), *Psychological
  Bulletin* 94(3): ADHD behavior partly reflects under-arousal; added
  stimulation can *improve* performance on monotonous tasks.
- **Noise research** — Söderlund, Sikström & Smart (2007), *JCPP* 48(8):
  white noise improved cognitive performance in children with ADHD while
  *degrading* it in controls. Meta-analysis: Nigg et al. (2024), *JAACAP*
  (13 studies, N=335): small positive effect of white/pink noise in ADHD,
  negative in non-ADHD — a replicated crossover. Caveats: effects are small,
  and whether the mechanism is stochastic resonance is contested
  (*Neuropsychologia*, 2024). We claim the effect, not the mechanism.
- **Delay aversion** — Sonuga-Barke's delay-aversion model; Antrop et al.
  (2006), *JCPP* 47(11): adding **non-temporal stimulation during a delay**
  reduced ADHD children's preference for immediate reward — filling the wait
  makes waiting tolerable. Direct rationale for audio *during* the boring part.

**Design consequences:** the feed is tuned for ADHD brains — a neurotypical
tester finding it "distracting" is the expected crossover, not a bug. Effects
are supportive, not miraculous, so the feed is one layer of several. (Roadmap:
a plain white/pink noise mode as the most evidence-backed minimal option.)

## 5. Variable rewards, novelty, and the earned-only vault **[STRONG mechanics]**

**Feature:** loot rarity rolls, surprise mid-quest treats, held-back reward
drops, rotating personas — and rewards that are *minted only on completion*.

- **Variable-ratio schedules** — Ferster & Skinner (1957), *Schedules of
  Reinforcement*: VR schedules produce the highest, steadiest response rates
  and the greatest resistance to extinction of any schedule.
- **Reward prediction error** — Schultz, Dayan & Montague (1997), *Science*
  275: dopamine neurons fire to *unpredicted* rewards and stay silent for
  fully predicted ones. A reward you can preview generates no prediction
  error — which is why the treat jar fills only at completion. The novelty is
  neurologically real precisely because it didn't exist until you earned it.
- **Novelty itself is dopaminergic** — novel stimuli engage the same midbrain
  system implicated in ADHD's altered reward anticipation. Hence the rotating
  personas: the companion itself is a novelty dispenser.
- **Delay discounting** — ADHD'ers steeply discount delayed rewards
  (Sonuga-Barke), so no reward is ever more than minutes away: XP per step,
  surprise treats mid-quest, the vault at the end.

These are the same mechanisms slot machines exploit — which is exactly why §7
exists.

## 6. Gamification — evidence and its limits **[MODERATE]**

- **EndeavorRx (Akili, AKL-T01)** — first FDA-cleared (De Novo, June 2020)
  prescription game for pediatric ADHD. Pivotal RCT: Kollins et al. (2020),
  *Lancet Digital Health* 2(4), N=348: TOVA attention index improved +0.93 vs
  +0.03 control (p=0.006). Honest caveats: the win was on a **computerized
  attention metric**, not blinded parent/clinician symptom ratings; adult/OTC
  evidence is single-arm; and the company's later commercial struggles are a
  cautionary tale about retention.
- Meta-analyses of game-based ADHD interventions (e.g. *BMC Psychiatry*,
  2025) find improvements in attention and executive function, with two
  recurring failure modes: **novelty wear-off** and **attrition in
  unsupervised home use** — supervised/social contexts outperform solo use.
- **Precommitment** — Ariely & Wertenbroch (2002): people voluntarily bind
  their future selves, and it works. Sidequest's earned-only vault is a
  precommitment device the user opts into knowingly, once.

**Design consequences:** gamification decorates real-life tasks at the point
of performance (countering the transfer problem: the "game" *is* the chore);
generative content and rotating personas counter novelty wear-off; and the
social/body-double layer counters solo-use attrition. Sidequest is a
self-management aid, not a medical device, and makes no clinical claims.

## 7. The ethics line: supportive contingency vs. dark pattern

Sidequest's mechanics — variable rewards, a feed that pauses, streaks — are
mechanically adjacent to **attention-capture deceptive designs** (Monge
Roffarello, Lukoff & De Russis, CHI '23: infinite scroll, autoplay, removal
of stopping points). A CHI '25 study of dark-pattern recognition found ADHD
users differentially vulnerable to some manipulative tactics — this audience
warrants a *higher* ethical bar, not a lower one. The literature's bright
line: **whose goal does the mechanism serve, and did the user consent to the
persuasion?**

Sidequest's standing rules, derived from that line:

1. **Every contingency serves the user's own declared quest** — never a
   session-time or engagement metric. There is no metric that rewards keeping
   you in the app; the win condition is the dishes being done.
2. **Transparent persuasion.** The app explains its own mechanics (this
   document ships with the product): rewards are variable *because* variable
   schedules sustain behavior; the feed pauses *because* contingency is what
   makes it work. Consent to persuasion is informed, once, at onboarding.
3. **"Can't skip ahead" means earned-only, not inescapable.** You cannot
   *preview* rewards (that would kill the prediction error), but you can
   always *leave* — pause quest is one tap, zero penalty, zero guilt copy.
   The friction is on cheating the reward schedule, never on stopping.
4. **Natural stopping points are preserved.** A completed quest lands on a
   clean "done" screen, not an autoplay chute into the next task. (Roadmap:
   hyperfocus guard — a gentle spoken boundary cue on very long sessions,
   since ADHD hyperfocus impairs self-generated stop signals; Ashinoff &
   Abu-Akel, 2021, *Psychological Research*.)
5. **Non-punitive by default.** People with ADHD show elevated rejection
   sensitivity and emotional dysregulation (validated constructs: Downey &
   Feldman, 1996; the popular "RSD affects 99%" figure is a clinical
   observation, not peer-reviewed data, and we don't repeat it). So: no
   streak-shaming, no guilt copy, no loss-aversion manipulation. A broken
   streak resets silently; getting stuck triggers *shrink the step*, never
   "try harder."

## 8. Time blindness — externalize the clock **[MODERATE]**

Meta-analysis (*Developmental Neuropsychology*, 2024): consistent ADHD
impairments across motor timing, perceptual timing, and temporal foresight,
pooled effect ≈ 0.69. Time is not reliably *felt* in ADHD; it must be made
external. Sidequest speaks time anchors during sessions ("that's ten minutes
in — two steps down") rather than assuming an internal clock.

## Summary table

| Mechanic | Evidence base | Tier |
| --- | --- | --- |
| Body double presence | Eagle et al. 2023/2024; Ara et al. 2025 (pilot); Zajonc 1965 | EMERGING |
| Micro-steps at point of performance | Gollwitzer & Sheeran 2006 (d=.65); Barkley 1997 | STRONG |
| Feed pauses when you stop | Premack 1959; contingency management literature | STRONG |
| Interest audio during chores | Milkman 2014 + Kirgios 2020 (N=6,792); Antrop 2006 | STRONG |
| Background stimulation helps ADHD | Zentall 1983; Söderlund 2007; Nigg 2024 meta | MODERATE |
| Variable, earned-only rewards | Ferster & Skinner 1957; Schultz 1997 | STRONG (mechanism) |
| Gamified ADHD tech | Kollins 2020 RCT; 2025 meta-analyses | MODERATE, with caveats |
| Spoken time anchors | 2024 time-perception meta-analysis | MODERATE |

Sidequest complements — never replaces — clinical care.
