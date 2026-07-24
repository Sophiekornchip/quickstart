# Sidequest on smart glasses

Sidequest's native home is your face, not your phone. The browser app in this
repo is a **HUD simulator**; this document is the engineering path to Meta AI
glasses and other wearables.

## Why glasses are the right body double

A body double has to be *ambient*. The phone is the enemy form factor — every
glance at it is a portal to the exact dopamine loops Sidequest competes with.
Glasses give us:

- **Open-ear audio, always on**: the companion talks while your hands work.
- **Hands-free confirmation**: "yep" / a head nod answers a check-in.
- **Egocentric sensing**: the device can *see the task* — the true unlock.
- **Glanceable HUD (display models)**: one line of "current step," nothing more.

## Target platforms

### 1. Meta AI glasses (Ray-Ban Meta, Ray-Ban Display, Oakley Meta HSTN)

Meta's **Wearables Device Access Toolkit** (announced at Connect 2025, preview
late 2025) lets third-party mobile apps access glasses sensors — camera,
open-ear audio, microphones — with the phone doing the compute. Sidequest maps
cleanly onto it:

| Sidequest function | Toolkit capability |
| --- | --- |
| Companion voice + dopamine feed | Audio session streamed to open-ear speakers |
| Voice check-in ("still on it?" → "yep") | Mic access + wake-word/ASR on phone |
| Task-activity detection | Camera frames → on-phone vision model ("are hands at the sink?") |
| Step cue on Display models | Notification glance / HUD text line |
| "Feed pauses when you stop" | Pause audio session on inactivity signal |

Architecture: **Sidequest runs as the phone app** (iOS/Android), the glasses
are its face-mounted I/O. The session engine in `js/session.js` ports directly
— it's already an event loop over {cue, chatter, check-in, drift, done}.

### 2. Other wearables

- **Even Realities G1 / Vuzix / INMO** (micro-LED HUD glasses): text-glance SDKs
  fit the one-line step display; audio via BT.
- **Audio-only earbuds** fallback: the entire product works with zero display —
  the HUD is sugar, the audio loop is the product.
- **Watch companions**: haptic check-in taps + streak glance.

## Interaction mapping (browser → glasses)

| Browser prototype | Glasses native |
| --- | --- |
| Tap "✋ still on it" | Say "yep" / head-nod (IMU gesture) |
| Tap "✅ step done" | Say "done" / double-nod |
| Tap "🧱 I'm stuck" | Say "I'm stuck" |
| Captions panel | Open-ear audio (captions on paired phone for accessibility) |
| `session-step` text | HUD glance line / spoken repeat on demand ("what am I doing?") |
| localStorage | On-device app storage; nothing to cloud by default |

## Activity detection ladder

The "feed pauses when you stop" contingency needs an engagement signal. Build
it as a ladder, cheapest signal first:

1. **Voice check-in response** (works everywhere, zero extra sensors)
2. **IMU motion signature** — wrist/head movement consistent with the task vs.
   sitting still scrolling
3. **Egocentric camera spot-checks** (opt-in, on-device inference only):
   frame classified against the current step ("dishes in view? hands moving?").
   Low frame rate, no storage, no upload — a yes/no engagement bit.
4. **Phone-state signal**: if the paired phone screen unlocks mid-step, that's
   the drift event. The glasses know you picked up the portal.

## Privacy is load-bearing

A body double hears your whole day. Non-negotiables, already reflected in the
prototype's design:

- All engagement inference **on-device**; the cloud sees tasks ("dishes"), not
  audio or camera frames.
- Camera engagement checks are **opt-in per quest**, with the LED indicator
  always honest.
- The special-interest profile (the most intimate data ADHD'ers have) is
  stored locally and never used for ads. It is the product's fuel, not its
  inventory.

## Porting plan

1. **Phase 0 (this repo)**: browser HUD simulator — mechanics, personality,
   contingency loop, content engine. ✅
2. **Phase 1**: React Native companion app; port `session.js` engine verbatim
   (it has no DOM dependencies); server-side LLM for task breakdown + persona
   lines (the contracts are documented in `tasks.js`/`personas.js`); licensed
   audio/podcast API for the dopamine feed.
3. **Phase 2**: Wearables Device Access Toolkit integration — audio session,
   mic check-ins, glance notifications on Display hardware.
4. **Phase 3**: engagement ladder (IMU → opt-in camera spot-checks), watch
   haptics, shared "co-working room" sessions (mutual body doubling with
   friends — the research says mutuality is half the magic).
