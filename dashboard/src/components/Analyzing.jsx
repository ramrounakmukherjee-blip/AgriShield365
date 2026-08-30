import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sprout, Satellite, CloudSun, Bug, LineChart } from "lucide-react";
import { useLang } from "../lib/useLang";

const STEP_ICONS = [Satellite, CloudSun, Bug, LineChart];

export default function Analyzing({ onDone }) {
  const { t } = useLang();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = STEP_ICONS.map((_, i) =>
      setTimeout(() => {
        if (i < STEP_ICONS.length - 1) setStep(i + 1);
      }, 600 * (i + 1))
    );
    const done = setTimeout(onDone, 600 * STEP_ICONS.length + 600);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [onDone]);

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-emerald-900 to-green-700 flex flex-col items-center justify-center px-6 text-center text-white">
      <div className="relative w-28 h-28 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-white/20" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-300 animate-spin-slow" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sprout className="w-10 h-10 text-emerald-200" />
        </div>
      </div>

      <h1 className="text-2xl font-extrabold max-w-sm">{t("analyzing.title")}</h1>

      <div className="mt-8 flex flex-col gap-3 w-full max-w-sm">
        {STEP_ICONS.map((Icon, i) => {
          const active = i <= step;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0.25 }}
              animate={{ opacity: active ? 1 : 0.25 }}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left ${
                active ? "bg-white/15" : "bg-white/5"
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${active ? "text-emerald-200" : "text-white/50"}`} />
              <p className="text-sm font-semibold">{t(`analyzing.steps.${i}`)}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
