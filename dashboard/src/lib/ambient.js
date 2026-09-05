// AgriShield 365 — procedural cinematic ambience for the intro story.
//
// No audio files, no downloads: the whole score is synthesized live with the
// Web Audio API, so it weighs 0 bytes, works offline, and loops forever
// without repetition loops. The texture is warm and hand-tuned rather than
// "generically AI":
//   • a tanpura-like drone (root + fifth, slow breathing tremolo)
//   • a pad that slowly glides between three soft chords (D – Bm – A)
//   • occasional pentatonic plucks, like a distant stringed instrument
//   • filtered rain + wind noise that only swells during the storm scenes
//
// Everything is guarded: if the browser blocks audio, the app never notices.

const MUTE_KEY = "agrishield365_story_music";

// Frequencies (Hz) ----------------------------------------------------------
const DRONE = [146.83, 220.0]; // D3 + A3 — a calm open fifth
const CHORDS = [
  [146.83, 185.0, 220.0], // D  : D3  F#3 A3
  [123.47, 146.83, 185.0], // Bm : B2  D3  F#3
  [110.0, 138.59, 164.81], // A  : A2  C#3 E3
];
const PENTATONIC = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33, 659.25]; // D4..E5

const MOODS = {
  calm: { rain: 0.0, pad: 0.055, pluckEvery: [2600, 5200], pluckGain: 0.05, filter: 900 },
  storm: { rain: 0.16, pad: 0.032, pluckEvery: [5000, 9000], pluckGain: 0.028, filter: 600 },
  hope: { rain: 0.0, pad: 0.06, pluckEvery: [2200, 4200], pluckGain: 0.062, filter: 1200 },
};

let ctx = null;
let chordTimer = 0;
let pluckTimer = 0;
let chordIdx = 0;
let mood = "calm";
let nodes = {};

function makeNoiseBuffer(ac) {
  const len = ac.sampleRate * 2;
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

function buildGraph(ac) {
  const out = ac.createGain();
  out.gain.value = 0.9;
  const comp = ac.createDynamicsCompressor();
  comp.threshold.value = -22;
  comp.ratio.value = 6;
  out.connect(comp);
  comp.connect(ac.destination);

  // --- Drone: two soft sines a fifth apart, gently detuned + breathing ---
  const droneGain = ac.createGain();
  droneGain.gain.value = 0.0;
  droneGain.connect(out);
  DRONE.forEach((f, i) => {
    const o = ac.createOscillator();
    o.type = "sine";
    o.frequency.value = f;
    o.detune.value = i === 0 ? -4 : 5;
    const g = ac.createGain();
    g.gain.value = i === 0 ? 0.6 : 0.4;
    o.connect(g);
    g.connect(droneGain);
    o.start();
    // slow shimmer on the fifth
    if (i === 1) {
      const lfo = ac.createOscillator();
      lfo.frequency.value = 0.12;
      const lg = ac.createGain();
      lg.gain.value = 0.18;
      lfo.connect(lg);
      lg.connect(g.gain);
      lfo.start();
    }
  });
  droneGain.gain.setTargetAtTime(0.05, ac.currentTime, 2.5);

  // --- Pad: three triangle voices that glide between chords -------------
  const padFilter = ac.createBiquadFilter();
  padFilter.type = "lowpass";
  padFilter.frequency.value = MOODS.calm.filter;
  padFilter.Q.value = 0.4;
  const padGain = ac.createGain();
  padGain.gain.value = MOODS.calm.pad;
  padFilter.connect(padGain);
  padGain.connect(out);
  const voices = CHORDS[0].map((f, vi) => {
    const o = ac.createOscillator();
    o.type = vi === 2 ? "sawtooth" : "triangle";
    o.frequency.value = f;
    o.detune.value = vi * 5 - 5;
    const g = ac.createGain();
    g.gain.value = vi === 2 ? 0.25 : 0.5;
    o.connect(g);
    g.connect(padFilter);
    o.start();
    return { o, g };
  });
  // slow filter sweep so the pad breathes
  const padLfo = ac.createOscillator();
  padLfo.frequency.value = 0.06;
  const padLfoGain = ac.createGain();
  padLfoGain.gain.value = 220;
  padLfo.connect(padLfoGain);
  padLfoGain.connect(padFilter.frequency);
  padLfo.start();

  // --- Rain + wind: looped noise through filters -------------------------
  const noise = ac.createBufferSource();
  noise.buffer = makeNoiseBuffer(ac);
  noise.loop = true;
  const rain = ac.createBiquadFilter();
  rain.type = "bandpass";
  rain.frequency.value = 2100;
  rain.Q.value = 0.5;
  const rainGain = ac.createGain();
  rainGain.gain.value = 0.0;
  noise.connect(rain);
  rain.connect(rainGain);
  rainGain.connect(out);

  const wind = ac.createBiquadFilter();
  wind.type = "lowpass";
  wind.frequency.value = 380;
  wind.Q.value = 0.6;
  const windGain = ac.createGain();
  windGain.gain.value = 0.0;
  noise.connect(wind);
  wind.connect(windGain);
  windGain.connect(out);
  // gusts
  const gust = ac.createOscillator();
  gust.frequency.value = 0.09;
  const gustGain = ac.createGain();
  gustGain.gain.value = 0.05;
  gust.connect(gustGain);
  gustGain.connect(windGain.gain);
  gust.start();
  noise.start();

  return { out, droneGain, padFilter, padGain, voices, rainGain, windGain };
}

function pluck(ac, out, gainPeak) {
  const f = PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)];
  const o = ac.createOscillator();
  o.type = "triangle";
  o.frequency.value = f;
  const bp = ac.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = f * 2;
  bp.Q.value = 1.2;
  const g = ac.createGain();
  const t = ac.currentTime;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gainPeak, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 2.1);
  o.connect(bp);
  bp.connect(g);
  g.connect(out);
  o.start(t);
  o.stop(t + 2.3);
}

function schedulePluck() {
  clearTimeout(pluckTimer);
  const [lo, hi] = MOODS[mood].pluckEvery;
  pluckTimer = setTimeout(() => {
    if (ctx && ctx.state === "running") {
      try {
        pluck(ctx, nodes.out, MOODS[mood].pluckGain * (0.7 + Math.random() * 0.6));
      } catch {
        /* ignore */
      }
    }
    schedulePluck();
  }, lo + Math.random() * (hi - lo));
}

function scheduleChords() {
  clearInterval(chordTimer);
  chordTimer = setInterval(() => {
    if (!ctx || ctx.state !== "running") return;
    chordIdx = (chordIdx + 1) % CHORDS.length;
    CHORDS[chordIdx].forEach((f, vi) => {
      nodes.voices?.[vi]?.o.frequency.setTargetAtTime(f, ctx.currentTime, 1.8);
    });
  }, 14000);
}

// Public API -----------------------------------------------------------------

export function isAmbientMuted() {
  try {
    return localStorage.getItem(MUTE_KEY) === "off";
  } catch {
    return false;
  }
}

// Call from a user gesture (language-continue tap, first touch on the story).
// Safe to call repeatedly — later calls are no-ops / resume only.
export async function startAmbient(opts = {}) {
  try {
    const wantMuted = opts.muted ?? isAmbientMuted();
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      nodes = buildGraph(ctx);
      scheduleChords();
      schedulePluck();
      applyMood(mood);
    }
    if (ctx.state === "suspended") await ctx.resume();
    nodes.out.gain.setTargetAtTime(wantMuted ? 0.0001 : 0.9, ctx.currentTime, 0.6);
    return true;
  } catch {
    return false;
  }
}

export function setMuted(m) {
  try {
    localStorage.setItem(MUTE_KEY, m ? "off" : "on");
  } catch {
    /* ignore */
  }
  if (ctx && nodes.out) {
    try {
      nodes.out.gain.setTargetAtTime(m ? 0.0001 : 0.9, ctx.currentTime, 0.4);
    } catch {
      /* ignore */
    }
  }
}

export function setMood(m) {
  mood = MOODS[m] ? m : "calm";
  applyMood(mood);
}

function applyMood(m) {
  if (!ctx || !nodes.rainGain) return;
  const cfg = MOODS[m];
  const t = ctx.currentTime;
  try {
    nodes.rainGain.gain.setTargetAtTime(cfg.rain, t, 2.2);
    nodes.windGain?.gain.setTargetAtTime(m === "storm" ? 0.09 : 0.0, t, 2.6);
    nodes.padGain.gain.setTargetAtTime(cfg.pad, t, 2.0);
    nodes.padFilter.frequency.setTargetAtTime(cfg.filter, t, 2.0);
  } catch {
    /* ignore */
  }
}

// Fade out and fully tear down — called when the story ends / is skipped so
// music never leaks into the login or dashboard. A later startAmbient()
// builds a fresh graph (avoids dead oscillators/loops).
export function stopAmbient() {
  clearTimeout(pluckTimer);
  clearInterval(chordTimer);
  if (!ctx) return;
  const oldCtx = ctx;
  const oldNodes = nodes;
  ctx = null;
  nodes = {};
  chordIdx = 0;
  try {
    const t = oldCtx.currentTime;
    oldNodes.out?.gain.setTargetAtTime(0.0001, t, 0.6);
    setTimeout(() => {
      try {
        oldCtx.close();
      } catch {
        /* ignore */
      }
    }, 1400);
  } catch {
    /* ignore */
  }
}
