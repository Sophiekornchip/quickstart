// Client side of the AI brain. Every function degrades gracefully: if the
// server (or the model) is unreachable, callers fall back to the offline seed
// content. The app must never block on the network — ADHD UX rule #1: the
// moment of motivation is perishable.

let aiOnline = false;

export function isOnline() {
  return aiOnline;
}

export async function detect() {
  try {
    const res = await fetch("/api/health");
    const data = await res.json();
    aiOnline = Boolean(data.ai);
  } catch {
    aiOnline = false;
  }
  return aiOnline;
}

async function post(path, body, timeoutMs) {
  if (!aiOnline) return null;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/** AI task breakdown. Returns {questTitle, steps} or null. */
export function quest(title, name, personaStyle) {
  return post("/api/quest", { title, name, personaStyle }, 20000);
}

let city = "";

/** Optional home city — unlocks local happenings in the feed. */
export function setCity(value) {
  city = value || "";
}

/** Fresh dopamine content (web-search-backed when online). Returns {items, reward} or null. */
export function feed(interests, count = 8) {
  return post("/api/feed", { interests, city, count }, 45000);
}

/** One generated persona line. Returns string or null. */
export async function banter(persona, kind, ctx) {
  const data = await post(
    "/api/banter",
    {
      persona: { name: persona.name, style: persona.style },
      kind,
      questTitle: ctx.questTitle,
      step: ctx.step,
      name: ctx.name,
    },
    12000
  );
  return data?.line || null;
}

// ---- prefetched dopamine queue ----
// The feed must play instantly when engagement resumes, so we buy content
// ahead of time and drain it locally.

const queue = [];
const rewardVault = [];
let refilling = false;

export async function refillFeed(interests) {
  if (!aiOnline || refilling || queue.length > 4) return;
  refilling = true;
  const data = await feed(interests, 8);
  if (data?.items?.length) {
    queue.push(...data.items);
    if (data.reward) rewardVault.push(data.reward);
  }
  refilling = false;
}

/** Next feed item, or null if the AI queue is dry (caller falls back to seeds). */
export function nextFeedItem() {
  return queue.shift() ?? null;
}

/** A held-back AI reward, or null. */
export function nextReward() {
  return rewardVault.shift() ?? null;
}
