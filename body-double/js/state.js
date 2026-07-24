// Persistent app state. Everything stays on-device (localStorage) — a design
// requirement for a wearable that hears your whole day.

const KEY = "sidequest.v1";

const defaults = () => ({
  name: "",
  interests: [],
  xp: 0,
  streak: 0,
  lastQuestDay: null,     // "YYYY-MM-DD" of last completed quest, for streaks
  treatJar: [],           // earned-but-unopened rewards (the locked vault)
  quests: [],             // { id, title, steps: [..], stepIndex, done, createdAt }
  muted: false,
});

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...defaults(), ...JSON.parse(raw) };
  } catch (e) {
    console.warn("state load failed, starting fresh", e);
  }
  return defaults();
}

export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("state save failed", e);
  }
}

export function get() {
  return state;
}

export function update(patch) {
  Object.assign(state, patch);
  save();
  return state;
}

export function addXp(amount) {
  state.xp += amount;
  save();
  return state.xp;
}

/** Record a completed quest and roll the streak. Returns the new streak. */
export function recordQuestComplete() {
  const today = new Date().toISOString().slice(0, 10);
  if (state.lastQuestDay !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    state.streak = state.lastQuestDay === yesterday ? state.streak + 1 : 1;
    state.lastQuestDay = today;
  }
  save();
  return state.streak;
}

export function resetAll() {
  state = defaults();
  save();
}
