// Persistent app state. Everything stays on-device (localStorage) — a design
// requirement for a wearable that hears your whole day.

const KEY = "sidequest.v1";

const defaults = () => ({
  name: "",
  city: "",               // optional — unlocks local happenings in the feed
  interests: [],
  xp: 0,
  streak: 0,
  lastQuestDay: null,     // "YYYY-MM-DD" of last completed quest, for streaks
  treatJar: [],           // trophy shelf: record of earned drops
  quests: [],             // { id, title, steps: [..], stepIndex, done, createdAt }
  muted: false,
  sickDay: false,         // contingencies suspended, companionship stays
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

/**
 * Record a completed quest and roll the streak.
 * Streaks-with-grace: a missed day DENTS the streak (−1 per missed day),
 * it never zeroes it. Rigid streaks cause abandonment-after-break; graceful
 * decay preserves the habit identity.
 */
export function recordQuestComplete() {
  const today = new Date().toISOString().slice(0, 10);
  if (state.lastQuestDay !== today) {
    if (state.lastQuestDay) {
      const gapDays = Math.round(
        (Date.parse(today) - Date.parse(state.lastQuestDay)) / 86400000
      );
      state.streak =
        gapDays <= 1
          ? state.streak + 1
          : Math.max(1, state.streak - (gapDays - 1));
    } else {
      state.streak = 1;
    }
    state.lastQuestDay = today;
  }
  save();
  return state.streak;
}

export function resetAll() {
  state = defaults();
  save();
}
