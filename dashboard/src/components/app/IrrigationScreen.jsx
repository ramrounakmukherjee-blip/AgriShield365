import { Droplets, CheckCircle2, CloudRain, AlertTriangle } from "lucide-react";
import { useLang } from "../../lib/useLang";
import { getIrrigation } from "../../lib/api";
import { shortDate } from "../../lib/weather";

const LOCALE = { en: "en-IN", hi: "hi-IN", bn: "bn-IN", mr: "mr-IN" };

export default function IrrigationScreen({ profile, weather }) {
  const { t, tr, lang } = useLang();
  const loc = LOCALE[lang] || "en-IN";
  const data = getIrrigation(profile, weather);
  const rec = data.today;

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
