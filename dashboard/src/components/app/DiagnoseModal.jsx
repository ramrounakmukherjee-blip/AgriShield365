import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Bug,
  Sparkles,
  ShieldAlert,
  Info,
} from "lucide-react";
import { useLang } from "../../lib/useLang";
import { groupsForCrop, diagnose } from "../../lib/diagnosis";
import SpeakButton from "./SpeakButton";

const confColor = (c) =>
  c >= 70 ? "bg-red-600" : c >= 40 ? "bg-amber-500" : "bg-sky-600";
const confText = (c) =>
  c >= 70 ? "text-red-700" : c >= 40 ? "text-amber-700" : "text-sky-700";

export default function DiagnoseModal({ crop, onClose }) {
  const { t, tr } = useLang();
  const groups = useMemo(() => groupsForCrop(crop.id), [crop.id]);
  // step: -1 = intro, 0..n-1 = question groups, n = result
  const [step, setStep] = useState(-1);
  const [selected, setSelected] = useState(() => new Set());

  const result = useMemo(
    () => diagnose(crop.id, Array.from(selected)),
    [crop.id, selected]
  );

  const toggle = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const restart = () => {
    setSelected(new Set());
    setStep(-1);
  };

  const isResult = step === groups.length;
  const group = step >= 0 && step < groups.length ? groups[step] : null;

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
        className="bg-stone-50 w-full sm:max-w-lg sm:rounded-2xl rounded-t-3xl max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-green-600 text-white px-5 py-4 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-white/15 grid place-items-center shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-extrabold text-base sm:text-lg leading-tight">{t("diag.title")}</h2>
            <p className="text-emerald-100 text-xs flex items-center gap-1">
              {t("diag.confirmCrop")} {crop.emoji} {tr(crop.name)}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label={t("diag.close")}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 grid place-items-center active:scale-95 transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress dots (questions only) */}
        {step >= 0 && !isResult && (
          <div className="px-5 pt-3 flex gap-1.5 shrink-0">
            {groups.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition ${i <= step ? "bg-emerald-500" : "bg-stone-200"}`}
              />
            ))}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <AnimatePresence mode="wait">
            {/* ---- Intro ---- */}
            {step === -1 && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-4"
              >
                <div className="bg-white rounded-2xl border border-stone-200 p-5 text-center">
                  <div className="text-5xl mb-2">🔍</div>
                  <p className="font-bold text-stone-800">
                    {crop.emoji} {tr(crop.name)}
                  </p>
                  <p className="text-sm text-stone-500 mt-2 leading-relaxed">{t("diag.pickHint")}</p>
                </div>
                <p className="text-xs text-stone-500 text-center leading-relaxed">{t("diag.disclaimer")}</p>
              </motion.div>
            )}

            {/* ---- Question group ---- */}
            {group && (
              <motion.div
                key={`g-${group.id}`}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
              >
                <h3 className="font-extrabold text-stone-800 mb-1">{tr(group.question)}</h3>
                <p className="text-xs text-stone-400 mb-3">{t("diag.pickHint")}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {group.symptoms.map((s) => {
                    const on = selected.has(s.id);
                    return (
                      <button
                        key={s.id}
                        onClick={() => toggle(s.id)}
                        className={`text-left rounded-2xl border-2 p-3 flex items-start gap-2.5 transition active:scale-[0.98] ${
                          on
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-stone-200 bg-white hover:border-stone-300"
                        }`}
                      >
                        <span className="text-2xl leading-none shrink-0">{s.emoji}</span>
                        <span className={`text-sm font-semibold leading-snug ${on ? "text-emerald-900" : "text-stone-700"}`}>
                          {tr(s.label)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ---- Result ---- */}
            {isResult && (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                className="flex flex-col gap-3"
              >
                {result.inconclusive ? (
                  <div className="rounded-2xl bg-sky-50 border border-sky-200 p-4">
                    <div className="flex items-center gap-2 text-sky-800 font-bold mb-1">
                      <Info className="w-5 h-5" /> {t("diag.inconclusiveTitle")}
                    </div>
                    <p className="text-sm text-sky-900 leading-relaxed">{t("diag.inconclusiveBody")}</p>
                  </div>
                ) : (
                  <>
                    {/* Top match */}
                    {(() => {
                      const top = result.matches[0];
                      return (
                        <div className="rounded-2xl border-2 border-emerald-300 bg-white overflow-hidden">
                          <div className={`px-4 py-2.5 text-white flex items-center justify-between ${confColor(top.confidence)}`}>
                            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                              {top.threat.type === "pest" ? <Bug className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                              {top.threat.type === "pest" ? "Pest" : "Disease"}
                            </span>
                            <span className="font-extrabold text-sm">{top.confidence}% {t("diag.match")}</span>
                          </div>
                          <div className="p-4">
                            <p className="text-lg font-extrabold text-stone-800 flex items-center gap-2">
                              <ShieldAlert className={`w-5 h-5 ${confText(top.confidence)}`} />
                              {tr(top.threat.name)}
                            </p>

                            {top.matchedSymptoms.length > 0 && (
                              <div className="mt-3">
                                <p className="text-[11px] font-bold uppercase tracking-wide text-stone-400 mb-1.5">
                                  {t("diag.signsMatched")}
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {top.matchedSymptoms.map((s) => (
                                    <span key={s.id} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold px-2.5 py-1">
                                      {s.emoji} {tr(s.label)}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="mt-3">
                              <p className="text-[11px] font-bold uppercase tracking-wide text-stone-400 mb-1">
                                {t("diag.whatToDo")}
                              </p>
                              <p className="text-sm text-stone-700 leading-relaxed">{tr(top.threat.action)}</p>
                            </div>

                            <div className="mt-3">
                              <SpeakButton
                                textObj={{
                                  en: `${tr(top.threat.name)}. ${tr(top.threat.action)}`,
                                  hi: `${tr(top.threat.name)}. ${tr(top.threat.action)}`,
                                  bn: `${tr(top.threat.name)}. ${tr(top.threat.action)}`,
                                  mr: `${tr(top.threat.name)}. ${tr(top.threat.action)}`,
                                }}
                                label={t("diag.listened")}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Runner-ups */}
                    {result.matches.length > 1 && (
                      <div className="rounded-2xl border border-stone-200 bg-white p-3">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-stone-400 mb-2">
                          {t("diag.alsoPossible")}
                        </p>
                        <div className="flex flex-col gap-2">
                          {result.matches.slice(1, 3).map((m) => (
                            <div key={m.threat.id} className="flex items-center justify-between gap-2">
                              <span className="text-sm font-semibold text-stone-600">
                                {m.threat.type === "pest" ? "🐛 " : "🍄 "} {tr(m.threat.name)}
                              </span>
                              <span className={`text-xs font-bold ${confText(m.confidence)}`}>{m.confidence}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                <p className="text-[11px] text-stone-400 text-center leading-relaxed pt-1">{t("diag.disclaimer")}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer nav */}
        <div className="border-t border-stone-200 bg-white px-5 py-3 flex items-center gap-2 shrink-0">
          {step > -1 && !isResult && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="inline-flex items-center gap-1 rounded-xl border-2 border-stone-200 text-stone-600 font-bold px-4 py-2.5 text-sm hover:bg-stone-50 transition active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" /> {t("diag.back")}
            </button>
          )}
          {isResult ? (
            <>
              <button
                onClick={restart}
                className="flex-1 rounded-xl border-2 border-emerald-600 text-emerald-700 font-bold px-4 py-2.5 text-sm hover:bg-emerald-50 transition active:scale-95"
              >
                {t("diag.restart")}
              </button>
              <button
                onClick={onClose}
                className="flex-1 rounded-xl bg-emerald-600 text-white font-bold px-4 py-2.5 text-sm hover:bg-emerald-500 transition active:scale-95"
              >
                {t("diag.close")}
              </button>
            </>
          ) : (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-600 text-white font-bold px-4 py-2.5 text-sm hover:bg-emerald-500 transition active:scale-95"
            >
              {step === -1 ? t("diag.start") : step === groups.length - 1 ? t("diag.seeResult") : t("diag.next")}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
