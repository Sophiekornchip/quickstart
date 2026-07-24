// Sidequest server — static file host + AI brain proxy.
//
// The browser app works fully offline with seed content. Run this server with
// an ANTHROPIC_API_KEY and the app upgrades itself: task breakdowns, the
// dopamine feed, and persona banter become generative — infinite novelty,
// which for this product is the active ingredient.
//
// The key stays server-side; the browser only ever talks to /api/*.
//
//   npm install && ANTHROPIC_API_KEY=... npm start   → http://localhost:8080

import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";

const ROOT = fileURLToPath(new URL(".", import.meta.url));
const PORT = process.env.PORT || 8080;
const MODEL = process.env.SIDEKICK_MODEL || "claude-opus-4-8";

const hasKey = Boolean(
  process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN
);
const client = hasKey ? new Anthropic() : null;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
};

// ---- persona voice, shared across endpoints (stable prefix → prompt cache) ----

const SYSTEM = `You are the writing engine behind "Doppel", an AI body double for adults with ADHD, delivered through smart glasses. Your words are spoken aloud while the user does boring chores (their "sidequests").

House rules:
- Funny, warm, sporadic. Never preachy, never shaming, never corporate.
- Short. Everything is heard, not read — one to three sentences per line.
- The science under the hood: body doubling (presence, not instruction), shaping (steps so small they're almost silly), temptation bundling (special-interest content is the reward for working), variable-ratio reinforcement (surprises beat schedules).
- Never moralize about productivity. The user is not broken; the task is boring.
- Special-interest content must be TRUE and genuinely interesting — the weirder and more specific the better. No made-up facts.`;

const QUEST_SCHEMA = {
  type: "object",
  properties: {
    questTitle: {
      type: "string",
      description: "The task reframed as a short, funny quest name",
    },
    steps: {
      type: "array",
      items: { type: "string" },
      description:
        "3-6 micro-steps. Step 1 must be startable in under 10 seconds (physical relocation or a single trivial action). Each step startable in under a minute, phrased in the persona's voice.",
    },
  },
  required: ["questTitle", "steps"],
  additionalProperties: false,
};

const FEED_SCHEMA = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: { type: "string" },
      description:
        "True, delightfully specific facts/stories about the user's special interests, 1-2 spoken sentences each",
    },
    reward: {
      type: "string",
      description:
        "One extra-juicy held-back item: a longer, more delicious story (2-3 sentences) to be revealed ONLY on quest completion",
    },
  },
  required: ["items", "reward"],
  additionalProperties: false,
};

async function aiQuest({ title, name, personaStyle }) {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
    output_config: { format: { type: "json_schema", schema: QUEST_SCHEMA } },
    messages: [
      {
        role: "user",
        content: `User ${name || "friend"} is dreading this task: "${title}". Current persona voice: ${personaStyle}. Break it into micro-steps.`,
      },
    ],
  });
  return firstJson(response);
}

async function aiFeed({ interests, count = 8 }) {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
    output_config: { format: { type: "json_schema", schema: FEED_SCHEMA } },
    messages: [
      {
        role: "user",
        content: `Generate ${count} dopamine-feed items for someone whose special interests are: ${interests.join(", ")}. Avoid the most famous/overused facts — dig for the deliciously obscure.`,
      },
    ],
  });
  return firstJson(response);
}

async function aiBanter({ persona, kind, questTitle, step, name }) {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 256,
    system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
    messages: [
      {
        role: "user",
        content: `Persona: ${persona.name} — ${persona.style}. User: ${name}. Quest: "${questTitle}", current step: "${step}". Write ONE spoken line of type "${kind}" (greet | during | checkin | drift | stepDone | stuck | questDone). Return only the line, no quotes.`,
      },
    ],
  });
  const text = response.content.find((b) => b.type === "text")?.text?.trim() ?? "";
  return { line: text };
}

function firstJson(response) {
  const text = response.content.find((b) => b.type === "text")?.text ?? "{}";
  return JSON.parse(text);
}

// ---- http plumbing ----

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString() || "{}");
}

function json(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

const API = {
  "/api/health": async () => ({ ok: true, ai: hasKey, model: hasKey ? MODEL : null }),
  "/api/quest": aiQuest,
  "/api/feed": aiFeed,
  "/api/banter": aiBanter,
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname.startsWith("/api/")) {
    const handler = API[url.pathname];
    if (!handler) return json(res, 404, { error: "not found" });
    if (url.pathname !== "/api/health" && !hasKey) {
      return json(res, 503, { error: "no ANTHROPIC_API_KEY — offline mode" });
    }
    try {
      const body = req.method === "POST" ? await readBody(req) : {};
      return json(res, 200, await handler(body));
    } catch (err) {
      console.error(`[api] ${url.pathname} failed:`, err.message);
      return json(res, 502, { error: "brain unavailable" });
    }
  }

  // static files
  try {
    let path = normalize(url.pathname).replace(/^(\.\.[/\\])+/, "");
    if (path === "/" || path === "\\") path = "/index.html";
    const file = await readFile(join(ROOT, path));
    res.writeHead(200, {
      "Content-Type": MIME[extname(path)] || "application/octet-stream",
    });
    res.end(file);
  } catch {
    res.writeHead(404);
    res.end("not found");
  }
});

server.listen(PORT, () => {
  console.log(`Doppel → http://localhost:${PORT}`);
  console.log(hasKey
    ? `AI brain: ONLINE (${MODEL}) — generative quests, feed, and banter`
    : "AI brain: offline — using seed content (set ANTHROPIC_API_KEY to go generative)");
});
