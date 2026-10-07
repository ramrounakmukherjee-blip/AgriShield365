import { useState, useEffect } from "react";
import {
  MapPin,
  Bell,
  BellOff,
  Download,
  Save,
  LogOut,
  RefreshCw,
  Globe,
  Compass,
  History,
  CheckCircle2,
  Info,
  Trophy,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import { useLang } from "../../lib/useLang";
import { LANGUAGES } from "../../lib/i18n";
import { CROPS, SOIL_TYPES, IRRIGATION_TYPES } from "../../lib/agri";
import { saveProfile, getAdvisoryHistory } from "../../lib/api";
import { getAlertFeedback } from "../../lib/feedback";

const inputCls =
  "w-full rounded-xl border-2 border-stone-200 focus:border-emerald-500 bg-white px-3.5 py-2.5 text-base font-medium text-stone-800 outline-none";

export default function ProfileScreen({ profile, onSignOut, onSave, onResetSetup }) {
  const { t, tr, lang, setLang } = useLang();
  const [form, setForm] = useState({ ...profile });
  const [notifPerm, setNotifPerm] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "unsupported"
  );
  const [installEvt, setInstallEvt] = useState(null);
  const [saved, setSaved] = useState(false);
  const [history] = useState(() => getAdvisoryHistory());
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [feedbackCount] = useState(() => getAlertFeedback().length);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallEvt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = () => {
    saveProfile(form);
    onSave?.(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const requestNotif = async () => {
    if (typeof Notification === "undefined") return;
    const p = await Notification.requestPermission();
    setNotifPerm(p);
    if (p === "granted") {
      new Notification("AgriShield 365", {
        body: t("home.allClear"),
        icon: "/assets/logo-agrishield365.jpg",
      });
    }
  };

  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto">
      {/* Identity */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 flex items-center gap-4">
        <img src="/assets/logo-agrishield365.jpg" alt="" className="w-16 h-16 rounded-2xl object-cover" />
        <div className="min-w-0">
          <p className="text-lg font-extrabold text-stone-800 truncate">{profile.name}</p>
          <p className="text-sm text-stone-500">+91 {profile.phone || "•••• ••••••"}</p>
        </div>
      </div>

      {/* Farm details */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5">
        <h3 className="font-bold text-stone-800 mb-4">{t("profile.title")}</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-bold text-stone-500 mb-1 block">{t("onb.nameLabel")}</span>
            <input className={inputCls} value={form.name || ""} onChange={(e) => set("name", e.target.value)} />
          </label>
          <label className="block">
            <span className="text-xs font-bold text-stone-500 mb-1 block">{t("onb.villageLabel")}</span>
            <input className={inputCls} value={form.village || ""} onChange={(e) => set("village", e.target.value)} />
          </label>
          <label className="block">
            <span className="text-xs font-bold text-stone-500 mb-1 block">{t("onb.cropQuestion")}</span>
            <select className={inputCls} value={form.crop} onChange={(e) => set("crop", e.target.value)}>
              {CROPS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {tr(c.name)}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-bold text-stone-500 mb-1 block">{t("onb.areaLabel")}</span>
            <input
              type="number"
              min="0.1"
              step="0.1"
              className={inputCls}
              value={form.area || ""}
              onChange={(e) => set("area", e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold text-stone-500 mb-1 block">{t("onb.soilLabel")}</span>
            <select className={inputCls} value={form.soil} onChange={(e) => set("soil", e.target.value)}>
              {SOIL_TYPES.map((s) => (
                <option key={s.id} value={s.id}>{tr(s)}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-bold text-stone-500 mb-1 block">{t("onb.irrigationLabel")}</span>
            <select className={inputCls} value={form.irrigation} onChange={(e) => set("irrigation", e.target.value)}>
              {IRRIGATION_TYPES.map((s) => (
                <option key={s.id} value={s.id}>{tr(s)}</option>
              ))}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs font-bold text-stone-500 mb-1 block">{t("onb.sowingLabel")}</span>
            <input
              type="date"
              className={inputCls}
              value={form.sowingDate || ""}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => set("sowingDate", e.target.value)}
            />
          </label>
        </div>

        <button
          onClick={save}
          className="mt-4 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 transition active:scale-95"
        >
          <Save className="w-4 h-4" /> {saved ? "✓" : t("profile.save")}
        </button>

        <button
          onClick={onResetSetup}
          className="mt-3 w-full sm:w-auto inline-flex items-center gap-2 rounded-xl border-2 border-stone-200 text-stone-600 font-bold px-5 py-3 hover:bg-stone-50 transition"
        >
          <RefreshCw className="w-4 h-4" /> {t("onb.title")}
        </button>

        <p className="mt-3 flex items-center gap-1.5 text-xs text-stone-400">
          <MapPin className="w-3.5 h-3.5" /> {t("profile.location")}: {Number(form.lat).toFixed(3)}°, {Number(form.lng).toFixed(3)}°
        </p>
      </div>

      {/* Language */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5">
        <h3 className="font-bold text-stone-800 mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4" /> {t("profile.language")}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {LANGUAGES.map((l) => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              className={`rounded-xl border-2 px-3 py-2.5 font-bold transition ${
                lang === l.id ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-stone-200 text-stone-500"
              }`}
            >
              {l.native}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 flex items-center gap-3">
        {notifPerm === "granted" ? (
          <>
            <Bell className="w-6 h-6 text-emerald-600" />
            <p className="flex-1 text-sm font-semibold text-stone-700">{t("profile.notifEnabled")}</p>
          </>
        ) : (
          <>
            <BellOff className="w-6 h-6 text-stone-400" />
            <p className="flex-1 text-sm text-stone-600">
              {notifPerm === "denied" ? t("profile.notifBlocked") : t("profile.notifications")}
            </p>
            {notifPerm !== "denied" && notifPerm !== "unsupported" && (
              <button
                onClick={requestNotif}
                className="shrink-0 rounded-xl bg-emerald-600 text-white font-bold px-4 py-2.5 text-sm hover:bg-emerald-500 transition"
              >
                {t("profile.notifOn")}
              </button>
            )}
          </>
        )}
      </div>

      {/* Install PWA */}
      {installEvt && (
        <button
          onClick={async () => {
            installEvt.prompt();
            setInstallEvt(null);
          }}
          className="rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-4 flex items-center gap-3 text-emerald-800 font-bold hover:bg-emerald-100 transition"
        >
          <Download className="w-6 h-6" />
          <span className="text-left">
            {t("profile.install")}
            <span className="block text-xs font-normal text-emerald-700">{t("profile.installHint")}</span>
          </span>
        </button>
      )}

      {/* Advisory history */}
      {history.length > 0 && (
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <h3 className="font-extrabold text-stone-800 flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600" />
            {tr({ en: "Advisory history", hi: "सलाह इतिहास", bn: "পরামর্শের ইতিহাস", mr: "सल्ला इतिहास" })}
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            {tr({ en: "Saved on this device and backed up to the cloud when you're signed in.", hi: "इस डिवाइस पर सुरक्षित और लॉगिन पर क्लाउड में बैकअप।", bn: "এই ডিভাইসে সংরক্ষিত এবং সাইন ইন থাকলে ক্লাউডে ব্যাকআপ।", mr: "या डिव्हाइसवर सेव्ह आणि लॉगिन असताना क्लाउड बॅकअप." })}
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {history.slice(0, showAllHistory ? 60 : 6).map((h, i) => (
              <li key={i} className="flex items-center gap-3 rounded-xl bg-stone-50 px-3 py-2.5">
                <span className="text-xl">{h.emoji || "🌱"}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-stone-700 truncate">
                    {h.topAlert ? (
                      <span className="inline-flex items-center gap-1.5">
                        <span className={`inline-block w-2 h-2 rounded-full ${h.topKind === "critical" ? "bg-red-500" : h.topKind === "warning" ? "bg-amber-500" : "bg-emerald-500"}`} />
                        {h.topAlert}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-emerald-700">
                        <CheckCircle2 className="w-4 h-4" />
                        {tr({ en: "No active alerts", hi: "कोई सक्रिय चेतावनी नहीं", bn: "কোনো সক্রিয় সতর্কতা নেই", mr: "कोणताही सक्रिय इशारा नाही" })}
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-stone-400">
                    {new Date(h.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {h.temp}°C · {h.humidity}% RH
                  </p>
                </div>
                {h.score > 0 && (
                  <span className={`shrink-0 text-[10px] font-bold rounded-full px-2 py-0.5 ${h.score >= 80 ? "bg-red-100 text-red-700" : h.score >= 60 ? "bg-amber-100 text-amber-700" : "bg-stone-200 text-stone-600"}`}>
                    {h.score}%
                  </span>
                )}
              </li>
            ))}
          </ul>
          {history.length > 6 && (
            <button
              onClick={() => setShowAllHistory((v) => !v)}
              className="mt-3 text-xs font-bold text-emerald-700 hover:underline"
            >
              {showAllHistory
                ? tr({ en: "Show less", hi: "कम दिखाएँ", bn: "কম দেখান", mr: "कमी दाखवा" })
                : tr({ en: `View all ${history.length} entries`, hi: `सभी ${history.length} प्रविष्टियाँ देखें`, bn: `সব ${history.length}টি দেখুন`, mr: `सर्व ${history.length} नोंदी पहा` })}
            </button>
          )}
        </div>
      )}

      {/* Replay guided tour */}
      <button
        onClick={() => {
          try {
            localStorage.removeItem("agrishield365_tour_done_v1");
          } catch {
            /* ignore */
          }
          window.dispatchEvent(new Event("agrishield:replay-tour"));
        }}
        className="rounded-2xl border-2 border-emerald-200 text-emerald-700 font-bold px-5 py-3.5 inline-flex items-center justify-center gap-2 hover:bg-emerald-50 transition"
      >
        <Compass className="w-4 h-4" /> {tr({ en: "Replay guided tour", hi: "गाइडेड टूर दोबारा देखें", bn: "গাইডেড ট্যুর আবার দেখুন", mr: "मार्गदर्शित दौरा पुन्हा पहा" })}
      </button>

      {/* Sign out */}
      <button
        onClick={onSignOut}
        className="rounded-2xl border-2 border-red-200 text-red-600 font-bold px-5 py-3.5 inline-flex items-center justify-center gap-2 hover:bg-red-50 transition"
      >
        <LogOut className="w-4 h-4" /> {t("app.signOut")}
      </button>

      {/* About — who builds this, and for which mission */}
      <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-5">
        <h3 className="font-extrabold text-emerald-900 flex items-center gap-2">
          <Info className="w-5 h-5 text-emerald-600" /> {t("about.title")}
        </h3>
        <p className="mt-1 text-sm font-bold text-emerald-800">🌾 {t("about.tagline")}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { icon: Trophy, key: "about.event" },
            { icon: ShieldCheck, key: "about.ps" },
            { icon: Cpu, key: "about.hardwareChip" },
          ].map(({ icon: ChipIcon, key }) => (
            <span
              key={key}
              className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-bold text-emerald-900"
            >
              <ChipIcon className="w-3.5 h-3.5" />
              {t(key)}
            </span>
          ))}
        </div>

        <p className="mt-3 text-xs text-emerald-900/90 leading-relaxed">{t("about.line")}</p>
        <p className="mt-2 text-xs text-emerald-900/90 leading-relaxed">{t("about.hardware")}</p>

        <div className="mt-4 border-t border-emerald-200 pt-3">
          <p className="text-sm font-extrabold text-emerald-900 flex items-center gap-2">
            <span className="text-base">🦅</span> {t("about.team")}
          </p>
          <p className="text-xs text-emerald-900/90 mt-1 leading-relaxed">{t("about.madeWith")}</p>
          {feedbackCount > 0 && (
            <p className="text-[11px] text-emerald-900/80 mt-2 leading-relaxed">
              {t("about.observations").replace("{n}", feedbackCount)}
            </p>
          )}
        </div>
      </div>

      {/* Build version (F12 console also logs this) */}
      <p className="text-center text-[11px] text-stone-400 font-medium">
        AgriShield 365 · v{/* eslint-disable-next-line no-undef */ __BUILD__} · {__BUILD_DATE__}
      </p>
    </div>
  );
}
