// AgriShield 365 — agronomic domain data.
// Scope aligned to SIH 2026 (Maharashtra Govt Agriculture PS):
//   Aman Paddy (West Bengal), Potato (West Bengal), Cotton (Vidarbha).
// Growth-stage Kc values follow FAO-56 Penman-Monteith — marked as research
// placeholders pending the agronomic researcher's verified table.

export const CROPS = [
  {
    id: "paddy",
    emoji: "🌾",
    name: { en: "Aman Paddy (Rice)", hi: "अमन धान", bn: "আমন ধান", mr: "अमन भात" },
    region: { en: "West Bengal", hi: "पश्चिम बंगाल", bn: "পশ্চিমবঙ্গ", mr: "पश्चिम बंगाल" },
    baseDays: 120,
    price: 2300,
    stages: [
      { id: "p1", days: [0, 30], kc: 1.05 },
      { id: "p2", days: [30, 65], kc: 1.15 },
      { id: "p3", days: [65, 100], kc: 1.2, critical: true },
      { id: "p4", days: [100, 120], kc: 0.85 },
    ],
  },
  {
    id: "potato",
    emoji: "🥔",
    name: { en: "Potato", hi: "आलू", bn: "আলু", mr: "बटाटा" },
    region: { en: "West Bengal", hi: "पश्चिम बंगाल", bn: "পশ্চিমবঙ্গ", mr: "पश्चिम बंगाल" },
    baseDays: 110,
    price: 1850,
    stages: [
      { id: "t1", days: [0, 25], kc: 0.5 },
      { id: "t2", days: [25, 50], kc: 0.75 },
      { id: "t3", days: [50, 80], kc: 1.15, critical: true },
      { id: "t4", days: [80, 110], kc: 0.85 },
    ],
  },
  {
    id: "cotton",
    emoji: "🫛",
    name: { en: "Cotton", hi: "कपास", bn: "তুলা", mr: "कापूस" },
    region: { en: "Vidarbha, Maharashtra", hi: "विदर्भ, महाराष्ट्र", bn: "বিদর্ভ, মহারাষ্ট্র", mr: "विदर्भ, महाराष्ट्र" },
    baseDays: 180,
    price: 7020,
    stages: [
      { id: "c1", days: [0, 30], kc: 0.35 },
      { id: "c2", days: [30, 75], kc: 0.75 },
      { id: "c3", days: [75, 120], kc: 1.18, critical: true },
      { id: "c4", days: [120, 180], kc: 0.75 },
    ],
  },
];

export const STAGE_NAMES = {
  paddy: [
    { en: "Nursery / Early transplant", hi: "नर्सरी / शुरुआती रोपाई", bn: "বীজতলা / প্রথম রোপণ", mr: "नर्सरी / लवकर रोपण" },
    { en: "Tillering", hi: "कल्ले फूटना", bn: "কুশি", mr: "फुटवे येणे" },
    { en: "Heading & flowering", hi: "बालियाँ व फूल", bn: "শীষ ও ফুল", mr: "तुरा व फुलोरा" },
    { en: "Ripening", hi: "पकने की अवस्था", bn: "পাকার সময়", mr: "पिकण्याची अवस्था" },
  ],
  potato: [
    { en: "Emergence", hi: "अंकुरण", bn: "গজানো", mr: "उगवण" },
    { en: "Tuber initiation", hi: "कंद बनना", bn: "কন্দ শুরু", mr: "कंद लागणे" },
    { en: "Tuber bulking", hi: "कंद बढ़ना", bn: "কন্দ বৃদ্ধি", mr: "कंद वाढ" },
    { en: "Maturation", hi: "परिपक्वता", bn: "পরিপক্বতা", mr: "परिपक्वता" },
  ],
  cotton: [
    { en: "Emergence", hi: "अंकुरण", bn: "গজানো", mr: "उगवण" },
    { en: "Squaring", hi: "वर्ग (कली)", bn: "স্কোয়ার", mr: "बोंड लागण्याआधी" },
    { en: "Flowering & boll formation", hi: "फूल व बोंड", bn: "ফুল ও বোল", mr: "फुलोरा व बोंडे" },
    { en: "Boll opening & harvest", hi: "बोंड खुलना व तुड़ाई", bn: "বোল ফাটা ও তোলা", mr: "बोंड उघडणे व कापूस वेचणे" },
  ],
};

export const SOIL_TYPES = [
  { id: "loamy", en: "Loamy", hi: "दोमट", bn: "দোআঁশ", mr: "मुरमाड" },
  { id: "clay", en: "Clay", hi: "चिकनी", bn: "এঁটেল", mr: "चिकनी" },
  { id: "sandy", en: "Sandy", hi: "बलुई", bn: "বেলে", mr: "वालुकामय" },
  { id: "black", en: "Black", hi: "काली", bn: "কালো", mr: "काळी" },
  { id: "red", en: "Red", hi: "लाल", bn: "লাল", mr: "तांबडी" },
];

export const IRRIGATION_TYPES = [
  { id: "drip", en: "Drip", hi: "ड्रिप", bn: "ড্রিপ", mr: "ठिबक" },
  { id: "sprinkler", en: "Sprinkler", hi: "फुहार", bn: "স্প্রিংকলার", mr: "तुषार" },
  { id: "flood", en: "Flood (traditional)", hi: "बाढ़ (पारंपरिक)", bn: "প্লাবন (ঐতিহ্যবাহী)", mr: "पूर (पारंपारिक)" },
  { id: "rainfed", en: "Rainfed", hi: "वर्षा आधारित", bn: "বৃষ্টিনির্ভর", mr: "पावसावर आधारित" },
];

// Irrigation efficiency by method (affects recommended water amount)
export const IRRIGATION_EFFICIENCY = {
  drip: 0.9,
  sprinkler: 0.75,
  flood: 0.55,
  rainfed: 1,
};

// Soil water-holding modifier (loamy retains well, sandy drains fast)
export const SOIL_FACTOR = {
  loamy: 1.0,
  clay: 1.1,
  black: 1.15,
  red: 0.9,
  sandy: 0.8,
};

export const SEASONS = {
  kharif: { en: "Kharif (Monsoon)", hi: "खरीफ (मानसून)", bn: "খরিফ (বর্ষা)", mr: "खरीप (मान्सून)" },
  rabi: { en: "Rabi (Winter)", hi: "रबी (सर्दी)", bn: "রবি (শীত)", mr: "रब्बी (हिवाळा)" },
  zaid: { en: "Zaid (Summer)", hi: "ज़ायद (गर्मी)", bn: "জায়েদ (গ্রীষ্ম)", mr: "उन्हाळी" },
};

export function getSeason(month = new Date().getMonth() + 1) {
  if (month >= 6 && month <= 10) return SEASONS.kharif;
  if (month >= 11 || month <= 3) return SEASONS.rabi;
  return SEASONS.zaid;
}

export function getCrop(cropId) {
  return CROPS.find((c) => c.id === cropId) || CROPS[0];
}

// Returns the crop's growth stage from days since sowing: { stageIndex, name, kc, critical, progressPct }
export function getStage(crop, daysElapsed) {
  const days = Math.max(0, daysElapsed || 0);
  let idx = 0;
  crop.stages.forEach((s, i) => {
    if (days >= s.days[0]) idx = i;
  });
  const stage = crop.stages[idx];
  const progress = Math.max(3, Math.min(99, Math.round((days / crop.baseDays) * 100)));
  return {
    stageIndex: idx,
    name: STAGE_NAMES[crop.id][idx],
    kc: stage.kc,
    critical: !!stage.critical,
    progress,
    days,
  };
}
