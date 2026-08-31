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

export function stopSpeaking() {
  if (isSpeechSupported()) window.speechSynthesis.cancel();
}

export function speak(text, lang) {
  if (!isSpeechSupported() || !text) return false;
  if (!isVoiceEnabled(lang)) return false;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = VOICE_LANG[lang] || "en-IN";
  utter.rate = 0.95;
  utter.pitch = 1;
  const voices = window.speechSynthesis.getVoices?.() || [];
  const match =
    voices.find((v) => v.lang === utter.lang) ||
    voices.find((v) => v.lang && v.lang.startsWith(lang));
  if (match) utter.voice = match;
  window.speechSynthesis.speak(utter);
  return true;
}
