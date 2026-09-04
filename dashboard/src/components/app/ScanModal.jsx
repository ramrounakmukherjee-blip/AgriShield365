import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Camera,
  Upload,
  Loader2,
  Leaf,
  ShieldAlert,
  CheckCircle2,
  ImageOff,
  RefreshCw,
  Stethoscope,
} from "lucide-react";
import { useLang } from "../../lib/useLang";
import { scanLeaf, fileToScaledDataUrl, wakeScanBackend } from "../../lib/api";
import SpeakButton from "./SpeakButton";

const sevStyle = {
  high: { bg: "bg-red-100 text-red-800 border-red-300", label: { en: "High risk", hi: "अधिक जोखिम", bn: "উচ্চ ঝুঁকি", mr: "उच्च धोका" } },
  medium: { bg: "bg-amber-100 text-amber-800 border-amber-300", label: { en: "Medium risk", hi: "मध्यम जोखिम", bn: "মাঝারি ঝুঁকি", mr: "मध्यम धोका" } },
  low: { bg: "bg-emerald-100 text-emerald-800 border-emerald-300", label: { en: "Low risk", hi: "कम जोखिम", bn: "কম ঝুঁকি", mr: "कमी धोका" } },
};

export default function ScanModal({ crop, onClose }) {
  const { t, lang } = useLang();
  const fileRef = useRef(null);
  const [phase, setPhase] = useState("pick"); // pick | loading | result | error | notleaf
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Wake the free Render backend the moment the scan screen opens, so a cold
  // start overlaps with the user choosing/taking a photo instead of blocking.
  useEffect(() => {
    wakeScanBackend();
  }, []);

  const tr = (obj) => (obj && obj[lang]) || (obj && obj.en) || "";

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToScaledDataUrl(file);
      setPreview(dataUrl);
      setPhase("loading");
      const res = await scanLeaf(dataUrl, crop);
      if (!res.ok) {
        setErrorMsg(res.status === 503 ? t("scan.offlineHint") : t("scan.error"));
        setPhase("error");
        return;
      }
      const scan = res.scan || {};
      if (scan.isLeaf === false) {
        setResult(scan);
        setPhase("notleaf");
        return;
      }
      setResult(scan);
      setPhase("result");
    } catch {
      setErrorMsg(t("scan.error"));
      setPhase("error");
    }
  }

  const reset = () => {
    setPhase("pick");
    setPreview(null);
    setResult(null);
    setErrorMsg("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const sev = sevStyle[result?.severity] || null;
  const speakText = result
    ? [result.disease, result.summary, ...(result.treatment || [])].filter(Boolean).join(". ")
    : "";

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
            <Camera className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-extrabold leading-tight">{t("scan.title")}</p>
            <p className="text-xs text-emerald-100/90 leading-snug">{t("scan.subtitle")}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/15 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5">
          {/* PICK */}
          {phase === "pick" && (
            <div className="flex flex-col items-center text-center gap-4 py-6">
              <div className="w-20 h-20 rounded-full bg-emerald-100 grid place-items-center">
                <Leaf className="w-10 h-10 text-emerald-600" />
              </div>
              <p className="text-sm text-stone-600 max-w-xs leading-relaxed">{t("scan.instructions")}</p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFile}
              />
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3.5 transition active:scale-[0.98]"
                >
                  <Camera className="w-5 h-5" /> {t("scan.takePhoto")}
                </button>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white border-2 border-emerald-200 text-emerald-700 font-bold px-6 py-3.5 hover:border-emerald-400 transition active:scale-[0.98]"
                >
                  <Upload className="w-5 h-5" /> {t("scan.upload")}
                </button>
              </div>
              <p className="text-[11px] text-stone-400 max-w-xs">{t("scan.disclaimer")}</p>
            </div>
          )}

          {/* LOADING */}
          {phase === "loading" && (
            <div className="flex flex-col items-center text-center gap-4 py-10">
              {preview && (
                <img src={preview} alt="leaf" className="w-40 h-40 object-cover rounded-2xl border-4 border-white shadow-md" />
              )}
              <Loader2 className="w-9 h-9 animate-spin text-emerald-600" />
              <p className="text-sm font-semibold text-stone-600">{t("scan.analyzing")}</p>
              <p className="text-xs text-stone-400 max-w-xs">{t("scan.analyzingSub")}</p>
            </div>
          )}

          {/* RESULT */}
          {phase === "result" && result && (
            <div className="flex flex-col gap-4">
              {preview && (
                <img src={preview} alt="leaf" className="w-full h-44 object-cover rounded-2xl border border-stone-200" />
              )}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 grid place-items-center shrink-0">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-extrabold text-stone-800 leading-tight break-words">{result.disease}</p>
                    {result.crop && <p className="text-xs text-stone-500 capitalize">{result.crop}</p>}
                  </div>
                </div>
                {sev && (
                  <span className={`shrink-0 text-[11px] font-bold border rounded-full px-2.5 py-1 ${sev.bg}`}>
                    {tr(sev.label)}
                  </span>
                )}
              </div>

              {/* confidence */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-stone-500 mb-1">
                  <span>{t("scan.confidence")}</span>
                  <span>{Math.round(result.confidence || 0)}%</span>
                </div>
                <div className="h-2 rounded-full bg-stone-200 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Math.max(0, result.confidence || 0))}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400"
                  />
                </div>
              </div>

              {result.summary && (
                <p className="text-sm text-stone-700 leading-relaxed bg-white rounded-2xl border border-stone-200 p-3.5">
                  {result.summary}
                </p>
              )}

              {result.treatment?.length > 0 && (
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-stone-500 mb-1.5">{t("scan.treatment")}</p>
                    <SpeakButton
                      textObj={{ en: speakText, hi: speakText, bn: speakText, mr: speakText }}
                      label={t("app.listen")}
                    />
                  </div>
                  <ul className="flex flex-col gap-2">
                    {result.treatment.map((step, i) => (
                      <li key={i} className="flex gap-2.5 text-sm text-stone-700 bg-white rounded-xl border border-stone-200 p-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <span className="leading-snug">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.prevention?.length > 0 && (
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wider text-stone-500 mb-1.5">{t("scan.prevention")}</p>
                  <ul className="flex flex-col gap-2">
                    {result.prevention.map((step, i) => (
                      <li key={i} className="flex gap-2.5 text-sm text-stone-700 bg-emerald-50 rounded-xl border border-emerald-100 p-3">
                        <Leaf className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <span className="leading-snug">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white border-2 border-emerald-200 text-emerald-700 font-bold px-6 py-3 hover:border-emerald-400 transition active:scale-[0.98]"
              >
                <RefreshCw className="w-4 h-4" /> {t("scan.scanAnother")}
              </button>
            </div>
          )}

          {/* NOT A LEAF */}
          {phase === "notleaf" && (
            <div className="flex flex-col items-center text-center gap-4 py-8">
              <div className="w-20 h-20 rounded-full bg-stone-100 grid place-items-center">
                <ImageOff className="w-9 h-9 text-stone-400" />
              </div>
              <p className="font-bold text-stone-700">{t("scan.notLeafTitle")}</p>
              <p className="text-sm text-stone-500 max-w-xs leading-relaxed">{result?.summary || t("scan.notLeafSub")}</p>
              <button
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-white font-bold px-6 py-3 hover:bg-emerald-500 transition"
              >
                <RefreshCw className="w-4 h-4" /> {t("scan.tryAgain")}
              </button>
            </div>
          )}

          {/* ERROR */}
          {phase === "error" && (
            <div className="flex flex-col items-center text-center gap-4 py-8">
              <div className="w-20 h-20 rounded-full bg-amber-100 grid place-items-center">
                <Stethoscope className="w-9 h-9 text-amber-600" />
              </div>
              <p className="font-bold text-stone-700">{t("scan.unavailableTitle")}</p>
              <p className="text-sm text-stone-500 max-w-xs leading-relaxed">{errorMsg}</p>
              <button
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-white font-bold px-6 py-3 hover:bg-emerald-500 transition"
              >
                <RefreshCw className="w-4 h-4" /> {t("scan.tryAgain")}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
