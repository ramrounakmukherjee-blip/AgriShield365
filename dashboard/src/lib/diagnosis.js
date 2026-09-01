// AgriShield 365 — Symptom Checker ("plant doctor").
// A rule-based diagnostic wizard: the farmer taps the signs they see and we
// match them against the same 8 disease/pest catalog used by the weather
// rule engine. Works 100% offline — no camera, no AI service, no backend.
// Symptom->disease weights are agronomic placeholders for the researcher
// (Mission 1) to verify; the structure is ready for their verified matrix.

import { THREATS } from "./rules";

// Each symptom is a picture-chip the farmer can tap. `signals` weights it
// toward one or more threats; `crops` (optional) limits where it is shown —
// omit `crops` to show for every crop.
export const SYMPTOM_GROUPS = [
  {
    id: "signs",
    question: {
      en: "What do you see on the plant?",
      hi: "पौधे पर आप क्या देखते हैं?",
      bn: "গাছে আপনি কী দেখছেন?",
      mr: "झाडावर तुम्हाला काय दिसते?",
    },
    symptoms: [
      {
        id: "s_diamond", emoji: "🔶", crops: ["paddy"],
        label: { en: "Diamond/spindle brown spots with a grey centre", hi: "हीरे जैसे भूरे धब्बे, बीच सलेटी", bn: "হীরার মতো বাদামি দাগ, মাঝে ধূসর", mr: "हिऱ्यासारखे तपकिरी डाग, मध्ये राखट" },
        signals: { rice_blast: 5 },
      },
      {
        id: "s_bullseye", emoji: "🎯", crops: ["potato"],
        label: { en: "Concentric ring (target-board) spots on older leaves", hi: "पुरानी पत्तियों पर चक्र/गोल-गोल धब्बे", bn: "পুরনো পাতায় চাকার মতো গোল দাগ", mr: "जुन्या पानांवर चक्रासारखे गोल डाग" },
        signals: { early_blight: 5 },
      },
      {
        id: "s_watersoaked", emoji: "💧", crops: ["potato"],
        label: { en: "Dark, water-soaked patches spreading quickly", hi: "गीले काले धब्बे जो तेज़ी से फैलते हैं", bn: "ভেজা কালো দাগ দ্রুত ছড়াচ্ছে", mr: "ओले काळे डाग लवकर पसरतात" },
        signals: { late_blight: 5 },
      },
      {
        id: "s_angular", emoji: "🔷", crops: ["cotton"],
        label: { en: "Angular/square dark spots bounded by leaf veins", hi: "नसों से बँधे कोनेदार काले धब्बे", bn: "শিরা দিয়ে বাঁধা চৌকো কালো দাগ", mr: "शिरांनी बांधलेले कोनेदार काळे डाग" },
        signals: { bacterial_blight: 5 },
      },
      {
        id: "s_sheath", emoji: "🎋", crops: ["paddy"],
        label: { en: "Grey-white oval lesions on the lower sheath near water", hi: "पानी के पास निचली खोल पर सलेटी-सफ़ेद धब्बे", bn: "পানির কাছে নিচের খোলে ধূসর-সাদা দাগ", mr: "पाण्याजवळ खालच्या खोडावर राखट-पांढरे डाग" },
        signals: { sheath_blight: 5 },
      },
      {
        id: "s_yellowcurl", emoji: "🍃", crops: ["cotton"],
        label: { en: "Leaves curling, crinkling and turning yellow", hi: "पत्तियाँ मुड़ना, सिकुड़ना, पीली होना", bn: "পাতা কুঁচকে ও হলুদ হওয়া", mr: "पाने कुरळे होऊन पिवळी होणे" },
        signals: { whitefly: 3 },
      },
      {
        id: "s_holes", emoji: "🐛", crops: ["cotton"],
        label: { en: "Irregular holes chewed in leaves or buds", hi: "पत्तियों/कलियों में कटे-फटे छेद", bn: "পাতা বা কুঁড়িতে কাটা ছিদ্র", mr: "पाने/कळ्यांवर खाल्लेली छिद्रे" },
        signals: { bollworm: 3 },
      },
      {
        id: "s_whitefuzz", emoji: "🤍", crops: ["potato"],
        label: { en: "White fuzzy mould under leaves in morning damp", hi: "सुबह की नमी में पत्तियों के नीचे सफ़ेद रोएँदार फफूँद", bn: "সকালের স্যাঁতস্যাঁতে পাতার নিচে সাদা তুলোর মতো ছত্রাক", mr: "सकाळच्या ओलीत पानांखाली पांढरी बुरशी" },
        signals: { late_blight: 3 },
      },
    ],
  },
  {
    id: "location",
    question: {
      en: "Where is the damage worst?",
      hi: "नुक़सान सबसे ज़्यादा कहाँ है?",
      bn: "ক্ষতি সবচেয়ে বেশি কোথায়?",
      mr: "नुकसान सर्वाधिक कुठे आहे?",
    },
    symptoms: [
      {
        id: "loc_lower", emoji: "⬇️", crops: ["paddy", "potato"],
        label: { en: "Starts on the older, lower leaves", hi: "पुरानी, निचली पत्तियों से शुरू", bn: "পুরনো, নিচের পাতা থেকে শুরু", mr: "जुन्या, खालच्या पानांपासून सुरू" },
        signals: { early_blight: 2, sheath_blight: 1 },
      },
      {
        id: "loc_sheath", emoji: "🎋", crops: ["paddy"],
        label: { en: "On the leaf sheath / stem base near the water", hi: "पानी के पास खोल/तने के आधार पर", bn: "পানির কাছে খোল/কাণ্ডের গোড়ায়", mr: "पाण्याजवळ खोड/देठाच्या पायाशी" },
        signals: { sheath_blight: 3 },
      },
      {
        id: "loc_bolls", emoji: "🌱", crops: ["cotton"],
        label: { en: "On the flower buds or bolls", hi: "फूल की कलियों या बोंडों पर", bn: "ফুলের কুঁড়ি বা বোলে", mr: "फुलांच्या कळ्या किंवा बोंड्यांवर" },
        signals: { bollworm: 4 },
      },
      {
        id: "loc_newgrowth", emoji: "🔝", crops: ["cotton"],
        label: { en: "On new leaves and fresh tips first", hi: "नई पत्तियों और कोमल टहनियों पर पहले", bn: "নতুন পাতা ও কচি ডগায় আগে", mr: "नवीन पाने व कोवळ्या शेंगांवर आधी" },
        signals: { whitefly: 2 },
      },
    ],
  },
  {
    id: "insects",
    question: {
      en: "Do you see any insects?",
      hi: "क्या कोई कीड़े दिखते हैं?",
      bn: "কোনো পোকা দেখা যাচ্ছে?",
      mr: "कीडे दिसत आहेत का?",
    },
    symptoms: [
      {
        id: "bug_whiteflies", emoji: "🦟", crops: ["cotton"],
        label: { en: "Tiny white flies fly up when I shake the plant", hi: "पौधा हिलाने पर छोटी सफ़ेद मक्खियाँ उड़ती हैं", bn: "গাছ নাড়লে ছোট সাদা মাছি উড়ে ওঠে", mr: "झाड हलवल्यावर लहान पांढऱ्या माश्या उडतात" },
        signals: { whitefly: 5 },
      },
      {
        id: "bug_caterpillar", emoji: "🐛", crops: ["cotton"],
        label: { en: "Green/brown caterpillars or worms are visible", hi: "हरी/भूरी सुंडियाँ (कीड़े) दिखती हैं", bn: "সবুজ/বাদামি শুঁয়োপোকা দেখা যায়", mr: "हिरव्या/तपकिरी अळ्या दिसतात" },
        signals: { bollworm: 5 },
      },
      {
        id: "bug_sticky", emoji: "🍯", crops: ["cotton"],
        label: { en: "Leaves feel sticky/shiny or have black sooty mould", hi: "पत्तियाँ चिपचिपी/चमकदार या काली फफूँद वाली", bn: "পাতা আঠালো/চকচকে বা কালো ছত্রাকযুক্ত", mr: "पाने चिकट/चकचकीत किंवा काळी बुरशीची" },
        signals: { whitefly: 3 },
      },
      {
        id: "bug_none", emoji: "🚫",
        label: { en: "No insects are visible", hi: "कोई कीड़ा नहीं दिखता", bn: "কোনো পোকা দেখা যায় না", mr: "कीडा दिसत नाही" },
        signals: {},
      },
    ],
  },
  {
    id: "plant",
    question: {
      en: "How is the whole plant?",
      hi: "पूरा पौधा कैसा है?",
      bn: "গোটা গাছ কেমন আছে?",
      mr: "संपूर्ण झाड कसे आहे?",
    },
    symptoms: [
      {
        id: "p_wilt", emoji: "🥀", crops: ["cotton"],
        label: { en: "Wilting / yellowing, often on one side", hi: "मुरझाना/पीला होना, अक्सर एक तरफ़", bn: "শুকিয়ে/হলুদ হওয়া, প্রায়ই এক পাশে", mr: "कोमेजणे/पिवळे होणे, बहुतेक एका बाजूला" },
        signals: { fusarium_wilt: 5 },
      },
      {
        id: "p_patches", emoji: "🗺️", crops: ["cotton"],
        label: { en: "Plants are dying in patches across the field", hi: "खेत में गुच्छों में पौधे मर रहे हैं", bn: "মাঠে থপে থপে গাছ মরছে", mr: "शेतात तुरळक-तुरळक झाडे मरत आहेत" },
        signals: { fusarium_wilt: 3 },
      },
      {
        id: "p_brownring", emoji: "🟤", crops: ["cotton"],
        label: { en: "A cut stem shows a brown ring inside", hi: "तना काटने पर अंदर भूरा छल्ला दिखता है", bn: "কাণ্ড কাটলে ভেতরে বাদামি বলয় দেখা যায়", mr: "देठ कापल्यास आत तपकिरी कंगवा दिसतो" },
        signals: { fusarium_wilt: 4 },
      },
    ],
  },
  {
    id: "weather",
    question: {
      en: "What was the recent weather?",
      hi: "हाल का मौसम कैसा रहा?",
      bn: "সাম্প্রতিক আবহাওয়া কেমন ছিল?",
      mr: "अलीकडचे हवामान कसे होते?",
    },
    symptoms: [
      {
        id: "w_wet", emoji: "🌧️",
        label: { en: "Continuous rain / very humid, leaves stay wet", hi: "लगातार बारिश / बहुत आर्द्रता, पत्ते गीले", bn: "টানা বৃষ্টি / খুব আর্দ্র, পাতা ভেজা", mr: "सतत पाऊस / खूप दमट, पाने ओली" },
        signals: { late_blight: 2, rice_blast: 2, sheath_blight: 2, bacterial_blight: 2 },
      },
      {
        id: "w_dry", emoji: "☀️", crops: ["cotton"],
        label: { en: "Hot and dry, little or no rain", hi: "गर्म और सूखा, बारिश कम या नहीं", bn: "গরম ও শুষ্ক, বৃষ্টি কম বা নেই", mr: "उष्ण व कोरडे, पाऊस कमी किंवा नाही" },
        signals: { whitefly: 3 },
      },
      {
        id: "w_waterlogged", emoji: "🌊", crops: ["cotton"],
        label: { en: "Standing water / waterlogging, then heat", hi: "पानी भर गया, फिर गर्मी आई", bn: "জমিতে পানি দাঁড়িয়েছিল, তারপর গরম", mr: "शेतात पाणी साचले, मग उष्णता" },
        signals: { fusarium_wilt: 4 },
      },
    ],
  },
];

// Flatten symptom lookup.
const SYMPTOM_BY_ID = {};
for (const g of SYMPTOM_GROUPS) for (const s of g.symptoms) SYMPTOM_BY_ID[s.id] = s;

// Groups that actually contain at least one symptom relevant to this crop.
export function groupsForCrop(cropId) {
  return SYMPTOM_GROUPS.map((g) => ({
    ...g,
    symptoms: g.symptoms.filter((s) => !s.crops || s.crops.includes(cropId)),
  })).filter((g) => g.symptoms.length > 0);
}

// Score the selected symptoms against this crop's threats.
// Returns ranked matches with confidence % and the signs that matched.
export function diagnose(cropId, selectedIds) {
  const selected = new Set(selectedIds);
  const threats = THREATS.filter((t) => t.crop === cropId);

  // Total weight available for each threat (used to normalise confidence).
  const available = {};
  for (const t of threats) available[t.id] = 0;
  for (const s of Object.values(SYMPTOM_BY_ID)) {
    for (const [tid, w] of Object.entries(s.signals || {})) {
      if (available[tid] !== undefined) available[tid] += w;
    }
  }

  const matches = threats
    .map((threat) => {
      let score = 0;
      const matchedSymptoms = [];
      for (const id of selected) {
        const sym = SYMPTOM_BY_ID[id];
        const w = sym?.signals?.[threat.id];
        if (w) {
          score += w;
          matchedSymptoms.push(sym);
        }
      }
      const total = available[threat.id] || 1;
      const confidence = score > 0 ? Math.min(98, Math.round((score / total) * 100)) : 0;
      return { threat, score, confidence, matchedSymptoms };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.confidence - a.confidence || b.score - a.score);

  const inconclusive = matches.length === 0 || matches[0].confidence < 25;
  return { matches, inconclusive };
}
