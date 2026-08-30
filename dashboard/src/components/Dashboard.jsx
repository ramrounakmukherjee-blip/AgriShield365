import { useMemo } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../lib/mapIcons";
import {
  Thermometer,
  Droplets,
  Wind,
  Activity,
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
import { generateInsights } from "../lib/agri";

const alertStyles = {
  critical: "bg-red-50 border-red-300 text-red-900",
  warning: "bg-amber-50 border-amber-300 text-amber-900",
  info: "bg-sky-50 border-sky-300 text-sky-900",
};

function MetricCard({ title, hi, value, unit, icon: Icon, color, delay }) {
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
      <p className="mt-3 text-xs font-semibold text-stone-500">
        {title} <span className="font-hindi">· {hi}</span>
      </p>
      <p className="text-2xl font-extrabold text-stone-800 leading-tight">
        {value}
        <span className="text-sm font-semibold text-stone-400 ml-1">{unit}</span>
      </p>
    </motion.div>
  );
}

function RiskGauge({ value }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value < 35 ? "#16a34a" : value < 65 ? "#f59e0b" : "#dc2626";
  const label =
    value < 35
      ? { en: "Low risk — your field looks safe", hi: "कम जोखिम — खेत सुरक्षित है" }
      : value < 65
      ? { en: "Moderate risk — stay alert", hi: "मध्यम जोखिम — सतर्क रहें" }
      : { en: "High risk — act now", hi: "उच्च जोखिम — अभी कार्य करें" };

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
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Risk index
          </span>
        </div>
      </div>
      <div className="text-center sm:text-left">
        <h3 className="font-bold text-stone-800 flex items-center gap-2 justify-center sm:justify-start">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          Shield status
        </h3>
        <p className="text-stone-600 text-sm mt-1">{label.en}</p>
        <p className="font-hindi text-sm text-stone-500">{label.hi}</p>
      </div>
    </motion.div>
  );
}

export default function Dashboard({ profile, onSignOut }) {
  const data = useMemo(() => generateInsights(profile), [profile]);
  const firstName = (profile.name || "Farmer").split(" ")[0];
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
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
                Namaste, {firstName} 🙏
              </h1>
              <p className="font-hindi text-emerald-100 text-xs sm:text-sm">
                {data.season.hi} · आज की सलाह
              </p>
            </div>
            <button
              onClick={onSignOut}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 transition px-3.5 py-2 text-xs sm:text-sm font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 font-semibold">
              <CloudSun className="w-3.5 h-3.5" /> {data.season.label}
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
            Active alerts <span className="font-hindi font-semibold normal-case tracking-normal">· चेतावनियाँ</span>
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
                    <p className="font-bold text-sm sm:text-base">
                      {a.title} <span className="font-hindi font-semibold">· {a.hi}</span>
                    </p>
                    <p className="text-sm mt-0.5 opacity-90">{a.detail}</p>
                    <p className="font-hindi text-sm mt-0.5 opacity-80">{a.detailHi}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Metrics */}
        <section>
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-stone-500 mb-2.5">
            Today's field conditions <span className="font-hindi font-semibold normal-case tracking-normal">· आज के हालात</span>
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricCard title="Temperature" hi="तापमान" value={data.temp} unit="°C" icon={Thermometer} color="bg-orange-100 text-orange-600" delay={0.05} />
            <MetricCard title="Soil moisture" hi="नमी" value={data.moisture} unit="%" icon={Droplets} color="bg-blue-100 text-blue-600" delay={0.1} />
            <MetricCard title="Humidity" hi="आर्द्रता" value={data.humidity} unit="%" icon={CloudSun} color="bg-cyan-100 text-cyan-600" delay={0.15} />
            <MetricCard title="Wind" hi="हवा" value={data.wind} unit="km/h" icon={Wind} color="bg-teal-100 text-teal-600" delay={0.2} />
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
                {data.crop.label.split(" / ")[0]} crop
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 rounded-full px-3 py-1">
                Day {data.daysElapsed}
              </span>
            </div>
            <p className="text-sm text-stone-500 mt-0.5">
              {data.stage.label} · <span className="font-hindi">{data.stage.hi}</span>
            </p>
            <div className="mt-4 h-3 rounded-full bg-stone-100 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${data.progress}%` }}
                transition={{ duration: 1.1, ease: "easeOut", delay: 0.4 }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400"
              />
            </div>
            <div className="mt-2 flex justify-between text-xs font-semibold text-stone-400">
              <span>Sown / बुवाई</span>
              <span className="text-emerald-700">{data.progress}% to harvest</span>
              <span>Harvest / कटाई</span>
            </div>
          </motion.div>

          <RiskGauge value={data.risk} />
        </section>

        {/* Map */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
        >
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-stone-500 mb-2.5">
            Your field <span className="font-hindi font-semibold normal-case tracking-normal">· आपका खेत</span>
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
                  <div className="font-bold">{firstName}'s field</div>
                  <div className="font-hindi text-sm">{data.crop.hi} का खेत</div>
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
            What to do today <span className="font-hindi font-semibold normal-case tracking-normal">· आज क्या करें</span>
          </h2>
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm divide-y divide-stone-100">
            {data.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 p-4">
                <div className="w-8 h-8 shrink-0 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm sm:text-base text-stone-700 font-medium">{tip.en}</p>
                  <p className="font-hindi text-sm text-stone-500 mt-0.5">{tip.hi}</p>
                </div>
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
            <Activity className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-stone-800 flex items-center gap-2">
              {data.market.crop.split(" / ")[0]} market price
              <span className="font-hindi font-semibold text-stone-500 text-sm">· मंडी भाव</span>
            </h3>
            <p className="text-2xl font-extrabold text-stone-800 mt-0.5">
              ₹{data.market.price.toLocaleString("en-IN")}
              <span className="text-sm font-semibold text-stone-400"> /quintal</span>
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-bold ${
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
          Advisories refresh daily · AgriShield 365
        </p>
      </main>
    </div>
  );
}
