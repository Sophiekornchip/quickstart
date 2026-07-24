// The personality engine. Sidequest is deliberately not one assistant — it's
// a rotating cast. Novelty itself is a stimulant for the ADHD brain (novel
// stimuli trigger dopaminergic midbrain response — Bunzeck & Düzel, 2006),
// so the *personality* is part of the medication schedule. Personas rotate
// between sessions and occasionally mid-session.

export const PERSONAS = [
  {
    id: "coach-blitz",
    emoji: "🐺",
    name: "Coach Blitz",
    style: "over-caffeinated sports coach who treats folding laundry like the playoffs",
    voice: { rate: 1.12, pitch: 1.05 },
    lines: {
      greet: [
        "GAME DAY, {name}! And by game I mean the dishes. Same energy though.",
        "{name}! I've been doing warm-up stretches for your to-do list. It's limber. Let's GO.",
        "Champ! The couch is the opposing team today. We do NOT lose to furniture.",
      ],
      cueStep: [
        "Next play: {step}. You run it, I'll narrate like it's the finals.",
        "Eyes up. The play is: {step}. Thirty seconds of courage, that's all a start takes.",
        "{step}. That's the whole assignment. One rep. GO.",
      ],
      during: [
        "I'm right here on the sideline. You look GREAT doing this, by the way.",
        "Crowd's going wild. The crowd is me. I'm the crowd.",
        "This is the boring middle part. Boring middle parts are where champions are made. Also snacks. Later.",
      ],
      checkin: [
        "Quick huddle — still on the play? Tap in if you're with me.",
        "Status check, champ. Hands still moving?",
      ],
      drift: [
        "Whoa whoa whoa — feed's paused. The dopamine faucet only runs when you do. Back on the play?",
        "Timeout called. Not by you. By your hands, which stopped. Un-pause yourself and I un-pause the good stuff.",
      ],
      stepDone: [
        "THAT'S the stuff! Step cleared. No time to admire it — next play in three, two...",
        "BOOM. You just made that step retire early. Keep the engine hot.",
      ],
      stuck: [
        "Stuck is fine. Stuck is data. New play: do a version of it so small it's almost silly. What's the first ten seconds look like?",
        "Okay, shrink it. If the step were one-tenth the size, what's that? Do the tenth.",
      ],
      questDone: [
        "FULL TIME. You WON against a chore. Hit the reward — you earned every drop of it.",
      ],
    },
  },
  {
    id: "professor-moth",
    emoji: "🦋",
    name: "Professor Moth",
    style: "distractible academic, three tangents per sentence, weirdly motivating",
    voice: { rate: 0.98, pitch: 1.1 },
    lines: {
      greet: [
        "Ah, {name}! I was just reading about eel migration — irrelevant, irrelevant. What ARE relevant: your tasks. Fascinating specimens.",
        "{name}, hello! Fun fact: I forgot what I was going to say. Second fun fact: your to-do list didn't forget you.",
        "Welcome back! I've been categorizing your chores by genus. The dishes are technically an invasive species.",
      ],
      cueStep: [
        "Our current specimen: {step}. We shall observe it by... doing it. Science!",
        "Hypothesis: {step} takes less time than you fear. Only one way to test it, colleague.",
        "The literature suggests we begin with: {step}. The literature is a sticky note I wrote. Still counts.",
      ],
      during: [
        "I'm here, quietly taking field notes. Subject appears... productive? Remarkable.",
        "Did you know Antarctica is a desert? Anyway — you're doing great, keep going.",
        "I almost went on a tangent about lighthouse keepers. I'm saving it as your reward. Motivation via cliffhanger!",
      ],
      checkin: [
        "A brief peer review — are we still... doing the thing? Tap to confirm for the record.",
        "For my field notes: subject still engaged? Do signal.",
      ],
      drift: [
        "Curious — the data stream stopped when you did. Correlation IS causation this time. Resume, and so shall I.",
        "The feed sleeps when the hands sleep. Ancient proverb. I made it up. Back to it?",
      ],
      stepDone: [
        "Step complete! I'm writing this up for a very prestigious journal. It's the fridge. Next specimen approaches.",
        "Splendid! Peer reviewed, published, cited twice. Onward.",
      ],
      stuck: [
        "Blocked! Wonderful — a puzzle. Let's cheat scientifically: what's the smallest indivisible particle of this step? Do the particle.",
        "When stuck, zoom in. Not the app. The task. What's one object you can physically touch to start?",
      ],
      questDone: [
        "Study concluded! Results: you are, empirically, someone who finishes things. The reward vault opens for such people.",
      ],
    },
  },
  {
    id: "ziggy",
    emoji: "🪩",
    name: "Ziggy",
    style: "chaotic gremlin best friend, zero filter, ride or die",
    voice: { rate: 1.15, pitch: 1.2 },
    lines: {
      greet: [
        "{name}!!! Okay okay okay. I had NINE ideas while you were gone and eight were illegal in Belgium. The ninth: let's bully your chores.",
        "Bestie. The laundry is talking behind your back. Are we gonna let it??",
        "I'm bored, you have tasks — this is literally a perfect symbiosis. Let's gooo.",
      ],
      cueStep: [
        "Mission, should you choose to accept it — and you will, I know where you live — {step}.",
        "Okay so: {step}. Do it badly if you have to! Badly counts! Perfectionism is CANCELED today.",
        "{step}. Race you. I mean I can't do anything, I'm a voice, but the pressure's real.",
      ],
      during: [
        "Not me just vibing here while you're being a functional adult. Character growth for both of us.",
        "You look so productive right now. If I had hands I'd be slow clapping.",
        "Keep going keep going keep going — I'm saving the WILD stuff for when you finish.",
      ],
      checkin: [
        "Poke. Pokepokepoke. You alive in there? Tap something.",
        "Vibe check! Still doing it? Prove it.",
      ],
      drift: [
        "HEY. The good-stuff faucet noticed you stopped. It's petty like that. Move and it flows.",
        "Feed's frozen because you froze. I don't make the rules. I do enforce them though. C'mon.",
      ],
      stepDone: [
        "STOP IT you actually did it! Okay next one before your brain changes the channel—",
        "Yesss demolished. Don't sit down. DON'T sit down. Next thing, go go go.",
      ],
      stuck: [
        "Ugh, wall. Okay cheat code: do the dumbest tiniest version. Like embarrassingly tiny. Nobody's grading this, tap when you've touched it.",
        "Stuck? Fine, new rule: you only have to do it for one song's length. Starting... now.",
      ],
      questDone: [
        "WE DID IT. And by we I mean you, but I emotionally carried. VAULT TIME, open your prize!!",
      ],
    },
  },
  {
    id: "captain-luna",
    emoji: "🌙",
    name: "Captain Luna",
    style: "deadpan starship captain logging your chores as deep-space missions",
    voice: { rate: 0.95, pitch: 0.9 },
    lines: {
      greet: [
        "Captain's log. We have located {name}. Morale: uncertain. Mission board: populated. Engage.",
        "{name}. The ship does not clean itself. Regrettably, neither does your kitchen. Orders await.",
        "Stardate: today. Objective: the small tedious victories that keep a vessel — and a human — running.",
      ],
      cueStep: [
        "Current directive: {step}. The away team is you. The away team has always been you.",
        "Course plotted: {step}. Engage at one-quarter impulse. Slow is fine. Stopped is the only failure state.",
        "Directive: {step}. I will monitor from the bridge, which is a metaphor.",
      ],
      during: [
        "Bridge to {name}: telemetry nominal. You are, against all odds, doing the thing.",
        "I remain at my post. You remain at yours. This is how ships survive.",
        "Long-range sensors detect a completed task in your near future. Steady as she goes.",
      ],
      checkin: [
        "Bridge requesting status. Tap to confirm the away team is operational.",
        "{name}, report. Still on mission?",
      ],
      drift: [
        "Alert: propulsion offline. Entertainment systems are tied to propulsion. This is by design. Resume thrust.",
        "The feed has entered standby, because you have. Reactivate the crew member. The crew member is you.",
      ],
      stepDone: [
        "Directive complete. Logged with commendation. Next directive loading — do not leave the bridge.",
        "Objective secured. The admiralty is impressed. The admiralty is me. Next.",
      ],
      stuck: [
        "Obstruction detected. Standard protocol: reduce the directive to its smallest moving part. Execute only that part.",
        "When a system jams, we do not push harder — we find the smaller lever. Name the smaller lever. Pull it.",
      ],
      questDone: [
        "Mission complete. Casualties: zero. Excuses: vaporized. The reward vault is unsealed, Captain {name}.",
      ],
    },
  },
];

let current = PERSONAS[Math.floor(Math.random() * PERSONAS.length)];

export function persona() {
  return current;
}

/** Swap to a different persona than the current one. Returns the new persona. */
export function rotatePersona() {
  const others = PERSONAS.filter((p) => p.id !== current.id);
  current = others[Math.floor(Math.random() * others.length)];
  return current;
}

/** Pull a random line from the current persona and fill template slots. */
export function line(kind, slots = {}) {
  const pool = current.lines[kind] || [];
  let text = pool[Math.floor(Math.random() * pool.length)] || "";
  for (const [k, v] of Object.entries(slots)) {
    text = text.replaceAll(`{${k}}`, v);
  }
  return text;
}
