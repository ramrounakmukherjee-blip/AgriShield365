// Free in-browser speech synthesis for read-aloud in the farmer's language.
const VOICE_LANG = { en: "en-IN", hi: "hi-IN", bn: "bn-IN", mr: "mr-IN" };

// Voice read-aloud is shipped for English & Hindi only. Bengali & Marathi TTS
// voices in most browsers sound unnatural, so those are shown as
// "under production" in the UI (future scope) rather than played badly.
export const VOICE_ENABLED_LANGS = ["en", "hi"];

export function isVoiceEnabled(lang) {
  return VOICE_ENABLED_LANGS.includes(lang);
}

export function isSpeechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

// ---- Voice list handling ----------------------------------------------------
// Chrome/Edge load the voice list ASYNCHRONOUSLY and fire `voiceschanged`.
// If we call getVoices() on the first click it is often empty, so no voice is
// assigned and nothing plays. We warm + cache the list as early as possible.
let cachedVoices = [];
let warmed = false;

export function warmVoices() {
  if (!isSpeechSupported() || warmed) return;
  warmed = true;
  const load = () => {
    const v = window.speechSynthesis.getVoices?.() || [];
    if (v.length) cachedVoices = v;
  };
  load();
  window.speechSynthesis.onvoiceschanged = load;
  // Some browsers need a nudge
  setTimeout(load, 250);
}

export function getVoices() {
  if (!isSpeechSupported()) return [];
  if (!cachedVoices.length) {
    cachedVoices = window.speechSynthesis.getVoices?.() || [];
  }
  return cachedVoices;
}

function pickVoice(targetLang, baseLang) {
  const voices = getVoices();
  if (!voices.length) return null;
  return (
    voices.find((v) => v.lang && v.lang.toLowerCase() === targetLang.toLowerCase()) ||
    voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(baseLang + "-")) ||
    voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(baseLang)) ||
    // Prefer a local-service Indian voice as a last resort
    voices.find((v) => /hi|en[-_]in/i.test(v.lang)) ||
    null
  );
}

export function stopSpeaking() {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.cancel();
  if (window.__agriVoiceTimer) {
    clearInterval(window.__agriVoiceTimer);
    window.__agriVoiceTimer = null;
  }
}

export function speak(text, lang) {
  if (!isSpeechSupported() || !text) return false;
  if (!isVoiceEnabled(lang)) return false;
  warmVoices();
  window.speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = VOICE_LANG[lang] || "en-IN";
  utter.rate = lang === "hi" ? 0.92 : 0.98;
  utter.pitch = 1;
  utter.volume = 1;

  const voice = pickVoice(utter.lang, lang);
  if (voice) utter.voice = voice;

  // Chrome pauses long utterances (~15s) — nudge it to keep talking.
  stopSpeaking();
  window.speechSynthesis.speak(utter);
  window.__agriVoiceTimer = setInterval(() => {
    if (window.speechSynthesis.speaking && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    if (!window.speechSynthesis.speaking) {
      clearInterval(window.__agriVoiceTimer);
      window.__agriVoiceTimer = null;
    }
  }, 5000);

  return true;
}
