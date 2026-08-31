// AgriShield 365 — single data layer.
// The whole app calls these async functions. Today they use REAL Open-Meteo
// weather when online and a deterministic mock fallback offline; when the
// team's backend ships, each function becomes a `fetch(VITE_API_URL/…)` call
// and NO components need to change.

import { getCrop, getStage, IRRIGATION_EFFICIENCY, SOIL_FACTOR } from "./agri";
import { evaluateThreats, evaluateWeather } from "./rules";

const PROFILE_KEY = "agrishield365_profile_v2";
const PHONE_KEY = "agrishield365_phone";

// ---------- deterministic pseudo-random (mock fallback) ----------
function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- profile storage ----------
export function getProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY));
  } catch {
    return null;
  }
}
export function saveProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
export function getPhone() {
  return localStorage.getItem(PHONE_KEY) || "";
}
export function savePhone(p) {
  localStorage.setItem(PHONE_KEY, p);
}

// ---------- weather: real Open-Meteo, mock fallback ----------
const OPEN_METEO = "https://api.open-meteo.com/v1/forecast";

function weatherParams(lat, lng) {
  const daily = [
    "temperature_2m_max",
    "temperature_2m_min",
    "precipitation_sum",
    "precipitation_probability_max",
    "relative_humidity_2m_mean",
    "et0_fao_evapotranspiration",
    "wind_speed_10m_max",
    "weather_code",
  ].join(",");
  const hourly = [
    "temperature_2m",
    "relative_humidity_2m",
    "precipitation",
    "precipitation_probability",
    "weather_code",
  ].join(",");
  return `latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&hourly=${hourly}&daily=${daily}&timezone=auto&forecast_days=7`;
}

function normalizeOpenMeteo(data) {
  const d = data.daily;
  const daily = d.time.map((date, i) => ({
    date,
    tempMax: Math.round(d.temperature_2m_max[i] * 10) / 10,
    tempMin: Math.round(d.temperature_2m_min[i] * 10) / 10,
    rain: Math.round(d.precipitation_sum[i] * 10) / 10,
    rainPct: d.precipitation_probability_max?.[i] ?? 0,
    humidity: Math.round(d.relative_humidity_2m_mean?.[i] ?? 70),
    et0: Math.round((d.et0_fao_evapotranspiration?.[i] ?? 4) * 10) / 10,
    wind: Math.round(d.wind_speed_10m_max?.[i] ?? 8),
    code: d.weather_code?.[i] ?? 0,
  }));

  const h = data.hourly;
  // next 72 hourly points (one per 3h to keep it light)
  const hourly = [];
  const now = Date.now();
  for (let i = 0; i < h.time.length && hourly.length < 24; i += 3) {
    if (new Date(h.time[i]).getTime() < now - 3600e3) continue;
    hourly.push({
      time: h.time[i],
      temp: h.temperature_2m[i],
      humidity: h.relative_humidity_2m[i],
      rain: h.precipitation[i],
      rainPct: h.precipitation_probability?.[i] ?? 0,
      code: h.weather_code?.[i] ?? 0,
    });
  }

  return {
    source: "open-meteo",
    current: {
      temp: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      rain: data.current.precipitation,
      wind: data.current.wind_speed_10m,
      code: data.current.weather_code,
    },
    daily,
    hourly,
  };
}

function mockWeather(lat, lng, seedKey) {
  const rng = mulberry32(hashString(seedKey + lat.toFixed(2) + lng.toFixed(2)));
  const month = new Date().getMonth() + 1;
  const seasonal =
    month >= 3 && month <= 5 ? 11 : month >= 6 && month <= 9 ? 3 : month >= 11 || month <= 1 ? -8 : 0;
  const latBase = 33 - Math.min(Math.max(Math.abs(lat), 8), 34) * 0.5;

  const daily = Array.from({ length: 7 }, (_, i) => {
    const swing = (rng() - 0.5) * 5;
    const tempMax = Math.round(latBase + seasonal + swing + (i % 3 === 1 ? 2 : 0));
    // A wet 3-day spell mid-week so the disease rule engine reliably fires in
    // the offline demo; real Open-Meteo data drives this when online.
    const wetSpell = i >= 1 && i <= 3 ? 28 + rng() * 45 : rng() * rng() * 12;
    const rain = Math.round(wetSpell * 10) / 10;
    const rainPct = rain > 25 ? 80 + Math.round(rng() * 15) : rain > 5 ? 40 + Math.round(rng() * 30) : Math.round(rng() * 25);
    // Wet-spell days are humid (RH ≥ 90) so humidity-driven disease rules
    // (rice blast / late blight) reliably demonstrate in the offline demo.
    const humidBase = Math.round(60 + rainPct * 0.3 + rng() * 12);
    const humidity = i >= 1 && i <= 3 ? Math.min(98, Math.max(humidBase, 90 + Math.round(rng() * 7))) : humidBase;
    const et0 = Math.round((Math.max(2, tempMax / 10) + (rng() - 0.3)) * 10) / 10;
    return {
      date: new Date(Date.now() + i * 86400000).toISOString().slice(0, 10),
      tempMax,
      tempMin: tempMax - Math.round(6 + rng() * 4),
      rain,
      rainPct,
      humidity: Math.min(98, humidity),
      et0,
      wind: Math.round(5 + rng() * 16),
      code: rain > 25 ? 63 : rain > 5 ? 61 : tempMax > 36 ? 1 : 0,
    };
  });

  const hourly = Array.from({ length: 24 }, (_, i) => {
    const day = daily[Math.min(6, Math.floor(i / 8))];
    return {
      time: new Date(Date.now() + i * 3 * 3600000).toISOString(),
      temp: day.tempMax - (i % 3),
      humidity: day.humidity,
      rain: day.rain / 8,
      rainPct: day.rainPct,
      code: day.code,
    };
  });

  return {
    source: "mock",
    current: {
      temp: daily[0].tempMax - 3,
      humidity: daily[0].humidity,
      rain: daily[0].rain > 5 ? 2 : 0,
      wind: daily[0].wind,
      code: daily[0].code,
    },
    daily,
    hourly,
  };
}

export async function getForecast(profile) {
  const seedKey = profile.phone || "demo";
  try {
    const url = `${OPEN_METEO}?${weatherParams(profile.lat, profile.lng)}`;
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 7000);
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) throw new Error("bad response");
    return normalizeOpenMeteo(await res.json());
  } catch {
    // Deterministic, offline-safe demo data shaped identically to the live payload.
    return mockWeather(profile.lat, profile.lng, seedKey);
  }
}

// ---------- advisories: rule engine over the forecast ----------
export function getAdvisories(profile, weather) {
  const crop = getCrop(profile.crop);
  const stage = getStage(crop, daysSinceSowing(profile));
  const threatAlerts = evaluateThreats(weather.daily, crop.id, stage.stageIndex).map((r) => ({
    id: r.threat.id,
    kind: r.severity === "critical" ? "critical" : "warning",
    daysAhead: r.daysAhead,
    threatType: r.threat.type,
    score: r.score,
    title: r.threat.name,
    detail: r.threat.action,
  }));
  const weatherAlerts = evaluateWeather(weather.daily, weather.hourly);
  return { alerts: [...threatAlerts, ...weatherAlerts], crop, stage };
}

export function daysSinceSowing(profile) {
  if (profile.sowingDate) {
    const d = Math.floor((Date.now() - new Date(profile.sowingDate).getTime()) / 86400000);
    if (!isNaN(d) && d > 0 && d < 400) return d;
  }
  return 42; // sensible default
}

// ---------- JalRakshak irrigation engine (FAO-56: crop ETc = Kc × ET0) ----------
export function getIrrigation(profile, weather) {
  const crop = getCrop(profile.crop);
  const stage = getStage(crop, daysSinceSowing(profile));
  const eff = IRRIGATION_EFFICIENCY[profile.irrigation] ?? 0.9;
  const soil = SOIL_FACTOR[profile.soil] ?? 1.0;

  // Today + 3-day outlook
  const plan = weather.daily.slice(0, 4).map((d, i) => {
    const cropNeed = stage.kc * d.et0; // mm
    const netNeed = Math.max(0, cropNeed - d.rain);
    const grossNeed = netNeed / eff; // mm to apply given method losses
    const soilAdj = grossNeed * soil;
    return {
      date: d.date,
      rainMm: d.rain,
      needMm: Math.round(soilAdj * 10) / 10,
      skip: d.rain >= cropNeed * 0.8,
      critical: stage.critical && i === 0,
    };
  });

  const today = plan[0];
  // 1 mm over 1 acre ≈ 4047 litres
  const litresPerAcre = Math.round((today.needMm || 0) * 4047);
  const area = Number(profile.area) || 1;
  const litresTotal = Math.round(litresPerAcre * area);

  return {
    crop,
    stage,
    kc: stage.kc,
    plan,
    today: {
      ...today,
      litresPerAcre,
      litresTotal,
      area,
    },
  };
}

// ---------- market (mock for now; real feed later) ----------
export function getMarket(profile) {
  const crop = getCrop(profile.crop);
  const rng = mulberry32(hashString("market" + crop.id + (profile.phone || "")));
  const todayPrice = Math.round(crop.price * (0.94 + rng() * 0.18));
  const history = Array.from({ length: 14 }, (_, i) => {
    const wobble = Math.sin(i / 2) * 60 + (rng() - 0.5) * 120;
    return {
      day: i + 1,
      price: Math.round(crop.price + wobble),
    };
  });
  const yesterday = history[history.length - 2].price;
  const trend = Math.round(((todayPrice - yesterday) / yesterday) * 1000) / 10;
  return {
    crop,
    price: todayPrice,
    trend,
    history,
    unit: { en: "/quintal", hi: "/क्विंटल", bn: "/কুইন্টাল", mr: "/क्विंटल" },
    advice:
      trend >= 0
        ? {
            en: "Prices are firm — a good window to sell staged lots.",
            hi: "भाव मज़बूत हैं — थोड़ी-थोड़ी उपज बेचने का अच्छा समय।",
            bn: "দাম ভালো — ধাপে ধাপে বিক্রির ভালো সময়।",
            mr: "भाव टिकाऊ आहेत — थोड्या-थोड्या विक्रीसाठी चांगला वेळ.",
          }
        : {
            en: "Prices are soft — if you can store safely, wait for the uptick.",
            hi: "भाव कमज़ोर हैं — सुरक्षित भंडारण हो तो तेज़ी का इंतज़ार करें।",
            bn: "দাম কম — নিরাপদে মজুত করা গেলে দাম বাড়ার অপেক্ষা করুন।",
            mr: "भाव नरम आहेत — सुरक्षित साठवण शक्य असेल तर वाढीची वाट पहा.",
          },
  };
}

// ---------- impact stats (researcher Mission 3 placeholders) ----------
export function getImpactStats() {
  return [
    {
      value: "40%",
      text: {
        en: "of Vidarbha cotton yield is lost to pests & disease every year",
        hi: "विदर्भ में हर साल ~40% कपास उपज कीट-रोग से नष्ट",
        bn: "ভিদর্ভে প্রতি বছর ~৪০% তুলা ফলন পোকা-রোগে নষ্ট হয়",
        mr: "विदर्भात दरवर्षी ~४०% कापूस उत्पादन कीड-रोगाने नष्ट",
      },
    },
    {
      value: "3-5d",
      text: {
        en: "is the lead time early weather warnings give a farmer",
        hi: "पहले से चेतावनी किसान को 3-5 दिन का समय देती है",
        bn: "আগাম সতর্কতা কৃষককে ৩-৫ দিন সময় দেয়",
        mr: "आधीच इशारा शेतकऱ्याला 3-5 दिवसांचा अवधी देतो",
      },
    },
    {
      value: "30%",
      text: {
        en: "water saving possible with stage-timed irrigation",
        hi: "सही समय सिंचाई से ~30% पानी बचत",
        bn: "সঠিক সময়ে সেচে ~৩০% জল সাশ্রয়",
        mr: "योग्य वेळी सिंचनाने ~३०% पाणी बचत",
      },
    },
  ];
}
