# AgriShield 365 — SIH 2026 Presentation Deck (build guide)

**Team:** RAVEN ROOTS · **PS ID:** SIH26131 · **Category:** Software
**PS Title:** Early detection and management of crop diseases and pest infestations
**Theme:** Agriculture, FoodTech & Rural Development
**Live app:** https://agrishield365.web.app · **API:** https://agrishield365-api.onrender.com
**Repo:** github.com/ramrounakmukherjee-blip/AgriShield365

> How to use this file: every slide gives you (a) the exact heading + text to type,
> (b) the diagram — with every box label and how to connect them, (c) the visual/
> screenshot to place, and (d) **speaker notes** — the script to say. Keep slides
> visual: short labels on boxes, sentences stay in your mouth.
> Style: official SIH template (navy title, blue footer bar), **RAVEN ROOTS raven
> logo in the top-left oval on every slide**, SIH bulb stays top-right. Accent
> colours: emerald/green (our brand) + teal/purple/pink bands.

---

## SLIDE 1 — TITLE PAGE

Fill the template blanks exactly:

- **Problem Statement ID —** `SIH26131`
- **Problem Statement Title —** Early detection and management of crop diseases and pest infestations
- **Theme —** Agriculture, FoodTech & Rural Development
- **PS Category —** Software
- **Team ID —** `[FILL FROM SIH PORTAL]`
- **Team Name (Registered on portal) —** RAVEN ROOTS

**Logo:** replace the "Your Team Name" oval (top-left) with the RAVEN ROOTS raven logo image.
**Optional small touch** (bottom-right corner, subtle): `Solution: AgriShield 365 · agrishield365.web.app`

**Speaker notes (≈20 sec):**
> "Good morning/afternoon, everyone. We are RAVEN ROOTS, presenting our solution
> for problem statement SIH26131 — early detection and management of crop diseases
> and pest infestations. Our product is called AgriShield 365 — every farmer, every
> season, protected. It is live today — you can scan a QR code on slide 3 and open
> it on your own phone right now."

---

## SLIDE 2 — PROPOSED SOLUTION

**IDEA TITLE (header):** AgriShield 365 — *Every Farmer, Every Season, Protected*

Use the **GeoGuards 3-column layout** (left = problem, centre = image, right = solution).

**Left column — rounded box "The problem in the field":**
- Pests & diseases are seen **too late** — up to **40% of yield lost** (CICR, Nagpur)
- IMD's **3–5 day forecasts** never reach the farmer in the field
- Advice exists — but **not in his language, not offline, not on his phone**
- Irrigation is guesswork — **~30% of water wasted** (FAO-56)

**Centre visual:** one cinematic story painting (scene 6 — daughter showing the phone)
with the AgriSaathi sprout mascot small in a corner. *This is our thematic anchor image.*

**Right column — box "AgriShield 365 — what the farmer gets":**
- 🐛 **Early pest & disease alerts** — 8 crop-specific threat models run on live weather × crop growth stage (ICAR / TNAU thresholds); every alert shows **"Why this alert?"** + the action to take
- 📷 **Crop Health section** — AI leaf scan (Google Gemini vision: disease, confidence, treatment) **+ offline symptom checker**
- 💧 **JalRakshak smart irrigation** — FAO-56 science → exact **mm & litres** for the field; auto-skips rainy days
- 🌦️ **Disaster & flood warnings**, 7-day forecast · 📈 **mandi sell/hold advice**
- 🤖 **AgriSaathi** — offline voice assistant that answers from the farm's live data + a guided tour for first-time users
- 🌐 English · हिन्दी · বাংলা · मराठी · 📶 **works in airplane mode** · installs as an app

**Bottom strip — "Innovation & uniqueness" (4 small coloured boxes):**
1. **Dual-brain architecture** — phone computes instantly; cloud only enriches; the UI never waits on the network
2. **Offline-first by design** — built for real village connectivity, not city Wi-Fi
3. **Story-first + voice onboarding** — made for low digital literacy; speaks the farmer's language
4. **Zero-cost, live today** — free tiers, keyless weather data — **agrishield365.web.app** (place QR here too)

**Speaker notes (≈75 sec):**
> "Meet a farmer in Nadia or Yavatmal. He works hard all season — and still loses
> the crop to a pest outbreak he noticed three days too late, or a storm the
> forecast predicted but never reached him. AgriShield 365 is his phone becoming
> the adviser the village never had. He picks his language, logs in with an OTP,
> drops a pin on his field — and the app starts warning him: pest and disease
> risk days ahead, with the science behind every alert; exactly how much to
> irrigate in litres; storm and flood warnings; mandi price advice. He can
> photograph a leaf for an AI diagnosis, or ask our assistant AgriSaathi by
> voice — in his own language. And crucially — it works without internet,
> because his field often has none. Four things make us different: the advisory
> brain lives on his phone so nothing ever hangs; it is built offline-first;
> it speaks and guides instead of expecting him to read manuals; and it costs
> nothing to run — it is deployed and live right now."

---

## SLIDE 3 — TECHNICAL APPROACH

Two panels: **left = farmer-journey pipeline (vertical steps)**, **right = tech-stack mind map + screenshots + QR**.

**Left — "How it works" pipeline (GeoGuards Step I→V style, rounded coloured boxes):**

- **Step 1 — Language & story:** pick English/हिन्दी/বাংলা/मराठी → cinematic story onboarding
- **Step 2 — Phone login:** Firebase phone OTP authentication (whitelisted test numbers)
- **Step 3 — Farm setup:** GPS pin / drag on OpenStreetMap; crop, area, soil, irrigation type, sowing date
- **Step 4 — Live weather:** Open-Meteo 7-day + 24-hour forecast for the field's GPS (no API key) — cached for offline
- **Step 5 — Rule engine:** **8 pest/disease models** — temperature × humidity × rain × crop stage matched against **ICAR / TNAU thresholds** → risk score & alert
- **Step 6 — JalRakshak:** FAO-56 formula **ETc = Kc × ET₀** → irrigation plan in mm and litres, rain days auto-skipped
- **Step 7 — Advisory:** alerts with plain-language "Why?" + action; disaster warnings; mandi guidance
- **Step 8 — Delivery:** 🔊 voice read-aloud · WhatsApp share card · AgriSaathi chat & voice questions · PWA offline

**Side branches off the pipeline (dashed lines):**
- 📷 **Google Gemini vision** → leaf-disease scan (cloud; premium tier)
- ☁️ **FastAPI cloud brain (Python, Render)** → mirrors the same rule engine server-side; Firestore persistence
- 🔐 **Firebase** → Auth · Firestore · Hosting

**Outcome branch (GeoGuards-style ovals at the bottom):** DATA → 🟢 **Low risk** / 🟡 **Medium risk** / 🔴 **High risk alert**

**Right top — Tech-stack mind map (DevWise style; central node "AgriShield 365"):**
- **Frontend:** React 19 · Vite · Tailwind CSS · Framer Motion · Leaflet/OpenStreetMap · Recharts · PWA (Workbox)
- **Languages:** JavaScript (JSX) · Python
- **Backend / Cloud:** FastAPI · Uvicorn · Render · Firebase (Auth · Firestore · Hosting)
- **AI / APIs:** Google Gemini vision · Open-Meteo weather · Web Speech API · Web Audio API
- **Agronomy data:** `rules.json` — ICAR/CICR & TNAU pest thresholds; FAO-56 crop coefficients

**Right bottom — "Working prototype" band:** 3 screenshots (alerts screen · JalRakshak litres · AgriSaathi chat)
+ **QR code → "Scan to open the live app"** with the URL printed under it.

**Speaker notes (≈75 sec):**
> "The flow starts with the farmer — language, OTP login, and a pin dropped on his
> actual field. We pull a seven-day and twenty-four-hour forecast for that exact GPS
> location from Open-Meteo — free, no API key. The heart of the system is our rule
> engine: eight pest and disease models per crop check temperature, humidity, rain
> and the crop's growth stage against thresholds we compiled from ICAR, CICR Nagpur
> and TNAU. Irrigation uses the FAO-56 standard — crop coefficient times reference
> evapotranspiration — so we tell him millimetres and litres, and we skip rainy days
> automatically. Everything reaches him by voice, WhatsApp share, or through
> AgriSaathi, our offline assistant. On the cloud side, a FastAPI service runs the
> same engine in Python for persistence and future scale, and Gemini handles leaf
> photos. But notice the key design: the phone computes the full advisory first —
> the cloud never blocks the farmer. The prototype on your screens is the real
> thing — please scan the QR and try it."

---

## SLIDE 4 — FEASIBILITY AND VIABILITY

Use the **WSI 3 stacked colour bands** (teal → purple → pink), each with a light bullet box.

**Band 1 — FEASIBILITY (teal):**
- **Technical:** already built, deployed and tested on real devices — PWA + live cloud API; rule engine is deterministic and testable
- **Financial:** runs entirely on free tiers (Firebase Spark, Render free, keyless Open-Meteo) — **~₹0 cost**; paid SMS is a billing upgrade, not a rebuild
- **Social:** 4 languages + voice read-aloud + voice questions; story-first onboarding for low literacy
- **Scalable:** thresholds live in a JSON rules file — adding crops/districts is **data, not code**

**Band 2 — CHALLENGES & RISKS (purple):**
- Patchy / no internet in villages
- SMS OTP requires a billing-enabled plan (Spark blocks SMS)
- Cloud AI quota, cost & dependence
- Low digital literacy; shared family phones
- Farmers must trust the advice

**Band 3 — STRATEGIES TO OVERCOME (pink):**
- **Offline-first PWA** — the complete advisory works in airplane mode; the cloud only enriches
- Real Firebase phone auth with whitelisted test numbers now; **Blaze upgrade path ready** for live SMS
- Local rule engine + **offline symptom checker never depend on AI**; Gemini scan is the premium tier
- Cinematic story onboarding, AgriSaathi guided tour, voice in 4 languages, large touch targets
- Thresholds grounded in **ICAR / CICR / TNAU / FAO-56**, with a "confirm with your KVK officer" safety net

**Viability footer strip:**
> Deployed today at zero cost → distribute via **KVKs, state agriculture departments and krishi WhatsApp groups** → future revenue from premium AI tier & mandi-data partnerships.

**Speaker notes (≈60 sec):**
> "We treated feasibility as a design requirement, not an afterthought. Technically,
> the system already works — it is deployed and has been tested across devices.
> Financially it runs on free tiers at essentially zero cost, and the one paid
> piece — real SMS — is a single billing upgrade away. The biggest risk is village
> connectivity, which is exactly why the entire advisory works offline; the cloud
> only adds richness. AI costs can never break the experience, because our pest
> logic and symptom checker run locally. Trust comes from grounding every threshold
> in ICAR, TNAU and FAO sources and always pointing the farmer back to their local
> KVK officer. For distribution, we don't need an app store or marketing — it
> installs from a link and spreads through the WhatsApp groups farmers already use."

---

## SLIDE 5 — IMPACT AND BENEFITS

**Top-left — beneficiary matrix (WSI-style 3 coloured columns):**

| 👨‍🌾 Smallholder farmers | 🏥 KVK / extension workers | 🏛️ Government / agri dept |
|---|---|---|
| Protect up to **~40% of yield** from pests/disease (CICR) | One advisory reaches hundreds via WhatsApp share cards | Last-mile advisory at near-zero cost |
| **3–5 day** disaster lead time protects lives & crops | Consistent ICAR/FAO-grounded messaging | Regional pest/disease incidence data |
| **~30% irrigation water/diesel saved** (FAO-56) | Saves repeated field visits | Advances Digital Agriculture mission |
| Mandi sell/hold guidance; works in their language, offline | AI scan as a second opinion tool | Scales to all districts via rules data |

**Bottom — benefit chevron chain (Social → Economic → Environmental):**
- **Social** 🔵 — language + voice access for low-literacy & women farmers; early disaster warnings
- **Economic** 🟣 — yield protected, input costs (water, diesel, excess pesticide) cut, better mandi price
- **Environmental** 🟢 — threshold-based spraying reduces excess chemicals; timed irrigation conserves water & energy

**Big-number banner across the slide:** **40% yield protected · 3–5 day early warning · 30% water saved**

**Roadmap winding road (Tech_Busters style, numbered milestones):**
01 Pilot: paddy, potato, cotton in WB & Vidarbha → 02 More crops/districts via rules data →
03 Real SMS + push alerts (Blaze) → 04 Live Agmarknet mandi feed → 05 All 22 scheduled languages → 06 KVK/agri-dept dashboards

**Speaker notes (≈60 sec):**
> "The impact hits three groups at once. For the farmer, our own research cites up
> to forty percent of cotton yield lost to pests and disease — catching outbreaks
> days earlier protects income directly; FAO-timed irrigation saves about thirty
> percent of water and diesel; and storm warnings give families three to five days
> to prepare. For extension workers, one shared card carries verified guidance to
> hundreds of farmers instantly. For the government, it is a near-zero-cost last-mile
> advisory channel that also generates regional pest data. Socially it is inclusive —
> voice and local language reach farmers who cannot read English apps; economically
> it protects yield and cuts costs; environmentally it means spraying only when
> thresholds are actually crossed. The roadmap is deliberately simple: pilot the
> three crops, scale by editing a rules file, switch on real SMS, wire live mandi
> prices, add languages."

---

## SLIDE 6 — RESEARCH AND REFERENCES

Three organised link blocks (DevWise/Innovators style):

**Block 1 — Agronomy research & thresholds (the science behind the engine):**
- ICAR – **Central Institute for Cotton Research (CICR), Nagpur** — pest loss estimates & cotton IPM
- **TNAU Agritech Portal** — weather trigger conditions for crop diseases & pests
- **FAO Irrigation & Drainage Paper 56 (FAO-56)** — crop coefficients (Kc) for irrigation
- **India Meteorological Department (IMD)** Agromet advisories — 3–5 day warning lead time
- **Agmarknet** — mandi price data

**Block 2 — Technology & data sources:**
- Open-Meteo weather API — https://open-meteo.com
- Firebase (Auth / Firestore / Hosting), FastAPI & Render, Google Gemini API — official docs

**Block 3 — Live prototype & code (QR of the app here too):**
- 📱 **Live app:** https://agrishield365.web.app
- ☁️ **API health:** https://agrishield365-api.onrender.com/health
- 💻 **Source code:** https://github.com/ramrounakmukherjee-blip/AgriShield365

*Footnote:* Our pest-threshold matrix (`rules.js` / `rules.json`) and FAO-56 irrigation coefficients were compiled from the sources above.

**Closing line (centre or bottom, large):**
> **AgriShield 365 — Every farmer, every season, protected.** 🌾

**Speaker notes (≈30 sec):**
> "Every number and threshold in this presentation traces to a verifiable source —
> ICAR's cotton institute, TNAU's agritech portal, the FAO irrigation standard, the
> meteorological department. And unlike a concept, you can hold it in your hand
> right now: the app, the API and the source code are all linked here. Thank you —
> we are RAVEN ROOTS, and we would love your questions."

---

# 📸 Screenshot shot-list (capture from the live app, Incognito, mobile width F12)

1. Cinematic story — scene 6 (daughter + phone) or any scene with rain FX
2. OTP login screen (shows the demo-code note)
3. Onboarding map with the farm pin on OpenStreetMap
4. **Home alerts** — a pest/disease alert expanded with **"Why this alert?"** open
5. **JalRakshak** — the mm + litres irrigation plan card
6. Forecast screen (7-day chart)
7. **AgriSaathi** — sprout chat panel open with an answer + chips visible
8. Crop Health section (AI scan card + symptom checker)
9. (If mandi data is live) Market screen with real price

# 📱 QR code

Generate a QR for `https://agrishield365.web.app` (any free QR maker; download PNG),
place on slides 2, 3 and 6 with caption **"Scan to try the live app"**.

# ✅ Demo-day checklist

- [ ] 10 min before: open https://agrishield365-api.onrender.com/health (wakes the cloud)
- [ ] Phone: pre-installed PWA + logged in; also know **Sign out → 123456** for a fresh demo
- [ ] Keep the **2–3 min golden-path demo video** ready as backup (story → OTP → map → alerts → AgriSaathi)
- [ ] Mobile hotspot ready in case venue Wi-Fi blocks anything
- [ ] Practice the 6 speaker-note scripts aloud once; assign one slide per teammate
