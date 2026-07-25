// App shell: screens, wiring, and the glue between the HUD and the engines.

import * as state from "./state.js";
import * as speech from "./speech.js";
import { persona, line } from "./personas.js";
import { INTEREST_PACKS } from "./interests.js";
import { buildQuestSmart } from "./tasks.js";
import { Session } from "./session.js";
import * as brain from "./brain.js";

const $ = (id) => document.getElementById(id);
const screens = ["onboard", "home", "session", "reward"];

let session = null;

function show(name) {
  for (const s of screens) $(`screen-${s}`).classList.toggle("hidden", s !== name);
}

function refreshGlance() {
  const s = state.get();
  $("glance-streak").textContent = `🔥 ${s.streak}`;
  $("glance-xp").textContent = `✦ ${s.xp}`;
  $("glance-persona").textContent = persona().emoji;
}

function setGlanceStep(text) {
  $("glance-step").textContent = text;
}

// ---- captions ----

function caption(who, text) {
  const el = $("caption");
  const row = document.createElement("div");
  row.innerHTML = `<span class="who">${who.emoji} ${who.name}:</span> `;
  row.appendChild(document.createTextNode(text));
  el.appendChild(row);
  while (el.childNodes.length > 6) el.removeChild(el.firstChild);
  el.scrollTop = el.scrollHeight;
}

function agentSay(text) {
  const p = persona();
  $("agent-line").textContent = `${p.emoji} ${text}`;
  speech.say(text, p.voice);
}

// ---- onboarding ----

function renderInterestPicker() {
  const picker = $("interest-picker");
  picker.innerHTML = "";
  const selected = new Set(state.get().interests);
  for (const [id, pack] of Object.entries(INTEREST_PACKS)) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "interest-tag" + (selected.has(id) ? " selected" : "");
    btn.textContent = `${pack.emoji} ${pack.label}`;
    btn.onclick = () => {
      selected.has(id) ? selected.delete(id) : selected.add(id);
      btn.classList.toggle("selected");
      state.update({ interests: [...selected] });
    };
    picker.appendChild(btn);
  }
}

$("btn-start").onclick = () => {
  const name = $("user-name").value.trim() || "friend";
  const city = $("user-city").value.trim();
  state.update({ name, city });
  brain.setCity(city);
  const s = state.get();
  if (!s.interests.length) state.update({ interests: ["space"] });
  goHome(true);
};

// ---- home ----

function renderQuests() {
  const list = $("quest-list");
  list.innerHTML = "";
  const quests = state.get().quests.filter((q) => !q.done).slice(0, 6);
  for (const q of quests) {
    const card = document.createElement("div");
    card.className = "quest-card";
    const title = document.createElement("span");
    title.className = "quest-title";
    title.textContent = q.title;
    const meta = document.createElement("span");
    meta.className = "quest-meta";
    meta.textContent = `step ${q.stepIndex + 1}/${q.steps.length}`;
    const go = document.createElement("button");
    go.className = "btn btn-primary";
    go.textContent = "▶";
    go.title = "start body-double session";
    go.onclick = () => startSession(q);
    card.append(title, meta, go);
    list.appendChild(card);
  }
  if (!quests.length) {
    const empty = document.createElement("div");
    empty.className = "quest-meta";
    empty.style.textAlign = "center";
    empty.textContent = "no open quests — name the thing you're dreading ↓";
    list.appendChild(empty);
  }
}

function goHome(greet = false) {
  show("home");
  setGlanceStep("quest board");
  refreshGlance();
  renderQuests();
  if (greet) agentSay(line("greet", { name: state.get().name }));
}

$("quest-form").onsubmit = async (e) => {
  e.preventDefault();
  const title = $("quest-input").value.trim();
  if (!title) return;
  $("quest-input").value = "";
  if (brain.isOnline()) {
    $("agent-line").textContent = `${persona().emoji} chopping "${title}" into embarrassingly small pieces...`;
  }
  const quest = await buildQuestSmart(title, state.get().name, persona().style);
  const s = state.get();
  s.quests.push(quest);
  state.save();
  renderQuests();
  agentSay(`Logged. I broke "${quest.title}" into ${quest.steps.length} bite-size steps. Hit play when you're ready — I'll be there the whole time.`);
};

// ---- session ----

function startSession(quest) {
  show("session");
  $("caption").innerHTML = "";
  const ui = {
    userName: state.get().name,
    gentle: state.get().sickDay,
    caption,
    step: (text, i, n) => {
      $("session-step").textContent = text;
      $("session-step-count").textContent = `STEP ${i + 1} OF ${n} · ${quest.title.toUpperCase()}`;
      setGlanceStep(text);
    },
    feed: (status) => {
      const el = $("feed-status");
      el.className = `feed-status ${status === "live" ? "live" : status === "paused" ? "paused" : ""}`;
      $("feed-icon").textContent = status === "live" ? "📡" : status === "paused" ? "⏸️" : "📻";
      $("feed-label").textContent =
        status === "live" ? "dopamine feed LIVE — keep moving to keep it flowing"
        : status === "paused" ? "feed paused — it noticed you stopped"
        : "dopamine feed idle";
    },
    attention: (on) => $("hud").classList.toggle("attention", on),
    personaChanged: () => refreshGlance(),
    stepBonus: () => refreshGlance(),
    questComplete: (payout) => showReward(payout),
  };
  session = new Session(quest, state.get().interests, ui);
  session.start();
}

$("btn-checkin").onclick = () => session?.checkin();
$("btn-quiet").onclick = () => {
  if (!session) return;
  session.setChatty(!session.chatty);
  $("btn-quiet").textContent = session.chatty ? "🤫 quiet mode" : "📢 chatty mode";
};
$("btn-done-step").onclick = () => {
  session?.stepDone();
  state.save();
  refreshGlance();
};
// Options, not orders: stalling gets 2–3 concrete choices — choice restores
// autonomy and reduces demand-avoidance.
$("btn-stuck").onclick = () => {
  if (!session) return;
  session.checkin();
  openModal(`<h3>🧱 Wall detected. Pick your fighter:</h3>
    <div style="display:flex;flex-direction:column;gap:0.6rem">
      <button id="opt-shrink" class="btn btn-primary">🤏 shrink the step — give me a tinier version</button>
      <button id="opt-ninety" class="btn btn-primary">⏱ 90-second bad version — perfectionism is canceled</button>
      <button id="opt-swap" class="btn btn-ghost">🔀 wrong quest — take me back to the board</button>
    </div>`);
  $("opt-shrink").onclick = () => { closeModal(); session?.stuck(); };
  $("opt-ninety").onclick = () => { closeModal(); session?.ninetySecondRun(); };
  $("opt-swap").onclick = () => {
    closeModal();
    session?.stop();
    session = null;
    state.save();
    goHome();
  };
};
$("btn-bail").onclick = () => {
  session?.stop();
  session = null;
  state.save();
  goHome();
};

// ---- reward ----

function showReward(payout) {
  session = null;
  state.save();
  show("reward");
  refreshGlance();
  const { drop, xp, streak } = payout;
  $("reward-burst").textContent = drop.flair;
  $("reward-text").textContent =
    `Quest complete. +${xp} XP` + (streak > 1 ? ` · 🔥 ${streak}-day streak` : "") +
    ` · You pulled ${drop.label}.`;
  $("reward-loot").textContent = drop.content;
  speech.say(`${drop.content}`, persona().voice);
}

$("btn-reward-continue").onclick = () => goHome(true);

// ---- treat jar & persona modal ----

function openModal(html) {
  $("modal-body").innerHTML = html;
  $("modal").classList.remove("hidden");
}
function closeModal() {
  $("modal").classList.add("hidden");
}
$("btn-modal-close").onclick = closeModal;

$("btn-treatjar").onclick = () => {
  const jar = state.get().treatJar.slice(-10).reverse();
  const items = jar.length
    ? jar.map((d) => `<li>${d.flair} ${d.content}</li>`).join("")
    : "<li>Empty. The jar only fills when quests finish — no shortcuts, that's the whole point.</li>";
  openModal(`<h3>🫙 Treat jar</h3><ul>${items}</ul>`);
};

// Transparent persuasion: the ethics literature's bright line is that users
// consent to the mechanics knowingly. So the app explains itself, plainly.
$("btn-science").onclick = () => {
  openModal(`<h3>🧪 Why this works (no secrets)</h3>
    <p><b>The steps are tiny on purpose.</b> Concrete "when X, do Y" micro-plans
    roughly double follow-through in meta-analyses (implementation intentions,
    d≈0.65). Starting is the wall; we shrink the wall.</p>
    <p><b>The feed pauses when you stop</b> because entertainment that's
    contingent on the task is what makes boring tasks tolerable (temptation
    bundling — raised gym attendance 10–50% in trials; Premack's principle).</p>
    <p><b>Rewards are unpredictable</b> because surprise is what dopamine
    responds to (reward prediction error). You can't preview them — that would
    kill the surprise — but you can always walk away: pausing costs nothing,
    streaks break silently, nothing here shames you. Ever.</p>
    <p><b>The personas rotate</b> because novelty itself is stimulating for
    ADHD brains, and any fixed pattern habituates fast.</p>
    <p>Every mechanic serves the quest <i>you</i> chose — never our screen-time.
    Full citations: docs/SCIENCE.md in the repo.</p>`);
};

$("btn-persona").onclick = () => {
  const p = persona();
  openModal(`<h3>${p.emoji} ${p.name}</h3><p>${p.style}.</p>
    <p style="color:#6f8f7f">Personas rotate on their own schedule — you don't pick, that's part of the novelty. Someone else might clock in mid-quest.</p>`);
};

// ---- sick day ----
// Contingencies suspended, companionship stays. Persistence applies to
// tasks, never to a person having a bad day.

function renderSickDay() {
  $("btn-sickday").textContent = state.get().sickDay ? "🛌 sick day: ON" : "🛌 sick day";
}

$("btn-sickday").onclick = () => {
  const on = !state.get().sickDay;
  state.update({ sickDay: on });
  renderSickDay();
  agentSay(on
    ? "Sick-day mode on. No check-ins, no feed-pausing, no pressure — I'm just company today. Rest counts."
    : "Sick-day mode off. Welcome back, champ. The mugs missed you.");
};

// ---- mute ----

$("btn-mute").onclick = () => {
  const muted = !speech.isMuted();
  speech.setMuted(muted);
  state.update({ muted });
  $("btn-mute").textContent = muted ? "🔇" : "🔊";
};

// ---- boot ----

(async function boot() {
  const s = state.get();
  speech.setMuted(s.muted);
  $("btn-mute").textContent = s.muted ? "🔇" : "🔊";
  renderInterestPicker();
  renderSickDay();
  refreshGlance();
  brain.setCity(s.city);
  if (s.name) {
    $("user-name").value = s.name;
    $("user-city").value = s.city || "";
    goHome(true);
  } else {
    show("onboard");
  }
  const ai = await brain.detect();
  document.querySelector(".hud-hint").textContent = ai
    ? "voice-first · AI brain online — generative quests & feed"
    : "voice-first · offline mode — seed content (run server.mjs with an API key to go generative)";
  if (ai && s.interests.length) brain.refillFeed(s.interests);
})();
