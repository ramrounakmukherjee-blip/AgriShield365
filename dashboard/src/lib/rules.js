// AgriShield 365 — rule engine.
// Early-warning logic: matches forecast weather against disease/pest trigger
// thresholds and generates disaster alerts.
// NOTE: threshold values are sensible agronomic placeholders pending the
// researcher's verified Disease & Pest Matrix (Mission 1).

// Each threat: weather window that raises risk + vulnerable crop stages.
export const THREATS = [
  // ---- Paddy ----
  {
    id: "rice_blast",
    crop: "paddy",
    type: "disease",
    name: {
      en: "Rice Blast",
      hi: "धान का ब्लास्ट",
      bn: "ধানের ব্লাস্ট",
      mr: "भात करपा",
    },
    minTemp: 22, maxTemp: 28, minHumidity: 90,
    rainNeeded: 0, windowDays: 3,
    vulnerableStages: [1, 2],
    action: {
      en: "Avoid excess nitrogen; ensure field drainage and prepare a preventative fungicide spray if humidity stays high.",
      hi: "अतिरिक्त नाइट्रोजन से बचें; खेत की निकासी ठीक रखें और आर्द्रता बनी रहे तो रोकथाम का फफूंदनाशक छिड़काव तैयार रखें।",
      bn: "অতিরিক্ত নাইট্রোজেন এড়ান; জমি থেকে পানি নিষ্কাশন নিশ্চিত করুন এবং আর্দ্রতা বেশি থাকলে প্রতিরোধমূলক ছত্রাকনাশক প্রস্তুত রাখুন।",
      mr: "जादा नायट्रोजन टाळा; शेताचा निचरा ठेवा आणि आर्द्रता टिकून राहिल्यास प्रतिबंधात्मक बुरशीनाशक फवारणी तयार ठेवा.",
    },
  },
  {
    id: "sheath_blight",
    crop: "paddy",
    type: "disease",
    name: {
      en: "Sheath Blight",
      hi: "शीथ ब्लाइट",
      bn: "শীথ ব্লাইট",
      mr: "शीथ ब्लाइट",
    },
    minTemp: 28, maxTemp: 33, minHumidity: 85,
    rainNeeded: 0, windowDays: 3,
    vulnerableStages: [1, 2],
    action: {
      en: "Reduce dense plant spacing, avoid over-watering, and monitor the lower leaf sheaths for grey lesions.",
      hi: "पौधों की घनी बुवाई कम करें, अधिक पानी से बचें और निचली पत्तियों पर धूसर धब्बे देखें।",
      bn: "ঘন রোপণ কমান, অতিরিক্ত পানি এড়ান এবং নিচের পাতার খাপে ধূসর দাগ লক্ষ্য করুন।",
      mr: "दाट लागवड टाळा, जास्त पाणी टाळा आणि खालच्या पानांवर राखट डाग पहा.",
    },
  },
  // ---- Potato ----
  {
    id: "late_blight",
    crop: "potato",
    type: "disease",
    name: {
      en: "Late Blight",
      hi: "लेट ब्लाइट",
      bn: "লেট ব্লাইট",
      mr: "लेट ब्लाइट",
    },
    minTemp: 10, maxTemp: 24, minHumidity: 90,
    rainNeeded: 2, windowDays: 2,
    vulnerableStages: [1, 2, 3],
    action: {
      en: "High-risk window: spray preventative fungicide BEFORE the wet spell hits; stop irrigation while foliage stays wet.",
      hi: "उच्च जोखिम: बारिश से पहले ही रोकथाम का फफूंदनाशक छिड़काव करें; पत्ते गीले रहने तक सिंचाई रोकें।",
      bn: "উচ্চ ঝুঁকি: ভেজা আবহাওয়ার আগেই প্রতিরোধমূলক ছত্রাকনাশক স্প্রে করুন; পাতা ভেজা থাকলে সেচ বন্ধ রাখুন।",
      mr: "उच्च धोका: ओल्या हवामानाआधीच प्रतिबंधात्मक बुरशीनाशक फवारा; पाने ओली असेपर्यंत सिंचन थांबवा.",
    },
  },
  {
    id: "early_blight",
    crop: "potato",
    type: "disease",
    name: {
      en: "Early Blight",
      hi: "अर्ली ब्लाइट",
      bn: "আর্লি ব্লাইট",
      mr: "अर्ली ब्लाइट",
    },
    minTemp: 24, maxTemp: 30, minHumidity: 75,
    rainNeeded: 0, windowDays: 4,
    vulnerableStages: [1, 2, 3],
    action: {
      en: "Rotate fungicide sprays, remove affected lower leaves, and keep plants well-fed with potassium.",
      hi: "फफूंदनाशक बदल-बदलकर छिड़कें, प्रभावित निचली पत्तियाँ हटाएँ, पोटेशियम पोषण बनाए रखें।",
      bn: "ছত্রাকনাশক পালাক্রমে স্প্রে করুন, আক্রান্ত নিচের পাতা সরান এবং পটাশিয়াম প্রয়োগ ঠিক রাখুন।",
      mr: "बुरशीनाशक पाळीने फवारा, बाधित खालची पाने काढा आणि पोटॅश पुरेसा द्या.",
    },
  },
  // ---- Cotton ----
  {
    id: "bacterial_blight",
    crop: "cotton",
    type: "disease",
    name: {
      en: "Bacterial Blight / Angular Leaf Spot",
      hi: "जीवाणु ब्लाइट",
      bn: "ব্যাকটেরিয়াল ব্লাইট",
      mr: "जिवाणू ब्लाइट",
    },
    minTemp: 25, maxTemp: 35, minHumidity: 70,
    rainNeeded: 5, windowDays: 2,
    vulnerableStages: [1, 2],
    action: {
      en: "Spreads by rain-splash: avoid field work in wet plants, ensure drainage, and use copper-based spray after the rain.",
      hi: "बारिश के छींटों से फैलता है — गीले पौधों में काम न करें, निकासी ठीक रखें, बारिश के बाद कॉपर छिड़काव करें।",
      bn: "বৃষ্টির ছিটায় ছড়ায় — ভেজা গাছে কাজ এড়ান, নিষ্কাশন ঠিক রাখুন এবং বৃষ্টির পর কপার স্প্রে করুন।",
      mr: "पावसाच्या उड्ड्यांनी पसरते — ओल्या झाडांत काम टाळा, निचरा ठेवा, पावसानंतर तांबे फवारणी करा.",
    },
  },
  {
    id: "fusarium_wilt",
    crop: "cotton",
    type: "disease",
    name: {
      en: "Fusarium Wilt",
      hi: "फ्यूज़ेरियम म्लानि",
      bn: "ফিউজারিয়াম উইল্ট",
      mr: "फ्युजेरियम वेल्ट",
    },
    minTemp: 30, maxTemp: 38, minHumidity: 0,
    rainNeeded: 0, waterlogging: true, windowDays: 5,
    vulnerableStages: [1, 2],
    action: {
      en: "Soil-borne and triggered by waterlogging + heat: prevent standing water completely and scout for wilting plants.",
      hi: "मिट्टी जनित — जलभराव + गर्मी से बढ़ता है; खेत में पानी बिल्कुल न रुकने दें और मुरझाते पौधों पर नज़र रखें।",
      bn: "মাটিবাহিত — জলাবদ্ধতা ও তাপে বাড়ে; জমিতে পানি জমতে দেবেন না এবং শুকিয়ে যাওয়া গাছ খুঁজে দেখুন।",
      mr: "मातीतून होते — पाणी साचणे + उष्णता वाढवते; शेतात पाणी अजिबात साचू देऊ नका, कोमजलेली झाडे तपासा.",
    },
  },
  {
    id: "bollworm",
    crop: "cotton",
    type: "pest",
    name: {
      en: "Cotton Bollworm",
      hi: "गुलाबी सुंडी (बॉलवर्म)",
      bn: "বোলওয়ার্ম (শুঁয়োপোকা)",
      mr: "बोंडअळी",
    },
    minTemp: 25, maxTemp: 33, minHumidity: 60,
    rainNeeded: 0, windowDays: 5,
    vulnerableStages: [2],
    action: {
      en: "Most damaging during flowering/boll stage: install pheromone traps now, scout bolls for holes, and use IPM sprays at threshold.",
      hi: "फूल/बोंड अवस्था में सबसे नुकसानदायक — अभी फेरोमोन ट्रैप लगाएँ, बोंडों में छेद जाँचें, आर्थिक सीमा पर IPM छिड़काव करें।",
      bn: "ফুল/বোল পর্যায়ে সবচেয়ে ক্ষতিকর — এখনই ফেরোমন ফাঁদ লাগান, বোলে ফুটো দেখুন এবং থ্রেশহোল্ডে IPM স্প্রে করুন।",
      mr: "फुलोरा/बोंड अवस्थेत सर्वाधिक नुकसान — आताच फेरोमोन सापळे लावा, बोंडांना छिद्रे तपासा, थ्रेशोल्डवर IPM फवारणी करा.",
    },
  },
  {
    id: "whitefly",
    crop: "cotton",
    type: "pest",
    name: {
      en: "Whitefly",
      hi: "सफ़ेद मक्खी",
      bn: "সাদা মাছি",
      mr: "पांढरी माशी",
    },
    minTemp: 30, maxTemp: 42, minHumidity: 0, maxHumidity: 65,
    rainNeeded: 0, dry: true, windowDays: 5,
    vulnerableStages: [1, 2],
    action: {
      en: "Thrives in dry heat and spreads leaf-curl virus: avoid broad insecticides that kill its predators, use yellow sticky traps.",
      hi: "शुष्क गर्मी में पनपती है और लीफ-कर्ल वायरस फैलाती है — इनके शत्रु कीड़े मारने वाली अंधाधुंध दवाई से बचें, पीले चिपचिपे ट्रैप लगाएँ।",
      bn: "শুষ্ক গরমে বাড়ে এবং লিফ-কার্ল ভাইরাস ছড়ায় — ক্ষতিকারক পোকা মারা কীটনাশক এড়ান, হলুদ স্টিকি ফাঁদ ব্যবহার করুন।",
      mr: "कोरड्या उष्णतेत वाढते, लीफ-कर्ल व्हायरस पसरवते — त्यांचे शत्रू मारणारी आंधळी कीटकनाशके टाळा, पिवळे चिकट सापळे लावा.",
    },
  },
];

function dayMatches(day, t) {
  const tempOk = day.tempMax >= t.minTemp && day.tempMin <= t.maxTemp;
  let humOk = true;
  if (t.minHumidity > 0) humOk = day.humidity >= t.minHumidity;
  if (t.maxHumidity) humOk = humOk && day.humidity <= t.maxHumidity;
  let rainOk = true;
  if (t.rainNeeded > 0) rainOk = day.rain >= t.rainNeeded;
  return tempOk && humOk && rainOk;
}

// Evaluate disease/pest risk across the daily forecast for ONE crop only —
// threats belonging to other crops are never reported.
export function evaluateThreats(daily, cropId, stageIndex) {
  const results = [];
  for (const t of THREATS) {
    if (t.crop !== cropId) continue; // ← only this crop's threats
    const window = daily.slice(0, 7);
    let bestRun = 0, run = 0, triggerDay = -1, runStart = -1, totalRain = 0;
    window.forEach((d, i) => {
      totalRain += d.rain;
      const match = dayMatches(d, t);
      // Fusarium wilt needs waterlogging (heavy rain) + heat
      const special = t.waterlogging ? d.rain >= 20 : t.dry ? d.rain < 1 && d.tempMax >= t.minTemp : true;
      if (match && special) {
        if (run === 0) runStart = i;
        run += 1;
        if (run > bestRun) {
          bestRun = run;
          triggerDay = runStart; // first day the risky weather begins
        }
      } else {
        run = 0;
      }
    });
    if (triggerDay < 0) triggerDay = 0;

    const weatherScore = Math.min(1, bestRun / t.windowDays);
    const rainBonus = t.rainNeeded > 0 ? (totalRain >= t.rainNeeded * 2 ? 0.25 : 0) : 0;
    const stageScore = t.vulnerableStages.includes(stageIndex) ? 1 : 0.45;
    const score = Math.round(Math.min(1, weatherScore * 0.65 + rainBonus * 0.65 + 0) * stageScore * 100 + (weatherScore > 0 && t.vulnerableStages.includes(stageIndex) ? 15 : 0));
    const scoreCapped = Math.min(99, score);

    if (scoreCapped >= 60) {
      results.push({ threat: t, severity: scoreCapped >= 80 ? "critical" : "watch", score: scoreCapped, daysAhead: triggerDay });
    }
  }
  return results.sort((a, b) => b.score - a.score);
}

// Weather / disaster alerts from the forecast.
export function evaluateWeather(daily, hourly) {
  const alerts = [];

  // Heavy rainfall in the next 72h
  const rain3 = (hourly || []).slice(0, 72).reduce((a, h) => a + (h.rain || 0), 0);
  const heavyDay = daily.slice(0, 3).find((d) => d.rain >= 60);
  if (rain3 > 60 || heavyDay) {
    alerts.push({
      id: "heavy_rain",
      kind: "critical",
      daysAhead: heavyDay ? daily.indexOf(heavyDay) : 1,
      title: {
        en: "Heavy rainfall expected soon",
        hi: "जल्द भारी बारिश की संभावना",
        bn: "শীঘ্রই ভারী বৃষ্টির সম্ভাবনা",
        mr: "लवकरच मुसळधार पावसाचा इशारा",
      },
      detail: {
        en: "Clear field drains now, postpone fertilizer/fungicide spraying, and move harvested produce under cover.",
        hi: "खेत की नालियाँ अभी साफ़ करें, छिड़काव टालें, और कटी उपज सुरक्षित ढकें।",
        bn: "মাঠের নালা এখনই পরিষ্কার করুন, স্প্রে পিছিয়ে দিন এবং কাটা ফসল ঢেকে রাখুন।",
        mr: "शेतातील नाले आता साफ करा, फवारणी पुढे ढकला आणि कापणी केलेले पीक झाकून ठेवा.",
      },
    });
  }

  // Heatwave
  const hotRun = daily.slice(0, 4).filter((d) => d.tempMax >= 38).length;
  if (hotRun >= 2) {
    alerts.push({
      id: "heatwave",
      kind: "warning",
      daysAhead: daily.slice(0, 4).findIndex((d) => d.tempMax >= 38),
      title: {
        en: "Heatwave watch — protect standing crop",
        hi: "लू की चेतावनी — खड़ी फसल बचाएँ",
        bn: "তাপপ্রবাহ — দাঁড়িয়ে থাকা ফসল রক্ষা করুন",
        mr: "उष्णतेची लाट — उभ्या पिकाचे संरक्षण करा",
      },
      detail: {
        en: "Irrigate early morning or evening only; mulch exposed soil to reduce evaporation.",
        hi: "सिंचाई सिर्फ़ सुबह या शाम करें; वाष्पण घटाने मिट्टी पर मल्च डालें।",
        bn: "ভোরে বা সন্ধ্যায় সেচ দিন; বাষ্প কমাতে মাটিতে মালচ দিন।",
        mr: "फक्त पहाटे किंवा सायंकाळी पाणी द्या; बाष्पीभवन कमी करण्यास आच्छादन करा.",
      },
    });
  }

  // Dry spell
  const dryDays = daily.slice(0, 6).filter((d) => d.rain < 1).length;
  if (dryDays >= 5 && !heavyDay) {
    alerts.push({
      id: "dry_spell",
      kind: "info",
      daysAhead: 4,
      title: {
        en: "Dry spell ahead — soil moisture dropping",
        hi: "सूखा दौर — मिट्टी की नमी घट रही",
        bn: "খরা — মাটির আর্দ্রতা কমছে",
        mr: "कोरडा काळ — मातीतील आर्द्रता घटत आहे",
      },
      detail: {
        en: "Prioritise irrigation for flowering sections; light, frequent watering beats one heavy flooding.",
        hi: "सिंचाई में फूल वाले हिस्से को प्राथमिकता दें; एक बार भारी पानी से बेहतर हल्की बार-बार सिंचाई है।",
        bn: "ফুল আসা অংশে আগে সেচ দিন; একবার ভারী সেচের চেয়ে হালকা বারবার সেচ ভালো।",
        mr: "सिंचनात फुलोरा भागाला प्राधान्य द्या; एकदा जास्त पाण्यापेक्षा हलके वारंवार पाणी चांगले.",
      },
    });
  }

  return alerts;
}
