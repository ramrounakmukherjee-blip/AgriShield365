import { useState, useEffect } from "react";
import { Volume2, Square, Hammer } from "lucide-react";
import { useLang } from "../../lib/useLang";
import {
  speak,
  stopSpeaking,
  isSpeechSupported,
  isVoiceEnabled,
  warmVoices,
  getVoices,
} from "../../lib/useVoice";

// Reads the given multilingual text out loud in the app's language.
// English & Hindi are live; Bengali & Marathi show an "under production" state.
export default function SpeakButton({ textObj, label, className = "" }) {
  const { lang, tr, t } = useLang();
  const [speaking, setSpeaking] = useState(false);
  const [noVoice, setNoVoice] = useState(false);
  const supported = isSpeechSupported();
  const enabled = isVoiceEnabled(lang);

  // Warm the browser's (asynchronously-loaded) voice list on mount and
  // whenever the language changes, so it's ready by the time the user taps.
  useEffect(() => {
    warmVoices();
    const check = () => warmVoices();
    window.speechSynthesis?.addEventListener?.("voiceschanged", check);
    return () => {
      window.speechSynthesis?.removeEventListener?.("voiceschanged", check);
      stopSpeaking();
    };
  }, []);

  if (!supported) return null;

  // Bengali / Marathi — feature shown as future scope, not playable.
  if (!enabled) {
    return (
      <span
        title={t("app.listenSoonHint")}
        className={`inline-flex cursor-not-allowed items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-bold text-stone-400 bg-stone-100 ring-1 ring-stone-200 ${className}`}
      >
        <Hammer className="w-3.5 h-3.5" />
        {t("app.listenSoon")}
      </span>
    );
  }

  const text = typeof textObj === "string" ? textObj : tr(textObj);

  const toggle = (e) => {
    e.stopPropagation();
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    // Detect when this browser genuinely has no voice for this language.
    const targetLang = lang === "hi" ? "hi-IN" : "en-IN";
    const hasVoice =
      getVoices().some(
        (v) => v.lang && (v.lang.toLowerCase().startsWith(lang) || v.lang === targetLang)
      ) || getVoices().length === 0; // voices may still load lazily
    setNoVoice(!hasVoice);

    const ok = speak(text, lang);
    if (ok) {
      setSpeaking(true);
      const synth = window.speechSynthesis;
      const done = () => setSpeaking(false);
      synth.onend = done;
      synth.onerror = done;
      // Safety net: never leave the button stuck if the browser never fires end.
      setTimeout(done, Math.max(8000, text.length * 90));
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={t("app.listen")}
      title={
        noVoice
          ? t("app.listenNoVoice")
          : t("app.listen")
      }
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold transition active:scale-95 ${
        speaking
          ? "bg-emerald-600 text-white"
          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
      } ${className}`}
    >
      {speaking ? <Square className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
      {label || t("app.listen")}
    </button>
  );
}
