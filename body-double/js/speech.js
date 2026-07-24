// Voice output layer. On glasses hardware this maps to the open-ear speakers
// via the wearable audio session; in the browser we use the Web Speech API.
// Every utterance is also mirrored to captions by the caller (audio-first,
// never audio-only).

let muted = false;
let voice = null;
let currentUtteranceDone = null;

const synth = typeof window !== "undefined" ? window.speechSynthesis : null;

function pickVoice() {
  if (!synth) return null;
  const voices = synth.getVoices();
  if (!voices.length) return null;
  // Prefer an English voice with some character; fall back to anything English.
  return (
    voices.find((v) => /en[-_]/i.test(v.lang) && /Google|Natural|Samantha|Daniel/i.test(v.name)) ||
    voices.find((v) => /en[-_]/i.test(v.lang)) ||
    voices[0]
  );
}

if (synth) {
  synth.onvoiceschanged = () => { voice = pickVoice(); };
  voice = pickVoice();
}

export function setMuted(value) {
  muted = value;
  if (muted && synth) synth.cancel();
}

export function isMuted() {
  return muted;
}

/**
 * Speak a line. Resolves when the utterance finishes (or immediately when
 * muted/unsupported) so the session engine can pace itself around speech.
 * rate/pitch let personas sound different from each other.
 */
export function say(text, { rate = 1.02, pitch = 1.0, interrupt = false } = {}) {
  return new Promise((resolve) => {
    if (muted || !synth || !text) return resolve();
    if (interrupt) synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (voice) u.voice = voice;
    u.rate = rate;
    u.pitch = pitch;
    u.onend = resolve;
    u.onerror = resolve;
    currentUtteranceDone = resolve;
    synth.speak(u);
  });
}

export function stopSpeaking() {
  if (synth) synth.cancel();
  if (currentUtteranceDone) {
    currentUtteranceDone();
    currentUtteranceDone = null;
  }
}
