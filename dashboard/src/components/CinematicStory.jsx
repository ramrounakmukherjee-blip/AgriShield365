import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Sprout, SkipForward, ChevronDown } from "lucide-react";
import { useLang } from "../lib/useLang";
import LanguageSwitcher from "./LanguageSwitcher";

// Per-scene camera + grade metadata. Scroll scrubs the "film": each scene gets
// a vertical crane + push-in move, and scenes cross-dissolve frame to frame
// like one continuous camera flight (technique from lets-scroll-main).
const SCENES = [
  {
    img: "/assets/cin/scene_1.jpg",
    w: 1.15,
    grade: "linear-gradient(180deg, rgba(255,196,96,0.14) 0%, rgba(255,150,60,0.06) 45%, rgba(10,20,10,0.05) 100%)",
    cam: { scale: [1.3, 1.12], y: [3.5, -2], oy: "62%" },
  },
  {
    img: "/assets/cin/scene_2.jpg",
    w: 0.95,
    grade: "linear-gradient(180deg, rgba(255,205,110,0.12) 0%, rgba(120,200,110,0.08) 55%, rgba(10,30,10,0.05) 100%)",
    cam: { scale: [1.24, 1.1], y: [2.5, -1.5], oy: "60%" },
  },
  {
    img: "/assets/cin/scene_3.jpg",
    w: 1.05,
    grade: "linear-gradient(180deg, rgba(180,150,90,0.08) 0%, rgba(60,70,50,0.12) 55%, rgba(15,20,15,0.14) 100%)",
    cam: { scale: [1.16, 1.34], y: [1, -1], oy: "52%", ox: "58%" },
  },
  {
    img: "/assets/cin/scene_4.jpg",
    w: 1.2,
    grade: "linear-gradient(180deg, rgba(16,28,56,0.42) 0%, rgba(10,16,38,0.52) 55%, rgba(6,10,26,0.66) 100%)",
    cam: { scale: [1.14, 1.26], y: [-2.5, 2.5], oy: "50%" },
    rain: true,
  },
  {
    img: "/assets/cin/scene_5.jpg",
    w: 1.05,
    grade: "linear-gradient(180deg, rgba(16,28,56,0.38) 0%, rgba(10,16,38,0.44) 55%, rgba(6,10,26,0.58) 100%)",
    cam: { scale: [1.2, 1.34], y: [2.5, -2.5], oy: "54%", ox: "62%" },
    rain: "slow",
  },
  {
    img: "/assets/cin/scene_6.jpg",
    w: 0.9,
    grade: "linear-gradient(180deg, rgba(255,214,120,0.16) 0%, rgba(150,220,130,0.10) 55%, rgba(10,30,10,0.06) 100%)",
    cam: { scale: [1.32, 1.1], y: [-1.5, 2], oy: "50%", ox: "42%" },
  },
  {
    img: "/assets/cin/scene_7.jpg",
    w: 1.3,
    grade: "linear-gradient(180deg, rgba(255,200,100,0.16) 0%, rgba(255,170,70,0.08) 50%, rgba(10,30,10,0.06) 100%)",
    cam: { scale: [1.12, 1.22], y: [2, 0], oy: "56%" },
  },
];

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const smooth = (x) => {
  x = clamp01(x);
  return x * x * (3 - 2 * x);
};

function FilmScene({ seg, globalProgress, index, total, copy, cta, onEnter, onSkip }) {
  const eased = useTransform(globalProgress, (g) =>
    smooth(clamp01((g - seg.start) / (seg.end - seg.start)))
  );

  // Crossfade: visible across the band, eased through the seams
  const opacity = useTransform(globalProgress, (g) => {
    const fade = 0.055;
    if (g < seg.start) return smooth(clamp01(1 - (seg.start - g) / fade));
    if (g > seg.end) return smooth(clamp01(1 - (g - seg.end) / fade));
    return 1;
  });

  // Scrubbed camera: slow push-in + vertical crane across the band
  const scale = useTransform(eased, [0, 1], seg.cam.scale);
  const y = useTransform(eased, [0, 1], seg.cam.y.map((v) => v + "vh"));

  // Copy timing: first scene greets on landing, last holds for the CTA,
  // middle scenes peak mid-band and fade at both edges
  const copyOpacity = useTransform(globalProgress, (g) => {
    const p = clamp01((g - seg.start) / (seg.end - seg.start));
    if (index === 0) return g > seg.end ? 0 : smooth(1 - p / 0.55);
    if (index === total - 1) return g < seg.start ? 0 : smooth(p / 0.32);
    if (g < seg.start || g > seg.end) return 0;
    return smooth(1 - Math.abs(p - 0.5) / 0.5);
  });
  const copyY = useTransform(globalProgress, (g) => {
    const p = clamp01((g - seg.start) / (seg.end - seg.start));
    return (0.5 - p) * 3 + "vh";
  });

  return (
    <>
      <motion.div className="fixed inset-0 z-10 overflow-hidden" style={{ opacity }}>
        <motion.img
          src={seg.img}
          alt=""
          loading={index < 2 ? "eager" : "lazy"}
          decoding="async"
          className="absolute inset-0 h-full w-full"
          style={{
            objectFit: "cover",
            objectPosition: `${seg.cam.ox || "50%"} ${seg.cam.oy || "50%"}`,
            scale,
            y,
          }}
        />
        {/* Color grade */}
        <div className="absolute inset-0" style={{ background: seg.grade }} />
        {/* Storm rain */}
        {seg.rain && (
          <div className={`cin-rain ${seg.rain === "slow" ? "cin-rain--slow" : ""}`} />
        )}
      </motion.div>

      <motion.div
        className="pointer-events-none fixed inset-0 z-30"
        style={{ opacity: copyOpacity }}
      >
        <motion.div
          style={{ y: copyY }}
          className="absolute inset-x-0 bottom-0 px-6 pb-[clamp(104px,17dvh,160px)]"
        >
          <div className="mx-auto w-full max-w-2xl">
            <p
              className={`text-xs sm:text-sm font-bold uppercase tracking-[0.22em] mb-3 drop-shadow-lg ${
                seg.rain ? "text-amber-300" : "text-emerald-300"
              }`}
            >
              {copy.kicker}
            </p>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] text-white whitespace-pre-line drop-shadow-[0_3px_24px_rgba(0,0,0,0.65)]">
              {copy.title}
            </h2>
            <p className="mt-4 text-sm sm:text-lg leading-relaxed text-white/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] max-w-xl">
              {copy.body}
            </p>

            {index === total - 1 && (
              <div className="pointer-events-auto mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={onEnter}
                  className="animate-float-soft inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 transition px-8 py-4 text-base sm:text-lg font-bold text-white shadow-2xl shadow-emerald-950/50"
                >
                  <Sprout className="w-5 h-5" />
                  {cta.enter}
                </button>
                <button
                  onClick={onSkip}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-black/30 backdrop-blur px-6 py-4 text-sm font-semibold text-white hover:bg-black/45 transition"
                >
                  {cta.already}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

export default function CinematicStory({ onComplete, onSkip }) {
  const { t } = useLang();
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll();

  // Cumulative band bounds (fraction of total scroll) for each scene
  const totalW = SCENES.reduce((a, s) => a + s.w, 0);
  const SEGMENTS = SCENES.reduce((accSegs, s) => {
    const start = accSegs.length ? accSegs[accSegs.length - 1].end : 0;
    accSegs.push({ ...s, start, end: start + s.w / totalW });
    return accSegs;
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (g) => {
    let idx = 0;
    for (let i = 0; i < SEGMENTS.length; i++) if (g >= SEGMENTS[i].start) idx = i;
    setActive((cur) => (cur === idx ? cur : idx));
  });

  const jumpTo = (i) => {
    const max = (trackRef.current?.offsetHeight || 0) - window.innerHeight;
    window.scrollTo({ top: SEGMENTS[i].start * max, behavior: "smooth" });
  };

  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const hintOpacity = useTransform(scrollYProgress, (g) => clamp01(1 - g / 0.04));

  const cta = { enter: t("storyCta.enter"), already: t("storyCta.already") };

  return (
    <>
      {/* Scroll track — the film's length (fixed camera plays over it) */}
      <div ref={trackRef} style={{ height: totalW * 100 + 100 + "dvh" }} />

      <div className="fixed inset-0 bg-black">
        {SEGMENTS.map((seg, i) => (
          <FilmScene
            key={i}
            seg={seg}
            globalProgress={scrollYProgress}
            index={i}
            total={SEGMENTS.length}
            copy={{
              kicker: t(`story.kickers.${i}`),
              title: t(`story.titles.${i}`),
              body: t(`story.bodies.${i}`),
            }}
            cta={cta}
            onEnter={onComplete}
            onSkip={onSkip}
          />
        ))}

        {/* Bottom scrim for copy legibility */}
        <div
          className="fixed inset-x-0 bottom-0 h-[46%] z-20 pointer-events-none"
          style={{
            background:
              "linear-gradient(0deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.35) 45%, transparent 100%)",
          }}
        />
        {/* Vignette */}
        <div
          className="fixed inset-0 z-[34] pointer-events-none"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 42%, transparent 55%, rgba(0,0,0,0.42) 100%)",
          }}
        />

        {/* Light motes in hopeful scenes */}
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

        {/* Film grain */}
        <div className="cin-grain" />

        {/* Letterbox bars */}
        <div className="cin-bar top-0" style={{ height: "6.2dvh" }} />
        <div className="cin-bar bottom-0" style={{ height: "6.2dvh" }} />

        {/* Top UI */}
        <div
          className="fixed top-0 inset-x-0 z-40 flex items-center justify-between gap-2 px-4 py-3"
          style={{ paddingTop: "calc(0.9rem + env(safe-area-inset-top))" }}
        >
          <div className="flex items-center gap-2 text-white/85">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.28em] uppercase">
              {t("story.brand")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher dark />
            <button
              onClick={onSkip}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/40 backdrop-blur px-3.5 py-2 text-xs sm:text-sm font-semibold text-white/90 hover:bg-black/60 transition"
            >
              <SkipForward className="w-4 h-4" />
              {t("storyCta.skip")}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="fixed top-0 inset-x-0 h-[3px] z-50 bg-white/10">
          <motion.div className="h-full origin-left bg-emerald-400" style={{ scaleX: barScale }} />
        </div>

        {/* Route rail */}
        <div className="fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3 sm:gap-4">
          {SEGMENTS.map((s, i) => (
            <button
              key={i}
              aria-label={`Scene ${i + 1}`}
              onClick={() => jumpTo(i)}
              className="group grid place-items-center w-7 h-7"
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  i === active
                    ? "w-2.5 h-2.5 bg-emerald-400 shadow-[0_0_0_5px_rgba(52,211,153,0.22)]"
                    : "w-2 h-2 bg-white/35 group-hover:bg-white/70"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Scroll hint */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="fixed bottom-[calc(1.4rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1.5 text-white/75"
        >
          <span className="text-[10px] uppercase tracking-[0.25em] font-semibold">
            {t("storyCta.scroll")}
          </span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </motion.div>
      </div>
    </>
  );
}
