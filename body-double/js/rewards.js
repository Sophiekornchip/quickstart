// Reward engine: the "dog trainer" half of Sidequest.
//
// Two rules borrowed straight from animal training and reinforcement
// research, applied kindly to humans:
//
// 1. VARIABLE-RATIO REINFORCEMENT (Ferster & Skinner, 1957): rewards land
//    unpredictably in size and kind. Variable schedules produce the most
//    persistent behavior of any schedule — it's the engine slot machines
//    exploit. Sidequest points that engine at your laundry instead.
//
// 2. NO SKIPPING TO THE TREAT: rewards are generated *only* on completion
//    events and stored in a vault (the treat jar) you can't preload. The
//    novelty is real precisely because you can't fast-forward to it.

import { randomReward } from "./interests.js";
import * as state from "./state.js";
import * as brain from "./brain.js";

const XP_TABLE = { step: 10, quest: 50, streakBonus: 25 };

const LOOT = [
  { rarity: "common", chance: 0.55, flair: "✨", label: "a shiny" },
  { rarity: "rare", chance: 0.3, flair: "💎", label: "a RARE drop" },
  { rarity: "epic", chance: 0.12, flair: "🌟", label: "an EPIC drop" },
  { rarity: "legendary", chance: 0.03, flair: "👑", label: "a LEGENDARY drop" },
];

function rollRarity() {
  let roll = Math.random();
  for (const tier of LOOT) {
    if (roll < tier.chance) return tier;
    roll -= tier.chance;
  }
  return LOOT[0];
}

/** Small chance a mere step completion pays out early — variable ratio. */
export function maybeStepBonus() {
  return Math.random() < 0.18;
}

export function stepXp() {
  return state.addXp(XP_TABLE.step);
}

/**
 * Called only on quest completion. Rolls loot, generates a novel
 * special-interest reward, banks it in the treat jar, pays XP + streak.
 */
export function questPayout(interests) {
  const tier = rollRarity();
  // Prefer a freshly generated, never-heard-before reward from the AI vault;
  // seeds are the offline fallback. Either way it was only minted now, on
  // completion — the no-skip contingency is structural, not cosmetic.
  const content = brain.nextReward() || randomReward(interests);
  const streak = state.recordQuestComplete();
  let xp = XP_TABLE.quest * (tier.rarity === "legendary" ? 4 : tier.rarity === "epic" ? 2 : 1);
  if (streak > 1) xp += XP_TABLE.streakBonus * Math.min(streak, 7);
  state.addXp(xp);

  const drop = {
    id: `loot${Date.now()}`,
    tier: tier.rarity,
    flair: tier.flair,
    label: tier.label,
    content,
    earnedAt: new Date().toISOString(),
  };
  const s = state.get();
  s.treatJar.push(drop);
  state.save();

  return { drop, xp, streak };
}
