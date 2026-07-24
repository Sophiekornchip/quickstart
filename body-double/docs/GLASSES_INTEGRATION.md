# Sidequest on smart glasses — engineering path

Grounded in the actual developer-platform landscape as of mid-2026. The
browser app in this repo is a HUD simulator; this is the plan for real
hardware. Confidence flags are noted where vendor docs are preview-stage.

## Why glasses are the right body double

A body double has to be *ambient* and live at the **point of performance**
(Barkley: ADHD supports work when they fire at the exact time and place of
the behavior — see `SCIENCE.md` §2). The phone is the enemy form factor:
every glance at it is a portal to the exact dopamine loops Sidequest competes
with. Glasses give us open-ear audio while hands work, hands-free
confirmation, and (on display models) a one-line glance.

## Target platform 1: Meta glasses via the Wearables Device Access Toolkit

**Status (mid-2026):** Developer Preview (SDK ~v0.8.0). Build and test on
real hardware today; distribute to release channels of up to 100 testers;
public publishing expected later in 2026 (currently limited to select
partners like Be My Eyes and Twitch). Plan: build now, beta via release
channel, ship when publishing opens.

**Architecture:** phone-centric. Sidequest runs as an iOS/Android app linking
the DAT SDK (`facebook/meta-wearables-dat-ios`, Swift PM; Android via Maven —
`mwdat-core`, `mwdat-camera`, `mwdat-display`, `mwdat-mockdevice`). The
glasses are a peripheral; the Meta AI app brokers the connection. There is no
on-glasses runtime — which is fine, because our session engine
(`js/session.js`) is already a phone-side event loop over
{cue, chatter, check-in, drift, done}.

**Capability mapping (from the actual docs):**

| Sidequest function | DAT reality |
| --- | --- |
| Companion voice + dopamine feed | Standard Bluetooth **A2DP** (44.1/48 kHz stereo) from the phone app — works today, no DAT required |
| Voice check-in ("still on it?" → "yep") | **HFP** mic path — but A2DP and HFP are mutually exclusive; opening the mic drops audio to 8 kHz mono with a ~2 s route-settling delay |
| Task-activity detection | DAT camera streaming (12 MP ultra-wide POV) → on-phone vision model |
| Step cue on Ray-Ban Display | `mwdat-display` (opened May 14, 2026): text, images, lists, buttons, video on the 600×600 monocular display |
| Silent "done" confirmation | Neural Band **predefined gestures** (pinch/swipe — no custom gestures, no raw EMG) |

**The load-bearing constraint — the A2DP/HFP trade-off:** continuous hi-fi
feed audio and an open microphone cannot coexist. So Sidequest's interaction
grammar on Meta hardware is: *speak briefly, then release the mic*. Check-ins
are short mic windows (or better, a Neural Band pinch — zero audio cost,
and silent confirmation beats talking to yourself in public). The feed
resumes in stereo the moment the mic closes.

**Second path — Web Apps SDK (Ray-Ban Display):** plain HTML/CSS/JS hosted
on any HTTPS URL, loaded through the Meta AI app; gets motion/orientation
sensors, phone GPS, Neural Band + captouch input, and local storage; no app
store or review yet (share by URL). Sidequest's HUD simulator is *already*
vanilla HTML/JS — the "current step + feed status" glance view ports almost
directly. This is the fastest demo path on real Meta display hardware.

**Not available via DAT (design around):** wake-word hooks, notification
injection, raw IMU (DAT path), background-execution guarantees, Meta AI
access.

## Target platform 2: other wearables

- **Even Realities G2 + R1 ring** — the most credible *shippable-today* HUD
  platform: official Even Hub app store, TypeScript SDK (`@evenrealities/
  even_hub_sdk`), CLI + simulator, starter templates including an ASR
  template that maps directly onto "glanceable one-liner + voice confirm."
  Caveat: **no speakers** — G2 is display+mic; the feed routes to earbuds.
- **Brilliant Labs Halo** (~$299) — best *hackable full-stack* option for the
  activity-detection prototype: camera, mic, bone-conduction speakers, IMU,
  on-device NPU, fully open source (Lua on-device; Python/Flutter/Web-BT
  host SDKs).
- **Vuzix Z100 / Ultralite** — mature open Android/iOS SDK for a
  notification-HUD-class device (~48 h battery); good for the one-line cue.
- **Solos AirGo** — audio-first glasses with a real (paid, ~$2k program) SDK;
  the pure-audio fallback in glasses form.
- **Halliday** — no public SDK found as of research date; not a target.

## Fallback: phone + earbuds is ~90% of v1

The whole loop runs with zero glasses hardware:

- **iOS:** `audio` background mode legitimately supports continuous playback
  and mic capture (`playAndRecord`); no third-party wake word at OS level —
  use push-to-talk (AirPods squeeze) or an in-app wake engine. Siri App
  Intents give "Hey Siri, start my quest" deep links.
- **Android:** `MediaSessionService` for playback; mic needs a
  `microphone`-type foreground service (visible notification; start rules
  tightened in Android 14/15).
- **Watch (Apple/Wear OS):** check-in surface — haptic tap to confirm,
  Ongoing Activity / Smart Stack chip showing the current step.

Architecture rule this all implies: **Sidequest is a phone-resident agent
with interchangeable peripheral surfaces** (glasses audio, HUD, watch
haptics, earbuds). The session engine doesn't know which body it's wearing.

## Voice stack (current best options)

- **Live companion voice:** Cartesia (Sonic — ~40–90 ms model-side TTFA) or
  ElevenLabs Flash v2.5 (~75 ms model latency) via WebSocket streaming;
  characterful persona voices are the product, so voice quality is a feature,
  not a nicety. (PlayHT is gone — acquired by Meta 2025, API shut down.)
- **Pre-rendered character content:** ElevenLabs v3 (audio tags, emotion) for
  reward drops and persona set-pieces.
- **Confirmation ASR (on-device, free):** Apple SpeechAnalyzer (iOS 26 —
  on-device, no session limit) or Moonshine/whisper.cpp cross-platform.
  Short-command parsing ("done", "stuck", "what's next") needs no cloud.
- **Wake word:** skip at MVP — Picovoice Porcupine's commercial floor
  (~$6k/yr) argues for push-to-talk/pinch instead.

## Dopamine feed content pipeline

- **Generated layer (built):** `server.mjs` generates interest-matched spoken
  content with Claude — infinite, novel, and legally clean.
- **Real-audio layer (roadmap):** Podcast Index (free, open, ~4M feeds) +
  Taddy transcripts for segment discovery. Play segments as timestamp-seeks
  into the original episode stream with attribution, and treat
  Podcasting 2.0 `podcast:soundbite` / `podcast:chapters` tags as
  first-class — publisher-defined segments are the licensing-safe primitive.
  Programmatic clipping into our own experience is derivative use — avoid.
  **Spotify's API is non-viable for new third parties** (2024–2026 access
  restrictions); don't build on it.

## Activity detection ladder

Cheapest signal first; each rung is optional and opt-in:

1. **Confirmation input** — voice "yep" / Neural Band pinch / watch tap
   (works everywhere, zero extra sensors)
2. **Motion signature** — IMU/motion via Web Apps sensors or phone/watch
   motion: task-consistent movement vs. sitting still scrolling
3. **Phone-state signal** — paired phone screen unlocks mid-step = the drift
   event; the glasses know you picked up the portal
4. **Egocentric camera spot-checks** (DAT camera, opt-in per quest) — low
   frame rate, on-device inference only, yields a yes/no engagement bit;
   nothing stored, nothing uploaded

## Privacy is load-bearing

A body double hears your whole day, and the special-interest profile is some
of the most intimate data an ADHD person has.

- All engagement inference on-device; the cloud sees task titles, not audio
  or frames.
- Camera spot-checks opt-in per quest; hardware capture LED stays honest.
- Interest profile stored locally, never used for ads; it is the product's
  fuel, not its inventory.
- The prototype already models this: state lives in `localStorage`; the AI
  server sees only task titles and interest names.

## Porting plan

1. **Phase 0 (this repo):** browser HUD simulator — mechanics, personality,
   contingency loop, generative brain. ✅
2. **Phase 1:** phone app (React Native or Swift/Kotlin); port the session
   engine (no DOM dependencies); streaming TTS (Cartesia/ElevenLabs);
   on-device ASR for confirmations; earbuds + watch surfaces. This alone is
   a shippable product.
3. **Phase 2:** Meta DAT release-channel beta — A2DP feed, brief HFP
   check-in windows, Neural Band pinch confirm; Ray-Ban Display glance view
   via `mwdat-display` and/or the Web Apps SDK. Even Hub build for G2 in
   parallel (TS SDK, real store, fastest public distribution).
4. **Phase 3:** activity-detection ladder (motion → phone-state → opt-in
   camera spot-checks on DAT / Brilliant Halo), podcast-segment feed layer,
   shared co-working rooms (mutual body doubling — the mutuality axis in
   Eagle et al.'s model says doubling works best when it's reciprocal).
