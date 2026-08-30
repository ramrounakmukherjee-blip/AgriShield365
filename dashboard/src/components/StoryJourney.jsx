import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, ChevronUp, Sprout, SkipForward } from "lucide-react";
import { useLang } from "../lib/useLang";
import LanguageSwitcher from "./LanguageSwitcher";

// Image/tone metadata for the seven story scenes. Copy lives in lib/i18n.js.
const SCENES = [
  { image: "/assets/scene_1.png", tone: "light" },
  { image: "/assets/scene_2.png", tone: "light" },
  { image: "/assets/scene_3.png", tone: "light" },
  { image: "/assets/scene_4.png", tone: "dark" },
  { image: "/assets/scene_5.png", tone: "dark" },
  { image: "/assets/scene_6.png", tone: "light" },
  { image: "/assets/scene_7.png", tone: "light", cta: true },
];

function Scene({ scene, index, total, onEnter, onFinish }) {
  const { t } = useLang();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1.02, 1.1]);
  const y = useTransform(scrollYProgress, [0, 1], [20, -20]);

  const isLast = index === total - 1;
  const dark = scene.tone === "dark";
  const kickerColor = dark ? "text-amber-300" : "text-emerald-300";

  return (
    <section
      ref={ref}
      className="relative h-[100dvh] w-full snap-start snap-always overflow-hidden"
    >
      <motion.div style={{ scale, y }} className="absolute inset-0">
        <img
          src={scene.image}
          alt=""
          className="h-full w-full object-cover"
          loading={index < 2 ? "eager" : "lazy"}
        />
      </motion.div>

      <div
        className={`absolute inset-0 bg-gradient-to-t ${
          dark
            ? "from-black/90 via-black/40 to-black/30"
            : "from-black/85 via-black/35 to-black/25"
        }`}
      />

      {index === 0 && (
        <div className="absolute top-0 inset-x-0 flex items-center justify-center gap-2 pt-6 px-4">
          <Sprout className="w-4 h-4 text-emerald-300" />
          <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-white/80">
            {t("story.brand")}
          </span>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 px-6 pb-24 sm:pb-28">
        <div className="mx-auto w-full max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className={`text-xs sm:text-sm font-bold uppercase tracking-[0.2em] ${kickerColor} mb-3`}
          >
            {t(`story.kickers.${index}`)}
          </motion.p>

          <motion.h2
            key={"title-" + index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-white whitespace-pre-line drop-shadow-lg"
          >
            {t(`story.titles.${index}`)}
          </motion.h2>

          <motion.p
            key={"body-" + index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-4 text-sm sm:text-lg text-white/90 leading-relaxed drop-shadow"
          >
            {t(`story.bodies.${index}`)}
          </motion.p>

          {scene.cta && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, delay: 0.55 }}
              className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              <button
                onClick={onFinish}
                className="animate-float-soft inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 transition px-8 py-4 text-base sm:text-lg font-bold text-white shadow-xl shadow-emerald-900/40"
              >
                <Sprout className="w-5 h-5" />
                {t("storyCta.enter")}
              </button>
              <button
                onClick={onEnter}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur px-6 py-4 text-sm font-semibold text-white hover:bg-white/20 transition"
              >
                {t("storyCta.already")}
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {!isLast && (
        <div className="absolute bottom-6 right-5 flex flex-col items-center gap-1 text-white/70">
          <span className="text-[10px] uppercase tracking-widest">{t("storyCta.scroll")}</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>
      )}
    </section>
  );
}

export default function StoryJourney({ onComplete, onSkip }) {
  const { t } = useLang();
  const containerRef = useRef(null);
  const [active, setActive] = useState(0);

  const goToScene = useCallback((index) => {
    const el = containerRef.current;
    if (!el) return;
    const target = el.children[index];
    if (target) target.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observers = [];
    Array.from(el.children).forEach((child, i) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(i);
        },
        { threshold: 0.55 }
      );
      obs.observe(child);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="relative h-[100dvh] w-full bg-black">
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
        <LanguageSwitcher dark />
        <button
          onClick={onSkip}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/40 backdrop-blur px-4 py-2 text-xs sm:text-sm font-semibold text-white/90 hover:bg-black/60 transition"
        >
          <SkipForward className="w-4 h-4" />
          {t("storyCta.skip")} · {t("storyCta.login")}
        </button>
      </div>

      <div ref={containerRef} className="no-scrollbar h-full w-full overflow-y-scroll snap-y snap-mandatory">
        {SCENES.map((scene, i) => (
          <Scene
            key={i}
            scene={scene}
            index={i}
            total={SCENES.length}
            onEnter={onSkip}
            onFinish={onComplete}
          />
        ))}
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {SCENES.map((_, i) => (
          <button
            key={i}
            aria-label={`Scene ${i + 1}`}
            onClick={() => goToScene(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === active ? "w-7 bg-emerald-400" : "w-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {active > 0 && (
        <button
          onClick={() => goToScene(0)}
          className="absolute bottom-6 left-5 z-20 hidden sm:inline-flex items-center gap-1 text-white/60 hover:text-white text-xs transition"
        >
          <ChevronUp className="w-4 h-4" /> {t("storyCta.replay")}
        </button>
      )}
    </div>
  );
}
