// AgriShield 365 — single data layer.
// The whole app calls these async functions. Today they use REAL Open-Meteo
// weather when online and a deterministic mock fallback offline; when the
// team's backend ships, each function becomes a `fetch(VITE_API_URL/…)` call
// and NO components need to change.

import { getCrop, getStage, IRRIGATION_EFFICIENCY, SOIL_FACTOR } from "./agri";
import { evaluateThreats, evaluateWeather } from "./rules";

const PROFILE_KEY = "agrishield365_profile_v2";
const PHONE_KEY = "agrishield365_phone";

// FastAPI cloud brain on Render (free tier sleeps; never block the UI on it).
// Override per environment with VITE_API_URL if needed.
export const API_BASE =
  (import.meta.env.VITE_API_URL || "https://agrishield365-api.onrender.com").replace(/\/$/, "");

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
    why: r.threat.why || null,
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
      source: "ICAR – Central Institute for Cotton Research (CICR), Nagpur",
      text: {
        en: "of Vidarbha cotton yield is lost to pests & disease every year",
        hi: "विदर्भ में हर साल ~40% कपास उपज कीट-रोग से नष्ट",
        bn: "ভিদর্ভে প্রতি বছর ~৪০% তুলা ফলন পোকা-রোগে নষ্ট হয়",
        mr: "विदर्भात दरवर्षी ~४०% कापूस उत्पादन कीड-रोगाने नष्ट",
      },
    },
    {
      value: "3-5d",
      source: "IMD Agromet & TNAU Agritech Portal",
      text: {
        en: "is the lead time early weather warnings give a farmer",
        hi: "पहले से चेतावनी किसान को 3-5 दिन का समय देती है",
        bn: "আগাম সতর্কতা কৃষককে ৩-৫ দিন সময় দেয়",
        mr: "आधीच इशारा शेतकऱ्याला 3-5 दिवसांचा अवधी देतो",
      },
    },
    {
      value: "30%",
      source: "FAO Irrigation & Drainage Paper 56 (FAO-56)",
      text: {
        en: "water saving possible with stage-timed irrigation",
        hi: "सही समय सिंचाई से ~30% पानी बचत",
        bn: "সঠিক সময়ে সেচে ~৩০% জল সাশ্রয়",
        mr: "योग्य वेळी सिंचनाने ~३०% पाणी बचत",
      },
    },
  ];
}

// ---------- AI leaf scan (Gemini via FastAPI on Render) ----------
/**
 * Send a leaf photo (data URL or File) to the backend Gemini scan.
 * Never blocks the product: on any failure returns { ok:false, reason } and
 * the caller can fall back to the offline symptom checker.
 */
export async function scanLeaf(imageDataUrl, crop) {
  try {
    // Long timeout: the free Render server may be cold-booting (~30-60s) plus
    // the Gemini call (~5-20s).
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 120000);
    const resp = await fetch(`${API_BASE}/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ crop: crop?.id || null, image: imageDataUrl }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!resp.ok) {
      let detail = `HTTP ${resp.status}`;
      try {
        detail = (await resp.json())?.detail || detail;
      } catch {}
      console.warn("[scan] backend returned:", resp.status, detail);
      return { ok: false, reason: "http", detail, status: resp.status };
    }
    const data = await resp.json();
    return { ok: true, scan: data.scan };
  } catch (e) {
    console.warn("[scan] request failed:", e?.message || e);
    return { ok: false, reason: "network", detail: e?.message || "network error" };
  }
}

/** Wake the free Render backend before the user submits a photo (cold starts
 *  take ~30-60s). Best-effort fire-and-forget. */
export function wakeScanBackend() {
  try {
    fetch(`${API_BASE}/health`, { mode: "cors" }).catch(() => {});
  } catch {}
}

/** Read a selected image File into a downscaled JPEG data URL (keeps payload
 *  small for the free Render/Gemini call). */
export function fileToScaledDataUrl(file, maxDim = 1024, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("image"));
      img.onload = () => {
        let { width, height } = img;
        if (Math.max(width, height) > maxDim) {
          const scale = maxDim / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// ---------- GPS field location (reverse geocode; free, no API key) ----------
export async function reverseGeocode(lat, lng) {
  try {
    if (lat == null || lng == null || (lat === 0 && lng === 0)) return null;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
      { signal: ctrl.signal }
    );
    clearTimeout(timer);
    if (!res.ok) return null;
    const d = await res.json();
    const place = [...new Set([d.locality || d.city, d.principalSubdivision].filter(Boolean))].join(", ");
    return { place: place || null, country: d.countryName || null, lat, lng };
  } catch {
    return null;
  }
}

// ---------- shareable advisory summary ----------
const enText = (v) => (v && typeof v === "object" ? v.en : v) || "";

export function buildAdvisorySummary(profile, weather, advisories) {
  const { alerts, crop } = advisories;
  const date = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const cur = weather.current;
  const L = [];
  L.push("🌱 AgriShield 365 — field advisory");
  L.push(`${crop.emoji} ${enText(crop.name)} · ${profile.village ? profile.village + " · " : ""}${date}`);
  L.push(`🌦️ Now: ${Math.round(cur.temp)}°C, ${Math.round(cur.humidity)}% humidity`);
  if (!alerts.length) {
    L.push("✅ No active alerts — conditions look favourable for your crop.");
  } else {
    L.push(`⚠️ ${alerts.length} active alert${alerts.length > 1 ? "s" : ""}:`);
    alerts.slice(0, 4).forEach((a, i) => {
      L.push(`${i + 1}. ${enText(a.title)}`);
      const detail = enText(a.detail);
      if (detail) L.push(`   → ${detail}`);
    });
  }
  L.push("\nSent from AgriShield 365 — crop protection, 365 days a year.");
  return L.join("\n");
}

export async function shareAdvisory(text) {
  try {
    if (navigator.share) {
      await navigator.share({ title: "AgriShield 365 advisory", text });
      return "shared";
    }
    await navigator.clipboard.writeText(text);
    return "copied";
  } catch {
    try {
      await navigator.clipboard.writeText(text);
      return "copied";
    } catch {
      return "failed";
    }
  }
}

// ---------- advisory history (local first, best-effort cloud) ----------
const HISTORY_KEY = "agrishield365_history_v1";

export function getAdvisoryHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

export function recordAdvisoryHistory(profile, weather, advisories) {
  try {
    const { alerts, crop } = advisories;
    const top = alerts[0];
    const day = new Date().toISOString().slice(0, 10);
    const entry = {
      date: new Date().toISOString(),
      day,
      crop: crop.id,
      cropName: enText(crop.name),
      emoji: crop.emoji,
      temp: Math.round(weather.current.temp),
      humidity: Math.round(weather.current.humidity),
      alertCount: alerts.length,
      topAlert: top ? enText(top.title) : null,
      topKind: top?.kind || "ok",
      score: top?.score ?? 0,
    };
    const hist = getAdvisoryHistory();
    // Avoid duplicate rows for the same day + crop + alert.
    if (hist[0] && hist[0].day === day && hist[0].crop === entry.crop && hist[0].topAlert === entry.topAlert) {
      return;
    }
    hist.unshift(entry);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(hist.slice(0, 60)));
    // Best-effort cloud copy (never blocks; works when signed in).
    import("./firebase")
      .then((m) => m.cloudSaveAdvisory && m.cloudSaveAdvisory(profile, entry))
      .catch(() => {});
  } catch {
    /* history is non-critical */
  }
}

// ---------- background cloud brain (FastAPI on Render), never blocks UI ----------
/**
 * Fire-and-forget: after the local advisory is shown, ping the FastAPI cloud
 * brain so the Python rule engine also runs the advisory and server-side
 * history can be persisted. Wrapped so a sleeping/offline backend is silent.
 * Returns a small result for logging/diagnostics only.
 */
export async function cloudSyncAdvisory(profile, weather) {
  try {
    const { getAuthToken } = await import("./firebase");
    const idToken = (await getAuthToken?.()) || null;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 75000); // tolerate Render cold start
    const res = await fetch(`${API_BASE}/get-advisory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lat: profile.lat,
        lng: profile.lng,
        crop: profile.crop,
        idToken,
        daysElapsed: daysSinceSowing(profile),
        irrigation: profile.irrigation || "flood",
        soil: profile.soil || "loamy",
        area: Number(profile.area) || 1,
        // Send the live weather we already used, so the cloud brain doesn't
        // have to re-fetch (avoids cold-start/network flakiness).
        weather: weather?.daily?.length ? weather : undefined,
      }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) {
      console.warn("[cloud] advisory sync returned", res.status);
      return { ok: false, status: res.status };
    }
    const data = await res.json();
    console.info("[cloud] advisory processed by server (persisted:", data.persisted, ")");
    return { ok: true, persisted: !!data.persisted };
  } catch (e) {
    // Backend asleep / offline — the local advisory already works.
    console.info("[cloud] advisory sync skipped (offline/asleep)");
    return { ok: false, reason: "unavailable" };
  }
}
