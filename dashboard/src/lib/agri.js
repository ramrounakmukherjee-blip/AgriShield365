// AgriShield 365 — domain helpers.
// Deterministic, seedable pseudo-data so a given farmer's dashboard feels
// personal and stable between visits (no backend required for the demo).
// All labels carry the four supported languages.

export const CROPS = [
  { id: "rice", emoji: "🌾", hi: "धान", bn: "ধান", mr: "भात", label: "Rice", baseDays: 110, price: 2300 },
  { id: "wheat", emoji: "🌾", hi: "गेहूँ", bn: "গম", mr: "गहू", label: "Wheat", baseDays: 120, price: 2275 },
  { id: "cotton", emoji: "🫛", hi: "कपास", bn: "তুলা", mr: "कापूस", label: "Cotton", baseDays: 160, price: 7020 },
  { id: "sugarcane", emoji: "🎋", hi: "गन्ना", bn: "আখ", mr: "ऊस", label: "Sugarcane", baseDays: 300, price: 340 },
  { id: "maize", emoji: "🌽", hi: "मक्का", bn: "ভুট্টা", mr: "मका", label: "Maize", baseDays: 90, price: 2090 },
  { id: "pulses", emoji: "🫘", hi: "दाल", bn: "ডাল", mr: "डाळ", label: "Pulses", baseDays: 100, price: 6600 },
  { id: "soybean", emoji: "🫘", hi: "सोयाबीन", bn: "সয়াবিন", mr: "सोयाबीन", label: "Soybean", baseDays: 95, price: 4892 },
  { id: "vegetables", emoji: "🥬", hi: "सब्ज़ी", bn: "সবজি", mr: "भाजीपाला", label: "Vegetables", baseDays: 60, price: 2400 },
];

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

export const SEASONS = {
  kharif: {
    en: "Kharif (Monsoon)",
    hi: "खरीफ (मानसून)",
    bn: "খরিফ (বর্ষা)",
    mr: "खरीप (मान्सून)",
  },
  rabi: {
    en: "Rabi (Winter)",
    hi: "रबी (सर्दी)",
    bn: "রবি (শীত)",
    mr: "रब्बी (हिवाळा)",
  },
  zaid: {
    en: "Zaid (Summer)",
    hi: "ज़ायद (गर्मी)",
    bn: "জায়েদ (গ্রীষ্ম)",
    mr: "उन्हाळी (खरीपपूर्व)",
  },
};

export function getSeason(month = new Date().getMonth() + 1) {
  if (month >= 6 && month <= 10) return SEASONS.kharif;
  if (month >= 11 || month <= 3) return SEASONS.rabi;
  return SEASONS.zaid;
}

export function getCrop(cropId) {
  return CROPS.find((c) => c.id === cropId) || CROPS[0];
}

// Growth stage labels in 4 languages
export const STAGE_LABELS = {
  seedling: {
    en: "Seedling stage",
    hi: "अंकुर अवस्था",
    bn: "চারা অবস্থা",
    mr: "रोपावस्था",
  },
  vegetative: {
    en: "Vegetative growth",
    hi: "वृद्धि अवस्था",
    bn: "বৃদ্ধি অবস্থা",
    mr: "वाढीची अवस्था",
  },
  flowering: {
    en: "Flowering stage",
    hi: "फूल अवस्था",
    bn: "ফুল আসার সময়",
    mr: "फुलोरा अवस्था",
  },
  ripening: {
    en: "Ripening stage",
    hi: "पकने की अवस्था",
    bn: "পাকার সময়",
    mr: "पिकण्याची अवस्था",
  },
  harvest: {
    en: "Ready to harvest",
    hi: "कटाई का समय",
    bn: "ফসল কাটার সময়",
    mr: "काढणीला तयार",
  },
};

// Tips per growth stage (2 each) — each tip in 4 languages
export const STAGE_TIPS = {
  seedling: [
    {
      en: "Keep the top soil moist but not waterlogged — light, frequent watering works best.",
      hi: "ऊपर की मिट्टी नम रखें, गीली नहीं — हल्की और बार-बार सिंचाई अच्छी रहती है।",
      bn: "উপরের মাটি স্যাঁতস্যাঁতে রাখুন, জমাট বাঁধা নয় — হালকা ও ঘন ঘন সেচই ভালো।",
      mr: "वरची माती ओलसर ठेवा, पाणी साचू देऊ नका — हलके व वारंवार पाणी देणे उत्तम.",
    },
    {
      en: "Watch for cutworm damage at the base of young plants; remove affected seedlings early.",
      hi: "छोटे पौधों की जड़ के पास लट सुंडी (कटवर्म) पर नज़र रखें; प्रभावित पौधे तुरंत हटाएँ।",
      bn: "ছোট গাছের গোড়ায় কাটুই পোকার ক্ষতি লক্ষ করুন; আক্রান্ত চারা তাড়াতাড়ি সরান।",
      mr: "छोट्या रोपांच्या बुंध्याजवळ कटवर्मच्या नुकसानीकडे लक्ष ठेवा; बाधित रोपे लवकर काढा.",
    },
  ],
  vegetative: [
    {
      en: "Apply the first split dose of nitrogen now — timing matters more than quantity.",
      hi: "नाइट्रोजन की पहली किश्त अब डालें — मात्रा से ज़्यादा समय महत्वपूर्ण है।",
      bn: "নাইট্রোজেনের প্রথম কিস্তি এখনই দিন — পরিমাণের চেয়ে সময় গুরুত্বপূর্ণ।",
      mr: "नायट्रोजनचा पहिला हप्ता आताच टाका — प्रमाणापेक्षा वेळ महत्त्वाची आहे.",
    },
    {
      en: "Weed in the next 10–15 days so your crop, not the weeds, takes the nutrients.",
      hi: "अगले 10–15 दिन में निराई-गुड़ाई करें ताकि पोषक तत्व फसल को मिलें।",
      bn: "আগামী ১০–১৫ দিনের মধ্যে আগাছা পরিষ্কার করুন যাতে পুষ্টি ফসলই পায়।",
      mr: "पुढील 10–15 दिवसांत खुरपणी करा म्हणजे पोषकद्रव्ये पिकालाच मिळतील.",
    },
  ],
  flowering: [
    {
      en: "Avoid water stress during flowering — it can reduce yield more than any other stage.",
      hi: "फूल आने के समय पानी की कमी न होने दें — यह सबसे ज़्यादा उपज घटा सकती है।",
      bn: "ফুল আসার সময় জলের অভাব হতে দেবেন না — এটাই ফলন সবচেয়ে বেশি কমাতে পারে।",
      mr: "फुलोरा अवस्थेत पाण्याचा ताण येऊ देऊ नका — त्यामुळे उत्पादन सर्वाधिक घटू शकते.",
    },
    {
      en: "High humidity now invites fungal disease; spray preventative, not after spots appear.",
      hi: "अधिक नमी से फफूंद का खतरा रहता है; धब्बे पड़ने से पहले ही रोकथाम का छिड़काव करें।",
      bn: "বেশি আর্দ্রতায় ছত্রাক রোগ দেখা দেয়; দাগ পড়ার আগেই প্রতিরোধমূলক স্প্রে দিন।",
      mr: "आर्द्रता वाढल्यास बुरशीरोगाचा धोका राहतो; डाग पडण्याआधीच प्रतिबंधात्मक फवारणी करा.",
    },
  ],
  ripening: [
    {
      en: "Stop nitrogen top-dressing; too much nitrogen delays maturity and weakens grain.",
      hi: "नाइट्रोजन डालना बंद कर दें; अधिक नाइट्रोजन पकने में देर करती है।",
      bn: "নাইট्रোজেন দেওয়া বন্ধ করুন; বেশি নাইট্রোজেন পাকতে দেরি করায় ও শস্য দুর্বল করে।",
      mr: "नायट्रोजन टाकणे थांबवा; जास्त नायट्रोजन परिपक्वता उशिरा आणतो व दाणा कमकुवत करतो.",
    },
    {
      en: "Drain standing water 7–10 days before harvest for easier, cleaner threshing.",
      hi: "कटाई से 7–10 दिन पहले खेत से पानी निकाल दें — मड़ाई आसान होती है।",
      bn: "ফসল কাটার ৭–১০ দিন আগে দাঁড়িয়ে থাকা জল নিষ্কাশন করুন — মাড়াই সহজ হয়।",
      mr: "काढणीच्या 7–10 दिवस आधी साचलेले पाणी काढून टाका — मळणी सोपी होते.",
    },
  ],
  harvest: [
    {
      en: "Harvest in dry weather; moisture in grain above 12–14% causes storage losses.",
      hi: "सूखे मौसम में कटाई करें; अनाज में 12–14% से अधिक नमी भंडारण में नुक़सान करती है।",
      bn: "শুষ্ক আবহাওয়ায় ফসল কাটুন; শস্যে আর্দ্রতা ১২–১৪%-এর বেশি হলে মজুতে ক্ষতি হয়।",
      mr: "कोरड्या हवामानात काढणी करा; धान्यातील आर्द्रता 12–14% पेक्षा जास्त असल्यास साठवणीत नुकसान होते.",
    },
    {
      en: "Sell in staged lots, not all at once, to ride Mandi price swings.",
      hi: "सारी उपज एक साथ न बेचें; मंडी भाव के उतार-चढ़ाव का फ़ायदा उठाएँ।",
      bn: "সব ফসল একসঙ্গে বিক্রি করবেন না; মণ্ডির দামের ওঠানামার সুযোগ নিন।",
      mr: "सर्व माल एकाच वेळी विकू नका; बाजारभाव चढ-उताराचा फायदा घ्या.",
    },
  ],
};

// One crop-specific tip each
export const CROP_TIPS = {
  rice: {
    en: "Rice: alternate wetting-drying saves ~30% water and boosts yield — don't keep standing water.",
    hi: "धान: बारी-बारी से गीला-सूखा रखने से 30% पानी बचता है और पैदावार बढ़ती है।",
    bn: "ধান: ভেজা-শুকনো পর্যায়ক্রমে রাখলে ৩০% জল বাঁচে আর ফলন বাড়ে।",
    mr: "भात: आळीपाळीने ओले-कोरडे ठेवल्यास 30% पाणी वाचते व उत्पादन वाढते.",
  },
  wheat: {
    en: "Wheat: the first irrigation at crown-root stage (~21 days) is the most critical for grain count.",
    hi: "गेहूँ: पहली सिंचाई (21 दिन) सबसे महत्वपूर्ण होती है।",
    bn: "গম: মুকুট-শিকড় পর্যায়ে (~২১ দিন) প্রথম সেচই দানার সংখ্যার জন্য সবচেয়ে জরুরি।",
    mr: "गहू: पहिले पाणी (२१ दिवस) दाण्यांच्या संख्येसाठी सर्वात महत्त्वाचे असते.",
  },
  cotton: {
    en: "Cotton: watch for whitefly and pink bollworm — install pheromone traps before flowering.",
    hi: "कपास: सफ़ेद मक्खी और गुलाबी सुंडी पर फेरोमोन ट्रैप फूल आने से पहले लगाएँ।",
    bn: "তুলা: সাদা মাছি ও গোলাপি শুঁয়োপোকার দিকে নজর রাখুন; ফুল আসার আগে ফেরোমন ফাঁদ লাগান।",
    mr: "कापूस: पांढरी माशी व गुलाबी बोंडअळीवर लक्ष ठेवा; फुलोरा येण्याआधी फेरोमोन सापळे लावा.",
  },
  sugarcane: {
    en: "Sugarcane: earthing-up at 90–100 days reduces lodging and improves juice quality.",
    hi: "गन्ना: 90–100 दिन पर मिट्टी चढ़ाने से पौधा गिरता नहीं और रस बेहतर होता है।",
    bn: "আখ: ৯০–১০০ দিনে মাটি চড়ালে গাছ হেলে পড়ে না আর রসের মান বাড়ে।",
    mr: "ऊस: 90–100 दिवसांनी मातीची धरणी केल्यास उस पडत नाही व रस दर्जेदार होतो.",
  },
  maize: {
    en: "Maize: tasseling and silking need the most water — don't skip irrigation in weeks 8–10.",
    hi: "मक्का: नर-मादा फूल के समय (8–10वें हफ़्ते) सिंचाई न छोड़ें।",
    bn: "ভুট্টা: ফুল আসার সময় (৮–১০ সপ্তাহ) সেচ একদম বাদ দেবেন না।",
    mr: "मका: तुरा-केस येण्याच्या काळात (8–10 आठवडा) पाणी वगळू नका.",
  },
  pulses: {
    en: "Pulses: rhizobium + PSB seed treatment before sowing can lift yield by 10–15%.",
    hi: "दाल: बुवाई से पहले राइज़ोबियम + पीएसबी से बीज उपचार से पैदावार 10–15% बढ़ती है।",
    bn: "ডাল: বপনের আগে রাইজোবিয়াম + PSB বীজ শোধনে ফলন ১০–১৫% বাড়তে পারে।",
    mr: "डाळ: पेरणीपूर्वी रायझोबियम + PSB बीज प्रक्रिया केल्यास उत्पादन 10–15% वाढते.",
  },
  soybean: {
    en: "Soybean: avoid excess water at pod-fill; yellow leaves now are often waterlogging, not disease.",
    hi: "सोयाबीन: फली भरते समय पानी न रुके; पीले पत्ते अक्सर बीमारी नहीं, जलभराव होता है।",
    bn: "সয়াবিন: শুঁটি ভরার সময় জল জমতে দেবেন না; হলুদ পাতা প্রায়ই রোগ নয়, জল জমার কারণে।",
    mr: "सोयाबीन: शेंगा भरण्याच्या काळात पाणी साचू देऊ नका; पिवळी पाने बहुधा रोग नसून पाणी साचल्यामुळे असतात.",
  },
  vegetables: {
    en: "Vegetables: mulching with straw cuts weeds, saves water and keeps produce clean.",
    hi: "सब्ज़ी: पुआल की मल्चिंग से खरपतवार कम, पानी बचत और सब्ज़ी साफ़ रहती है।",
    bn: "সবজি: খড়ের মালচিং-এ আগাছা কমে, জল বাঁচে আর ফসল পরিষ্কার থাকে।",
    mr: "भाजीपाला: पेंढ्याचे आच्छादन केल्यास तण कमी, पाण्याची बचत व भाजी स्वच्छ राहते.",
  },
};

const ALERTS_LIB = [
  {
    id: "rain",
    kind: "critical",
    title: {
      en: "Heavy rainfall expected in 48h",
      hi: "48 घंटे में भारी बारिश की संभावना",
      bn: "৪৮ ঘণ্টায় ভারী বৃষ্টির সম্ভাবনা",
      mr: "48 तासांत मुसळधार पावसाचा इशारा",
    },
    detail: {
      en: "Avoid fertilizer spraying and ensure field drains are clear before the downpour.",
      hi: "छिड़काव टालें और बारिश से पहले खेत की नालियाँ साफ़ करें।",
      bn: "স্প্রে এড়ান এবং বৃষ্টির আগে মাঠের নালা পরিষ্কার রাখুন।",
      mr: "फवारणी टाळा आणि पावसाआधी शेतातील नाले साफ असल्याची खात्री करा.",
    },
  },
  {
    id: "heat",
    kind: "warning",
    title: {
      en: "Heatwave watch — 3 days",
      hi: "लू की चेतावनी — 3 दिन",
      bn: "তাপপ্রবাহের সতর্কতা — ৩ দিন",
      mr: "उष्णतेच्या लाटेचा इशारा — 3 दिवस",
    },
    detail: {
      en: "Irrigate your standing crop in the early morning or evening; never at midday.",
      hi: "खड़ी फसल की सिंचाई सुबह या शाम करें, दोपहर में कभी नहीं।",
      bn: "দাঁড়িয়ে থাকা ফসলে ভোরে বা সন্ধ্যায় সেচ দিন; দুপুরে কখনোই নয়।",
      mr: "उभ्या पिकाला सकाळी किंवा सायंकाळी पाणी द्या; दुपारी कधीही नका.",
    },
  },
  {
    id: "humidity",
    kind: "warning",
    title: {
      en: "High humidity — disease window",
      hi: "अधिक आर्द्रता — रोग का खतरा",
      bn: "বেশি আর্দ্রতা — রোগের ঝুঁকি",
      mr: "जास्त आर्द्रता — रोगाचा धोका",
    },
    detail: {
      en: "Ideal conditions for blight and fungal spots. Inspect leaves daily for the next week.",
      hi: "फफूंद रोग के अनुकूल मौसम — अगले एक हफ़्ते रोज़ पत्ते जाँचें।",
      bn: "ব্লাইট ও ছত্রাক দাগের অনুকূল আবহাওয়া — আগামী সপ্তাহ প্রতিদিন পাতা পরীক্ষা করুন।",
      mr: "करपा व बुरशीच्या डागांसाठी पोषक हवामान — पुढील आठवडा दररोज पाने तपासा.",
    },
  },
  {
    id: "dry",
    kind: "info",
    title: {
      en: "Dry spell — soil moisture dropping",
      hi: "सूखा दौर — मिट्टी की नमी घट रही",
      bn: "খরা — মাটির আর্দ্রতা কমছে",
      mr: "कोरडा काळ — मातीतील आर्द्रता घटत आहे",
    },
    detail: {
      en: "Priority irrigation to flowering sections; mulch exposed soil to slow evaporation.",
      hi: "सिंचाई में फूल वाले भाग को प्राथमिकता दें; मिट्टी पर मल्च डालें।",
      bn: "ফুল আসা অংশকে আগে সেচ দিন; বাষ্প কমাতে মাটিতে মালচ দিন।",
      mr: "सिंचनात फुलोरा भागाला प्राधान्य द्या; बाष्पीभवन रोखण्यासाठी आच्छादन करा.",
    },
  },
];

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

export function generateInsights(profile) {
  const rng = mulberry32(hashString(profile.phone || "demo" + profile.crop + profile.lat));
  const crop = getCrop(profile.crop);
  const month = new Date().getMonth() + 1;
  const season = getSeason(month);

  const latBase = 34 - Math.min(Math.max(Math.abs(profile.lat || 23), 8), 34);
  const seasonal =
    month >= 3 && month <= 5 ? 12 : month >= 6 && month <= 9 ? 4 : month >= 11 || month <= 1 ? -8 : 0;
  const temp = Math.round((latBase + seasonal) * 10) / 10 + (rng() * 3 - 1.5);

  const humidity = Math.round(55 + rng() * 40);
  const moisture = Math.round(30 + rng() * 50);
  const wind = Math.round(4 + rng() * 16);
  const cropHealth = Math.round(70 + rng() * 28);

  let sowingDate = profile.sowingDate ? new Date(profile.sowingDate) : null;
  if (!sowingDate || isNaN(sowingDate.getTime())) {
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

  let risk = 20;
  if (temp > 38) risk += 22;
  if (humidity > 85) risk += 18;
  if (moisture < 25) risk += 20;
  if (cropHealth < 80) risk += 12;
  risk += Math.round(rng() * 12);
  risk = Math.max(6, Math.min(96, risk));

  const alerts = [];
  if (month >= 7 && month <= 9 && rng() > 0.35) alerts.push(ALERTS_LIB[0]);
  if (month >= 4 && month <= 6 && rng() > 0.45) alerts.push(ALERTS_LIB[1]);
  if (humidity > 80 && rng() > 0.4) alerts.push(ALERTS_LIB[2]);
  if (moisture < 35 && rng() > 0.45) alerts.push(ALERTS_LIB[3]);
  if (alerts.length === 0) alerts.push(ALERTS_LIB[Math.floor(rng() * ALERTS_LIB.length)]);

  const priceToday = Math.round(crop.price * (0.92 + rng() * 0.2));
  const priceTrend = Math.round((rng() - 0.45) * 100) / 10;

  const tips = [STAGE_TIPS[stageKey][0], STAGE_TIPS[stageKey][1], CROP_TIPS[crop.id]];

  return {
    temp,
    humidity,
    moisture,
    wind,
    cropHealth,
    progress,
    stageKey,
    risk,
    alerts,
    market: { crop, price: priceToday, trend: priceTrend },
    tips,
    season,
    daysElapsed: Math.max(1, daysElapsed),
    crop,
  };
}
