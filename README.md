<div align="center">

# 🛡️ AgriShield 365 🌾

### *Every farmer, every season, protected.*

**Early pest & insect warnings, smart irrigation, disaster alerts and weather–market advisories — in the farmer's own language, on their phone, 365 days a year.**

**🔗 Live app: [agrishield365.web.app](https://agrishield365.web.app)**
&nbsp;&nbsp;·&nbsp;&nbsp;**☁️ Cloud API: [agrishield365-api.onrender.com/health](https://agrishield365-api.onrender.com/health)**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore%20%2B%20Hosting-FFCA28?logo=firebase&logoColor=black)
![PWA](https://img.shields.io/badge/Installable-PWA-5A0FC8?logo=pwa&logoColor=white)
![Languages](https://img.shields.io/badge/Languages-EN%20%7C%20हिं%20%7C%20বাং%20%7C%20म-E91E63)
![License](https://img.shields.io/badge/license-MIT-green)

</div>

---

## 🌱 The problem

Every season, Indian farmers lose standing crops to threats they see **too late**:

- 🐛 **Pest & insect outbreaks** — bollworms on cotton, stem borers on paddy, aphids on potato — can wipe out up to **40% of yield** (CICR, Nagpur).
- 🌊 **Sudden storms, floods and unseasonal rain** arrive with no warning on the ground, while the India Meteorological Department's 3–5 day forecasts never reach the farmer who needs them.
- 💧 **Irrigation is guesswork** — over-watering wastes up to **30% of water** (FAO-56) and raises disease risk; under-watering stresses the crop.
- 📉 **Mandis, weather data and advice exist — but not in the farmer's language, not at the right time, and not on a ₹8,000 phone.**

AgriShield 365 closes that gap. It is built around the **Smart India Hackathon 2026 (Govt. of Maharashtra, Agriculture) problem statement: early detection of pests and insects**, with irrigation, disaster and market intelligence woven around it.

## ✨ What it does

The app **tells a story first, then becomes a tool** — a seven-scene cinematic journey (a farmer losing a crop to pests and flood → his daughter showing him a phone that warned of it *before it happened*), then full advisory tooling:

| Feature | Detail |
| --- | --- |
| 🐛 **Pest & insect risk engine** | 8 rule-based threat models per crop (bollworm, whitefly, stem borer, aphid, blast, blight…) driven by live temperature, humidity, rain and growth stage — with a plain-language **"Why this alert?"** explanation for every warning |
| 📷 **AI leaf scan** | Photo a leaf → Google Gemini vision identifies disease/pests with confidence, treatment & prevention. *(Premium tier in demo build; offline symptom checker always available.)* |
| 💧 **JalRakshak smart irrigation** | FAO-56 crop-coefficient (Kc) water budgeting → exact mm needed, litres per acre, and a 7-day irrigation plan that skips rain days, with best-time-of-day advice |
| 🌦️ **7-day + 24-hour forecast** | Live Open-Meteo data (no API key), offline-cached with deterministic fallback — works in airplane mode |
| ⚠️ **Disaster & flood warnings** | Heavy-rain, flood and storm risk surfaced at the top of the dashboard before the event |
| 📈 **Mandi market prices** | Crop price, 14-day trend chart and sell/hold advice for the farmer's district |
| 🗣️ **Voice read-aloud** | Every advisory speaks aloud in **English & हिन्दी** via the device's own speech engine (বাংলা/मराठी queued next) |
| 📲 **Share advisory** | One-tap share card (WhatsApp-ready) so one connected farmer can warn the whole village |
| 📍 **Farm on a map** | Tap/drag pin or GPS, OpenStreetMap keyless tiles — zero-cost mapping |
| 🔒 **Phone OTP login** | Real Firebase phone authentication (whitelisted test numbers); demo code `123456` |
| 📶 **Offline-first PWA** | Installs to the home screen; the advisory brain runs **in the browser** — cloud never blocks the UI |
| 🌐 **4 languages, end to end** | English · हिन्दी · বাংলা · मराठी — story, alerts, advice, buttons, all of it |

## 🌾 Locked crops & regions (SIH scope)

| Crop | Regions |
| --- | --- |
| 🌾 **Aman Paddy** | Nadia, Burdwan, Hooghly (West Bengal) |
| 🥔 **Potato** | Hooghly, Bankura (West Bengal) |
| 🏵️ **Cotton** | Nagpur, Yavatmal, Amravati, Washim — Vidarbha (Maharashtra) |

## 🏗️ Architecture — two brains, never blocking

```
 Farmer's phone (PWA, installed)                 Cloud
 ┌───────────────────────────────┐        ┌──────────────────────────────┐
 │ Cinematic story → OTP →       │        │ FastAPI on Render (free)     │
 │ onboarding map → 5-tab        │        │                              │
 │ dashboard                     │        │  POST /get-advisory          │
 │                               │  ───▶  │   (same rule engine, Python) │
 │ 🧠 LOCAL BRAIN (instant):     │        │  POST /scan  → Gemini vision │
 │ rules.js · weather cache ·    │  ◀───  │  GET  /health · /scan/health │
 │ Kc irrigation · offline diag  │        │ Open-Meteo (weather)         │
 │ ── works in airplane mode ──  │        └──────────────────────────────┘
 └──────────────┬────────────────┘
                │ Firebase (Google)
                ├─ Auth ........ phone OTP (test whitelist + demo 123456)
                ├─ Firestore ... farms/p<phone>, advisory history
                └─ Hosting ..... agrishield365.web.app (PWA, service worker)
```

**Design principle:** the browser computes the full advisory locally first and renders instantly; the Render cloud re-processes in the background and enriches the result. If the network, API or SMS is unavailable, **nothing the farmer needs breaks**.

## 🧑‍💻 Tech stack

**Frontend** — React 19 · Vite (rolldown) · Tailwind CSS 4 · Framer Motion · react-leaflet (OpenStreetMap) · Recharts · lucide-react · Web Speech API · vite-plugin-pwa (Workbox) · Firebase Web SDK v12

**Backend** — FastAPI · Uvicorn · Pydantic · firebase-admin · requests · [Google Gemini](https://ai.google.dev/) vision · deployed on Render

**Data** — [Open-Meteo](https://open-meteo.com/) (keyless weather) · thresholds grounded in ICAR, TNAU Agritech Portal, CICR Nagpur & FAO-56 Paper 56 (crop coefficients)

## 📂 Repository structure

| Path | What it is |
| --- | --- |
| `dashboard/` | The AgriShield 365 web app — React PWA (main project) |
| `dashboard/src/components/` | Story, language picker, login, onboarding map |
| `dashboard/src/components/app/` | 5-tab dashboard: Home (alerts), Irrigation (JalRakshak), Forecast, Market, Profile + scan & symptom modals |
| `dashboard/src/lib/` | `rules.js` (threat engine), `api.js` (weather/market/sync), `firebase.js`, `i18n.js` (4 languages), voice, geocoding |
| `backend/` | FastAPI cloud brain: `rules_engine.py`, `weather_api.py`, `gemini_scan.py`, `firestore_db.py`, `data/rules.json`; deploys on Render via `render.yaml` |
| `assests-agrishield365/` | SIH problem-statement PDFs and project logo assets |
| `firebase.json`, `firestore.rules` | Hosting + Firestore security rules |

## 🚀 Run it locally

**Frontend**

```bash
cd dashboard
npm install
npm run dev       # dev server
npm run build     # production build (stamps build SHA)
npm run preview   # preview the build
```

**Backend (optional — the app runs fully without it)**

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend environment variables: `GEMINI_API_KEY` (leaf scan), `FIREBASE_CREDENTIALS` (Firestore persistence; without it the API degrades gracefully).

## 📱 Try the deployed app

1. Open **[agrishield365.web.app](https://agrishield365.web.app)**
2. Watch the story (7 scenes, ~1 min) → pick your language
3. Enter any mobile number → OTP screen: use demo code **`123456`**
4. Drop your farm pin on the map (or use GPS) → pick crop, area, soil, irrigation
5. The dashboard lights up with pest alerts, irrigation plan, forecasts & mandi prices
6. Tip: install it (browser menu → *Add to Home screen*), then switch on airplane mode — it still works.

---

<div align="center">

Built for **Smart India Hackathon 2026** — problem statement: *Early detection and advisory for pests and insects in agriculture, Government of Maharashtra.*

*Built for the farmer who waits for the rain, watches the sky, and deserves to know first.* 🛡️🌾

</div>
