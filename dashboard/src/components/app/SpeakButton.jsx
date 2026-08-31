import { useState, useEffect } from "react";
import { Volume2, Square, Hammer } from "lucide-react";
import { useLang } from "../../lib/useLang";
import { speak, stopSpeaking, isSpeechSupported, isVoiceEnabled } from "../../lib/useVoice";

// Reads the given multilingual text out loud in the app's language.
// English & Hindi are live; Bengali & Marathi show an "under production" state.
export default function SpeakButton({ textObj, label, className = "" }) {
  const { lang, tr, t } = useLang();
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const enabled = isVoiceEnabled(lang);

  useEffect(() => {
    setSupported(isSpeechSupported());
    return () => stopSpeaking();
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
    } else {
      const ok = speak(text, lang);
      if (ok) {
        setSpeaking(true);
        window.speechSynthesis.onend = () => setSpeaking(false);
      }
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={t("app.listen")}
      title={t("app.listen")}
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
