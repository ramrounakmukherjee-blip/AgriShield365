import { useState, useRef, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { LANGUAGES } from "../lib/i18n";
import { useLang } from "../lib/useLang";

// Compact globe button + dropdown to change language from any screen.
export default function LanguageSwitcher({ dark = false, className = "" }) {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const btnCls = dark
    ? "border-white/25 bg-black/40 text-white hover:bg-black/60"
    : "border-white/20 bg-white/15 text-white hover:bg-white/25";

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        className={`inline-flex items-center gap-1.5 rounded-full border backdrop-blur px-3 py-2 text-xs sm:text-sm font-semibold transition active:scale-95 ${btnCls}`}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">
          {LANGUAGES.find((l) => l.id === lang)?.native}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 rounded-2xl bg-white shadow-2xl border border-stone-200 overflow-hidden z-50">
          {LANGUAGES.map((l) => (
            <button
              key={l.id}
              onClick={() => {
                setLang(l.id);
                setOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold text-stone-700 hover:bg-emerald-50 transition"
            >
              <span>
                <span className="block">{l.native}</span>
                <span className="block text-xs font-normal text-stone-400">{l.label}</span>
              </span>
              {lang === l.id && <Check className="w-4 h-4 text-emerald-600" strokeWidth={3} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
