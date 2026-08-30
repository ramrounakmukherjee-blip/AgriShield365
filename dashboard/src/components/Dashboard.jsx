import { useMemo } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../lib/mapIcons";
import {
  Thermometer,
  Droplets,
  Wind,
  AlertTriangle,
  Info,
  MapPin,
  LogOut,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  CloudSun,
  Lightbulb,
  RefreshCw,
} from "lucide-react";
import { generateInsights, STAGE_LABELS } from "../lib/agri";
import { useLang } from "../lib/useLang";
import LanguageSwitcher from "./LanguageSwitcher";

const alertStyles = {
  critical: "bg-red-50 border-red-300 text-red-900",
  warning: "bg-amber-50 border-amber-300 text-amber-900",
  info: "bg-sky-50 border-sky-300 text-sky-900",
};

function MetricCard({ title, value, unit, icon: Icon, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm"
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="mt-3 text-xs font-semibold text-stone-500">{title}</p>
      <p className="text-2xl font-extrabold text-stone-800 leading-tight">
        {value}
        <span className="text-sm font-semibold text-stone-400 ml-1">{unit}</span>
      </p>
    </motion.div>
  );
}

function RiskGauge({ value, labels }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value < 35 ? "#16a34a" : value < 65 ? "#f59e0b" : "#dc2626";
  const label = value < 35 ? labels.low : value < 65 ? labels.mid : labels.high;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4 }}
      className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm flex flex-col sm:flex-row items-center gap-5"
    >
      <div className="relative w-36 h-36 shrink-0">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r={radius} stroke="#e7e5e4" strokeWidth="11" fill="none" />
          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            stroke={color}
            strokeWidth="11"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold" style={{ color }}>
            {value}
          </span>
        </div>
      </div>
      <div className="text-center sm:text-left">
        <h3 className="font-bold text-stone-800 flex items-center gap-2 justify-center sm:justify-start">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          {labels.status}
        </h3>
        <p className="text-stone-600 text-sm mt-1">{label}</p>
      </div>
    </motion.div>
  );
}

export default function Dashboard({ profile, onSignOut }) {
  const { t, tr, lang } = useLang();
  const data = useMemo(() => generateInsights(profile), [profile]);
  const firstName = (profile.name || "Farmer").split(" ")[0];
  const today = new Date().toLocaleDateString(
    lang === "bn" ? "bn-BD" : lang === "hi" ? "hi-IN" : lang === "mr" ? "mr-IN" : "en-IN",
    { weekday: "long", day: "numeric", month: "long" }
  );

  const riskLabels = {
    low: t("dash.riskLow"),
    mid: t("dash.riskMid"),
    high: t("dash.riskHigh"),
    status: t("dash.shieldStatus"),
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-gradient-to-r from-emerald-700 to-green-600 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center gap-3">
            <img
              src="/assets/logo-agrishield365.jpg"
              alt="AgriShield 365"
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/30"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-extrabold leading-tight truncate">
                {t("dash.namaste")}, {firstName} 🙏
              </h1>
              <p className="text-emerald-100 text-xs sm:text-sm">{t("dash.today")}</p>
            </div>
            <LanguageSwitcher />
            <button
              onClick={onSignOut}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 transition px-3.5 py-2 text-xs sm:text-sm font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{t("dash.signOut")}</span>
            </button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 font-semibold">
              <CloudSun className="w-3.5 h-3.5" /> {tr(data.season)}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              {profile.village
                ? profile.village
                : `${profile.lat.toFixed(2)}°, ${profile.lng.toFixed(2)}°`}
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1 font-semibold">{today}</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-5">
        {/* Alerts */}
        <section>
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-stone-500 mb-2.5">
            {t("dash.alertsTitle")}
          </h2>
          <div className="flex flex-col gap-2.5">
            {data.alerts.map((a, i) => (
              <motion.div
                key={a.id + i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className={`rounded-2xl border p-4 ${alertStyles[a.kind]}`}
              >
                <div className="flex items-start gap-3">
                  {a.kind === "info" ? (
                    <Info className="w-5 h-5 mt-0.5 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                  )}
                  <div>
                    <p className="font-bold text-sm sm:text-base">{tr(a.title)}</p>
                    <p className="text-sm mt-0.5 opacity-90">{tr(a.detail)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Metrics */}
        <section>
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-stone-500 mb-2.5">
            {t("dash.conditionsTitle")}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricCard title={t("dash.temp")} value={data.temp} unit="°C" icon={Thermometer} color="bg-orange-100 text-orange-600" delay={0.05} />
            <MetricCard title={t("dash.moisture")} value={data.moisture} unit="%" icon={Droplets} color="bg-blue-100 text-blue-600" delay={0.1} />
            <MetricCard title={t("dash.humidity")} value={data.humidity} unit="%" icon={CloudSun} color="bg-cyan-100 text-cyan-600" delay={0.15} />
            <MetricCard title={t("dash.wind")} value={data.wind} unit="km/h" icon={Wind} color="bg-teal-100 text-teal-600" delay={0.2} />
          </div>
        </section>

        {/* Crop progress + risk */}
        <section className="grid lg:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-800 flex items-center gap-2">
                <span className="text-2xl">{data.crop.emoji}</span>
                {tr(data.crop)}
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 rounded-full px-3 py-1">
                {t("dash.day")} {data.daysElapsed}
              </span>
            </div>
            <p className="text-sm text-stone-500 mt-0.5">{tr(STAGE_LABELS[data.stageKey])}</p>
            <div className="mt-4 h-3 rounded-full bg-stone-100 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${data.progress}%` }}
                transition={{ duration: 1.1, ease: "easeOut", delay: 0.4 }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400"
              />
            </div>
            <div className="mt-2 flex justify-between text-xs font-semibold text-stone-400">
              <span>{t("dash.sown")}</span>
              <span className="text-emerald-700">
                {t("dash.toHarvest").replace("{p}", data.progress)}
              </span>
              <span>{t("dash.harvest")}</span>
            </div>
          </motion.div>

          <RiskGauge value={data.risk} labels={riskLabels} />
        </section>

        {/* Map */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
        >
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-stone-500 mb-2.5">
            {t("dash.fieldMapTitle")}
          </h2>
          <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
            <MapContainer
              center={[profile.lat, profile.lng]}
              zoom={12}
              scrollWheelZoom={false}
              style={{ height: "260px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              <Circle
                center={[profile.lat, profile.lng]}
                radius={400}
                pathOptions={{ color: "#059669", fillColor: "#10b981", fillOpacity: 0.18 }}
              />
              <Marker position={[profile.lat, profile.lng]}>
                <Popup>
                  {firstName}
                  {t("dash.fieldPopup")}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </motion.section>

        {/* Recommendations */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-stone-500 mb-2.5 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            {t("dash.adviceTitle")}
          </h2>
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm divide-y divide-stone-100">
            {data.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 p-4">
                <div className="w-8 h-8 shrink-0 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </div>
                <p className="text-sm sm:text-base text-stone-700 font-medium leading-relaxed">
                  {tr(tip)}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Market */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <span className="text-2xl">{data.crop.emoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-stone-800">
              {tr(data.crop)} {t("dash.marketPrice")}
            </h3>
            <p className="text-2xl font-extrabold text-stone-800 mt-0.5">
              ₹{data.market.price.toLocaleString("en-IN")}
              <span className="text-sm font-semibold text-stone-400"> {t("dash.perQuintal")}</span>
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-bold shrink-0 ${
              data.market.trend >= 0
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {data.market.trend >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {data.market.trend >= 0 ? "+" : ""}
            {data.market.trend}%
          </span>
        </motion.section>

        <p className="text-center text-xs text-stone-400 flex items-center justify-center gap-1.5 pb-4">
          <RefreshCw className="w-3.5 h-3.5" />
          {t("dash.refreshNote")}
        </p>
      </main>
    </div>
  );
}
