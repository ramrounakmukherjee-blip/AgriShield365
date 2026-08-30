import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sprout, Satellite, CloudSun, Bug, LineChart } from "lucide-react";

const STEPS = [
  { icon: Satellite, text: "Locating your field via satellite", hi: "सैटेलाइट से खेत ढूँढा जा रहा है" },
  { icon: CloudSun, text: "Fetching local weather forecast", hi: "मौसम की जानकारी ली जा रही है" },
  { icon: Bug, text: "Scanning crop disease risk", hi: "फसल रोग जोखिम की जाँच हो रही है" },
  { icon: LineChart, text: "Preparing today's advisories", hi: "आज की सलाह तैयार हो रही है" },
];

export default function Analyzing({ onDone }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = STEPS.map((_, i) =>
      setTimeout(() => {
        if (i < STEPS.length - 1) setStep(i + 1);
      }, 550 * (i + 1))
    );
    const done = setTimeout(onDone, 550 * STEPS.length + 500);
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

      <h1 className="text-2xl font-extrabold">Preparing your shield</h1>
      <p className="font-hindi text-emerald-200 mt-1">आपके खेत की सुरक्षा तैयार हो रही है…</p>

      <div className="mt-8 flex flex-col gap-3 w-full max-w-sm">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
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
              <Icon className={`w-5 h-5 ${active ? "text-emerald-200" : "text-white/50"}`} />
              <div>
                <p className="text-sm font-semibold">{s.text}</p>
                <p className="font-hindi text-xs text-emerald-100/80">{s.hi}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
