import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, CalendarDays, Droplets, TrendingUp, User, LogOut } from "lucide-react";
import { useLang } from "../../lib/useLang";
import LanguageSwitcher from "../LanguageSwitcher";
import { getForecast, getAdvisories, recordAdvisoryHistory, cloudSyncAdvisory } from "../../lib/api";
import { getSeason } from "../../lib/agri";
import Loading from "./Loading";
import HomeScreen from "./HomeScreen";
import ForecastScreen from "./ForecastScreen";
import IrrigationScreen from "./IrrigationScreen";
import MarketScreen from "./MarketScreen";
import ProfileScreen from "./ProfileScreen";

export default function AppShell({ profile, onSignOut, onProfileChange, onResetSetup }) {
  const { t, lang, tr } = useLang();
  const [tab, setTab] = useState("home");
  const [weather, setWeather] = useState(null);
  const [advisories, setAdvisories] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let alive = true;
    setWeather(null);
    setAdvisories(null);
    getForecast(profile).then((w) => {
      if (!alive) return;
      setWeather(w);
      const adv = getAdvisories(profile, w);
      setAdvisories(adv);
      recordAdvisoryHistory(profile, w, adv); // local + best-effort cloud log
      // Background cloud brain: non-blocking, server runs the Python engine.
      cloudSyncAdvisory(profile, w);
    });
    return () => {
      alive = false;
    };
  }, [profile, reloadKey]);

  const tabs = [
    { id: "home", icon: Home },
    { id: "forecast", icon: CalendarDays },
    { id: "irrigation", icon: Droplets },
    { id: "market", icon: TrendingUp },
    { id: "profile", icon: User },
  ];

  const firstName = (profile.name || "Farmer").split(" ")[0];
  const season = getSeason();

  return (
    <div className="min-h-screen bg-stone-50 pb-6">
      {/* Sticky header + top tab navigation (all screen sizes) */}
      <header className="bg-gradient-to-r from-emerald-700 to-green-600 text-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4">
          <div className="flex items-center gap-3">
            <img src="/assets/logo-agrishield365.jpg" alt="AgriShield 365" className="w-11 h-11 rounded-xl object-cover ring-2 ring-white/30" />
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-extrabold leading-tight truncate">
                {t("app.greet")}, {firstName} 🙏
              </h1>
              <p className="text-emerald-100 text-xs sm:text-sm flex items-center gap-1.5 flex-wrap">
                {advisories && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 font-semibold">
                    {advisories.crop.emoji} {tr(advisories.crop.name)}
                  </span>
                )}
                <span className="hidden sm:inline">{tr(season)}</span>
                {weather && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold ${
                      weather.source === "open-meteo" ? "bg-white/20" : "bg-amber-400/25"
                    }`}
                    title={weather.source === "open-meteo" ? "Open-Meteo" : t("app.demo")}
                  >
                    {weather.source === "open-meteo" ? `● ${t("app.live")}` : `◎ ${t("app.demo")}`}
                  </span>
                )}
              </p>
            </div>
            <LanguageSwitcher />
            <button
              onClick={onSignOut}
              aria-label={t("app.signOut")}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 transition px-3 py-2 text-xs sm:text-sm font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{t("app.signOut")}</span>
            </button>
          </div>
        </div>

        {/* Top tab bar — full accessibility on desktop & mobile */}
        <nav className="max-w-5xl mx-auto px-3 sm:px-6 pb-3 pt-3">
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {tabs.map(({ id, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex-1 min-w-[72px] inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-bold transition ${
                  tab === id ? "bg-white text-emerald-700 shadow-sm" : "text-emerald-50 hover:bg-white/15"
                }`}
              >
                <Icon className="w-4 h-4" />
                {t(`tabs.${id}`)}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {!weather || !advisories ? (
              <Loading />
            ) : tab === "home" ? (
              <HomeScreen profile={profile} weather={weather} advisories={advisories} />
            ) : tab === "forecast" ? (
              <ForecastScreen weather={weather} />
            ) : tab === "irrigation" ? (
              <IrrigationScreen profile={profile} weather={weather} />
            ) : tab === "market" ? (
              <MarketScreen profile={profile} />
            ) : (
              <ProfileScreen
                profile={profile}
                onSignOut={onSignOut}
                onSave={onProfileChange}
                onResetSetup={onResetSetup}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
