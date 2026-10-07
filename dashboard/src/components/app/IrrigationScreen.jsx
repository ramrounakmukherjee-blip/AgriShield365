import { Droplets, CheckCircle2, CloudRain, AlertTriangle, Leaf } from "lucide-react";
import { useLang } from "../../lib/useLang";
import { getIrrigation } from "../../lib/api";
import { IRRIGATION_EFFICIENCY, SOIL_FACTOR, IRRIGATION_TYPES } from "../../lib/agri";
import { shortDate } from "../../lib/weather";

const LOCALE = { en: "en-IN", hi: "hi-IN", bn: "bn-IN", mr: "mr-IN" };

// 1 mm of water over 1 acre ≈ 4047 litres
const LITRES_PER_MM_ACRE = 4047;

export default function IrrigationScreen({ profile, weather }) {
  const { t, tr, lang } = useLang();
  const loc = LOCALE[lang] || "en-IN";
  const data = getIrrigation(profile, weather);
  const rec = data.today;

  // Water saved by following this plan instead of watering by habit:
  //  • rain-covered days: nothing is applied at all
  //  • irrigated days: an efficient method needs less water than flood
  const eff = IRRIGATION_EFFICIENCY[profile.irrigation] ?? 0.9;
  const soil = SOIL_FACTOR[profile.soil] ?? 1.0;
  const area = Number(profile.area) || 1;
  const savings = data.plan.reduce(
    (acc, d, i) => {
      const cropNeed = data.kc * (weather.daily[i]?.et0 ?? 0); // mm the crop needs
      const mine = (cropNeed / eff) * soil;
      if (d.skip) {
        acc.rain += mine;
      } else if (profile.irrigation !== "rainfed" && eff > 0.55) {
        // Rainfed fields are not irrigated at all, so there is nothing to compare.
        acc.method += (cropNeed / 0.55) * soil - mine;
      }
      return acc;
    },
    { rain: 0, method: 0 }
  );
  const savedRainL = Math.round(savings.rain * LITRES_PER_MM_ACRE * area);
  const savedMethodL = Math.round(Math.max(0, savings.method) * LITRES_PER_MM_ACRE * area);
  const savedTotalL = savedRainL + savedMethodL;
  const method = IRRIGATION_TYPES.find((m) => m.id === profile.irrigation);
  const fmt = (n) => n.toLocaleString("en-IN");

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-extrabold text-stone-800 flex items-center gap-2">
          💧 {t("irrigation.title")}
        </h2>
        <p className="text-sm text-stone-500">{t("irrigation.subtitle")}</p>
      </div>

      {/* Today's recommendation */}
      <div
        className={`rounded-2xl border p-5 ${
          rec.skip ? "bg-sky-50 border-sky-300" : "bg-emerald-50 border-emerald-300"
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-14 h-14 shrink-0 rounded-2xl grid place-items-center text-white ${
              rec.skip ? "bg-sky-500" : "bg-emerald-600"
            }`}
          >
            {rec.skip ? <CloudRain className="w-7 h-7" /> : <Droplets className="w-7 h-7" />}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-extrabold text-stone-800">
              {rec.skip ? t("irrigation.noNeed") : t("irrigation.irrigate")}
            </h3>
            {rec.skip ? (
              <p className="text-sm text-stone-700 mt-1">{t("irrigation.rainCovers")}</p>
            ) : (
              <>
                <p className="text-sm text-stone-700 mt-1 font-semibold">
                  {t("irrigation.perAcre")
                    .replace("{mm}", rec.needMm)
                    .replace("{l}", rec.litresPerAcre.toLocaleString("en-IN"))}
                </p>
                <p className="text-sm text-stone-600">
                  {t("irrigation.litres")
                    .replace("{l}", rec.litresTotal.toLocaleString("en-IN"))
                    .replace("{area}", rec.area)}
                </p>
                <p className="text-xs text-stone-500 mt-1.5">🕑 {t("irrigation.bestTime")}</p>
              </>
            )}
          </div>
        </div>

        {data.stage.critical && (
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-100 border border-amber-300 p-3 text-amber-900 text-sm">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <p className="font-medium">{t("irrigation.criticalNote")}</p>
          </div>
        )}
      </div>

      {/* Water saved by following the plan (vs watering by habit) */}
      {savedTotalL > 0 && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 sm:p-5">
          <div className="flex items-center gap-2 text-emerald-900">
            <Leaf className="w-4 h-4 shrink-0" />
            <p className="text-xs font-extrabold uppercase tracking-wider">
              {t("irrigation.savedTitle")}
            </p>
          </div>
          <p className="mt-2 text-3xl font-extrabold text-emerald-800">
            ≈ {fmt(savedTotalL)}
            <span className="text-sm font-bold ml-1.5">L</span>
          </p>
          <p className="text-xs text-emerald-900/90 font-semibold mt-1">
            {t("irrigation.savedWeek").replace("{area}", area)}
          </p>
          <ul className="mt-3 flex flex-col gap-1.5 text-xs font-semibold text-emerald-900">
            {savedRainL > 0 && (
              <li className="flex items-start gap-2">
                <CloudRain className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                {t("irrigation.savedRain").replace("{l}", fmt(savedRainL))}
              </li>
            )}
            {savedMethodL > 0 && method && (
              <li className="flex items-start gap-2">
                <Droplets className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                {t("irrigation.savedMethod")
                  .replace("{l}", fmt(savedMethodL))
                  .replace("{method}", tr(method))}
              </li>
            )}
          </ul>
          <p className="mt-3 text-[11px] text-emerald-900/80 leading-snug border-t border-emerald-200 pt-2">
            {t("irrigation.savedNote").replace("{kc}", data.kc)}
          </p>
        </div>
      )}

      {/* 4-day plan */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5">
        <h3 className="font-bold text-stone-800 mb-3">{t("irrigation.waterPlan")}</h3>
        <div className="flex flex-col gap-2">
          {data.plan.map((d, i) => (
            <div
              key={d.date}
              className="flex items-center gap-3 rounded-xl border border-stone-100 px-3 py-2.5"
            >
              <div className="w-16 shrink-0">
                <p className="text-xs font-bold text-stone-400 uppercase">
                  {i === 0 ? t("app.today") : shortDate(d.date, loc)}
                </p>
              </div>
              <div className="flex-1 flex items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1 text-sky-700 font-semibold">
                  <CloudRain className="w-4 h-4" /> {d.rainMm} mm
                </span>
                {d.skip ? (
                  <span className="inline-flex items-center gap-1 text-sky-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> {t("irrigation.skipped")}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                    <Droplets className="w-4 h-4" /> {d.needMm} mm
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-stone-400 mt-3">
          Kc = {data.kc} · FAO-56 · {tr(data.crop.name)} · {tr(data.stage.name)}
        </p>
      </div>
    </div>
  );
}
