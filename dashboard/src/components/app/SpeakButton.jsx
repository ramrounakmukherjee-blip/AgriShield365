import { useState, useEffect } from "react";
import { Volume2, Square, VolumeX } from "lucide-react";
import { useLang } from "../../lib/useLang";
import {
  speak,
  stopSpeaking,
  isSpeechSupported,
  warmVoices,
  hasVoiceForLang,
} from "../../lib/useVoice";

// Reads the given multilingual text out loud in the app's language.
// English, Hindi, Bengali and Marathi are enabled when the browser/device has
// a matching native/neural voice. If not, we avoid the bad robotic fallback.
export default function SpeakButton({ textObj, label, className = "" }) {
  const { lang, tr, t } = useLang();
  const [speaking, setSpeaking] = useState(false);
  const [voiceErrorLang, setVoiceErrorLang] = useState("");
  const [voicesVersion, setVoicesVersion] = useState(0);
  const supported = isSpeechSupported();

  // Warm the browser's (asynchronously-loaded) voice list on mount and
  // whenever the language changes, so it's ready by the time the user taps.
  useEffect(() => {
    warmVoices();
    const check = () => {
      warmVoices();
      setVoicesVersion((v) => v + 1);
    };
    window.speechSynthesis?.addEventListener?.("voiceschanged", check);
    const timer = setTimeout(check, 700);
    return () => {
      clearTimeout(timer);
      window.speechSynthesis?.removeEventListener?.("voiceschanged", check);
      stopSpeaking();
    };
  }, []);

  if (!supported) return null;

  const text = typeof textObj === "string" ? textObj : tr(textObj);
  const voiceAvailable = hasVoiceForLang(lang);
  const noVoice = voiceErrorLang === lang;
  void voicesVersion; // keeps this component re-evaluating after voices load

  if (!voiceAvailable) {
    return (
      <span
        title={t("app.listenSoonHint")}
        className={`inline-flex cursor-not-allowed items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-bold text-stone-500 bg-stone-100 ring-1 ring-stone-200 ${className}`}
      >
        <VolumeX className="w-3.5 h-3.5" />
        {t("app.listenSoon")}
      </span>
    );
  }

  const toggle = (e) => {
    e.stopPropagation();
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }

    const done = () => setSpeaking(false);
    const ok = speak(text, lang, done);
    setVoiceErrorLang(ok ? "" : lang);

    if (ok) {
      setSpeaking(true);
      // Safety net: never leave the button stuck if the browser never fires end.
      setTimeout(done, Math.max(8000, text.length * 90));
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={t("app.listen")}
      title={noVoice ? t("app.listenNoVoice") : t("app.listen")}
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold transition active:scale-95 ${
        speaking
          ? "bg-emerald-600 text-white"
          : noVoice
            ? "bg-amber-50 text-amber-800 ring-1 ring-amber-200"
            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
      } ${className}`}
    >
      {speaking ? <Square className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
      {label || t("app.listen")}
    </button>
  );
}
