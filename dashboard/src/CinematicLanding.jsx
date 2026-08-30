import React, { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';

const SCENE_COUNT = 7;
const SCENES = Array.from({ length: SCENE_COUNT }, (_, index) => index);

function SceneFrame({ index, progress }) {
  const prefersReducedMotion = useReducedMotion();
  const step = 1 / (SCENE_COUNT - 1);
  const center = index * step;
  const fadeStart = Math.max(0, center - step * 0.6);
  const fullyVisibleAt = Math.max(0, center - step * 0.4);
  const fadeOutAt = Math.min(1, center + step * 0.4);
  const hiddenAt = Math.min(1, center + step * 0.6);

  let opacityRange;
  let opacityValues;

  if (index === 0) {
    opacityRange = [0, fadeOutAt, hiddenAt];
    opacityValues = [1, 1, 0];
  } else if (index === SCENE_COUNT - 1) {
    opacityRange = [fadeStart, fullyVisibleAt, 1];
    opacityValues = [0, 1, 1];
  } else {
    opacityRange = [fadeStart, fullyVisibleAt, fadeOutAt, hiddenAt];
    opacityValues = [0, 1, 1, 0];
  }

  const opacity = useTransform(progress, opacityRange, opacityValues);
  const scale = useTransform(progress, [fadeStart, hiddenAt], [1, 1.045]);

  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      style={{ opacity, scale: prefersReducedMotion ? 1 : scale }}
    >
      <img
        src={`/assets/scene_${index + 1}.png`}
        alt=""
        className="h-full w-full object-cover"
        draggable="false"
        loading={index === 0 ? 'eager' : 'lazy'}
        fetchPriority={index === 0 ? 'high' : 'auto'}
      />
    </motion.div>
  );
}

export default function CinematicLanding() {
  const sequenceRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sequenceRef,
    offset: ['start start', 'end end'],
  });

  // Keep the opening copy attached to the opening scene instead of letting it
  // linger over later chapters of the story.
  const introOpacity = useTransform(
    scrollYProgress,
    [0, 0.04, 0.11, 0.14],
    [1, 1, 0, 0],
  );
  const introY = useTransform(scrollYProgress, [0.04, 0.14], [0, -28]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.055, 0.09], [1, 1, 0]);

  return (
    <section
      ref={sequenceRef}
      aria-label="The AgriShield 365 story"
      className="relative h-[700vh] w-full bg-black"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {SCENES.map((index) => (
          <SceneFrame key={index} index={index} progress={scrollYProgress} />
        ))}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80"
        />

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <motion.div
            style={{
              opacity: introOpacity,
              y: prefersReducedMotion ? 0 : introY,
            }}
          >
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.25, ease: 'easeOut' }}
              className="rounded-3xl border border-white/10 bg-black/30 p-8 backdrop-blur-sm"
            >
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-white drop-shadow-xl md:text-6xl">
                AgriShield <span className="text-emerald-400">365</span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg font-medium text-slate-200 drop-shadow-md md:text-2xl">
                Early Detection and Management of Crop Diseases and Pest Infestations
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            aria-hidden="true"
            className="absolute bottom-10 flex flex-col items-center"
            style={{ opacity: hintOpacity }}
            animate={prefersReducedMotion ? undefined : { y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <span className="mb-2 text-sm uppercase tracking-widest text-white/60">
              Scroll to explore
            </span>
            <div className="h-12 w-px bg-gradient-to-b from-white/60 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
