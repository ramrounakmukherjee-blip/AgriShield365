import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, SkipForward, ChevronLeft, ChevronRight } from "lucide-react";
import { useLang } from "../lib/useLang";
import LanguageSwitcher from "./LanguageSwitcher";

// Cinematic intro — a soft FOCUS-PULL (blur cross-dissolve) between scenes.
// Each painting drifts with a slow Ken Burns push while the next scene eases
// in from a gentle blur, like a rack-focus in film. Auto-plays with a
// per-scene progress bar; arrows, dots, keyboard and tap-zones let the user
// move manually. Same artwork, atmosphere FX, letterbox bars and story copy
// in all 4 languages.
const SCENES = [
  {
    img: "/assets/cin/scene_1.jpg",
    grade: "linear-gradient(180deg, rgba(255,196,96,0.14) 0%, rgba(255,150,60,0.06) 45%, rgba(10,20,10,0.05) 100%)",
    cam: { fy: "26%" },
    sun: true,
  },
  {
    img: "/assets/cin/scene_2.jpg",
    grade: "linear-gradient(180deg, rgba(255,205,110,0.12) 0%, rgba(120,200,110,0.08) 55%, rgba(10,30,10,0.05) 100%)",
    cam: { fy: "34%" },
    sun: true,
  },
  {
    img: "/assets/cin/scene_3.jpg",
    grade: "linear-gradient(180deg, rgba(180,150,90,0.08) 0%, rgba(60,70,50,0.12) 55%, rgba(15,20,15,0.14) 100%)",
    cam: { fy: "32%" },
  },
  {
    img: "/assets/cin/scene_4.jpg",
    grade: "linear-gradient(180deg, rgba(16,28,56,0.42) 0%, rgba(10,16,38,0.52) 55%, rgba(6,10,26,0.66) 100%)",
    cam: { fy: "30%" },
    rain: true,
    fog: true,
    flash: "hard",
  },
  {
    img: "/assets/cin/scene_5.jpg",
    grade: "linear-gradient(180deg, rgba(16,28,56,0.38) 0%, rgba(10,16,38,0.44) 55%, rgba(6,10,26,0.58) 100%)",
    cam: { fy: "34%" },
    rain: "slow",
    fog: true,
    flash: "soft",
  },
  {
    img: "/assets/cin/scene_6.jpg",
    grade: "linear-gradient(180deg, rgba(255,214,120,0.16) 0%, rgba(150,220,130,0.10) 55%, rgba(10,30,10,0.06) 100%)",
    cam: { fy: "18%" },
    phoneGlow: true,
  },
  {
    img: "/assets/cin/scene_7.jpg",
    grade: "linear-gradient(180deg, rgba(255,200,100,0.16) 0%, rgba(255,170,70,0.08) 50%, rgba(10,30,10,0.06) 100%)",
    cam: { fy: "24%" },
    sun: true,
  },
];

const SCENE_MS = 8000;

// Smooth rack-focus: ease in from a soft blur + slight scale, settle sharp,
// blur out gently. A long, even curve keeps every cut buttery.
const FOCUS = {
  initial: { opacity: 0, scale: 1.06, filter: "blur(16px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 1.05, filter: "blur(16px)" },
  transition: { duration: 1.15, ease: [0.45, 0, 0.2, 1] },
};

export default function CinematicStory({ onComplete, onSkip }) {
  const { t } = useLang();
  const [idx, setIdx] = useState(0);
  const total = SCENES.length;
  const last = idx === total - 1;

  const go = useCallback(
    (n) => setIdx((i) => Math.max(0, Math.min(total - 1, typeof n === "function" ? n(i) : n))),
    [total]
  );
  const next = useCallback(() => setIdx((i) => (i < total - 1 ? i + 1 : i)), [total]);
  const prev = useCallback(() => setIdx((i) => (i > 0 ? i - 1 : i)), []);

  // Auto-advance (final scene holds for the CTA).
  useEffect(() => {
    if (last) return;
    const id = setTimeout(() => setIdx((i) => Math.min(total - 1, i + 1)), SCENE_MS);
    return () => clearTimeout(id);
  }, [idx, last, total]);

  // Preload every painting up-front so crossfades never flash blank.
  useEffect(() => {
    SCENES.forEach((s) => {
      const img = new Image();
      img.src = s.img;
    });
  }, []);

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const seg = SCENES[idx];
  const copy = {
    kicker: t(`story.kickers.${idx}`),
    title: t(`story.titles.${idx}`),
    body: t(`story.bodies.${idx}`),
  };
  const titleLines = copy.title.split("\n");
  const kenFromLeft = idx % 2 === 0;

  return (
    <div className="fixed inset-0 bg-black overflow-hidden select-none">
      {/* ---- Scene image + atmosphere (focus-pull crossfade) ---- */}
      <AnimatePresence mode="sync">
        <motion.div
          key={idx}
          initial={FOCUS.initial}
          animate={FOCUS.animate}
          exit={FOCUS.exit}
          transition={FOCUS.transition}
          className="absolute inset-0 overflow-hidden will-change-transform"
        >
          <motion.img
            src={seg.img}
            alt=""
            initial={
              kenFromLeft
                ? { scale: 1.04, x: "-1.2%", y: "0.5%" }
                : { scale: 1.06, x: "1.2%", y: "-0.5%" }
            }
            animate={{ scale: 1.15, x: "0%", y: "0%" }}
            transition={{ duration: SCENE_MS / 1000 + 2, ease: "linear" }}
            className="cin-img absolute inset-0 h-full w-full"
            style={{ "--fx": seg.cam?.fx || "50%", "--fy": seg.cam?.fy || "50%" }}
          />
          <div className="absolute inset-0" style={{ background: seg.grade }} />
          {seg.sun && <div className="cin-sun" />}
          {seg.rain && <div className={`cin-rain ${seg.rain === "slow" ? "cin-rain--slow" : ""}`} />}
          {seg.fog && <div className="cin-fog" />}
          {seg.flash && (
            <div className={`cin-flash ${seg.flash === "soft" ? "cin-flash--soft" : "cin-flash--hard"}`} />
          )}
          {seg.phoneGlow && <div className="cin-phoneglow" />}
        </motion.div>
      </AnimatePresence>

      {/* Bottom scrim + vignette */}
      <div
        className="fixed inset-x-0 bottom-0 h-[62%] z-20 pointer-events-none"
        style={{
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 38%, rgba(0,0,0,0.12) 70%, transparent 100%)",
        }}
      />
      <div
        className="fixed inset-0 z-[34] pointer-events-none"
        style={{
          background: "radial-gradient(120% 90% at 50% 42%, transparent 55%, rgba(0,0,0,0.42) 100%)",
        }}
      />

      {/* Light motes + grain */}
      <div className="cin-motes">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="cin-mote"
            style={{
              left: `${(i * 37) % 100}%`,
              width: `${3 + (i % 3) * 2}px`,
              height: `${3 + (i % 3) * 2}px`,
              animationDuration: `${11 + (i % 7) * 3}s`,
              animationDelay: `${-(i * 1.7)}s`,
            }}
          />
        ))}
      </div>
      <div className="cin-grain" />

      {/* Letterbox bars sweep open */}
      <motion.div
        className="cin-bar top-0"
        initial={{ height: "50dvh" }}
        animate={{ height: "6.2dvh" }}
        transition={{ duration: 1.4, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="cin-bar bottom-0"
        initial={{ height: "50dvh" }}
        animate={{ height: "6.2dvh" }}
        transition={{ duration: 1.4, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* ---- Copy (fade + rise per scene) ---- */}
      <div className="fixed inset-0 z-30 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={"copy-" + idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -22 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="absolute inset-x-0 bottom-0 px-6 pb-[clamp(104px,15dvh,150px)]"
          >
            <div className="mx-auto w-full max-w-2xl">
              <p
                className={`cin-copy-kicker text-xs sm:text-sm font-bold uppercase tracking-[0.22em] mb-3 ${
                  seg.rain ? "text-amber-300" : "text-emerald-300"
                }`}
              >
                {copy.kicker}
              </p>
              <h2 className="cin-copy-title cin-title-serif text-3xl sm:text-5xl lg:text-[4.2rem] leading-[1.16] text-white">
                {titleLines.map((line, li) => (
                  <span key={li} className="cin-reveal">
                    <motion.span
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      transition={{ duration: 0.7, delay: 0.5 + li * 0.14, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {line}
                    </motion.span>
                  </span>
                ))}
              </h2>
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.55 + titleLines.length * 0.14 }}
                className="cin-copy-body mt-4 text-sm sm:text-lg leading-relaxed text-white/95 max-w-xl"
              >
                {copy.body}
              </motion.p>

              {last && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.95 }}
                  className="pointer-events-auto mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                >
                  <button
                    onClick={onComplete}
                    className="cin-cta-shine animate-float-soft inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 transition px-8 py-4 text-base sm:text-lg font-bold text-white shadow-2xl shadow-emerald-950/50"
                  >
                    <Sprout className="w-5 h-5" />
                    {t("storyCta.enter")}
                  </button>
                  <button
                    onClick={onSkip}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-black/30 backdrop-blur px-6 py-4 text-sm font-semibold text-white hover:bg-black/45 transition"
                  >
                    {t("storyCta.already")}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ---- Top UI ---- */}
      <div
        className="fixed top-0 inset-x-0 z-40 flex items-center justify-between gap-2 px-4 py-2.5"
        style={{ paddingTop: "calc(0.7rem + env(safe-area-inset-top))" }}
      >
        <motion.div
          className="flex items-center gap-2.5"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <img
            src="/assets/logo-agrishield365.jpg"
            alt="AgriShield 365"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover ring-1 ring-white/25 shadow-lg"
          />
          <span className="text-[11px] sm:text-sm font-extrabold tracking-[0.16em] uppercase text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
            {t("story.brand")}
          </span>
        </motion.div>
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <LanguageSwitcher dark />
          <button
            onClick={onSkip}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/40 backdrop-blur px-3.5 py-2 text-xs sm:text-sm font-semibold text-white/90 hover:bg-black/60 transition"
          >
            <SkipForward className="w-4 h-4" />
            {t("storyCta.skip")}
          </button>
        </motion.div>
      </div>

      {/* Per-scene progress segments */}
      <div className="fixed top-0 inset-x-0 z-50 flex gap-1.5 px-4 pt-[calc(0.65rem+env(safe-area-inset-top))]">
        {SCENES.map((_, i) => (
          <button
            key={i}
            aria-label={`Scene ${i + 1}`}
            onClick={() => go(i)}
            className="h-[3px] flex-1 rounded-full bg-white/20 overflow-hidden"
          >
            {i < idx && <span className="block h-full w-full bg-emerald-400" />}
            {i === idx && (
              <motion.span
                key={idx}
                className="block h-full bg-emerald-400"
                initial={{ scaleX: last ? 1 : 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: last ? 0.4 : SCENE_MS / 1000, ease: "linear" }}
                style={{ transformOrigin: "left" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        aria-label="Previous"
        disabled={idx === 0}
        className="hidden sm:grid fixed left-4 top-1/2 -translate-y-1/2 z-40 w-11 h-11 place-items-center rounded-full bg-black/35 backdrop-blur text-white/90 hover:bg-black/60 transition disabled:opacity-0"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        aria-label="Next"
        disabled={last}
        className="hidden sm:grid fixed right-4 top-1/2 -translate-y-1/2 z-40 w-11 h-11 place-items-center rounded-full bg-black/35 backdrop-blur text-white/90 hover:bg-black/60 transition disabled:opacity-0"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Bottom dots */}
      <div className="fixed bottom-[calc(1.3rem+env(safe-area-inset-bottom))] inset-x-0 z-40 flex justify-center gap-2.5">
        {SCENES.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to scene ${i + 1}`}
            onClick={() => go(i)}
            className={`block rounded-full transition-all duration-300 ${
              i === idx ? "w-7 h-2 bg-emerald-400" : "w-2 h-2 bg-white/40 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      {/* Tap zones (mobile) — below copy/CTA layer so buttons always win */}
      <button aria-label="Previous" onClick={prev} disabled={idx === 0} className="md:hidden fixed left-0 top-0 h-full w-1/3 z-20" />
      <button aria-label="Next" onClick={next} disabled={last} className="md:hidden fixed right-0 top-0 h-full w-1/3 z-20" />
    </div>
  );
}
