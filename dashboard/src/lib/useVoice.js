// Free in-browser speech synthesis for read-aloud in the farmer's language.
// Uses the device/browser's best available neural/native voice. No API key,
// no server call, and no audio files are required.
const VOICE_CONFIG = {
  en: { locales: ["en-IN", "en-GB", "en-US", "en"], rate: 0.94, pitch: 1.02 },
  hi: { locales: ["hi-IN", "hi"], rate: 0.88, pitch: 1.0 },
  bn: { locales: ["bn-IN", "bn-BD", "bn"], rate: 0.86, pitch: 1.0 },
  mr: { locales: ["mr-IN", "mr"], rate: 0.88, pitch: 1.0 },
};

export const VOICE_ENABLED_LANGS = Object.keys(VOICE_CONFIG);

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
  setTimeout(load, 900);
}

export function getVoices() {
  if (!isSpeechSupported()) return [];
  if (!cachedVoices.length) {
    cachedVoices = window.speechSynthesis.getVoices?.() || [];
  }
  return cachedVoices;
}

function normalizedLang(lang = "") {
  return lang.toLowerCase().replace("_", "-");
}

function voiceScore(voice, lang) {
  const cfg = VOICE_CONFIG[lang] || VOICE_CONFIG.en;
  const voiceLang = normalizedLang(voice.lang);
  const locales = cfg.locales.map(normalizedLang);
  const base = normalizedLang(lang);

  let score = -1000;
  if (locales.includes(voiceLang)) score = 120;
  else if (voiceLang.startsWith(`${base}-`) || voiceLang === base) score = 95;
  else if (lang === "en" && voiceLang.startsWith("en-")) score = 70;

  if (score < 0) return score;

  const name = `${voice.name || ""} ${voice.voiceURI || ""}`.toLowerCase();

  // Browser/cloud voices with these names are usually more natural than OS
  // fallback voices. This improves Hindi, Bengali and Marathi when available.
  if (/natural|neural|online|google|microsoft|heera|kalpana|lekha|hemant|ravi|swara/i.test(name)) score += 30;
  if (/female|zira|aria|sonia|neerja|madhur|ananya/i.test(name)) score += 8;

  // Avoid the voices that typically sound like old desktop robots.
  if (/compact|espeak|festival|flite|klatt|novelty|whisper|dummy/i.test(name)) score -= 60;

  // Exact Indian-region matches are preferred for farmer advisories.
  if (voiceLang.endsWith("-in")) score += 10;

  return score;
}

export function getBestVoice(lang) {
  const voices = getVoices();
  if (!voices.length || !isVoiceEnabled(lang)) return null;
  const ranked = voices
    .map((voice) => ({ voice, score: voiceScore(voice, lang) }))
    .filter((v) => v.score > 0)
    .sort((a, b) => b.score - a.score);
  return ranked[0]?.voice || null;
}

export function hasVoiceForLang(lang) {
  if (!isSpeechSupported() || !isVoiceEnabled(lang)) return false;
  const voices = getVoices();
  // Voice list may still be loading. Allow the button briefly instead of hiding
  // it forever on first paint.
  if (!voices.length) return true;
  if (lang === "en") return true;
  return Boolean(getBestVoice(lang));
}

export function stopSpeaking() {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.cancel();
  if (window.__agriVoiceTimer) {
    clearInterval(window.__agriVoiceTimer);
    window.__agriVoiceTimer = null;
  }
}

function cleanForSpeech(text) {
  return String(text || "")
    .replace(/[•·]/g, ".")
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
    .replace(/[\u2600-\u27BF]/g, "")
    .replace(/\uFE0F/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function speak(text, lang, onDone) {
  if (!isSpeechSupported() || !text || !isVoiceEnabled(lang)) return false;
  warmVoices();

  const cfg = VOICE_CONFIG[lang] || VOICE_CONFIG.en;
  const voice = getBestVoice(lang);

  // For vernacular languages, do not fall back to an English/default voice —
  // that is exactly what makes Bengali/Marathi sound broken and robotic.
  if (lang !== "en" && !voice && getVoices().length) return false;

  stopSpeaking();

  const utter = new SpeechSynthesisUtterance(cleanForSpeech(text));
  utter.lang = cfg.locales[0];
  utter.rate = cfg.rate;
  utter.pitch = cfg.pitch;
  utter.volume = 1;
  if (voice) {
    utter.voice = voice;
    utter.lang = voice.lang || utter.lang;
  }
  if (onDone) {
    utter.onend = onDone;
    utter.onerror = onDone;
  }

  window.speechSynthesis.speak(utter);

  // Chrome pauses long utterances (~15s) — nudge it to keep talking.
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
