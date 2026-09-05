import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
} from "recharts";
import { useLang } from "../../lib/useLang";
import { weatherEmoji, weekday, hourLabel } from "../../lib/weather";

const LOCALE = { en: "en-IN", hi: "hi-IN", bn: "bn-IN", mr: "mr-IN" };

function Card({ children, className = "" }) {
  return <div className={`bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 ${className}`}>{children}</div>;
}

export default function ForecastScreen({ weather }) {
  const { t, lang } = useLang();
  const loc = LOCALE[lang] || "en-IN";
  const daily = weather.daily;

  const chartData = daily.map((d) => ({
    day: weekday(d.date, loc),
    rainPct: d.rainPct,
    rain: d.rain,
    max: d.tempMax,
    min: d.tempMin,
    humidity: d.humidity,
  }));

  const hourData = weather.hourly.map((h) => ({
    t: hourLabel(h.time, loc),
    temp: Math.round(h.temp),
    humidity: h.humidity,
    rainPct: h.rainPct,
  }));

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-extrabold text-stone-800">{t("forecast.title")}</h2>
        <p className="text-sm text-stone-500">{t("forecast.subtitle")}</p>
      </div>

      {/* 7-day cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {daily.map((d, i) => (
          <div
            key={d.date}
            className={`rounded-2xl border p-3 text-center ${
              d.rain >= 20 ? "border-blue-300 bg-blue-50" : "border-stone-200 bg-white"
            }`}
          >
            <p className="text-[11px] font-bold text-stone-400 uppercase">{i === 0 ? t("app.today") : weekday(d.date, loc)}</p>
            <p className="text-2xl my-1">{weatherEmoji(d.code)}</p>
            <p className="text-sm font-extrabold text-stone-800">{Math.round(d.tempMax)}°</p>
            <p className="text-xs text-stone-400">{Math.round(d.tempMin)}°</p>
            <p className="mt-1.5 text-[11px] font-bold text-blue-600">💧 {d.rainPct}%</p>
            <p className="text-[10px] text-stone-400">{d.rain} mm</p>
          </div>
        ))}
      </div>

      {/* Rain probability chart */}
      <Card>
        <h3 className="font-bold text-stone-800 mb-3">
          {t("forecast.rainChance")} <span className="text-stone-400 font-medium">· {t("forecast.rainfall")} (mm)</span>
        </h3>
        <div style={{ width: "100%", height: 200 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#78716c" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="pct" domain={[0, 100]} tick={{ fontSize: 11, fill: "#a8a29e" }} axisLine={false} tickLine={false} unit="%" />
              <YAxis yAxisId="mm" orientation="right" tick={{ fontSize: 11, fill: "#a8a29e" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v, n) => (n === "rainPct" ? `${v}%` : `${v} mm`)} />
              <Bar yAxisId="pct" dataKey="rainPct" fill="#38bdf8" radius={[6, 6, 0, 0]} name="rainPct" />
              <Bar yAxisId="mm" dataKey="rain" fill="#0369a1" radius={[6, 6, 0, 0]} name="rain" opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Temp + humidity 72h */}
      <Card>
        <h3 className="font-bold text-stone-800 mb-3">{t("forecast.hours72")} · {t("forecast.tempHumid")}</h3>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <AreaChart data={hourData} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="t" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="h" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
              <XAxis dataKey="t" tick={{ fontSize: 10, fill: "#a8a29e" }} axisLine={false} tickLine={false} interval={3} />
              <YAxis yAxisId="temp" tick={{ fontSize: 11, fill: "#f97316" }} axisLine={false} tickLine={false} unit="°" />
              <YAxis yAxisId="hum" orientation="right" domain={[0, 100]} tick={{ fontSize: 11, fill: "#06b6d4" }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area yAxisId="temp" type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={2} fill="url(#t)" name="°C" />
              <Area yAxisId="hum" type="monotone" dataKey="humidity" stroke="#06b6d4" strokeWidth={2} fill="url(#h)" name="%" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
