// Quest builder: turns a dreaded task into a chain of micro-steps.
// This is "shaping" from behavioral training — reinforce successive
// approximations instead of demanding the whole behavior at once. For ADHD,
// task initiation is the wall; a step small enough to be almost silly gets
// you over it (implementation intentions: Gollwitzer, 1999).
//
// The prototype uses a keyword playbook; the production build hands this to
// an LLM with the same contract: 3–6 steps, each startable in under a minute.

const PLAYBOOK = [
  {
    match: /dish|kitchen|sink/i,
    steps: [
      "Walk to the sink and just look at it. That's the whole step.",
      "Clear one flat surface — stack everything on one side.",
      "Wash five things. Only five. Count them out loud.",
      "Wash five more (sneaky, I know).",
      "Wipe the counter like you're in a cleaning montage.",
    ],
  },
  {
    match: /laundry|clothes|fold/i,
    steps: [
      "Go stand next to the laundry. Physical proximity counts.",
      "Sort into two piles max. We're not the Container Store.",
      "Start the machine, or fold ten items — whichever applies.",
      "Fold or hang the rest while the feed plays.",
      "Put the piles where they actually live.",
    ],
  },
  {
    match: /email|inbox|message|reply/i,
    steps: [
      "Open the inbox. Do not read anything yet. Just open it.",
      "Delete or archive ten easy ones. Speed round.",
      "Answer the single scariest one with two sentences max.",
      "Answer two more. Short replies are legal replies.",
    ],
  },
  {
    match: /clean|tidy|room|declutter|mess/i,
    steps: [
      "Pick up exactly one thing and put it where it belongs.",
      "Set a landing zone: one box or corner for stuff with no home.",
      "Clear one surface completely. Just one.",
      "Do a trash-only sweep of the whole room.",
      "Two-minute final boss: anything on the floor gets a home or the box.",
    ],
  },
  {
    match: /shower|hygiene|teeth|brush/i,
    steps: [
      "Walk to the bathroom. You don't have to do anything yet.",
      "Touch the faucet. Turn on the water.",
      "You're in the room with running water — momentum does the rest.",
    ],
  },
  {
    match: /work|write|report|study|homework|project/i,
    steps: [
      "Open the document or app. Opening is a full step here.",
      "Write or read one terrible sentence / paragraph. Terrible is the assignment.",
      "Do 10 focused minutes. The feed keeps you company.",
      "Do 10 more. You're allowed to be mediocre at speed.",
      "Write down tomorrow's first step, then stop while it's easy.",
    ],
  },
  {
    match: /call|phone|appointment|doctor|dentist/i,
    steps: [
      "Find the number and put it on screen. That's it.",
      "Write the one sentence you'll open with.",
      "Press call. The scary part is over in three seconds.",
    ],
  },
];

const GENERIC = (title) => [
  `Physically move to where "${title}" happens. Just relocate.`,
  "Do the smallest possible piece — embarrassingly small is perfect.",
  "Keep going for 10 minutes with the feed on.",
  "Push to a natural stopping point. Done beats perfect.",
];

let nextId = Date.now();

export function buildQuest(title) {
  const play = PLAYBOOK.find((p) => p.match.test(title));
  return {
    id: `q${nextId++}`,
    title: title.trim(),
    steps: play ? [...play.steps] : GENERIC(title.trim()),
    stepIndex: 0,
    done: false,
    createdAt: new Date().toISOString(),
  };
}
