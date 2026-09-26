import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, MicOff, Send, Sparkles, Compass } from "lucide-react";
import { useLang } from "../../lib/useLang";
import SpeakButton from "./SpeakButton";

const MASCOT = "/assets/saathi-mascot.jpg";
import {
  saathiStrings,
  buildSaathiContext,
  answerQuestion,
  routeQuestion,
  isRecognitionSupported,
  createRecognition,
} from "../../lib/saathi";

const TOUR_KEY = "agrishield365_tour_done_v1";
const FEEDBACK_KEY = "agrishield365_saathi_feedback";

const FEEDBACK_TEXT = {
  title: {
    en: "Close AgriSaathi?",
    hi: "AgriSaathi बंद करें?",
    bn: "AgriSaathi বন্ধ করবেন?",
    mr: "AgriSaathi बंद करायचे?",
  },
  body: {
    en: "Before you exit, tell us how helpful this answer felt. Your feedback helps AgriSaathi improve for farmers.",
    hi: "बंद करने से पहले बताइए जवाब कितना उपयोगी लगा। आपका फीडबैक AgriSaathi को किसानों के लिए बेहतर बनाता है।",
    bn: "বন্ধ করার আগে বলুন উত্তরটি কতটা সাহায্য করেছে। আপনার মতামত AgriSaathi-কে কৃষকদের জন্য আরও ভালো করে।",
    mr: "बंद करण्यापूर्वी उत्तर किती उपयोगी वाटले ते सांगा. तुमचा अभिप्राय AgriSaathi शेतकऱ्यांसाठी अधिक चांगला करतो.",
  },
  prompt: {
    en: "Was I helpful?",
    hi: "क्या मैं मददगार था?",
    bn: "আমি কি সাহায্য করতে পেরেছি?",
    mr: "मी उपयोगी ठरलो का?",
  },
  saved: {
    en: "Thanks — feedback saved locally.",
    hi: "धन्यवाद — फीडबैक इस डिवाइस पर सेव हो गया।",
    bn: "ধন্যবাদ — মতামত এই ডিভাইসে সংরক্ষিত হয়েছে।",
    mr: "धन्यवाद — अभिप्राय या डिव्हाइसवर सेव्ह झाला.",
  },
  confirm: { en: "Confirm", hi: "पक्का करें", bn: "নিশ্চিত করুন", mr: "निश्चित करा" },
  cancel: { en: "Cancel", hi: "रद्द करें", bn: "বাতিল", mr: "रद्द करा" },
};

const FEEDBACK_RATINGS = [
  { score: 5, emoji: "😊", label: "great" },
  { score: 4, emoji: "🙂", label: "good" },
  { score: 3, emoji: "😐", label: "okay" },
  { score: 2, emoji: "☹️", label: "poor" },
  { score: 1, emoji: "😔", label: "bad" },
];

function saveSaathiFeedback(entry) {
  try {
    const old = JSON.parse(localStorage.getItem(FEEDBACK_KEY) || "[]");
    const next = [entry, ...old].slice(0, 50);
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

function hasSeenTour() {
  try {
    return localStorage.getItem(TOUR_KEY) === "1";
  } catch {
    return false;
  }
}
function markTourSeen() {
  try {
    localStorage.setItem(TOUR_KEY, "1");
  } catch {
    /* ignore */
  }
}

const TOUR_STEPS = [
  {
    icon: "🏠",
    title: { en: "Home — your alerts", hi: "होम — आपके अलर्ट", bn: "হোম — আপনার সতর্কতা", mr: "होम — तुमचे इशारे" },
    body: {
      en: "Pest, disease and storm warnings appear here first — each with a 'Why this alert?' explanation and a Share button.",
      hi: "कीट, रोग और तूफ़ान की चेतावनियाँ सबसे पहले यहीं दिखती हैं — हर एक के साथ 'क्यों?' कारण और शेयर बटन।",
      bn: "পোকামাকড়, রোগ ও ঝড়ের সতর্কতা প্রথমে এখানেই আসে — প্রতিটিতে 'কেন?' ব্যাখ্যা ও শেয়ার বাটন থাকে।",
      mr: "कीड, रोग आणि वादळाचे इशारे सगळ्यात आधी इथेच दिसतात — प्रत्येकासोबत 'का?' कारण आणि शेअर बटण.",
    },
  },
  {
    icon: "📅",
    title: { en: "Forecast — 7 days + 24 hours", hi: "पूर्वानुमान — 7 दिन + 24 घंटे", bn: "পূর্বাভাস — ৭ দিন + ২৪ ঘণ্টা", mr: "अंदाज — 7 दिवस + 24 तास" },
    body: {
      en: "Live weather for your field as charts — rain chance, temperature and humidity, from Open-Meteo. Works offline too.",
      hi: "आपके खेत का लाइव मौसम चार्ट में — बारिश की संभावना, तापमान और आर्द्रता। ऑफ़लाइन भी चलता है।",
      bn: "আপনার মাঠের লাইভ আবহাওয়া চার্টে — বৃষ্টির সম্ভাবনা, তাপমাত্রা ও আর্দ্রতা। অফলাইনেও চলে।",
      mr: "तुमच्या शेताचं थेट हवामान चार्टमध्ये — पावसाची शक्यता, तापमान आणि आर्द्रता. ऑफलाइनही चालतं.",
    },
  },
  {
    icon: "💧",
    title: { en: "Irrigation — JalRakshak", hi: "सिंचाई — जलरक्षक", bn: "সেচ — জলরক্ষক", mr: "सिंचन — जलरक्षक" },
    body: {
      en: "Exactly how much water to give today (mm and litres for your field size), based on FAO-56 science — and it skips rainy days.",
      hi: "आज कितना पानी देना है — मिमी और लीटर में, FAO-56 विज्ञान पर आधारित; बारिश के दिन अपने-आप छूट जाते हैं।",
      bn: "আজ কতটা জল দিতে হবে — মিমি ও লিটারে, FAO-56 বিজ্ঞানভিত্তিক; বৃষ্টির দিন নিজে থেকেই বাদ পড়ে।",
      mr: "आज किती पाणी द्यायचे — मिमी आणि लिटरमध्ये, FAO-56 शास्त्रावर आधारित; पावसाळी दिवस आपोआप वगळले जातात.",
    },
  },
  {
    icon: "📈",
    title: { en: "Market — mandi prices", hi: "मार्केट — मंडी भाव", bn: "মার্কেট — মান্ডি দর", mr: "मार्केट — मंडई भाव" },
    body: {
      en: "Today's mandi price, a 14-day trend chart and a clear sell-or-hold tip for your crop.",
      hi: "आज का मंडी भाव, 14 दिन का ट्रेंड चार्ट और साफ़ बेचें-या-रुकें सलाह।",
      bn: "আজকের মান্ডি দর, ১৪ দিনের ট্রেন্ড চার্ট আর বিক্রি-নাকি-অপেক্ষা স্পষ্ট পরামর্শ।",
      mr: "आजचा मंडई भाव, 14 दिवसांचा ट्रेंड चार्ट आणि विक्री-की-थांबायचे स्पष्ट सल्ला.",
    },
  },
  {
    img: MASCOT,
    title: { en: "And me — AgriSaathi!", hi: "और मैं — अग्रिसाथी!", bn: "আর আমি — অগ্রিসাথী!", mr: "आणि मी — अग्रिसाथी!" },
    body: {
      en: "Tap the green button anytime to ask about weather, pests, water or market — type or tap the mic and speak. I work fully offline, in your language. Let's farm smart! 🌾",
      hi: "कभी भी हरे बटन पर टैप करें — मौसम, कीट, पानी या बाज़ार के बारे में पूछें। लिखें या माइक पर बोलें। मैं पूरी तरह ऑफ़लाइन, आपकी भाषा में हूँ। चलिए, स्मार्ट खेती करें! 🌾",
      bn: "যেকোনো সময় সবুজ বাটনে ট্যাপ করুন — আবহাওয়া, পোকা, জল বা বাজার নিয়ে জিজ্ঞেস করুন। লিখুন বা মাইকে বলুন। আমি পুরোপুরি অফলাইনে, আপনার ভাষায়। চলুন, স্মার্ট চাষ করি! 🌾",
      mr: "केव्हाही हिरवं बटण टॅप करा — हवामान, कीड, पाणी किंवा बाजाराबद्दल विचारा. लिहा किंवा माइकवर बोला. मी पूर्णपणे ऑफलाइन, तुमच्या भाषेत आहे. चला, स्मार्ट शेती करूया! 🌾",
    },
  },
];

function CoachTour({ step, onBack, onNext, onSkip, tr }) {
  const s = TOUR_STEPS[step];
  const last = step === TOUR_STEPS.length - 1;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
      onClick={onNext}
    >
      <motion.div
        initial={{ y: 40, scale: 0.96, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6"
      >
        <div className="flex items-center gap-3">
          {s.img ? (
            <img src={s.img} alt="AgriSaathi" className="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-200 shrink-0 bg-emerald-50" />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 grid place-items-center text-3xl shrink-0">
              {s.icon}
            </div>
          )}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">
              {step + 1} / {TOUR_STEPS.length}
            </p>
            <h3 className="text-lg font-extrabold text-stone-800 leading-tight">{tr(s.title)}</h3>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-stone-600">{tr(s.body)}</p>
        <div className="mt-5 flex items-center gap-1.5">
          {TOUR_STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-emerald-500" : "w-1.5 bg-stone-200"}`}
            />
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between gap-2">
          <button onClick={onSkip} className="text-xs font-bold text-stone-400 hover:text-stone-600 px-2 py-2">
            Skip tour
          </button>
          <div className="flex gap-2">
            {step > 0 && (
              <button onClick={onBack} className="rounded-full px-4 py-2.5 text-sm font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 transition">
                Back
              </button>
            )}
            <button
              onClick={onNext}
              className="rounded-full px-6 py-2.5 text-sm font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition shadow-lg shadow-emerald-200"
            >
              {last ? "Got it 🌾" : "Next"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AgriSaathi({ profile, weather, advisories }) {
  const { lang, tr } = useLang();
  const L = saathiStrings(lang);
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [thinking, setThinking] = useState(false);
  const [listening, setListening] = useState(false);
  const [input, setInput] = useState("");
  const [tourStep, setTourStep] = useState(hasSeenTour() ? -1 : 0);
  const [exitPrompt, setExitPrompt] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [feedbackSaved, setFeedbackSaved] = useState(false);
  const recRef = useRef(null);
  const scrollRef = useRef(null);
  const ready = weather && advisories;

  const ctx = useMemo(
    () => (ready ? buildSaathiContext({ profile, weather, advisories, tr, t: tr }) : null),
    [profile, weather, advisories, tr, ready]
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, thinking, open]);

  useEffect(() => () => recRef.current?.abort?.(), []);

  // Profile screen can ask to replay the guided tour.
  useEffect(() => {
    const replay = () => setTourStep(0);
    window.addEventListener("agrishield:replay-tour", replay);
    return () => window.removeEventListener("agrishield:replay-tour", replay);
  }, []);

  function greet() {
    setMsgs([{ role: "saathi", text: L.greeting }]);
  }

  function openPanel() {
    setOpen(true);
    if (!msgs.length) greet();
  }

  function feedbackPayload(rating = selectedRating) {
    const lastUser = [...msgs].reverse().find((m) => m.role === "user")?.text || "";
    const lastSaathi = [...msgs].reverse().find((m) => m.role === "saathi")?.text || "";
    return {
      rating,
      label: FEEDBACK_RATINGS.find((r) => r.score === rating)?.label || "not-rated",
      lang,
      crop: advisories?.crop?.id || profile?.crop || "",
      alertCount: advisories?.alerts?.length || 0,
      messageCount: msgs.length,
      lastUser: lastUser.slice(0, 220),
      lastSaathi: lastSaathi.slice(0, 320),
      createdAt: new Date().toISOString(),
    };
  }

  function submitFeedback(rating = selectedRating, closeAfter = false) {
    saveSaathiFeedback(feedbackPayload(rating));
    setSelectedRating(rating);
    setFeedbackSaved(true);
    if (closeAfter) {
      setTimeout(() => closePanel(), 420);
    }
  }

  function requestClose() {
    setExitPrompt(true);
    setFeedbackSaved(false);
  }

  function closePanel() {
    recRef.current?.abort?.();
    setListening(false);
    setOpen(false);
    setExitPrompt(false);
    setSelectedRating(null);
    setFeedbackSaved(false);
  }

  function ask(topic, userText) {
    if (!ctx) return;
    if (userText) setMsgs((m) => [...m, { role: "user", text: userText }]);
    setThinking(true);
    setTimeout(() => {
      const answer = answerQuestion(topic, ctx, lang);
      setMsgs((m) => [...m, { role: "saathi", text: answer }]);
      setThinking(false);
    }, 650);
  }

  function onChip(topic) {
    if (topic === "help") {
      // Answer AND show the interactive tour.
      ask("help");
      setTourStep(0);
      return;
    }
    ask(topic, L.chips[topic]);
  }

  function onSend() {
    const q = input.trim();
    if (!q) return;
    setInput("");
    ask(routeQuestion(q), q);
  }

  function toggleMic() {
    if (listening) {
      recRef.current?.stop?.();
      setListening(false);
      return;
    }
    const rec = createRecognition(
      lang,
      (said) => {
        setMsgs((m) => [...m, { role: "user", text: said }]);
        setThinking(true);
        setTimeout(() => {
          setMsgs((mm) => [...mm, { role: "saathi", text: answerQuestion(routeQuestion(said), ctx, lang) }]);
          setThinking(false);
        }, 550);
      },
      () => setListening(false),
      () => setListening(false)
    );
    if (!rec) return;
    recRef.current = rec;
    setListening(true);
    try {
      rec.start();
    } catch {
      setListening(false);
    }
  }

  const tourOpen = tourStep >= 0;
  function finishTour() {
    setTourStep(-1);
    markTourSeen();
  }

  const chips = ["weather", "pests", "irrigation", "market", "help"];

  return (
    <>
      {/* Floating action button */}
      {!open && (
        <motion.button
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 260, damping: 18 }}
          onClick={openPanel}
          aria-label={L.open}
          title={L.open}
          className="fixed bottom-5 right-4 sm:right-6 z-[60] inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white font-extrabold shadow-2xl shadow-emerald-600/40 pl-1.5 pr-4 py-1.5 hover:scale-105 active:scale-95 transition"
        >
          <span className="relative">
            <img
              src={MASCOT}
              alt=""
              className="w-11 h-11 rounded-full object-cover ring-2 ring-white/70 bg-emerald-100"
            />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-amber-300 ring-2 ring-emerald-600 animate-pulse" />
          </span>
          <span className="hidden sm:inline text-sm">AgriSaathi</span>
        </motion.button>
      )}

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed bottom-4 right-3 sm:right-6 z-[65] w-[calc(100%-1.5rem)] sm:w-[380px] max-w-[380px] h-[min(70vh,620px)] flex flex-col bg-white rounded-3xl shadow-2xl ring-1 ring-stone-200 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-700 to-green-600 text-white px-4 py-3 flex items-center gap-3 shrink-0">
            <img src={MASCOT} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-white/40 bg-white/10 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-extrabold leading-tight flex items-center gap-1.5">
                  {L.title}
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </p>
                <p className="text-[11px] text-emerald-100 leading-tight">{L.subtitle}</p>
              </div>
              <button
                onClick={requestClose}
                aria-label={L.close}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 grid place-items-center transition"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3 bg-stone-50">
              {msgs.map((m, i) => (
                <div key={i} className={`flex items-end gap-1.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "saathi" && (
                    <img src={MASCOT} alt="" className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-200 shrink-0" />
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-emerald-600 text-white rounded-br-md"
                        : "bg-white text-stone-700 ring-1 ring-stone-200 rounded-bl-md"
                    }`}
                  >
                    {m.text}
                    {m.role === "saathi" && (
                      <div className="mt-1.5 -mb-0.5">
                        <SpeakButton textObj={m.text} className="!px-2 !py-1 text-[10px]" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {thinking && (
                <div className="flex justify-start">
                  <div className="bg-white ring-1 ring-stone-200 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce"
                        style={{ animationDelay: `${d * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              {listening && (
                <div className="flex justify-start">
                  <div className="bg-amber-50 ring-1 ring-amber-200 text-amber-800 rounded-2xl rounded-bl-md px-3.5 py-2 text-xs font-bold flex items-center gap-2">
                    <Mic className="w-3.5 h-3.5 animate-pulse" /> {L.micTip}…
                  </div>
                </div>
              )}
            </div>

            {/* Quick chips */}
            <div className="shrink-0 px-3 pt-2 bg-stone-50">
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {chips.map((c) => (
                  <button
                    key={c}
                    onClick={() => onChip(c)}
                    className="shrink-0 rounded-full bg-white ring-1 ring-emerald-200 text-emerald-700 text-[11px] font-bold px-3 py-1.5 hover:bg-emerald-50 active:scale-95 transition whitespace-nowrap"
                  >
                    {L.chips[c]}
                  </button>
                ))}
              </div>
            </div>

            {/* Input row */}
            <div className="shrink-0 p-3 bg-white border-t border-stone-100 flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSend()}
                placeholder={L.chips.weather}
                className="flex-1 min-w-0 rounded-full bg-stone-100 px-4 py-2.5 text-sm outline-none focus:ring-2 ring-emerald-300"
              />
              {isRecognitionSupported() && (
                <button
                  onClick={toggleMic}
                  title={listening ? L.micStop : L.micTip}
                  className={`w-10 h-10 shrink-0 rounded-full grid place-items-center transition active:scale-95 ${
                    listening ? "bg-red-500 text-white animate-pulse" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                  }`}
                >
                  {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              )}
              <button
                onClick={onSend}
                className="w-10 h-10 shrink-0 rounded-full bg-emerald-600 text-white grid place-items-center hover:bg-emerald-500 active:scale-95 transition"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="shrink-0 bg-emerald-50 px-3 py-1.5 text-center text-[10px] font-semibold text-emerald-700 flex items-center justify-center gap-1">
              <Compass className="w-3 h-3" /> Runs offline · agronomy rules from ICAR / TNAU / FAO-56
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exit feedback prompt */}
      <AnimatePresence>
        {exitPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setExitPrompt(false)}
          >
            <motion.div
              initial={{ y: 28, scale: 0.96, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 28, scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl ring-1 ring-stone-200"
            >
              <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-200">
                <img src={MASCOT} alt="" className="h-11 w-11 rounded-full object-cover" />
              </div>
              <h3 className="text-lg font-extrabold text-stone-900">{tr(FEEDBACK_TEXT.title)}</h3>
              <p className="mx-auto mt-2 max-w-[18rem] text-sm leading-relaxed text-stone-600">
                {tr(FEEDBACK_TEXT.body)}
              </p>

              <p className="mt-4 text-sm font-bold text-stone-800">{tr(FEEDBACK_TEXT.prompt)}</p>
              <div className="mt-3 flex items-center justify-center gap-2">
                {FEEDBACK_RATINGS.map((r) => (
                  <button
                    key={r.score}
                    onClick={() => submitFeedback(r.score, true)}
                    aria-label={`${r.score} / 5`}
                    className={`grid h-11 w-11 place-items-center rounded-full text-2xl transition active:scale-95 ${
                      selectedRating === r.score
                        ? "bg-emerald-100 ring-2 ring-emerald-500"
                        : "bg-stone-50 ring-1 ring-stone-200 hover:bg-emerald-50 hover:ring-emerald-300"
                    }`}
                  >
                    {r.emoji}
                  </button>
                ))}
              </div>

              {feedbackSaved && (
                <p className="mt-3 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  {tr(FEEDBACK_TEXT.saved)}
                </p>
              )}

              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  onClick={() => submitFeedback(selectedRating, true)}
                  className="rounded-xl border border-red-300 px-5 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 active:scale-95"
                >
                  {tr(FEEDBACK_TEXT.confirm)}
                </button>
                <button
                  onClick={() => setExitPrompt(false)}
                  className="rounded-xl border border-stone-200 px-5 py-2.5 text-sm font-bold text-stone-600 transition hover:bg-stone-50 active:scale-95"
                >
                  {tr(FEEDBACK_TEXT.cancel)}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* First-visit coach tour */}
      <AnimatePresence>
        {tourOpen && (
          <CoachTour
            step={tourStep}
            tr={tr}
            onBack={() => setTourStep((s) => Math.max(0, s - 1))}
            onNext={() => (tourStep >= TOUR_STEPS.length - 1 ? finishTour() : setTourStep((s) => s + 1))}
            onSkip={finishTour}
          />
        )}
      </AnimatePresence>
    </>
  );
}
