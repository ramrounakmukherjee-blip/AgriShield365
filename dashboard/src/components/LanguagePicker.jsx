import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Check, ArrowRight, Sprout } from "lucide-react";
import { LANGUAGES } from "../lib/i18n";
import translations from "../lib/i18n";
import { useLang } from "../lib/useLang";


export default function LanguagePicker({ onChoose }) {
  const { lang, setLang } = useLang();
  const [selected, setSelected] = useState(lang);

  const pick = (code) => setSelected(code);

  const confirm = () => {
    setLang(selected);
    onChoose(selected);
  };

  // Live-preview helper: renders strings in the currently highlighted language
  const txt = (entry) => (entry && entry[selected]) || entry?.en || "";

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-emerald-950 via-emerald-900 to-green-800 text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8 pt-12 w-full">
        <motion.img
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          src="/assets/logo-agrishield365.jpg"
          alt="AgriShield 365"
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-2xl ring-4 ring-white/10"
        />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.5 }}
          className="mt-6 flex items-center gap-2 text-emerald-200"
        >
          <Globe className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-[0.25em]">AgriShield 365</span>
        </motion.div>

        <motion.h1
          key={"title-" + selected}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-4 text-2xl sm:text-4xl font-extrabold text-center leading-tight"
        >
          {txt(translations.picker.title)}
        </motion.h1>

        <p
          key={"sub-" + selected}
          className="mt-3 text-emerald-200/80 text-xs sm:text-sm text-center max-w-sm"
        >
          {txt(translations.picker.subtitle)}
        </p>

        <div className="mt-8 w-full max-w-sm grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LANGUAGES.map((l, i) => {
            const active = selected === l.id;
            return (
              <motion.button
                key={l.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.4 }}
                onClick={() => pick(l.id)}
                className={`relative rounded-2xl border-2 p-4 text-left transition active:scale-[0.97] ${
                  active
                    ? "border-emerald-300 bg-white/15 shadow-lg"
                    : "border-white/15 bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl font-extrabold">{l.native}</span>
                  {active && (
                    <span className="w-6 h-6 rounded-full bg-emerald-300 text-emerald-900 flex items-center justify-center">
                      <Check className="w-4 h-4" strokeWidth={3} />
                    </span>
                  )}
                </div>
                <span className="block mt-1 text-xs text-emerald-100/70 font-semibold">
                  {l.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        <motion.button
          key={"btn-" + selected}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          onClick={confirm}
          className="mt-8 w-full max-w-sm inline-flex items-center justify-center gap-2 rounded-full bg-emerald-400 hover:bg-emerald-300 active:scale-[0.98] transition px-8 py-4 text-base sm:text-lg font-extrabold text-emerald-950 shadow-xl"
        >
          <Sprout className="w-5 h-5" />
          {txt(translations.picker.continue)}
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}
