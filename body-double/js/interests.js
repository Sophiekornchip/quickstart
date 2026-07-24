// Special-interest content packs — the dopamine feed's fuel.
// While you work, Sidequest drips these through the glasses' speakers
// (temptation bundling: pairing a "want" with a "should" — Milkman et al.,
// 2014). The feed pauses the moment you stop working, and the juiciest
// items are held back as completion rewards.
//
// In a production build these packs are hydrated from live sources (podcast
// segments, audio clips, LLM-generated riffs on the user's niche interests).
// The offline seed packs below keep the prototype fully self-contained.

export const INTEREST_PACKS = {
  space: {
    emoji: "🚀",
    label: "Space",
    facts: [
      "A day on Venus is longer than its year. Venus is out here refusing to be normal.",
      "Neutron stars can spin 600 times per second. A city-sized object. Six hundred. Per second.",
      "There's a planet made largely of diamond — 55 Cancri e. Space said 'budget? never heard of it.'",
      "Saturn would float in water, if you had a bathtub eighty thousand miles wide.",
      "The footprints on the Moon will last millions of years. No wind. No cleanup crew. Just vibes.",
      "Jupiter's Great Red Spot is a storm bigger than Earth that's been raging for centuries.",
      "One spoonful of neutron star matter would weigh about a billion tons. Do not put it in your pocket.",
      "Olympus Mons on Mars is nearly three times the height of Everest, and nobody's climbed it. Yet.",
    ],
    rewards: [
      "Reward drop: in 1977 we caught the 'Wow!' signal — 72 seconds of unexplained radio from deep space, and it has never repeated. We still don't know what it was.",
      "Reward drop: Voyager 1 is over 15 billion miles away and still whispering back to us on 23 watts — about the power of a fridge light bulb.",
      "Reward drop: there are rogue planets drifting between the stars with no sun at all — billions of them, sailing dark and alone through the galaxy.",
    ],
  },
  dinosaurs: {
    emoji: "🦕",
    label: "Dinosaurs",
    facts: [
      "T. rex lived closer in time to you than to Stegosaurus. Chew on that. With banana-sized teeth.",
      "Some sauropods needed to eat half a ton of plants a day. Relatable energy honestly.",
      "Birds are dinosaurs. That pigeon judging you? Direct line to velociraptors.",
      "Velociraptors were actually turkey-sized and feathered. Hollywood owes them an apology and a paycheck.",
      "The Argentinosaurus may have been 35 meters long. Its heart alone weighed as much as a person.",
      "Sue, the most complete T. rex ever found, sold for over 8 million dollars. Skeleton money.",
      "Ankylosaurus had a tail club that could shatter bone. Nature's first monster truck.",
    ],
    rewards: [
      "Reward drop: we've found fossilized dinosaur SLEEPING positions — curled up like birds, mid-nap for 120 million years.",
      "Reward drop: in 2016 scientists found a feathered dinosaur tail perfectly preserved in amber. Feathers, bones, and all — a dinosaur you could hold in your palm.",
      "Reward drop: some duck-billed dinosaurs had hundreds of teeth arranged in batteries that self-replaced for life. Infinite teeth. The dental plan of the Cretaceous.",
    ],
  },
  ocean: {
    emoji: "🐙",
    label: "Deep Ocean",
    facts: [
      "We've mapped more of Mars than of our own ocean floor. The abyss is right there, being ignored.",
      "Octopuses have three hearts, blue blood, and can taste with their arms. Show-offs.",
      "The anglerfish's glowing lure is powered by bacteria roommates. Symbiotic nightlight.",
      "Sperm whales sleep vertically, bobbing in pods like giant sea pickles. Look it up later — after the task.",
      "There are lakes and rivers ON the ocean floor — brine pools so dense they have shorelines and waves.",
      "The immortal jellyfish can age backwards. It hit a rough patch and just... restarted.",
      "Giant squid eyes are the size of dinner plates — the largest eyes in the animal kingdom.",
    ],
    rewards: [
      "Reward drop: the 52-hertz whale sings at a frequency no other whale uses. It's been called the loneliest whale on Earth — and scientists think others may finally be answering.",
      "Reward drop: in the Mariana Trench, seven miles down, we found... a plastic bag. But also entirely new species of ghostly white snailfish thriving under pressure that would crush a submarine.",
      "Reward drop: bioluminescent bays exist where every paddle stroke ignites blue fire in the water. You can kayak through liquid starlight in Puerto Rico.",
    ],
  },
  mythology: {
    emoji: "⚡",
    label: "Mythology",
    facts: [
      "Loki once turned into a mare, got pregnant, and gave birth to an eight-legged horse. Odin rode it. Nobody discussed it.",
      "The Egyptian god Set had the head of an animal scientists still can't identify. A god of pure cryptid energy.",
      "Persephone's pomegranate seeds are why we have winter. Snack responsibly.",
      "Māui fished entire islands out of the sea with a magic hook. Overachiever.",
      "Cerberus's drool was said to spawn poisonous plants. Even the dog's slobber had lore.",
      "In Norse myth the world ends and then just... starts again. The gods knew about New Game Plus.",
      "Athena was born fully armored from Zeus's headache. Some ideas really do arrive like that.",
    ],
    rewards: [
      "Reward drop: the Norse believed thunder was Thor commuting. The full story of how Thor once dressed as a bride to steal his hammer back is even better — and it worked.",
      "Reward drop: there's a Japanese yokai called the Akaname that exists only to lick bathrooms clean. Even folklore invented a cleaning body double.",
      "Reward drop: the Epic of Gilgamesh — humanity's oldest surviving story — is about grief, friendship, and a man who couldn't stop doomscrolling his own mortality. Four thousand years and we haven't changed.",
    ],
  },
  music: {
    emoji: "🎸",
    label: "Music",
    facts: [
      "Beethoven kept composing after going deaf, sawing the legs off his piano to feel vibrations through the floor.",
      "The longest concert in history is still playing — a John Cage organ piece in Germany scheduled to last 639 years.",
      "Queen's 'Bohemian Rhapsody' overdubbed vocals so many times the tape became transparent.",
      "The Beatles were rejected by Decca Records because 'guitar groups are on the way out.'",
      "Mozart wrote a canon literally titled — well, it's rude. Extremely rude. Genius contains multitudes.",
      "Dolly Parton lost a Dolly Parton look-alike contest. To a man.",
      "The world's oldest known melody is 3,400 years old, from ancient Syria. We can still play it.",
    ],
    rewards: [
      "Reward drop: in 1952, John Cage premiered 4'33\" — four and a half minutes of silence — and the real composition was the audience slowly losing its mind. It's still argued about today.",
      "Reward drop: NASA put a golden record on Voyager with Chuck Berry on it. When it launched, Saturday Night Live joked the aliens replied: 'Send more Chuck Berry.'",
      "Reward drop: the 'brown note' is a myth, but infrasound below 20 hertz genuinely causes unease and awe — some pipe organs use it to make congregations feel the presence of the divine.",
    ],
  },
  truecrime: {
    emoji: "🔍",
    label: "Unsolved Mysteries",
    facts: [
      "The Voynich manuscript has resisted every codebreaker for 600 years, including the people who cracked Enigma.",
      "D.B. Cooper hijacked a plane, took the ransom, parachuted into the night in 1971, and was never seen again.",
      "The Antikythera mechanism is a 2,000-year-old analog computer found in a shipwreck. We still don't fully know who built it.",
      "In 1518 a dancing plague hit Strasbourg. Hundreds danced for days. Nobody knows why.",
      "The Zodiac's final cipher took 51 years to crack — solved in 2020 by three hobbyists.",
      "Australia's Somerton Man died in 1948 with a scrap of Persian poetry sewn into his pocket reading 'it is ended.'",
      "The Max Headroom broadcast hijacker interrupted Chicago TV in 1987 and has never been identified.",
    ],
    rewards: [
      "Reward drop: the Circleville Letter Writer terrorized an Ohio town for years with letters that knew everyone's secrets — and kept arriving even while the main suspect sat in prison.",
      "Reward drop: in 1990, thieves dressed as cops stole 500 million dollars of art from the Gardner Museum. The empty frames still hang on the walls, waiting.",
      "Reward drop: the Dyatlov Pass incident — nine experienced hikers, a tent cut open from the inside, and six decades of theories. The latest science says a rare slab avalanche... probably.",
    ],
  },
};

export function packFor(id) {
  return INTEREST_PACKS[id];
}

export function randomFact(interestIds) {
  const pools = interestIds.map((id) => INTEREST_PACKS[id]).filter(Boolean);
  if (!pools.length) return "Fun fact: you're doing the thing right now. That's rarer than most fun facts.";
  const pack = pools[Math.floor(Math.random() * pools.length)];
  return pack.facts[Math.floor(Math.random() * pack.facts.length)];
}

/** The held-back, juicier material — only dispensed on task completion. */
export function randomReward(interestIds) {
  const pools = interestIds.map((id) => INTEREST_PACKS[id]).filter(Boolean);
  if (!pools.length) return "Reward drop: an unclaimed mystery. Pick some interests and it gets much better.";
  const pack = pools[Math.floor(Math.random() * pools.length)];
  return pack.rewards[Math.floor(Math.random() * pack.rewards.length)];
}
