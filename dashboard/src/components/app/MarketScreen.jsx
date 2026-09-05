import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { TrendingUp, TrendingDown, Lightbulb } from "lucide-react";
import { useLang } from "../../lib/useLang";
import { getMarket } from "../../lib/api";

export default function MarketScreen({ profile }) {
  const { t, tr } = useLang();
  const m = getMarket(profile);
  const data = m.history.map((h) => ({ day: h.day, price: h.price }));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-extrabold text-stone-800">{t("market.title")}</h2>
          <p className="text-sm text-stone-500">{t("market.subtitle")}</p>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 ring-1 ring-emerald-200 text-emerald-700 text-[11px] font-bold px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {t("market.updated")} · {tr(m.source)}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 grid place-items-center text-3xl shrink-0">
          {m.crop.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-stone-800">{tr(m.crop.name)}</h3>
          <p className="text-3xl font-extrabold text-stone-800">
            ₹{m.price.toLocaleString("en-IN")}
            <span className="text-sm font-semibold text-stone-400"> {t("market.perQuintal")}</span>
          </p>
          <p className="text-xs text-stone-500 mt-1 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1">
              {t("market.costToGrow")}: <span className="font-bold text-stone-600">₹{m.costPrice?.toLocaleString("en-IN")}</span>
            </span>
            <span className="text-stone-300">|</span>
            <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
              {t("market.margin")}: ₹{m.margin?.toLocaleString("en-IN")}
            </span>
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-bold shrink-0 ${
            m.trend >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {m.trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {m.trend >= 0 ? "+" : ""}
          {m.trend}%
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-5">
        <h3 className="font-bold text-stone-800 mb-3">{t("market.trend14")}</h3>
        <div style={{ width: "100%", height: 210 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 6, right: 10, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#a8a29e" }} axisLine={false} tickLine={false} />
              <YAxis domain={["dataMin - 100", "dataMax + 100"]} tick={{ fontSize: 11, fill: "#a8a29e" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => `₹${v}`} />
              <Line type="monotone" dataKey="price" stroke="#059669" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3 text-amber-900">
        <Lightbulb className="w-5 h-5 mt-0.5 shrink-0" />
        <p className="text-sm font-medium">{tr(m.advice)}</p>
      </div>
    </div>
  );
}
