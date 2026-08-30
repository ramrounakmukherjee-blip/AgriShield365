import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function CinematicLanding() {
  const { scrollYProgress } = useScroll();

  // We have 7 scenes, so each gets a segment of the scroll.
  // 0 -> 1/7, 1/7 -> 2/7, etc.
  const numScenes = 7;
  const scenes = Array.from({ length: numScenes }, (_, i) => i);

  return (
    <div className="relative w-full h-[700vh] bg-black">
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* Render each scene, crossfading based on scrollYProgress */}
        {scenes.map((index) => {
          const start = Math.max(0, (index - 0.5) / numScenes);
          const end = (index + 0.5) / numScenes;
          
          // Crossfade opacity
          const opacity = useTransform(
            scrollYProgress,
            [start, index / numScenes, end],
            [0, 1, 0]
          );

          // Subtle zoom-in scale effect for each scene
          const scale = useTransform(
            scrollYProgress,
            [start, end],
            [1, 1.1]
          );

          return (
            <motion.div
              key={index}
              style={{ opacity, scale }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={`/assets/scene_${index + 1}.png`}
                alt={`Scene ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          );
        })}

        {/* Global overlays like vignette for cinematic effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80" />

        {/* Text Overlay overlaying the cinematic scenes */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="backdrop-blur-sm bg-black/30 p-8 rounded-3xl border border-white/10"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4 drop-shadow-xl">
              AgriShield <span className="text-emerald-400">365</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-200 max-w-2xl mx-auto font-medium drop-shadow-md">
              Early Detection and Management of Crop Diseases and Pest Infestations
            </p>
          </motion.div>
          
          <motion.div 
            className="absolute bottom-10 flex flex-col items-center"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <span className="text-white/60 uppercase tracking-widest text-sm mb-2">Scroll to explore</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
