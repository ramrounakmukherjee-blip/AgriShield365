// AgriSaathi 🤖 — the farmer's onboard assistant.
// Runs 100% offline on the app's OWN data: the rule engine, live forecast,
// FAO-56 irrigation plan and mandi prices. No LLM, no quota, no failures —
// it works in airplane mode and speaks the farmer's language.
//
// Every answer is { text, lang } generated from the live advisory context.

import { getIrrigation, getMarket } from "./api";

// ---- small helpers ---------------------------------------------------------

function whenWord(n, L) {
  if (n <= 0) return L.when[0];
  if (n === 1) return L.when[1];
  if (n === 2) return L.when[2];
  return L.when[3].replace("{n}", n);
}

// ---- localized phrasing ----------------------------------------------------

const S = {
  en: {
    chips: { weather: "Weather this week?", pests: "Any pest risk?", irrigation: "When to irrigate?", market: "Sell or hold?", help: "How do I use this?" },
    greeting: "Namaste 🙏 I am AgriSaathi, your farming companion. Ask me anything about your crop, weather, water or market — or tap a question below.",
    when: ["Today", "Tomorrow", "in 2 days", "in {n} days"],
    weather: (ctx) => {
      const w = ctx.weather.daily;
      const rainDays = w.slice(0, 7).filter((d) => d.rain >= 3);
      const maxes = w.slice(0, 7).map((d) => d.tempMax);
      const hi = Math.max(...maxes).toFixed(0),
        lo = Math.min(...w.slice(0, 7).map((d) => d.tempMin)).toFixed(0);
      const tmm = w[1];
      if (!rainDays.length)
        return `This week looks dry — highs around ${hi}°C, lows near ${lo}°C. Good window for field work; keep monitoring your ${ctx.cropName}. Tomorrow: ${tmm.tempMax.toFixed(0)}°C, ${tmm.rainPct}% rain chance.`;
      const first = rainDays[0];
      const di = w.findIndex((d) => d.date === first.date);
      return `${whenWord(di, S.en)} expect rain — ${rainDays.length} rainy day${rainDays.length > 1 ? "s" : ""} in the week, with up to ${Math.max(
        ...rainDays.map((d) => d.rain)
      ).toFixed(0)} mm. Temperatures ${lo}–${hi}°C. ${
        rainDays.some((d) => d.rain >= 15)
          ? "Avoid spraying on rainy days — rain washes away fungicide."
          : "Light rain only — still safe to work between showers."
      } Tomorrow: ${tmm.tempMax.toFixed(0)}°C, ${tmm.rainPct}% rain chance.`;
    },
    pests: (ctx) => {
      const threats = ctx.advisories.alerts.filter((a) => a.threatType === "disease" || a.threatType === "pest");
      if (!threats.length)
        return `Good news — right now your ${ctx.cropName} has no pest or disease risk in the forecast. I keep watching temperature and humidity every hour; if risk rises, a red alert appears on your Home tab.`;
      const a = threats[0];
      return `Heads-up 🐛 ${whenWord(a.daysAhead ?? 0, S.en)} there is ${ctx.tr(a.title)} risk. ${ctx.tr(a.detail)} ${
        a.why ? `Why: ${ctx.tr(a.why)} ` : ""
      }Tap the alert on your Home tab for the full detail.`;
    },
    irrigation: (ctx) => {
      const ir = ctx.irrigation;
      const t = ir.today;
      const nextWater = ir.plan.find((d) => !d.skip);
      if (t.skip) {
        const di = ir.plan.findIndex((d) => !d.skip);
        return `Good news — no watering today 🌧️ Rain covers your crop's need. Next irrigation ${whenWord(
          di < 0 ? 3 : di,
          S.en
        )}. JalRakshak recalculates every day from live rain data.`;
      }
      return `Irrigate ${whenWord(0, S.en).toLowerCase()}: about ${t.needMm.toFixed(0)} mm — roughly ${t.litresTotal.toLocaleString(
        "en-IN"
      )} litres for your ${t.area} acre field. Best time: early morning or evening. ${
        nextWater && nextWater !== t ? `After that, your next planned watering is ${whenWord(ir.plan.indexOf(nextWater), S.en).toLowerCase()}.` : ""
      } See the Droplets tab for the full 4-day plan.`;
    },
    market: (ctx) => {
      const m = ctx.market;
      return `Today's mandi price for your ${ctx.cropName} is ₹${m.price.toLocaleString("en-IN")} per quintal (source: ${
        m.source.en
      }, updated today). Your cost of production is about ₹${m.costPrice.toLocaleString("en-IN")} per quintal — so that's a margin of ₹${m.margin.toLocaleString(
        "en-IN"
      )}. ${m.advice.en} See the Market tab for the 14-day trend chart.`;
    },
    help: () =>
      "Here is the quick tour 🧭 Home tab = pest & weather alerts. Calendar tab = 7-day + 24-hour forecast. Droplets tab = your JalRakshak irrigation plan. Trending tab = mandi price & sell/hold advice. The camera on Home scans a leaf (premium), and any advisory card can be shared on WhatsApp. Tap the mic and speak if you prefer. Everything also works in airplane mode.",
    fallback:
      "I am best at weather, pest risk, irrigation timing and mandi prices for your field — tap one of the buttons below and I will answer from your live data. Namaste 🙏",
    think: "Reading your farm data…",
    title: "AgriSaathi",
    subtitle: "Your offline farming companion",
    micTip: "Tap and speak your question",
    micStop: "Stop listening",
    open: "Ask AgriSaathi",
    close: "Close",
    tourTitle: "Welcome to your dashboard 👋",
  },
  hi: {
    chips: { weather: "इस हफ्ते मौसम?", pests: "कीट का खतरा?", irrigation: "सिंचाई कब करें?", market: "बेचें या रुकें?", help: "ऐप कैसे चलाएं?" },
    greeting:
      "नमस्ते 🙏 मैं हूँ अग्रिसाथी, आपका किसान-साथी। फसल, मौसम, पानी या मंडी के बारे में कुछ भी पूछें — या नीचे कोई सवाल चुनें।",
    when: ["आज", "कल", "परसों", "{n} दिन में"],
    weather: (ctx) => {
      const w = ctx.weather.daily;
      const rainDays = w.slice(0, 7).filter((d) => d.rain >= 3);
      const hi = Math.max(...w.slice(0, 7).map((d) => d.tempMax)).toFixed(0);
      const lo = Math.min(...w.slice(0, 7).map((d) => d.tempMin)).toFixed(0);
      const tmm = w[1];
      if (!rainDays.length)
        return `इस हफ्ते मौसम सूखा रहेगा — अधिकतम तापमान ${hi}°C, न्यूनतम ${lo}°C के आसपास। खेत के काम के लिए अच्छा समय; अपनी ${ctx.cropNameHi} पर नज़र रखें। कल: ${tmm.tempMax.toFixed(
          0
        )}°C, बारिश की संभावना ${tmm.rainPct}%।`;
      const di = w.findIndex((d) => d.date === rainDays[0].date);
      return `${whenWord(di, S.hi)} बारिश की संभावना — हफ्ते में ${rainDays.length} बरसात के दिन, अधिकतम ${Math.max(
        ...rainDays.map((d) => d.rain)
      ).toFixed(0)} मिमी तक। तापमान ${lo}–${hi}°C। ${
        rainDays.some((d) => d.rain >= 15)
          ? "बरसात वाले दिनों में छिड़काव न करें — बारिश दवाई धो देती है।"
          : "हल्की बारिश है — बूंदाबांदी के बीच काम सुरक्षित है।"
      } कल: ${tmm.tempMax.toFixed(0)}°C, बारिश ${tmm.rainPct}%।`;
    },
    pests: (ctx) => {
      const threats = ctx.advisories.alerts.filter((a) => a.threatType === "disease" || a.threatType === "pest");
      if (!threats.length)
        return `अच्छी खबर — अभी पूर्वानुमान में आपकी ${ctx.cropNameHi} के लिए किसी कीट या रोग का खतरा नहीं है। मैं तापमान और आर्द्रता पर हर घंटे नज़र रखता हूँ; खतरा बढ़ते ही होम टैब पर लाल अलर्ट आ जाएगा।`;
      const a = threats[0];
      return `ध्यान दें 🐛 ${whenWord(a.daysAhead ?? 0, S.hi)} ${ctx.tr(a.title)} का खतरा है। ${ctx.tr(a.detail)} ${
        a.why ? `कारण: ${ctx.tr(a.why)} ` : ""
      }पूरी जानकारी होम टैब पर अलर्ट में मिलेगी।`;
    },
    irrigation: (ctx) => {
      const ir = ctx.irrigation;
      const t = ir.today;
      if (t.skip) {
        const di = ir.plan.findIndex((d) => !d.skip);
        return `अच्छी खबर — आज पानी नहीं देना 🌧️ बारिश फसल की ज़रूरत पूरी कर रही है। अगली सिंचाई ${whenWord(
          di < 0 ? 3 : di,
          S.hi
        )}। जलरक्षक हर दिन लाइव बारिश के आँकड़ों से दोबारा गिनता है।`;
      }
      const nextWater = ir.plan.find((d) => !d.skip);
      return `आज सिंचाई करें: लगभग ${t.needMm.toFixed(0)} मिमी — आपके ${t.area} एकड़ खेत के लिए करीब ${t.litresTotal.toLocaleString(
        "hi-IN"
      )} लीटर। सबसे अच्छा समय: सुबह या शाम। ${
        nextWater && nextWater !== t ? `उसके बाद अगली सिंचाई ${whenWord(ir.plan.indexOf(nextWater), S.hi)}।` : ""
      } पूरी 4-दिन की योजना ड्रॉपलेट्स टैब में देखें।`;
    },
    market: (ctx) => {
      const m = ctx.market;
      return `आपकी ${ctx.cropNameHi} का आज का मंडी भाव ₹${m.price.toLocaleString("hi-IN")} प्रति क्विंटल है (स्रोत: ${
        m.source.hi
      }, आज अपडेट)। उत्पादन लागत लगभग ₹${m.costPrice.toLocaleString("hi-IN")} प्रति क्विंटल है — यानी मुनाफ़ा ₹${m.margin.toLocaleString(
        "hi-IN"
      )}। ${m.advice.hi} 14 दिन का ट्रेंड मार्केट टैब पर देखें।`;
    },
    help: () =>
      "छोटा-सा दौरा 🧭 होम टैब = कीट और मौसम अलर्ट। कैलेंडर टैब = 7 दिन और 24 घंटे का पूर्वानुमान। ड्रॉपलेट्स टैब = जलरक्षक सिंचाई योजना। ट्रेंडिंग टैब = मंडी भाव और बेचें/रुकें सलाह। होम पर कैमरे से पत्ती स्कैन करें (प्रीमियम), और किसी भी सलाह को व्हाट्सऐप पर शेयर कर सकते हैं। माइक दबाकर बोलकर भी पूछ सकते हैं। सब कुछ हवाई जहाज़ मोड में भी चलता है।",
    fallback:
      "मैं मौसम, कीट खतरे, सिंचाई समय और मंडी भाव पर सबसे अच्छा जवाब देता हूँ — नीचे कोई बटन चुनें और मैं आपके लाइव आँकड़ों से जवाब दूँगा। नमस्ते 🙏",
    think: "आपके खेत के आँकड़े पढ़ रहा हूँ…",
    title: "अग्रिसाथी",
    subtitle: "आपका ऑफ़लाइन किसान-साथी",
    micTip: "दबाकर बोलें",
    micStop: "रोकें",
    open: "अग्रिसाथी से पूछें",
    close: "बंद करें",
    tourTitle: "आपके डैशबोर्ड में स्वागत है 👋",
  },
  bn: {
    chips: { weather: "এ সপ্তাহের আবহাওয়া?", pests: "পোকার ঝুঁকি আছে?", irrigation: "কখন সেচ দেব?", market: "বিক্রি না অপেক্ষা?", help: "অ্যাপ কীভাবে চালাব?" },
    greeting:
      "নমস্কার 🙏 আমি অগ্রিসাথী, আপনার কৃষি সঙ্গী। ফসল, আবহাওয়া, জল বা বাজার নিয়ে যা খুশি জিজ্ঞেস করুন — অথবা নিচের প্রশ্নে ট্যাপ করুন।",
    when: ["আজ", "আগামীকাল", "পরশু", "{n} দিনের মধ্যে"],
    weather: (ctx) => {
      const w = ctx.weather.daily;
      const rainDays = w.slice(0, 7).filter((d) => d.rain >= 3);
      const hi = Math.max(...w.slice(0, 7).map((d) => d.tempMax)).toFixed(0);
      const lo = Math.min(...w.slice(0, 7).map((d) => d.tempMin)).toFixed(0);
      if (!rainDays.length)
        return `এ সপ্তাহ শুষ্ক থাকবে — সর্বোচ্চ প্রায় ${hi}°C, সর্বনিম্ন প্রায় ${lo}°C। মাঠের কাজের ভালো সময়; আপনার ${ctx.cropName} খেয়াল রাখুন।`;
      const di = w.findIndex((d) => d.date === rainDays[0].date);
      return `${whenWord(di, S.bn)} বৃষ্টির সম্ভাবনা — সপ্তাহে ${rainDays.length} টি বৃষ্টির দিন, সর্বোচ্চ ${Math.max(
        ...rainDays.map((d) => d.rain)
      ).toFixed(0)} মিমি পর্যন্ত। তাপমাত্রা ${lo}–${hi}°C। ${
        rainDays.some((d) => d.rain >= 15)
          ? "বৃষ্টির দিনে স্প্রে এড়ান — বৃষ্টি ওষুধ ধুয়ে ফেলে।"
          : "হালকা বৃষ্টি — ফোঁটা ফোঁটার ফাঁকে কাজ নিরাপদ।"
      }`;
    },
    pests: (ctx) => {
      const threats = ctx.advisories.alerts.filter((a) => a.threatType === "disease" || a.threatType === "pest");
      if (!threats.length)
        return `সুখবর — পূর্বাভাসে এখন আপনার ${ctx.cropName}-এর জন্য কোনো পোকামাকড় বা রোগের ঝুঁকি নেই। আমি তাপমাত্রা ও আর্দ্রতায় প্রতি ঘণ্টা নজর রাখছি; ঝুঁকি বাড়লেই হোম ট্যাবে লাল সতর্কতা আসবে।`;
      const a = threats[0];
      return `খেয়াল করুন 🐛 ${whenWord(a.daysAhead ?? 0, S.bn)} ${ctx.tr(a.title)}-এর ঝুঁকি আছে। ${ctx.tr(a.detail)} ${
        a.why ? `কারণ: ${ctx.tr(a.why)} ` : ""
      }বিস্তারিত হোম ট্যাবের সতর্কতায় পাবেন।`;
    },
    irrigation: (ctx) => {
      const ir = ctx.irrigation;
      const t = ir.today;
      if (t.skip) {
        const di = ir.plan.findIndex((d) => !d.skip);
        return `সুখবর — আজ জল দিতে হবে না 🌧️ বৃষ্টিই ফসলের চাহিদা মেটাচ্ছে। পরবর্তী সেচ ${whenWord(
          di < 0 ? 3 : di,
          S.bn
        )}। জলরক্ষক প্রতিদিন লাইভ বৃষ্টির তথ্য থেকে নতুন করে হিসাব করে।`;
      }
      return `আজ সেচ দিন: প্রায় ${t.needMm.toFixed(0)} মিমি — আপনার ${t.area} একর জমিতে মোটামুটি ${t.litresTotal.toLocaleString(
        "bn-IN"
      )} লিটার। সেরা সময়: ভোরে বা সন্ধ্যায়। পুরো ৪-দিনের পরিকল্পনা ড্রপলেটস ট্যাবে দেখুন।`;
    },
    market: (ctx) => {
      const m = ctx.market;
      return `আপনার ${ctx.cropName}-এর আজকের মান্ডি দর ₹${m.price.toLocaleString("bn-IN")} প্রতি কুইন্টাল (উৎস: ${
        m.source.bn
      }, আজ আপডেট)। উৎপাদন খরচ প্রায় ₹${m.costPrice.toLocaleString("bn-IN")} প্রতি কুইন্টাল — অর্থাৎ লাভ ₹${m.margin.toLocaleString(
        "bn-IN"
      )}। ${m.advice.bn} ১৪ দিনের ট্রেন্ড মার্কেট ট্যাবে দেখুন।`;
    },
    help: () =>
      "ছোট্ট পরিচিতি 🧭 হোম ট্যাব = পোকামাকড় ও আবহাওয়ার সতর্কতা। ক্যালেন্ডার ট্যাব = ৭ দিন ও ২৪ ঘণ্টার পূর্বাভাস। ড্রপলেটস ট্যাব = আপনার জলরক্ষক সেচ পরিকল্পনা। ট্রেন্ডিং ট্যাব = মান্ডি দাম ও বিক্রি/অপেক্ষা পরামর্শ। হোমে ক্যামেরা দিয়ে পাতা স্ক্যান করুন (প্রিমিয়াম), আর যেকোনো পরামর্শ হোয়াটসঅ্যাপে শেয়ার করা যায়। মাইক চেপে বলেও জিজ্ঞেস করতে পারেন। সবকিছু এয়ারপ্লেন মোডেও চলে।",
    fallback:
      "আমি আবহাওয়া, পোকার ঝুঁকি, সেচের সময় আর মান্ডি দামে সবচেয়ে ভালো উত্তর দিই — নিচের যেকোনো বোতামে ট্যাপ করলেই আপনার লাইভ তথ্য থেকে উত্তর দেব। নমস্কার 🙏",
    think: "আপনার মাঠের তথ্য পড়ছি…",
    title: "অগ্রিসাথী",
    subtitle: "আপনার অফলাইন কৃষি সঙ্গী",
    micTip: "চেপে প্রশ্ন বলুন",
    micStop: "থামান",
    open: "অগ্রিসাথীকে জিজ্ঞেস করুন",
    close: "বন্ধ করুন",
    tourTitle: "আপনার ড্যাশবোর্ডে স্বাগতম 👋",
  },
  mr: {
    chips: { weather: "या आठवड्याचे हवामान?", pests: "कीडीचा धोका?", irrigation: "सिंचन कधी करावे?", market: "विक्री की थांबावे?", help: "अ‍ॅप कसे वापरावे?" },
    greeting:
      "नमस्कार 🙏 मी अग्रिसाथी, तुमचा शेती-सोबती. पीक, हवामान, पाणी किंवा बाजारभाव यांबद्दल काहीही विचारा — किंवा खालील प्रश्न निवडा.",
    when: ["आज", "उद्या", "परवा", "{n} दिवसांत"],
    weather: (ctx) => {
      const w = ctx.weather.daily;
      const rainDays = w.slice(0, 7).filter((d) => d.rain >= 3);
      const hi = Math.max(...w.slice(0, 7).map((d) => d.tempMax)).toFixed(0);
      const lo = Math.min(...w.slice(0, 7).map((d) => d.tempMin)).toFixed(0);
      if (!rainDays.length)
        return `या आठवड्यात हवामान कोरडे राहील — कमाल सुमारे ${hi}°C, किमान सुमारे ${lo}°C. शेतकामासाठी चांगला वेळ; तुमच्या ${ctx.cropName}वर लक्ष ठेवा.`;
      const di = w.findIndex((d) => d.date === rainDays[0].date);
      return `${whenWord(di, S.mr)} पावसाची शक्यता — आठवड्यात ${rainDays.length} पावसाळी दिवस, कमाल ${Math.max(
        ...rainDays.map((d) => d.rain)
      ).toFixed(0)} मिमी पर्यंत. तापमान ${lo}–${hi}°C. ${
        rainDays.some((d) => d.rain >= 15)
          ? "पावसाच्या दिवशी फवारणी टळा — पाऊस औषध धुवून टाकतो."
          : "हलका पाऊस आहे — सरींच्या फटीत काम सुरक्षित."
      }`;
    },
    pests: (ctx) => {
      const threats = ctx.advisories.alerts.filter((a) => a.threatType === "disease" || a.threatType === "pest");
      if (!threats.length)
        return `चांगली बातमी — सध्याच्या अंदाजात तुमच्या ${ctx.cropName}साठी कोणत्याही कीड-रोगाचा धोका नाही. मी तापमान व आर्द्रतेवर दर तासाला लक्ष ठेवतो; धोका वाढला की होम टॅबवर लाल इशारा येईल.`;
      const a = threats[0];
      return `लक्ष द्या 🐛 ${whenWord(a.daysAhead ?? 0, S.mr)} ${ctx.tr(a.title)} चा धोका आहे. ${ctx.tr(a.detail)} ${
        a.why ? `कारण: ${ctx.tr(a.why)} ` : ""
      }संपूर्ण माहिती होम टॅबवरील इशाऱ्यात मिळेल.`;
    },
    irrigation: (ctx) => {
      const ir = ctx.irrigation;
      const t = ir.today;
      if (t.skip) {
        const di = ir.plan.findIndex((d) => !d.skip);
        return `चांगली बातमी — आज पाणी देऊ नका 🌧️ पाऊसच पिकाची गरज भागवत आहे. पुढचे सिंचन ${whenWord(
          di < 0 ? 3 : di,
          S.mr
        )}. जलरक्षक दररोज थेट पावसाच्या आकड्यांवरून पुन्हा मोजतो.`;
      }
      return `आज सिंचन करा: सुमारे ${t.needMm.toFixed(0)} मिमी — तुमच्या ${t.area} एकर शेतासाठी अंदाजे ${t.litresTotal.toLocaleString(
        "mr-IN"
      )} लिटर. उत्तम वेळ: पहाटे किंवा संध्याकाळी. संपूर्ण 4-दिवसांची योजना ड्रॉपलेट्स टॅबमध्ये पहा.`;
    },
    market: (ctx) => {
      const m = ctx.market;
      return `तुमच्या ${ctx.cropName}चा आजचा बाजारभाव ₹${m.price.toLocaleString("mr-IN")} प्रति क्विंटल आहे (स्रोत: ${
        m.source.mr
      }, आज अद्ययावत). उत्पादन खर्च सुमारे ₹${m.costPrice.toLocaleString("mr-IN")} प्रति क्विंटल — म्हणजे नफा ₹${m.margin.toLocaleString(
        "mr-IN"
      )}. ${m.advice.mr} 14 दिवसांचा कल मार्केट टॅबवर पहा.`;
    },
    help: () =>
      "लहान दौरा 🧭 होम टॅब = कीड व हवामान इशारे. कॅलेंडर टॅब = 7 दिवस व 24 तासांचा अंदाज. ड्रॉपलेट्स टॅब = तुमची जलरक्षक सिंचन योजना. ट्रेंडिंग टॅब = बाजारभाव व विक्री/थांबण्याचा सल्ला. होमवर कॅमेऱ्याने पान स्कॅन करा (प्रीमियम), आणि कोणताही सल्ला व्हॉट्सअ‍ॅपवर शेअर करता येतो. माइक दाबून बोलूनही विचारता येते. सर्व काही एअरप्लेन मोडमध्येही चालते.",
    fallback:
      "मी हवामान, कीड धोका, सिंचन वेळ आणि बाजारभाव यांवर सर्वोत्तम उत्तर देतो — खालील बटणांपैकी एक टॅप करा आणि मी तुमच्या थेट आकड्यांवरून उत्तर देईन. नमस्कार 🙏",
    think: "तुमच्या शेताचे आकडे वाचत आहे…",
    title: "अग्रिसाथी",
    subtitle: "तुमचा ऑफलाइन शेती सोबती",
    micTip: "दाबून बोला",
    micStop: "थांबवा",
    open: "अग्रिसाथीला विचारा",
    close: "बंद करा",
    tourTitle: "तुमच्या डॅशबोर्डमध्ये स्वागत 👋",
  },
};

// ---- public API -------------------------------------------------------------

export function saathiStrings(lang) {
  return S[lang] || S.en;
}

// Cheap keyword routing for the typed/spoken free-form question.
export function routeQuestion(q) {
  const s = q.toLowerCase().trim();
  if (/(weather|rain|temp|मौसम|बारिश|पानी का|आबो?हवा|বৃষ্টি|আবহাওয়া|হাওয়া|पावस|हवामान|पाऊस)/.test(s)) return "weather";
  if (/(pest|insect|disease|blight|borer|whitefly|bollworm|aphid|कीट|रोग|कीड|रोग|পোকা|রোগ)/.test(s)) return "pests";
  if (/(irrigate|irrigation|water|पानी|सिंचाई|जल|সেচ|জল|सिंचन|पाणी)/.test(s)) return "irrigation";
  if (/(price|market|sell|mandis?|mandi|भाव|बेच|मंडी|দাম|বিক্রি|मंडई|भाव|विक्री|बाजार)/.test(s)) return "market";
  if (/(how|where|use|help|guide|kaise|kahan|कैसे|कहाँ|मदद|की|কিভাবে|কোথায়|साहाय्य|कसे|कुठे|मदत)/.test(s)) return "help";
  return "fallback";
}

// Builds the context once from the app's live data.
export function buildSaathiContext({ profile, weather, advisories, tr, t }) {
  const irrigation = getIrrigation(profile, weather);
  const market = getMarket(profile);
  return {
    profile,
    weather,
    advisories,
    irrigation,
    market,
    tr,
    t,
    cropName: tr(advisories.crop.name),
    cropNameHi: tr(advisories.crop.name),
  };
}

export function answerQuestion(topic, ctx, lang) {
  const L = S[lang] || S.en;
  switch (topic) {
    case "weather":
      return L.weather(ctx);
    case "pests":
      return L.pests(ctx);
    case "irrigation":
      return L.irrigation(ctx);
    case "market":
      return L.market(ctx);
    case "help":
      return L.help();
    default:
      return L.fallback;
  }
}

// ---- speech recognition (typing by voice) ----------------------------------

export function isRecognitionSupported() {
  return typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function createRecognition(lang, onResult, onEnd, onError) {
  const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Ctor) return null;
  const rec = new Ctor();
  rec.lang = lang === "hi" ? "hi-IN" : lang === "bn" ? "bn-IN" : lang === "mr" ? "mr-IN" : "en-IN";
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  rec.onresult = (e) => {
    const said = e.results?.[0]?.[0]?.transcript || "";
    if (said) onResult(said);
  };
  rec.onend = onEnd;
  rec.onerror = () => {
    onError?.();
    onEnd?.();
  };
  return rec;
}
