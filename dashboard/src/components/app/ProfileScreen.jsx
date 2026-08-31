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
} from "lucide-react";
import { useLang } from "../../lib/useLang";
import { LANGUAGES } from "../../lib/i18n";
import { CROPS, SOIL_TYPES, IRRIGATION_TYPES } from "../../lib/agri";
import { saveProfile } from "../../lib/api";

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

      {/* Sign out */}
      <button
        onClick={onSignOut}
        className="rounded-2xl border-2 border-red-200 text-red-600 font-bold px-5 py-3.5 inline-flex items-center justify-center gap-2 hover:bg-red-50 transition"
      >
        <LogOut className="w-4 h-4" /> {t("app.signOut")}
      </button>
    </div>
  );
}
