import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Info,
  ShieldAlert,
  Bug,
  Thermometer,
  Droplets,
  CloudRain,
  Wind,
  ShieldCheck,
  CheckCircle2,
  Stethoscope,
} from "lucide-react";
import { useLang } from "../../lib/useLang";
import SpeakButton from "./SpeakButton";
import DiagnoseModal from "./DiagnoseModal";
import { weatherEmoji } from "../../lib/weather";
import { getImpactStats } from "../../lib/api";

const alertStyles = {
  critical: "bg-red-50 border-red-300 text-red-900",
  warning: "bg-amber-50 border-amber-300 text-amber-900",
  info: "bg-sky-50 border-sky-300 text-sky-900",
};

function whenLabel(daysAhead, t) {
  if (daysAhead === 0) return t("app.today");
  if (daysAhead === 1) return t("app.tomorrow");
  return t("app.inDays").replace("{n}", daysAhead ?? 2);
}

export default function HomeScreen({ profile, weather, advisories }) {
  const { t, tr, lang } = useLang();
  const { alerts, crop, stage } = advisories;
  const cur = weather.current;
  const stats = getImpactStats();
  const [showDiagnose, setShowDiagnose] = useState(false);

  const highest = alerts.reduce((m, a) => {
    if (a.kind === "critical") return Math.max(m, 90);
    if (a.kind === "warning") return Math.max(m, 62);
    return Math.max(m, 30);
  }, 10);
  const risk = Math.max(
    highest,
    alerts.some((a) => a.threatType) ? 55 : 0
  );
  const riskLabel = risk < 35 ? t("home.riskLow") : risk < 65 ? t("home.riskMid") : t("home.riskHigh");
  const riskColor = risk < 35 ? "text-emerald-600" : risk < 65 ? "text-amber-600" : "text-red-600";

  const metrics = [
    { icon: Thermometer, val: Math.round(cur.temp), unit: "°C", label: t("home.temp"), color: "bg-orange-100 text-orange-600" },
    { icon: Droplets, val: Math.round(cur.humidity), unit: "%", label: t("home.moisture"), color: "bg-cyan-100 text-cyan-600" },
    { icon: CloudRain, val: weather.daily[0].rain, unit: "mm", label: t("home.rainToday"), color: "bg-blue-100 text-blue-600" },
    { icon: Wind, val: Math.round(cur.wind), unit: "km/h", label: t("home.wind"), color: "bg-teal-100 text-teal-600" },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Alerts */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-stone-500">
            {t("home.activeAlerts")}
          </h2>
          <SpeakButton
            textObj={{
              en: alerts.map((a) => `${tr(a.title)}. ${tr(a.detail)}`).join(". "),
              hi: alerts.map((a) => `${tr(a.title)}. ${tr(a.detail)}`).join(". "),
              bn: alerts.map((a) => `${tr(a.title)}. ${tr(a.detail)}`).join(". "),
              mr: alerts.map((a) => `${tr(a.title)}. ${tr(a.detail)}`).join(". "),
            }}
            label={t("app.listen")}
          />
        </div>
        {alerts.length === 0 ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-3 text-emerald-900">
            <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
            <p className="text-sm font-medium">{t("home.noAlerts")}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {alerts.map((a, i) => (
              <motion.div
                key={a.id + i}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`rounded-2xl border p-4 ${alertStyles[a.kind] || alertStyles.info}`}
              >
                <div className="flex items-start gap-3">
                  {a.kind === "info" ? (
                    <Info className="w-5 h-5 mt-0.5 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-sm sm:text-base">{tr(a.title)}</p>
                      <span className="text-[10px] font-bold uppercase tracking-wide bg-black/10 rounded-full px-2 py-0.5">
                        {whenLabel(a.daysAhead, t)}
                      </span>
                      {a.threatType && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase bg-black/10 rounded-full px-2 py-0.5">
                          <Bug className="w-3 h-3" /> {a.threatType}
                        </span>
                      )}
                    </div>
                    <p className="text-sm mt-0.5 opacity-90 leading-relaxed">{tr(a.detail)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Symptom checker entry (option 6) */}
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setShowDiagnose(true)}
        className="w-full text-left rounded-2xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-4 flex items-center gap-3 hover:border-emerald-400 hover:shadow-md transition active:scale-[0.99] group"
      >
        <div className="w-12 h-12 shrink-0 rounded-2xl bg-emerald-600 text-white grid place-items-center group-hover:scale-105 transition">
          <Stethoscope className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-extrabold text-emerald-900 text-sm sm:text-base">{t("diag.entryTitle")}</p>
          <p className="text-xs text-emerald-700/80 mt-0.5 leading-snug">{t("diag.entrySub")}</p>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-600 text-white text-xs font-bold px-4 py-2">
          {t("diag.entryCta")}
        </span>
      </motion.button>

      {/* Metrics */}
      <section>
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-stone-500 mb-2.5">
          {t("home.conditions")}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="bg-white rounded-2xl border border-stone-200 p-4"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${m.color}`}>
                <m.icon className="w-5 h-5" />
              </div>
              <p className="mt-3 text-xs font-semibold text-stone-500">{m.label}</p>
              <p className="text-2xl font-extrabold text-stone-800">
                {m.val}
                <span className="text-sm font-semibold text-stone-400 ml-1">{m.unit}</span>
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Crop + risk */}
      <section className="grid md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-stone-200 p-5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-stone-800 flex items-center gap-2">
              <span className="text-2xl">{crop.emoji}</span> {tr(crop.name)}
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 rounded-full px-3 py-1">
              {t("home.day")} {stage.days}
            </span>
          </div>
          <p className="text-sm text-stone-500 mt-0.5">{tr(stage.name)}</p>
          {stage.critical && (
            <p className="mt-2 inline-block text-xs font-bold text-amber-800 bg-amber-100 rounded-full px-2.5 py-1">
              ⚠️ {t("home.criticalStage")}
            </p>
          )}
          <div className="mt-4 h-3 rounded-full bg-stone-100 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stage.progress}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400"
            />
          </div>
          <div className="mt-2 flex justify-between text-xs font-semibold text-stone-400">
            <span>{t("home.sown")}</span>
            <span className="text-emerald-700">{t("home.toHarvest").replace("{p}", stage.progress)}</span>
            <span>{t("home.harvest")}</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-stone-200 p-5 flex items-center gap-5">
          <div className="w-20 h-20 shrink-0 rounded-full grid place-items-center bg-stone-50">
            <ShieldCheck className={`w-11 h-11 ${riskColor}`} />
          </div>
          <div>
            <h3 className="font-bold text-stone-800 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-600" /> {t("home.shield")}
            </h3>
            <p className={`text-sm mt-1 font-semibold ${riskColor}`}>{riskLabel}</p>
            <p className="text-xs text-stone-400 mt-1">
              {weatherEmoji(cur.code)} {tr({ en: "Based on the live forecast for your field", hi: "आपके खेत के लाइव पूर्वानुमान पर आधारित", bn: "আপনার মাঠের লাইভ পূর্বাভাসের ভিত্তিতে", mr: "तुमच्या शेताच्या थेट अंदाजावर आधारित" })}
            </p>
          </div>
        </motion.div>
      </section>

      {/* Impact stats */}
      <section className="bg-emerald-900 rounded-2xl p-5 text-white">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-emerald-200 mb-3">
          {t("home.impact")}
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <p className="text-3xl font-extrabold text-emerald-300">{s.value}</p>
              <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">{tr(s.text)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Symptom checker modal */}
      <AnimatePresence>
        {showDiagnose && <DiagnoseModal crop={crop} onClose={() => setShowDiagnose(false)} />}
      </AnimatePresence>
    </div>
  );
}
