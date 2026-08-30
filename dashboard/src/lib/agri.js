// AgriShield 365 — domain helpers.
// Deterministic, seedable pseudo-data so a given farmer's dashboard feels
// personal and stable between visits (no backend required for the demo).

export const CROPS = [
  { id: "rice", emoji: "🌾", label: "Rice / धान", hi: "धान", baseDays: 110, price: 2300 },
  { id: "wheat", emoji: "🌾", label: "Wheat / गेहूँ", hi: "गेहूँ", baseDays: 120, price: 2275 },
  { id: "cotton", emoji: "🫛", label: "Cotton / कपास", hi: "कपास", baseDays: 160, price: 7020 },
  { id: "sugarcane", emoji: "🎋", label: "Sugarcane / गन्ना", hi: "गन्ना", baseDays: 300, price: 340 },
  { id: "maize", emoji: "🌽", label: "Maize / मक्का", hi: "मक्का", baseDays: 90, price: 2090 },
  { id: "pulses", emoji: "🫘", label: "Pulses / दाल", hi: "दाल", baseDays: 100, price: 6600 },
  { id: "soybean", emoji: "🫘", label: "Soybean / सोयाबीन", hi: "सोयाबीन", baseDays: 95, price: 4892 },
  { id: "vegetables", emoji: "🥬", label: "Vegetables / सब्ज़ी", hi: "सब्ज़ी", baseDays: 60, price: 2400 },
];

export const SOIL_TYPES = ["Loamy / दोमट", "Clay / चिकनी", "Sandy / बलुई", "Black / काली", "Red / लाल"];
export const IRRIGATION_TYPES = [
  "Drip / ड्रिप",
  "Sprinkler / फुहार",
  "Flood / बाढ़ (पारंपरिक)",
  "Rainfed / वर्षा आधारित",
];

export const STAGE_TIPS = {
  seedling: {
    label: "Seedling stage",
    hi: "अंकुर अवस्था",
    tips: [
      {
        en: "Keep the top soil moist but not waterlogged — light, frequent watering works best.",
        hi: "ऊपर की मिट्टी नम रखें, गीली नहीं — हल्की और बार-बार सिंचाई अच्छी रहती है।",
      },
      {
        en: "Watch for cutworm damage at the base of young plants; remove affected seedlings early.",
        hi: "छोटे पौधों की जड़ के पास लट सुंडी (कटवर्म) पर नज़र रखें; प्रभावित पौधे तुरंत हटाएँ।",
      },
    ],
  },
  vegetative: {
    label: "Vegetative growth",
    hi: "वृद्धि अवस्था",
    tips: [
      {
        en: "Apply the first split dose of nitrogen now — timing matters more than quantity.",
        hi: "नाइट्रोजन की पहली किश्त अब डालें — मात्रा से ज़्यादा समय महत्वपूर्ण है।",
      },
      {
        en: "Weed in the next 10–15 days so your crop, not the weeds, takes the nutrients.",
        hi: "अगले 10–15 दिन में निराई-गुड़ाई करें ताकि पोषक तत्व फसल को मिलें।",
      },
    ],
  },
  flowering: {
    label: "Flowering stage",
    hi: "फूल अवस्था",
    tips: [
      {
        en: "Avoid water stress during flowering — it can reduce yield more than any other stage.",
        hi: "फूल आने के समय पानी की कमी न होने दें — यह सबसे ज़्यादा उपज घटा सकती है।",
      },
      {
        en: "High humidity now invites fungal disease; spray preventative, not after spots appear.",
        hi: "अधिक नमी से फफूंद का खतरा रहता है; धब्बे पड़ने से पहले ही रोकथाम का छिड़काव करें।",
      },
    ],
  },
  ripening: {
    label: "Ripening stage",
    hi: "पकने की अवस्था",
    tips: [
      {
        en: "Stop nitrogen top-dressing; too much nitrogen delays maturity and weakens grain.",
        hi: "नाइट्रोजन डालना बंद कर दें; अधिक नाइट्रोजन पकने में देर करती है।",
      },
      {
        en: "Drain standing water 7–10 days before harvest for easier, cleaner threshing.",
        hi: "कटाई से 7–10 दिन पहले खेत से पानी निकाल दें — मड़ाई आसान होती है।",
      },
    ],
  },
  harvest: {
    label: "Ready to harvest",
    hi: "कटाई का समय",
    tips: [
      {
        en: "Harvest in dry weather; moisture in grain above 12–14% causes storage losses.",
        hi: "सूखे मौसम में कटाई करें; अनाज में 12–14% से अधिक नमी भंडारण में नुक़सान करती है।",
      },
      {
        en: "Sell in staged lots, not all at once, to ride Mandi price swings.",
        hi: "सारी उपज एक साथ न बेचें; मंडी भाव के उतार-चढ़ाव का फ़ायदा उठाएँ।",
      },
    ],
  },
};

export const CROP_TIPS = {
  rice: {
    en: "Rice: alternate wetting-drying (do not keep 5 cm of standing water) saves ~30% water and boosts yield.",
    hi: "धान: बारी-बारी से गीला-सूखा रखने से 30% पानी बचता है और पैदावार बढ़ती है।",
  },
  wheat: {
    en: "Wheat: the first irrigation at crown-root stage (~21 days) is the most critical for grain count.",
    hi: "गेहूँ: पहली सिंचाई (21 दिन) सबसे महत्वपूर्ण होती है।",
  },
  cotton: {
    en: "Cotton: watch for whitefly and pink bollworm — install pheromone traps before flowering.",
    hi: "कपास: सफ़ेद मक्खी और गुलाबी सुंडी पर फेरोमोन ट्रैप फूल आने से पहले लगाएँ।",
  },
  sugarcane: {
    en: "Sugarcane: earth-up (earthing) at 90–100 days reduces lodging and improves juice quality.",
    hi: "गन्ना: 90–100 दिन पर मिट्टी चढ़ाने से पौधा गिरता नहीं और रस बेहतर होता है।",
  },
  maize: {
    en: "Maize: tasseling and silking need the most water — do not skip irrigation in week 8–10.",
    hi: "मक्का: नर-मादा फूल के समय (8–10वें हफ़्ते) सिंचाई न छोड़ें।",
  },
  pulses: {
    en: "Pulses: rhizobium + PSB seed treatment before sowing can lift yield by 10–15%.",
    hi: "दाल: बुवाई से पहले राइज़ोबियम + पीएसबी से बीज उपचार से पैदावार 10–15% बढ़ती है।",
  },
  soybean: {
    en: "Soybean: avoid excess water at pod-fill; yellow leaves now are often waterlogging, not disease.",
    hi: "सोयाबीन: फली भरते समय पानी न रुके; पीले पत्ते अक्सर बीमारी नहीं, जलभराव होता है।",
  },
  vegetables: {
    en: "Vegetables: mulching with straw cuts weeds, saves water and keeps produce clean.",
    hi: "सब्ज़ी: पुआल की मल्चिंग से खरपतवार कम, पानी बचत और सब्ज़ी साफ़ रहती है।",
  },
};

// Indian cropping seasons
export function getSeason(month = new Date().getMonth() + 1) {
  if (month >= 6 && month <= 10) return { id: "kharif", label: "Kharif (Monsoon)", hi: "खरीफ (मानसून)" };
  if (month >= 11 || month <= 3) return { id: "rabi", label: "Rabi (Winter)", hi: "रबी (सर्दी)" };
  return { id: "zaid", label: "Zaid (Summer)", hi: "ज़ायद (गर्मी)" };
}

export function getCrop(cropId) {
  return CROPS.find((c) => c.id === cropId) || CROPS[0];
}

// Deterministic pseudo-random generator (mulberry32)
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const ALERTS_LIB = [
  {
    id: "rain",
    title: "Heavy rainfall expected in 48h",
    hi: "48 घंटे में भारी बारिश की संभावना",
    detail: "Avoid fertilizer spraying and ensure field drains are clear before the downpour.",
    detailHi: "छिड़काव टालें और बारिश से पहले खेत की नालियाँ साफ़ करें।",
    kind: "critical",
  },
  {
    id: "heat",
    title: "Heatwave watch — 3 days",
    hi: "लू की चेतावनी — 3 दिन",
    detail: "Irrigate your standing crop in the early morning or evening; never at midday.",
    detailHi: "खड़ी फसल की सिंचाई सुबह या शाम करें, दोपहर में कभी नहीं।",
    kind: "warning",
  },
  {
    id: "humidity",
    title: "High humidity — disease window",
    hi: "अधिक आर्द्रता — रोग का खतरा",
    detail: "Ideal conditions for blight and fungal spots. Inspect leaves daily for the next week.",
    detailHi: "फफूंद रोग के अनुकूल मौसम — अगले एक हफ़्ते रोज़ पत्ते जाँचें।",
    kind: "warning",
  },
  {
    id: "dry",
    title: "Dry spell — soil moisture dropping",
    hi: "सूखा दौर — मिट्टी की नमी घट रही",
    detail: "Priority irrigation to flowering sections; mulch exposed soil to slow evaporation.",
    detailHi: "सिंचाई में फूल वाले भाग को प्राथमिकता दें; मिट्टी पर मल्च डालें।",
    kind: "info",
  },
];

export function generateInsights(profile) {
  const rng = mulberry32(hashString(profile.phone || "demo" + profile.crop + profile.lat));
  const crop = getCrop(profile.crop);
  const month = new Date().getMonth() + 1;
  const season = getSeason(month);

  // Base temperature by latitude (India: 8°N tropical → 34°N temperate)
  const latBase = 34 - Math.min(Math.max(Math.abs(profile.lat || 23), 8), 34);
  const seasonal =
    month >= 3 && month <= 5 ? 12 : month >= 6 && month <= 9 ? 4 : month >= 11 || month <= 1 ? -8 : 0;
  const temp = Math.round((latBase + seasonal) * 10) / 10 + (rng() * 3 - 1.5);

  const humidity = Math.round(55 + rng() * 40);
  const moisture = Math.round(30 + rng() * 50);
  const wind = Math.round(4 + rng() * 16);
  const cropHealth = Math.round(70 + rng() * 28);

  // Crop progress
  let sowingDate = profile.sowingDate ? new Date(profile.sowingDate) : null;
  if (!sowingDate || isNaN(sowingDate.getTime())) {
    // assume sown 40 days ago if not known
    sowingDate = new Date();
    sowingDate.setDate(sowingDate.getDate() - 40);
  }
  const daysElapsed = Math.floor((Date.now() - sowingDate.getTime()) / 86400000);
  const progress = Math.max(4, Math.min(99, Math.round((daysElapsed / crop.baseDays) * 100)));

  let stageKey = "seedling";
  if (progress >= 90) stageKey = "harvest";
  else if (progress >= 70) stageKey = "ripening";
  else if (progress >= 40) stageKey = "flowering";
  else if (progress >= 18) stageKey = "vegetative";
  const stage = STAGE_TIPS[stageKey];

  // Risk score
  let risk = 20;
  if (temp > 38) risk += 22;
  if (humidity > 85) risk += 18;
  if (moisture < 25) risk += 20;
  if (cropHealth < 80) risk += 12;
  risk += Math.round(rng() * 12);
  risk = Math.max(6, Math.min(96, risk));

  // Alerts chosen from the library deterministically
  const alerts = [];
  if (month >= 7 && month <= 9 && rng() > 0.35) alerts.push(ALERTS_LIB[0]);
  if (month >= 4 && month <= 6 && rng() > 0.45) alerts.push(ALERTS_LIB[1]);
  if (humidity > 80 && rng() > 0.4) alerts.push(ALERTS_LIB[2]);
  if (moisture < 35 && rng() > 0.45) alerts.push(ALERTS_LIB[3]);
  // Always guarantee one actionable alert so the dashboard feels alive
  if (alerts.length === 0) alerts.push(ALERTS_LIB[Math.floor(rng() * ALERTS_LIB.length)]);

  // Market (MSP base ± variation)
  const priceToday = Math.round(crop.price * (0.92 + rng() * 0.2));
  const priceTrend = Math.round((rng() - 0.45) * 100) / 10;

  const tips = [stage.tips[0], stage.tips[1], CROP_TIPS[crop.id]];

  return {
    temp,
    humidity,
    moisture,
    wind,
    cropHealth,
    progress,
    stage,
    stageKey,
    risk,
    alerts,
    market: { crop: crop.label, price: priceToday, trend: priceTrend, unit: "₹ / quintal" },
    tips,
    season,
    daysElapsed: Math.max(1, daysElapsed),
    crop,
  };
}
