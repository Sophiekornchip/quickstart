// The body-double session engine — the heart of Sidequest.
//
// Body doubling (working alongside another presence) measurably improves
// task initiation and persistence for ADHD'ers; the presence doesn't need
// to help, it needs to *be there* and occasionally acknowledge you. This
// engine reproduces that loop:
//
//   cue step → companionship chatter + dopamine feed while you work
//   → periodic check-ins ("still with me?")
//   → no response? feed PAUSES (contingent stimulation — the reward stream
//     is yoked to engagement, like a treadmill that only plays your show
//     while you run)
//   → step done → variable reinforcement → next cue
//
// On glasses hardware, check-ins can be confirmed hands-free by voice
// ("yep"), head-nod IMU gesture, or egocentric-camera activity detection.
// In the browser prototype it's a tap.

import * as speech from "./speech.js";
import { persona, rotatePersona, line } from "./personas.js";
import { randomFact } from "./interests.js";
import * as rewards from "./rewards.js";
import * as brain from "./brain.js";

const COMPANION_INTERVAL_MS = 22000;   // chatter/fact cadence while engaged
const CHECKIN_INTERVAL_MS = 60000;     // how often we ask for proof of life
const CHECKIN_GRACE_MS = 20000;        // silence tolerated before feed pauses
const PERSONA_SHIFT_CHANCE = 0.3;      // per completed step
const TIME_ANCHOR_MS = 5 * 60000;      // spoken elapsed-time cue (time blindness:
                                       // ADHD time perception deficits ≈ d 0.69 —
                                       // externalize the clock, don't assume one)
const HYPERFOCUS_GUARD_MS = 50 * 60000; // gentle boundary cue on long sessions —
                                        // hyperfocus impairs self-generated stop
                                        // signals (Ashinoff & Abu-Akel, 2021)

export class Session {
  /**
   * @param {object} quest       quest object from tasks.js
   * @param {string[]} interests selected interest pack ids
   * @param {object} ui          callbacks: caption(who, text), step(text, i, n),
   *                             feed(status), attention(bool), personaChanged(p),
   *                             stepBonus(text), questComplete(payout)
   */
  constructor(quest, interests, ui) {
    this.quest = quest;
    this.interests = interests;
    this.ui = ui;
    this.engaged = true;
    this.awaitingCheckin = false;
    this.chatty = true; // quiet mode = ambient presence, check-ins only
    this.startedAt = Date.now();
    this.lastAnchorAt = Date.now();
    this.timers = { companion: null, checkin: null, grace: null, hyperfocus: null };
    this.speaking = Promise.resolve();
  }

  // Serialize speech so lines don't talk over each other.
  narrate(text, opts = {}) {
    const p = persona();
    this.ui.caption(p, text);
    this.speaking = this.speaking.then(() =>
      speech.say(text, { ...p.voice, ...opts })
    );
    return this.speaking;
  }

  start() {
    const p = persona();
    this.ui.personaChanged(p);
    this.cueStep(true);
    this.armCompanion();
    this.armCheckin();
    this.armHyperfocusGuard();
    this.setFeed("live");
  }

  /** Presence dial: quiet keeps the double there but nearly silent. */
  setChatty(on) {
    this.chatty = on;
    this.narrate(on
      ? "Chatty mode back on. You missed me, admit it."
      : "Going quiet. Still here, still watching your six — I'll only pipe up for check-ins.");
  }

  elapsedMinutes() {
    return Math.round((Date.now() - this.startedAt) / 60000);
  }

  /** Gentle boundary cue on very long sessions — hyperfocus can't self-stop. */
  armHyperfocusGuard() {
    clearTimeout(this.timers.hyperfocus);
    this.timers.hyperfocus = setTimeout(() => {
      this.narrate(
        `Boundary check, not a nag: we've been at this ${this.elapsedMinutes()} minutes. ` +
        "Water, stretch, look at something far away. The quest will hold for ninety seconds."
      );
      this.armHyperfocusGuard(); // re-arm; next cue in another 50 min
    }, HYPERFOCUS_GUARD_MS);
  }

  cueStep(first = false) {
    const { steps, stepIndex } = this.quest;
    const stepText = steps[stepIndex];
    this.ui.step(stepText, stepIndex, steps.length);
    const intro = first ? line("greet", { name: this.ui.userName }) + " " : "";
    this.narrate(intro + line("cueStep", { step: stepText }));
  }

  // ---- engagement loop ----

  /** Context passed to the AI brain for generated lines. */
  ctx() {
    return {
      questTitle: this.quest.title,
      step: this.quest.steps[this.quest.stepIndex],
      name: this.ui.userName,
    };
  }

  armCompanion() {
    clearInterval(this.timers.companion);
    brain.refillFeed(this.interests); // buy content ahead of the need
    this.timers.companion = setInterval(async () => {
      if (!this.engaged) return; // feed paused ⇒ no free entertainment
      brain.refillFeed(this.interests);
      // Time anchor: ADHD time perception is unreliable — externalize the clock.
      if (Date.now() - this.lastAnchorAt > TIME_ANCHOR_MS) {
        this.lastAnchorAt = Date.now();
        this.narrate(
          `Time check: ${this.elapsedMinutes()} minutes in, step ${this.quest.stepIndex + 1} of ${this.quest.steps.length}. Still moving.`
        );
        return;
      }
      // Quiet mode: ambient presence — an occasional feed drip, no banter.
      if (!this.chatty) {
        if (Math.random() < 0.35) this.narrate(brain.nextFeedItem() || randomFact(this.interests));
        return;
      }
      // Alternate between persona companionship and special-interest drip.
      if (Math.random() < 0.5) {
        // Generated banter when the brain is up; canned lines otherwise.
        const generated =
          brain.isOnline() && Math.random() < 0.6
            ? await brain.banter(persona(), "during", this.ctx())
            : null;
        if (!this.engaged) return; // drifted while we were generating
        this.narrate(generated || line("during"));
      } else {
        this.narrate(brain.nextFeedItem() || randomFact(this.interests));
      }
    }, COMPANION_INTERVAL_MS);
  }

  armCheckin() {
    clearInterval(this.timers.checkin);
    this.timers.checkin = setInterval(() => this.requestCheckin(), CHECKIN_INTERVAL_MS);
  }

  requestCheckin() {
    if (this.awaitingCheckin) return;
    this.awaitingCheckin = true;
    this.ui.attention(true);
    this.narrate(line("checkin"));
    this.timers.grace = setTimeout(() => this.onDrift(), CHECKIN_GRACE_MS);
  }

  /** User confirmed they're still working (tap / voice / nod). */
  checkin() {
    this.awaitingCheckin = false;
    clearTimeout(this.timers.grace);
    this.ui.attention(false);
    if (!this.engaged) {
      this.engaged = true;
      this.setFeed("live");
      this.narrate("There you are. Feed's back on — where were we? Right: " + this.quest.steps[this.quest.stepIndex]);
    }
  }

  /** Check-in grace expired: the human stopped, so the dopamine stops. */
  onDrift() {
    this.engaged = false;
    this.awaitingCheckin = false;
    this.ui.attention(true);
    this.setFeed("paused");
    speech.stopSpeaking();
    this.narrate(line("drift"), { interrupt: true });
  }

  setFeed(status) {
    this.ui.feed(status);
  }

  // ---- progress events ----

  stepDone() {
    this.checkin(); // completing a step is the strongest proof of engagement
    rewards.stepXp();
    this.narrate(line("stepDone"));

    if (rewards.maybeStepBonus()) {
      // Variable-ratio surprise: sometimes a mid-quest treat, unannounced.
      const bonus = randomFact(this.interests);
      this.ui.stepBonus(bonus);
      this.narrate("Surprise treat, no reason: " + bonus);
    }

    this.quest.stepIndex += 1;
    if (this.quest.stepIndex >= this.quest.steps.length) {
      return this.complete();
    }

    // Sporadic personality shift keeps the companion itself novel.
    if (Math.random() < PERSONA_SHIFT_CHANCE) {
      const p = rotatePersona();
      this.ui.personaChanged(p);
      this.narrate(`Shift change — ${p.name} here now. ${p.style}. Anyway—`);
    }
    this.cueStep();
  }

  stuck() {
    this.checkin();
    this.narrate(line("stuck"));
  }

  complete() {
    this.quest.done = true;
    this.stop(false);
    const payout = rewards.questPayout(this.interests);
    this.narrate(line("questDone", { name: this.ui.userName }));
    this.ui.questComplete(payout);
  }

  /** Tear down all timers. speakFarewell=false when completing (payout speaks). */
  stop(speakFarewell = true) {
    clearInterval(this.timers.companion);
    clearInterval(this.timers.checkin);
    clearTimeout(this.timers.grace);
    clearTimeout(this.timers.hyperfocus);
    this.ui.attention(false);
    this.setFeed("idle");
    if (speakFarewell) {
      speech.stopSpeaking();
      this.narrate("Quest paused, not abandoned. It'll be here. So will I. Annoyingly.", { interrupt: true });
    }
  }
}
