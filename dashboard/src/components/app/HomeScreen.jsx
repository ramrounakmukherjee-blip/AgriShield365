import { useState, useEffect } from "react";
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
  Camera,
  BookOpen,
  FlaskConical,
  MapPin,
  Share2,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useLang } from "../../lib/useLang";
import SpeakButton from "./SpeakButton";
import DiagnoseModal from "./DiagnoseModal";
import ScanModal from "./ScanModal";
import { weatherEmoji } from "../../lib/weather";
import {
  getImpactStats,
  reverseGeocode,
  buildAdvisorySummary,
  shareAdvisory,
} from "../../lib/api";

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
  const [showScan, setShowScan] = useState(false);
  const [loc, setLoc] = useState(null);
  const [openWhy, setOpenWhy] = useState({});
  const [shareState, setShareState] = useState("");

  // Reverse-geocode the field GPS to a readable place name (free, no key).
  useEffect(() => {
    let alive = true;
    reverseGeocode(profile.lat, profile.lng).then((p) => {
      if (alive && p) setLoc(p);
    });
    return () => { alive = false; };
  }, [profile.lat, profile.lng]);

  const onShare = async () => {
    const text = buildAdvisorySummary(profile, weather, advisories);
    const r = await shareAdvisory(text);
    setShareState(r === "shared" ? t("home.shareDone") : r === "copied" ? t("home.shareCopied") : "");
    setTimeout(() => setShareState(""), 2500);
  };

  const fieldLabel = loc?.place
    || profile.village
    || t("home.yourField");
  const fieldSub = loc?.place
    ? `${profile.lat.toFixed(4)}, ${profile.lng.toFixed(4)} · ${loc.country || ""}`
    : `${profile.lat.toFixed(4)}°, ${profile.lng.toFixed(4)}°`;

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
      {/* GPS field location */}
      <div className="flex items-center gap-3 rounded-2xl bg-white border border-stone-200 px-4 py-3">
        <div className="w-10 h-10 shrink-0 rounded-xl bg-emerald-100 text-emerald-700 grid place-items-center">
          <MapPin className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">{t("home.field")}</p>
          <p className="font-extrabold text-stone-800 text-sm truncate">{fieldLabel}</p>
          <p className="text-[11px] text-stone-500 truncate">{fieldSub}</p>
        </div>
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-700 rounded-full px-2.5 py-1">
          GPS
        </span>
      </div>

      {/* Alerts */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-stone-500">
            {t("home.activeAlerts")}
          </h2>
          <div className="flex items-center gap-2">
            <SpeakButton
              textObj={{
                en: alerts.map((a) => `${tr(a.title)}. ${tr(a.detail)}`).join(". "),
                hi: alerts.map((a) => `${tr(a.title)}. ${tr(a.detail)}`).join(". "),
                bn: alerts.map((a) => `${tr(a.title)}. ${tr(a.detail)}`).join(". "),
                mr: alerts.map((a) => `${tr(a.title)}. ${tr(a.detail)}`).join(". "),
              }}
              label={t("app.listen")}
            />
            <button
              onClick={onShare}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 transition active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" /> {shareState || t("home.share")}
            </button>
          </div>
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
                    {a.why && (
                      <div className="mt-2">
                        <button
                          onClick={() => setOpenWhy((s) => ({ ...s, [a.id + i]: !s[a.id + i] }))}
                          className="inline-flex items-center gap-1 text-[11px] font-bold opacity-80 hover:opacity-100 transition"
                        >
                          <FlaskConical className="w-3 h-3" />
                          {t("home.why")}
                          <ChevronDown className={`w-3 h-3 transition-transform ${openWhy[a.id + i] ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence>
                          {openWhy[a.id + i] && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-[11px] leading-relaxed mt-1.5 rounded-lg bg-black/5 px-2.5 py-2"
                            >
                              {tr(a.why)}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* AI leaf-scan entry (Gemini via backend) */}
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setShowScan(true)}
        className="w-full text-left rounded-2xl border-2 border-emerald-600 bg-gradient-to-r from-emerald-600 to-green-600 p-4 flex items-center gap-3 hover:shadow-lg hover:shadow-emerald-600/30 transition active:scale-[0.99] group text-white"
      >
        <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/20 grid place-items-center group-hover:scale-105 transition">
          <Camera className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-extrabold text-sm sm:text-base flex items-center gap-2">
            {t("scan.cardTitle")}
            <span className="text-[9px] font-bold uppercase tracking-wide bg-white/25 rounded-full px-2 py-0.5">AI</span>
          </p>
          <p className="text-xs text-emerald-50/90 mt-0.5 leading-snug">{t("scan.cardSub")}</p>
        </div>
        <span className="shrink-0 rounded-full bg-white text-emerald-700 text-xs font-bold px-4 py-2">
          {t("scan.cardCta")}
        </span>
      </motion.button>

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
              {s.source && (
                <p className="mt-2 flex items-start gap-1 text-[10px] font-semibold text-emerald-300/80 leading-snug border-t border-white/10 pt-1.5">
                  <BookOpen className="w-3 h-3 mt-0.5 shrink-0" />
                  <span>{s.source}</span>
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Science & sources — credibility layer (all free) */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-stone-200 p-5"
      >
        <h3 className="font-extrabold text-stone-800 flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-emerald-600" />
          {tr({ en: "The science behind AgriShield 365", hi: "AgriShield 365 के पीछे का विज्ञान", bn: "AgriShield 365-এর পেছনের বিজ্ঞান", mr: "AgriShield 365 मागील शास्त्र" })}
        </h3>
        <p className="text-xs text-stone-500 mt-1 leading-relaxed">
          {tr({ en: "Every alert and irrigation plan is grounded in verified government & institutional sources — not guesswork.", hi: "हर चेतावनी और सिंचाई योजना सत्यापित सरकारी व संस्थागत स्रोतों पर आधारित है — अनुमान नहीं।", bn: "প্রতিটি সতর্কতা ও সেচ পরিকল্পনা যাচাইকৃত সরকারি ও প্রাতিষ্ঠানিক উৎসের ভিত্তিতে — অনুমান নয়।", mr: "प्रत्येक इशारा व सिंचन योजना पडताळलेल्या सरकारी व संस्थात्मक स्त्रोतांवर आधारित — अंदाज नाही." })}
        </p>
        <ul className="mt-4 flex flex-col gap-2.5">
          {[
            { icon: "🌦️", src: { en: "Open-Meteo live weather (IMD-grade forecasts), refreshed for your GPS field location", hi: "Open-Meteo लाइव मौसम (IMD-स्तरीय पूर्वानुमान), आपके GPS खेत के लिए", bn: "Open-Meteo লাইভ আবহাওয়া (IMD-স্তরের পূর্বাভাস), আপনার GPS মাঠের জন্য", mr: "Open-Meteo थेट हवामान (IMD-दर्जाचे अंदाज), तुमच्या GPS शेतासाठी" } },
            { icon: "🐛", src: { en: "Disease & pest thresholds — ICAR (CICR Nagpur) & TNAU Agritech Portal", hi: "रोग-कीट सीमाएँ — ICAR (CICR नागपुर) और TNAU एग्रीटेक पोर्टल", bn: "রোগ-পোকা মাত্রা — ICAR (CICR নাগপুর) ও TNAU অ্যাগ্রিটেক পোর্টাল", mr: "रोग-कीड सीमा — ICAR (CICR नागपूर) व TNAU ॲग्रिटेक पोर्टल" } },
            { icon: "💧", src: { en: "Smart irrigation — FAO-56 Penman-Monteith crop coefficients (Kc)", hi: "स्मार्ट सिंचाई — FAO-56 पेनमैन-मोंटिथ फसल गुणांक (Kc)", bn: "স্মার্ট সেচ — FAO-56 পেনম্যান-মন্টিথ শস্য গুণাঙ্ক (Kc)", mr: "स्मार्ट सिंचन — FAO-56 पेनमन-माँटेइथ पीक गुणांक (Kc)" } },
          ].map((row, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-stone-600">
              <span className="text-base leading-6">{row.icon}</span>
              <span className="leading-snug">{tr(row.src)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[11px] text-stone-400 leading-relaxed flex items-start gap-1.5 border-t border-stone-100 pt-3">
          <BookOpen className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          {tr({ en: "Advisory screening only — always confirm sprays with your local KVK / agriculture officer.", hi: "यह केवल सलाह-स्क्रीनिंग है — छिड़काव से पहले स्थानीय KVK / कृषि अधिकारी से पुष्टि करें।", bn: "এটি শুধু পরামর্শ-স্ক্রিনিং — স্প্রে করার আগে স্থানীয় KVK/কৃষি অফিসারের সঙ্গে নিশ্চিত করুন।", mr: "हे केवळ सल्ला-स्क्रीनिंग आहे — फवारणीपूर्वी स्थानिक KVK/कृषी अधिकाऱ्यांची खात्री करा." })}
        </p>
      </motion.section>

      {/* Symptom checker modal */}
      <AnimatePresence>
        {showScan && <ScanModal crop={crop} onClose={() => setShowScan(false)} />}
        {showDiagnose && <DiagnoseModal crop={crop} onClose={() => setShowDiagnose(false)} />}
      </AnimatePresence>
    </div>
  );
}
