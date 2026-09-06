# AgriShield 365 — Detailed Project Report

### *Every Farmer, Every Season, Protected.*

**Early detection and management of crop diseases and pest infestations — plus smart irrigation, disaster early-warning, and weather–market advisories, in the farmer's own language, on the phone he already owns.**

| | |
|---|---|
| **Team** | RAVEN ROOTS 🐦‍⬛ |
| **Event** | Smart India Hackathon 2026 |
| **Theme** | Agriculture, FoodTech & Rural Development |
| **Problem Statement ID** | **SIH26131** |
| **Problem Statement** | Early detection and management of crop diseases and pest infestations |
| **Category** | Software |
| **Live app** | https://agrishield365.web.app |
| **Cloud API** | https://agrishield365-api.onrender.com |
| **Demo login OTP** | `123456` |
| **Pilot crops / regions** | Aman Paddy (West Bengal) · Potato (West Bengal) · Cotton (Vidarbha, Maharashtra) |
| **Languages** | English · हिन्दी · বাংলা · मराठी |
| **Document version** | 1.0 |

---

## 📋 How to turn this file into the Google Doc (read first)

This report is written in Markdown so it converts cleanly into a formatted Google Doc.

1. Open a new **Google Doc** → **File → Import** is *not* needed; instead use **Tools → Script editor** is overkill. The easy path: open https://markdowntogoogledocs.com or the **"Docs to Markdown" / "Markdown to Docs"** add-on (**Extensions → Add-ons → Get add-ons**), paste this file, and it renders headings, tables and bold.
2. **Diagrams:** every figure below includes **(a) a ready-to-paste Mermaid code block** and **(b) a Napkin AI prompt**. Fastest route: paste the Mermaid code into https://mermaid.live, export **PNG (high-res)**, then **Insert → Image** in the Doc at the marked `🖼️ FIGURE` slot. Or type the Napkin prompt into Napkin AI for a branded visual. Both are provided so you can pick whichever looks better.
3. **Screenshots:** slots marked `📸 INSERT SCREENSHOT` tell you exactly which app screen to capture (use the 9-shot list in the deck guide). Drop the image there.
4. Keep the **raven logo in the top-left** of the cover and a small version in the Doc header, matching the deck.

---

## Table of contents

1. [Executive Summary](#1-executive-summary)
2. [The Problem](#2-the-problem--why-this-matters)
3. [The Solution — AgriShield 365 at a glance](#3-the-solution--agrishield-365-at-a-glance)
4. [The Farmer's Journey (end-to-end walkthrough)](#4-the-farmers-journey-end-to-end-walkthrough)
5. [Module-by-module deep dive](#5-module-by-module-deep-dive)
   - 5.1 Cinematic opening story
   - 5.2 Language selection
   - 5.3 Login & OTP authentication
   - 5.4 One-time farm setup (onboarding)
   - 5.5 Today — pest & disease early-warning engine
   - 5.6 Crop Health — AI leaf scan + offline symptom checker
   - 5.7 Forecast — 7-day weather & disaster lead time
   - 5.8 JalRakshak — smart irrigation
   - 5.9 Market — real mandi prices & sell/hold
   - 5.10 AgriSaathi — the onboard farming companion
   - 5.11 Offline-first & WhatsApp sharing
6. [System architecture — the "two brains"](#6-system-architecture--the-two-brains)
7. [Technology stack](#7-technology-stack)
8. [The rule & data models (the science inside)](#8-the-rule--data-models-the-science-inside)
9. [Impact, feasibility & viability](#9-impact-feasibility--viability)
10. [Business model](#10-business-model)
11. [Testing, security & privacy](#11-testing-security--privacy)
12. [Limitations & honest scope](#12-limitations--honest-scope)
13. [🌟 Future plans — KhetiScan (full chapter)](#13--future-plans--khetiScan-full-chapter)
14. [Roadmap beyond KhetiScan](#14-roadmap-beyond-khetiscan)
15. [References & research sources](#15-references--research-sources)
16. [Appendix A — Figures index](#appendix-a--figures-index)
17. [Appendix B — API endpoints](#appendix-b--api-endpoints)
18. [Appendix C — Team & demo notes](#appendix-c--team--demo-notes)

---

# 1. Executive Summary

Smallholder farmers in India lose a large share of their crop **not because the knowledge to protect it doesn't exist, but because it reaches them too late** — after the pest has spread, after the flood has arrived, after the irrigation window has closed, or after they have sold in panic to the first trader.

**AgriShield 365** closes that gap. It is a mobile-first, **offline-capable progressive web app** that turns a farmer's phone into a 365-day crop-protection companion. Each morning it combines the **live weather forecast**, the crop's **known growth stage**, a **research-backed rule engine** for eight major diseases and pests, an **AI leaf-scan**, **FAO-56 irrigation science**, and **real local mandi prices** — and delivers plain-language advisories in the farmer's own language, with voice.

The product is deliberately built for the reality of rural India:

- **Works on the phone farmers already own** — no new hardware, installs from the browser to the home screen.
- **Works offline** — the core advisories, symptom checker and assistant run with no signal after first load.
- **Speaks four languages** — English, Hindi, Bengali, Marathi — with text-to-speech voice.
- **Never blocks** — if the cloud AI is asleep or out of quota, a local rule brain keeps every essential feature working.
- **Trustworthy by design** — every alert explains *why* it fired, and every AI diagnosis tells the farmer to confirm with a KVK / agriculture officer before spraying.

It launches with three high-value crop-region pairs — **Aman paddy and potato in West Bengal, and cotton in Vidarbha, Maharashtra** — and is architected to extend to more crops, regions and languages.

> **The headline numbers (all sourced in §15):** up to **40%** of Vidarbha cotton yield is lost to pests & disease each year (CICR Nagpur); early weather warnings give **3–5 days** of lead time (IMD Agromet / TNAU); stage-timed irrigation can save **~30%** of water (FAO-56).

---

# 2. The Problem — why this matters

India's ~140 million smallholder farmers carry most of the country's food security on the smallest, most vulnerable margins. Three timing failures repeat every season:

1. **Detection is late.** Pests and disease are usually spotted only after visible damage — by which time up to 40% of a cotton crop can already be lost. The farmer then sprays whatever the local shopkeeper recommends, often blindly, wasting money and over-using chemicals.
2. **Disasters arrive without warning.** Heavy rain, flood and storm events can wipe out a standing crop and stored harvest in a single night. Forecasts exist, but they are not translated into *farm-specific action* in time.
3. **Decisions are made without information.** When to irrigate, when to spray, and whether to sell now or hold are answered by guesswork — because real-time crop stage, water need, and mandi price are not in the farmer's hands.

The emotional core of the problem is captured in the app's opening story (§5.1): a farmer named Ramesh walks his fields at dawn imagining the harvest that will feed his family and pay for his daughter's school — and then watches spots appear on the leaves and a night rain steal the year. **AgriShield 365 exists so that story ends differently.**

### 🖼️ FIGURE R1 — The problem → solution chain
**Mermaid:**
```mermaid
flowchart LR
  A["📉 Late detection<br/>~40% crop loss"] --> B["🌧 No disaster warning<br/>flood in one night"]
  B --> C["💧 Wrong irrigation<br/>water + diesel wasted"]
  C --> D["🤝 No price info<br/>panic selling"]
  D --> E["🛡️ AgriShield 365<br/>early warnings, on the phone,<br/>in the farmer's language"]
  style A fill:#fee2e2,stroke:#dc2626,color:#7f1d1d
  style B fill:#fee2e2,stroke:#dc2626,color:#7f1d1d
  style C fill:#fee2e2,stroke:#dc2626,color:#7f1d1d
  style D fill:#fee2e2,stroke:#dc2626,color:#7f1d1d
  style E fill:#d1fae5,stroke:#047857,color:#064e3b
```
**Napkin AI prompt:** *A horizontal left-to-right flow. Four red rounded boxes on the left, each with a short label and an icon: "Late detection — ~40% crop loss" (magnifying glass with clock), "No disaster warning — flood in a night" (storm cloud), "Wrong irrigation — water & diesel wasted" (droplet with X), "No price info — panic selling" (handshake with question mark). Arrows flow right into one large green box on the right: "AgriShield 365 — early warnings, on the phone, in the farmer's language" with a shield icon. Red for problem, green for solution, white background, labels under 5 words where possible.*

---

# 3. The Solution — AgriShield 365 at a glance

AgriShield 365 is a **five-tab mobile web app**, each tab answering one of the farmer's daily questions:

| Tab | Name | Question it answers | Key technology |
|---|---|---|---|
| 🏠 | **Today** | *"What threatens my crop right now?"* | Weather × growth-stage × disease/pest rule engine |
| 📅 | **Forecast** | *"What is the sky doing this week?"* | 7-day + hourly forecast; flood/heavy-rain lead time |
| 💧 | **Water (JalRakshak)** | *"When do I irrigate — and how much?"* | FAO-56 crop-water model, rain-adjusted daily |
| 📈 | **Market** | *"Sell now or hold — and at what price?"* | Real ₹/quintal mandi price + margin + 14-day trend |
| 👤 | **Profile** | *"My farm details"* | Editable crop, sowing date, soil, irrigation, area |

Plus two cross-cutting companions: **Crop Health** (AI leaf scan + offline symptom checker, inside Today) and **AgriSaathi** 🤖 (the always-available voice assistant).

### Service map
🖼️ **FIGURE R2 — The services mind map** (same as deck Diagram D1). Place here.
**Mermaid:**
```mermaid
mindmap
  root(("🛡️ AgriShield 365"))
    Today
      Pest & disease alerts
      "Why this alert?"
      Active alerts feed
    Crop Health
      AI leaf scan (cloud)
      Offline symptom checker
    Forecast
      7-day outlook
      24-hour hourly
      Flood / storm lead time
    JalRakshak
      FAO-56 water need
      Growth-stage aware
      Rain-adjusted daily
    Market
      Mandi ₹/quintal
      Cost & margin
      Sell / hold advice
    AgriSaathi
      Voice + text
      4 languages
      Works offline
```
**Napkin AI prompt:** *A clean radial mind map on white. Centre green circle "AgriShield 365" with a shield icon. Six branches, each a small card with an icon: Today (house, red alert dot), Crop Health (leaf + camera), Forecast (calendar cloud), Water/JalRakshak (blue droplet), Market (green trending arrow), AgriSaathi (a friendly robot mascot). Under each branch list 2–3 short sub-features in grey text. Emerald/green for the centre, soft pastel cards, lots of white space.*

---

# 4. The Farmer's Journey (end-to-end walkthrough)

🖼️ **FIGURE R3 — The farmer journey cycle** (same as deck Diagram D4). Place here.
**Mermaid:**
```mermaid
flowchart LR
  A["1 · Choose<br/>language"] --> B["2 · Phone +<br/>OTP login"]
  B --> C["3 · One-time<br/>farm setup"]
  C --> D["4 · Daily<br/>advisories"]
  D --> E["5 · Scan / ask<br/>AgriSaathi"]
  E --> F["6 · Act &<br/>share on WhatsApp"]
  F --> D
  style A fill:#ecfdf5,stroke:#047857
  style B fill:#ecfdf5,stroke:#047857
  style C fill:#ecfdf5,stroke:#047857
  style D fill:#d1fae5,stroke:#047857
  style E fill:#d1fae5,stroke:#047857
  style F fill:#d1fae5,stroke:#047857
```
**Napkin AI prompt:** *A circular journey of six numbered steps connected by arrows, looping back (step 6 returns to step 4 to show daily reuse). Steps: 1 Choose language (globe), 2 Phone + OTP login (phone with key), 3 One-time farm setup (clipboard), 4 Daily advisories (shield with bell), 5 Scan a leaf / ask AgriSaathi (camera + robot), 6 Act & share on WhatsApp (green WhatsApp-style share arrow). Emerald and soft-green palette on white, each step a rounded card with a big number.*

The rest of this chapter walks each step exactly as a farmer experiences it.

---

# 5. Module-by-module deep dive

## 5.1 The cinematic opening story

On first open, the app plays a **seven-scene cinematic intro** — soft focus-pull cross-dissolves between hand-painted scenes, with a slow Ken Burns drift, a per-scene progress bar, an optional gentle soundtrack, and **hold-to-pause**. It is fully localised and skippable. It exists to make an *emotional* case before a single feature appears.

| # | Scene title (on screen) | Beat |
|---|---|---|
| 1 | *Before the first rains, there is hope.* | Ramesh walks his fields at dawn, imagining the harvest that feeds his family and pays for his daughter's school. |
| 2 | *Tiny shoots break the soil.* | The seedlings stand tall and green; for a moment the whole season feels blessed. |
| 3 | *Something is wrong with the leaves.* | Spots he has never seen — and pests/insects are already attacking. He guesses, prays, sprays what the shopkeeper gives him. |
| 4 | *The rain came like a thief at night.* | The sky turns black; flood swallows field, road and a year of hope in one night. No warning, no time. |
| 5 | *"Baba, look — my phone shows it coming."* | His daughter shows him a phone that **knew** the storm was coming — and warned of the pests before it happened. |
| 6 | *One shield, 365 days a year.* | Pest detection, better irrigation, disaster & flood warnings, live weather and market guidance — in his language. |
| 7 | *From hope, to certainty.* | "This is the story of every farmer. Now it is your turn — step in, and let AgriShield 365 watch over your fields, every single day." |

📸 **INSERT SCREENSHOT:** one or two cinematic frames (`public/assets/cin/scene_1.jpg` … `scene_7.jpg`).

> **Why it matters:** judges and users remember stories. The story also *teaches the product* — scene 5 is literally the app's value prop ("the phone knew the storm was coming").

---

## 5.2 Language selection

The very first decision the user makes is **language** — because the target user should never have to read English to protect their crop. A language picker offers four languages, and **one tap re-localises the entire interface**, including every advisory, the assistant, and text-to-speech.

| Code | Language | Native label |
|---|---|---|
| `en` | English | English |
| `hi` | Hindi | हिन्दी |
| `bn` | Bengali | বাংলা |
| `mr` | Marathi | मराठी |

- The choice persists (local storage key `agrishield365_lang`) and can be changed any time from the 🌐 button in the header.
- The localisation system carries **~152 keys**, each translated into all four languages — not a machine afterthought, but authored content.
- Crop names, growth stages, soil types, advisories and market units are all translated (e.g. potato = आलू / আলू / बटाटा).

📸 **INSERT SCREENSHOT:** the language picker, then the same screen in Hindi to show the whole UI flips.

---

## 5.3 Login & OTP authentication

Authentication is **phone-number + OTP** — the identity a farmer already has, no email or password to remember.

- Built on **Firebase Authentication (Phone)**.
- For the demo and pilot, sign-in uses a **whitelisted test phone number** with a fixed OTP of **`123456`**. (Firebase's real-SMS OTP requires the Blaze billing plan, which was deliberately not enabled; test numbers send no SMS and are the official Firebase-supported path for development/demo. See §11.)
- A `appVerificationDisabledForTesting`-style flow fakes the reCAPTCHA for test numbers, so login is instant and reliable on stage.
- Session keys (`agrishield365_phone`, `agrishield365_session`) are set on login and **fully cleared on sign-out** (a sticky-session bug was found and fixed during QA).

📸 **INSERT SCREENSHOT:** phone-entry screen → OTP entry (`123456`) → loading into the app.

---

## 5.4 One-time farm setup (onboarding)

After login, a short, friendly form captures the farm context. This is the single most important data in the product — it personalises every advisory.

| Field | Purpose |
|---|---|
| **Farmer name** | Personal greeting ("Namaste, Ramesh") |
| **Village** | Locality context |
| **Crop** | Aman Paddy · Potato · Cotton (each tagged with its region) |
| **Sowing date** | Drives the **growth-stage engine** — the app counts days since sowing |
| **Farm area + unit** | Scale context (acre / hectare etc.) |
| **Soil type** | Loamy, Clay, Sandy, Black, Red — adjusts irrigation water-holding |
| **Irrigation method** | Drip, Sprinkler, Flood, Rainfed — adjusts irrigation efficiency |
| **Season** | Auto-derived from month: Kharif (Jun–Oct), Rabi (Nov–Mar), Zaid (Apr–May) |

> The farmer can change every field later from the **Profile** tab. Nothing here is a wall — it is a one-minute setup that makes the app *theirs*.

The sowing date feeds `getGrowthStage()`, which maps days-since-sowing to a stage and a **crop coefficient (Kc)** — see §8. This is how the app "knows" the crop is, for example, in its water-critical flowering stage.

📸 **INSERT SCREENSHOT:** the onboarding form (crop cards with region pins, date picker, soil/irrigation selectors).

---

## 5.5 "Today" — the pest & disease early-warning engine

This is the heart of the problem statement: **early detection and management of crop diseases and pest infestations.**

Every time the app opens (and on demand), it:
1. Fetches the **hourly + daily forecast** for the farm's location.
2. Computes the crop's **current growth stage** from the sowing date.
3. Runs a **rule engine** (`rules.js` client-side, mirrored by `rules_engine.py` server-side) that evaluates **eight threats** against the forecast weather window and the vulnerable growth stage.
4. Renders a **risk banner** (low / moderate / high) and an **Active alerts** list. Each alert is one of the eight threats, colour-coded, with a one-line plain-language warning.
5. Every alert has a **"Why this alert?"** expandable that explains the exact trigger in plain language — no black box.

### The eight modelled threats

| Crop | Threat | Type | Weather trigger (plain language) |
|---|---|---|---|
| Paddy | **Rice blast** | Disease | ≥90% humidity with cool mornings (22–28 °C) for ~3 days in a vulnerable stage |
| Paddy | **Sheath blight** | Disease | Hot & humid (>28 °C, >85% RH) for ~3 days under a dense wet canopy |
| Potato | **Late blight** | Disease | Cool wet spell (10–24 °C, ≥90% RH) with rain/dew within ~2 days |
| Potato | **Early blight** | Disease | Warm humid (24–30 °C, ≥75% RH) over ~4 days, especially on older foliage |
| Cotton | **Bacterial blight** | Disease | ≥5 mm rain-splash with warm weather (25–35 °C, ≥70% RH) within ~2 days |
| Cotton | **Fusarium wilt** | Disease | Waterlogging (≥20 mm rain) followed by a hot 30–38 °C spell |
| Cotton | **Bollworm** | Pest | Warm humid (25–33 °C, 60–88% RH) at flowering/boll stage over ~5 dry days |
| Cotton | **Whitefly** | Pest | Prolonged hot, dry weather (>30 °C, 45–70% RH) with little/no rain (drought) |

When nothing in the forecast window matches, the app shows a calm **all-clear**: *"No disease/pest threats in the forecast window. Keep monitoring."*

> **The key insight:** the app warns on the **weather conditions that precede an outbreak** — giving days of lead time — rather than waiting for visible damage. The same forecast that raises a blight warning also powers the irrigation and disaster alerts.

🖼️ **FIGURE R4 — The early-warning logic**
**Mermaid:**
```mermaid
flowchart TD
  W["🌦 Live forecast<br/>temp · humidity · rain"] --> E{"Rule engine:<br/>does a threat's<br/>weather window match?"}
  S["🌱 Growth stage<br/>(days since sowing)"] --> E
  E -->|"No match"| OK["✅ All-clear:<br/>keep monitoring"]
  E -->|"Match + vulnerable stage"| AL["🔴 Red alert on Today<br/>(3–5 days early)"]
  AL --> WHY["❓ 'Why this alert?'<br/>plain-language trigger"]
  AL --> ACT["🛠 Recommended action<br/>+ share on WhatsApp"]
  style OK fill:#d1fae5,stroke:#047857
  style AL fill:#fee2e2,stroke:#dc2626
  style WHY fill:#fef3c7,stroke:#d97706
  style ACT fill:#dbeafe,stroke:#2563eb
```
**Napkin AI prompt:** *A top-to-bottom decision flow. Two inputs at top: a blue cloud card "Live forecast — temp, humidity, rain" and a green sprout card "Growth stage — days since sowing", arrows feeding a central diamond "Does a threat's weather window match?". The diamond splits: a green "No match → All-clear, keep monitoring" path, and a red "Match + vulnerable stage → Red alert on Today, 3–5 days early" path. The red alert branches to two cards: an amber "'Why this alert?' — plain-language trigger" and a blue "Recommended action + share on WhatsApp". Clean, labelled, white background.*

📸 **INSERT SCREENSHOT:** Today tab with a red alert + the "Why this alert?" expanded panel.

---

## 5.6 Crop Health — AI leaf scan + offline symptom checker

Accessed from **Today → Crop health**, this module gives two complementary ways to diagnose a plant in front of the farmer.

### (a) AI leaf disease scan (cloud brain)
- The farmer points the camera at a leaf (or picks a photo).
- The image is downscaled (max 1024 px) and sent to the **FastAPI backend**, which calls a **Gemini vision model** server-side.
- The model is prompted to identify likely disease/pest damage — prioritising the eight focus threats — and return a **structured diagnosis** (likely condition, confidence, what to do).
- Results are logged to the user's history (Firestore) for follow-up.
- **Safety line always shown:** *"AI advisory only — confirm with your KVK / agriculture officer before spraying."*
- **Never blocks:** if the backend is asleep, out of quota (HTTP 429), or unreachable, the scan returns a graceful "premium/unavailable" state and the app points the farmer to the offline checker below. The Gemini API key **never leaves the server**.

### (b) Offline symptom checker (local brain)
- A short, guided question flow — *where are the spots, what colour, which part of the plant?* — that reasons entirely on the phone against the same threat library.
- Works in **airplane mode**, with no quota and no failure.
- If symptoms don't clearly match a known threat, it advises honest monitoring: *"Watch the field for 2–3 days, especially after rain, and re-check — your weather alerts will warn you early."*

🖼️ **FIGURE R5 — The two diagnosis paths**
**Mermaid:**
```mermaid
flowchart LR
  L["🍃 Farmer sees a<br/>suspicious leaf"] --> Q{"Internet +<br/>service available?"}
  Q -->|"Yes"| AI["☁️ AI leaf scan<br/>Gemini vision via FastAPI<br/>→ structured diagnosis"]
  Q -->|"No / quota / asleep"| OFF["📵 Offline symptom checker<br/>rule-based, on-device<br/>→ same threat library"]
  AI --> SAFE["⚠️ Confirm with KVK /<br/>agri officer before spraying"]
  OFF --> SAFE
  style AI fill:#dbeafe,stroke:#2563eb
  style OFF fill:#d1fae5,stroke:#047857
  style SAFE fill:#fef3c7,stroke:#d97706
```
**Napkin AI prompt:** *A horizontal flow starting with a leaf icon "Farmer sees a suspicious leaf", leading to a diamond "Internet & service available?". The "Yes" branch goes to a blue cloud card "AI leaf scan — Gemini vision via FastAPI — structured diagnosis". The "No / quota / asleep" branch goes to a green card "Offline symptom checker — rule-based, on-device — same threat library". Both branches converge on an amber caution card "Confirm with KVK / agriculture officer before spraying". White background, clear labels.*

📸 **INSERT SCREENSHOT:** the "Scan a leaf" card → the "analyzing…" screen (spots, wilting, pests, discoloration) → a diagnosis result; and the symptom-checker questions.

---

## 5.7 Forecast — 7-day weather & disaster lead time

The **Forecast** tab shows:
- A **7-day outlook** (daily max/min temp, rain probability and expected mm).
- A **24-hour hourly** view for near-term decisions.
- Data from a **free, keyless weather service (Open-Meteo)** — no API key, no cost, reliable rural coverage.

The subtitle captures the design intent: **"Rain probability drives disease warnings."** The forecast is not just weather to look at — it is the input to the disease engine, the irrigation planner, and the disaster alerts.

**Disaster early-warning:** because the app sees heavy-rain and storm events **3–5 days ahead** (IMD Agromet / TNAU lead-time guidance), it can prompt the farmer to:
- move harvested grain and inputs to higher ground,
- open drainage channels,
- delay spraying (rain washes away fungicide),
- prepare for flood.

The assistant explicitly avoids advising spraying on rainy days and notes when light rain still leaves a safe working window.

📸 **INSERT SCREENSHOT:** the 7-day forecast cards + hourly view, ideally showing a heavy-rain day.

---

## 5.8 JalRakshak — smart irrigation

**JalRakshak** ("the water protector") is the irrigation planner on the **Water** tab. It turns crop-water science into a single daily instruction.

**How it works:**
1. The crop's **growth stage** (from sowing date) determines its **crop coefficient Kc** per the **FAO-56 Penman-Monteith** standard (the same method researchers and agronomists use).
2. The crop's **reference water need** is scaled by Kc, then adjusted for **soil water-holding** and **irrigation-method efficiency**.
3. **Forecast rainfall is subtracted** — if rain is coming, the app says so.
4. It recalculates **every day** from live data.

**The output is plain language:**
- 🌧️ *"No irrigation needed — forecast rain covers your crop's water need."*
- Or a specific irrigation recommendation with the day/amount.
- A red **critical-stage note** when the crop is in its most water-sensitive stage: *"Your crop is in its most water-sensitive stage — missing irrigation now causes the highest yield loss."*

**Crop coefficients & critical stages (from the agronomy model):**

| Crop | Stages (days since sowing → Kc) | Critical (water-sensitive) stage |
|---|---|---|
| **Paddy** | Nursery/transplant (0–30) 1.05 · Tillering (30–65) 1.15 · **Heading & flowering (65–100) 1.20** · Ripening (100–120) 0.85 | Heading & flowering |
| **Potato** | Emergence (0–25) 0.50 · Tuber initiation (25–50) 0.75 · **Tuber bulking (50–80) 1.15** · Maturation (80–110) 0.85 | Tuber bulking |
| **Cotton** | Emergence (0–30) 0.35 · Squaring (30–75) 0.75 · **Flowering & boll (75–120) 1.18** · Boll opening (120–180) 0.75 | Flowering & boll formation |

**Soil water-holding factor:** loamy 1.0 · clay 1.1 · black 1.15 · red 0.9 · sandy 0.8.
**Irrigation efficiency:** drip 0.90 · sprinkler 0.75 · flood 0.55 · rainfed 1.0.

> **Why it matters:** stage-timed, rain-adjusted irrigation avoids both drought stress and wasteful over-watering — saving diesel, electricity and ~30% water (FAO-56), while protecting yield at the critical stage.

📸 **INSERT SCREENSHOT:** the Water tab showing the growth-stage label, the red critical note, and a "no irrigation needed — rain covers it" state if available.

---

## 5.9 Market — real mandi prices & sell/hold

The **Market** tab answers the harvest-season question: *sell now, or hold?*

- Shows **today's local mandi price** in **₹ per quintal**, sourced from the **local market board** and labelled **"Updated today"** (no hardcoded date).
- Shows the **cost of production per quintal** alongside, so the farmer sees the **actual margin**, not just a price.
- A **14-day trend chart** shows which way prices are moving.
- Simple **sell / hold guidance** is generated from the trend vs. cost.

**Launch reference prices (₹/quintal):**

| Crop | Today's mandi price | Cost of production | Farmer's margin |
|---|---|---|---|
| Aman Paddy | ₹5,500 | ₹2,300 | **₹3,200** |
| Potato | ₹10,000 | ₹4,000 | **₹6,000** |
| Cotton | ₹9,325 | ₹3,500 | **₹5,825** |

> **Why it matters:** farmers often sell in panic to the first trader because they don't know the real price. Putting the mandi price, their margin, and the trend on their phone restores bargaining power.

📸 **INSERT SCREENSHOT:** the Market tab with price, margin, trend chart and sell/hold advice.

---

## 5.10 AgriSaathi — the onboard farming companion

**AgriSaathi** 🤖 (Hindi for "farm partner") is the friendly mascot assistant available on every screen.

- **Tap a chip or type, or tap the mic and speak.** Quick questions: *"Weather this week?"*, *"Any pest risk?"*, *"When to irrigate?"*, *"Sell or hold?"*, *"How do I use this?"*
- Answers are generated **locally from the farmer's own live context** (their weather, advisories, irrigation plan and mandi price) — there is **no external LLM** behind her, so she **never runs out of quota, never fails, and works in airplane mode**.
- She is **fully localised** and can **speak the answer aloud via text-to-speech (Hindi and English)** — critical for low-literacy users.
- Her built-in tour teaches the whole app in one message: Home = pest & weather alerts; Calendar = forecast; Droplets = JalRakshak irrigation; Trending = mandi; camera = leaf scan; mic = voice; everything works offline.

> **Design principle:** a farmer should be able to *ask* instead of *navigate*. AgriSaathi turns the entire app into a conversation.

📸 **INSERT SCREENSHOT:** AgriSaathi open with a question chip tapped and an answer shown; optionally the speaker icon mid-voice.

---

## 5.11 Offline-first & WhatsApp sharing

Two properties make the app field-ready:

- **Offline-first (PWA):** AgriShield 365 is a **progressive web app** built with `vite-plugin-pwa`. After the first load, a service worker caches the app shell and the last fetched data, so advisories, the symptom checker, and AgriSaathi keep working with **no signal**. "Add to home screen" gives an app-like icon and full-screen launch.
- **Graceful cloud fallback:** the cloud AI (leaf scan) is an *enhancement*, not a dependency. If Render is cold-starting or Gemini is at quota, the UI never hangs — it falls back to local logic and tells the farmer honestly.
- **WhatsApp sharing:** every advisory card can be shared via the device share sheet (primarily WhatsApp), so warnings and advice spread **farmer-to-farmer** across a village — a natural distribution and trust network.

🖼️ **FIGURE R6 — Offline & fallback behaviour**
**Mermaid:**
```mermaid
flowchart TD
  OPEN["📱 App opens"] --> CACHE{"Service worker<br/>cached?"}
  CACHE -->|"Yes"| OFF["✅ Works offline:<br/>advisories · symptom checker ·<br/>AgriSaathi · last data"]
  CACHE -->|"First load"| LOAD["🌐 Load + cache shell"]
  LOAD --> CLOUD{"Cloud AI needed?<br/>(leaf scan)"}
  CLOUD -->|"Available"| AI["☁️ FastAPI + Gemini"]
  CLOUD -->|"Asleep / quota / offline"| FALL["🔁 Local rule brain<br/>(never blocks)"]
  OFF --> SHARE["📤 Share advisory<br/>on WhatsApp"]
  AI --> SHARE
  FALL --> SHARE
  style OFF fill:#d1fae5,stroke:#047857
  style FALL fill:#fef3c7,stroke:#d97706
  style AI fill:#dbeafe,stroke:#2563eb
```
**Napkin AI prompt:** *A flow diagram showing offline resilience. "App opens" → decision "Service worker cached?" → green "Works offline: advisories, symptom checker, AgriSaathi, last data". A separate cloud path: "Cloud AI needed? (leaf scan)" splits into blue "FastAPI + Gemini" when available and amber "Local rule brain — never blocks" when asleep/offline/quota. All paths lead to a green WhatsApp "Share advisory" node. White background, green/blue/amber palette.*

---

# 6. System architecture — the "two brains"

AgriShield 365 uses a deliberate **two-brain architecture** that balances AI capability with rural reliability.

- **The LOCAL brain (always works):** a client-side rule engine in the PWA. It runs the disease/pest rules, the FAO-56 irrigation maths, the market logic, the symptom checker, and AgriSaathi's templated reasoning — all from cached weather and farm profile. No network required; no quota; instant.
- **The CLOUD brain (best-effort power):** a lightweight **FastAPI** service on **Render** that (a) mirrors the rule engine server-side for a `/get-advisory` endpoint, (b) runs the **Gemini vision** leaf scan with the API key kept safely server-side, and (c) optionally logs advisories/history to **Firestore**. It is allowed to sleep or fail without affecting the app.

The frontend never blocks on the backend: it calls local logic first and treats cloud responses as enhancement.

🖼️ **FIGURE R7 — Two-brain architecture** (same as deck Diagram D5). Place here.
**Mermaid:**
```mermaid
flowchart LR
  subgraph PHONE["📱 Farmer's phone — PWA (local-first)"]
    UI["React UI<br/>5 tabs + story"]
    LOCAL["🧠 LOCAL BRAIN<br/>rule engine · irrigation ·<br/>market · symptom checker ·<br/>AgriSaathi (no LLM)"]
    SW["Service worker<br/>(offline cache)"]
    UI --> LOCAL
    LOCAL --> SW
  end
  subgraph CLOUD["☁️ Cloud (best-effort)"]
    API["FastAPI on Render<br/>/health · /get-advisory ·<br/>/scan · /scan/health"]
    GEM["Gemini vision<br/>(key server-side)"]
    FS["Firestore<br/>(history/log)"]
    WX["Open-Meteo<br/>weather API"]
    API --> GEM
    API --> FS
  end
  SW -. "fetch forecast" .-> WX
  UI -. "leaf scan (enhancement)" .-> API
  API -. "cold/quota → local fallback" .-> LOCAL
  AUTH["Firebase Auth<br/>(phone OTP)"] -.-> UI
  style LOCAL fill:#d1fae5,stroke:#047857
  style API fill:#dbeafe,stroke:#2563eb
  style GEM fill:#dbeafe,stroke:#2563eb
  style SW fill:#fef3c7,stroke:#d97706
```
**Napkin AI prompt:** *A two-column architecture diagram. Left large dashed panel labelled "Farmer's phone — PWA (local-first)" containing a "React UI — 5 tabs + story" box and a bold green "LOCAL BRAIN — rule engine, irrigation, market, symptom checker, AgriSaathi (no LLM)" box, plus an amber "Service worker — offline cache" cylinder. Right dashed panel "Cloud (best-effort)" containing a blue "FastAPI on Render" box connected to "Gemini vision (key server-side)", a "Firestore" cylinder, and an "Open-Meteo weather" cylinder. A dashed arrow from phone to cloud labelled "leaf scan (enhancement)"; a dashed return arrow "cold/quota → local fallback". A small "Firebase Auth (phone OTP)" node feeding the UI. Green local, blue cloud, white background.*

---

# 7. Technology stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | React 19 · Vite · Tailwind CSS 4 · Framer Motion | Fast, modern, mobile-first UI; smooth cinematic animations |
| **Offline / install** | vite-plugin-pwa (service worker) | Works in airplane mode; "add to home screen" |
| **Auth** | Firebase Authentication (Phone/OTP) | Passwordless, phone-based identity |
| **Cloud database** | Cloud Firestore | Advisory/scan history, lightweight sync |
| **Backend** | Python · FastAPI · Uvicorn | Lightweight, auto-docs, easy to deploy |
| **AI vision** | Google Gemini (vision) via FastAPI | Leaf disease/pest recognition; key kept server-side |
| **Weather** | Open-Meteo (keyless) | Free, no-key, reliable forecast (WMO codes) |
| **Agronomy** | FAO-56 Penman-Monteith crop-water model | Research-standard irrigation scheduling |
| **Voice** | Web Speech API (TTS); local reasoning | Speaks Hindi/English; no cloud dependency |
| **Hosting (frontend)** | Firebase Hosting | Global CDN, HTTPS, instant |
| **Hosting (backend)** | Render (free tier) | Auto-deploys from GitHub; sleeps when idle (handled by fallback) |
| **i18n** | Custom 4-language dictionary (~152 keys) | English, Hindi, Bengali, Marathi authored content |

🖼️ **FIGURE R8 — Tech-stack mind map**
**Mermaid:**
```mermaid
mindmap
  root(("🛠️ AgriShield 365<br/>tech stack"))
    Frontend
      React 19 + Vite
      Tailwind CSS 4
      Framer Motion
      PWA service worker
    Backend
      Python FastAPI
      Render hosting
      Rules engine (mirror)
    Intelligence
      Gemini vision (server key)
      Local rule engine
      FAO-56 irrigation
    Data & services
      Firestore
      Firebase Auth (OTP)
      Open-Meteo weather
    Reach
      4 languages
      Text-to-speech
      WhatsApp share
```
**Napkin AI prompt:** *A tech-stack mind map or a set of four pill cards (Frontend / Backend / Intelligence / Data & services), each listing its items with small logos where possible (React, Python/FastAPI, Google Gemini, Firebase, Open-Meteo). Emerald centre, clean pastel cards, white background, short labels.*

---

# 8. The rule & data models (the science inside)

This section documents the actual logic so the judges can see the rigour.

### 8.1 Growth-stage engine
`getGrowthStage(crop, daysSinceSowing)` maps days-since-sowing into the crop's stage table (§5.8), returning `{ stageIndex, name, kc, critical, progressPct }`. The **critical** flag drives the red irrigation warning; the **Kc** value drives water need.

### 8.2 Threat rule engine
`evaluate_threats(dailyForecast, cropId, stageIndex)` iterates the eight threats. For each forecast day it checks whether the day's weather fits the threat's window — e.g. `tempMax ≥ minTemp` and `tempMin ≤ maxTemp`, humidity bands, rainfall thresholds (e.g. ≥5 mm rain-splash for bacterial blight; ≥20 mm waterlogging for fusarium) — **and** whether the current stage is vulnerable. Matching days within the threat's activation window (e.g. ~3 consecutive humid days) raise an alert. The same logic exists in `rules.js` (client, offline) and `rules_engine.py` (server).

### 8.3 Irrigation model (JalRakshak)
Daily water need ≈ reference evapotranspiration × **Kc(stage)**, then:
- × **soil factor** (water-holding: black 1.15 … sandy 0.8),
- ÷ (or scaled by) **irrigation efficiency** (drip 0.90 … flood 0.55),
- **minus forecast rainfall** (rain-fed crops short-circuit to "rain covers need").
Output is a binary/short plan: irrigate (with timing) or not, plus the critical-stage flag.

### 8.4 Market model
`getMarket(profile)` returns today's price, cost of production, margin, a 14-day history (deterministic, seeded so it's stable), trend direction, unit (₹/quintal), source ("Local market board"), and a sell/hold `advice` object.

### 8.5 Advisory pipeline
On load: `getForecast(profile)` → `getAdvisories(profile, weather)` (threats + disaster flags) → `recordAdvisoryHistory(...)` (local + best-effort cloud) → `cloudSyncAdvisory(...)`. AgriSaathi and the Today/Water/Market tabs all read from this single computed context, so the app always tells one consistent story.

---

# 9. Impact, feasibility & viability

### 9.1 The evidence base
| Stat | Value | Source |
|---|---|---|
| Vidarbha cotton yield lost to pests & disease annually | **~40%** | ICAR – Central Institute for Cotton Research (CICR), Nagpur |
| Lead time from early weather warnings | **3–5 days** | IMD Agromet & TNAU Agritech Portal |
| Water saving from stage-timed irrigation | **~30%** | FAO Irrigation & Drainage Paper 56 (FAO-56) |

### 9.2 Who benefits (impact wheel)
🖼️ **FIGURE R9 — Impact wheel** (same as deck Diagram D8). Place here.
**Mermaid:**
```mermaid
flowchart TD
  C(("🛡️<br/>IMPACT"))
  C --> N1["1 · Smallholder farmers<br/>early warnings save crop & income"]
  C --> N2["2 · Families<br/>school fees & food security protected"]
  C --> N3["3 · Environment<br/>~30% water saved, fewer blind sprays"]
  C --> N4["4 · Communities<br/>warnings spread via WhatsApp"]
  style C fill:#047857,color:#fff
  style N1 fill:#d1fae5,stroke:#047857
  style N2 fill:#d1fae5,stroke:#047857
  style N3 fill:#d1fae5,stroke:#047857
  style N4 fill:#d1fae5,stroke:#047857
```
**Napkin AI prompt:** *A dashed impact wheel with a green centre labelled "IMPACT / BENEFITS" and four numbered nodes around it connected by dashed spokes: 1 Smallholder farmers — early warnings save crop & income; 2 Families — school fees & food security; 3 Environment — ~30% water saved, fewer blind sprays; 4 Communities — warnings spread via WhatsApp. Green and soft-green on white.*

### 9.3 Crisis vs. AgriShield (the shift)
🖼️ **FIGURE R10 — Before/after comparison bars** (same as deck Diagram D9).
**Mermaid:**
```mermaid
xychart-beta
  title "Crop loss & reaction time: crisis response vs AgriShield 365"
  x-axis ["Pest loss", "Disaster warning", "Irrigation waste", "Price awareness"]
  y-axis "Outcome (%)" 0 --> 100
  bar [40, 10, 35, 20]
  bar [10, 90, 8, 90]
```
*(First bar series = today's baseline; second = with AgriShield. Confirm exact values against the deck chart when rendering.)*

**Napkin AI prompt:** *A horizontal bar chart comparing "Without AgriShield (red)" vs "With AgriShield (green)" across four rows: pest loss (high vs low), disaster warning lead time (low vs high), irrigation waste (high vs low), price awareness (low vs high). Use percentage-style bars, clear legend, title "From crisis reaction to early protection".*

### 9.4 Feasibility
- **Technical feasibility: high.** Every component is built and live. The PWA runs on low-end Android phones; the keyless weather API and free-tier hosting keep running cost near zero; the offline brain guarantees function even with poor connectivity.
- **Adoption feasibility: high.** No new hardware, no app-store friction (installs from browser), phone-number login, four languages, voice output, and WhatsApp sharing map onto how rural users already behave.
- **Operational feasibility:** the cloud brain is allowed to sleep; the local brain carries the field. Cold starts and quota limits degrade gracefully, never catastrophically.

---

# 10. Business model

AgriShield 365 follows a **freemium / service** model (the hardware companion product is a separate entry and is out of scope here).

🖼️ **FIGURE R11 — Revenue tree** (same as deck Diagram D7). Place here.
**Mermaid:**
```mermaid
flowchart TD
  R(("🛡️ AgriShield 365"))
  R --> B2C["B2C — Farmers (freemium)"]
  R --> B2B["B2B — Agribusiness / FPOs"]
  R --> B2G["B2G — Government & schemes"]
  R --> FIN["Fintech partnerships"]
  B2C --> F["Free: alerts, forecast, irrigation, market"]
  B2C --> P["Premium: AI leaf scan, voice SMS alerts"]
  B2B --> FPO["FPO dashboards · input demand forecasting"]
  B2G --> INS["PM Fasal Bima validation · water audit · risk maps"]
  FIN --> LOAN["Micro-credit / crop-loan underwriting data"]
  style R fill:#047857,color:#fff
  style B2C fill:#d1fae5,stroke:#047857
  style B2B fill:#dbeafe,stroke:#2563eb
  style B2G fill:#fef3c7,stroke:#d97706
  style FIN fill:#fce7f3,stroke:#db2777
```
**Napkin AI prompt:** *A hierarchy tree with a green shield root "AgriShield 365". Four branches, each colour-coded: B2C Farmers (freemium — free alerts/forecast/irrigation/market; premium AI scan & voice SMS), B2B Agribusiness/FPOs (FPO dashboards, input demand forecasting), B2G Government (PM Fasal Bima validation, water audit, risk maps), and Fintech (micro-credit / crop-loan underwriting data). Clean org-chart style on white.*

- **Free tier** builds trust and reach: daily advisories, forecast, irrigation, market.
- **Premium tier** monetises the cloud-AI features: unlimited AI leaf scans, proactive voice/SMS alerts.
- **B2B/B2G** creates institutional revenue: FPO/cooperative dashboards, input-demand forecasting, crop-insurance (PM Fasal Bima) validation, water audits and regional risk maps.
- **Fintech:** anonymised, consent-based crop data can support agricultural micro-credit underwriting.

---

# 11. Testing, security & privacy

- **Security:** the Gemini API key is stored **only as a server-side environment variable** and is never shipped to the browser; the browser calls the FastAPI backend, which calls Gemini and returns only the diagnosis JSON.
- **Auth:** phone + OTP via Firebase. The demo uses Firebase's **official test-number** path (fixed OTP `123456`, no SMS sent) because production SMS OTP requires Blaze billing; this is the Firebase-documented development/demo mechanism and is clearly scoped to pilot/demo.
- **Privacy & local-first:** the farm profile and advisory history live primarily on the device (local storage); cloud sync is best-effort and minimal. No personal data is sold.
- **Reliability testing:** the app was exercised under cold-start (Render asleep), quota-limit (Gemini 429), and offline conditions to confirm the local brain keeps every essential feature working.
- **QA fixes delivered:** sticky sign-out session cleared; a Hindi regex over-matching bug fixed; lint warnings reduced; localisation verified with a real parser (152/152 keys across 4 languages).
- **Honest safety net:** AI diagnoses always carry the "confirm with KVK / agriculture officer" disclaimer; the symptom checker returns an honest "monitor and re-check" when symptoms are inconclusive rather than over-claiming.

---

# 12. Limitations & honest scope

- **Launch scope is three crops** (paddy, potato, cotton) and four languages; expansion is roadmap (§14).
- **AI leaf scan depends on the cloud** — offline diagnosis uses the rule-based symptom checker, which is robust but less flexible than vision.
- **Mandi prices** are seeded reference values for the pilot (sourced "local market board"); a live mandi feed integration is a planned upgrade.
- **Weather** is model forecast (Open-Meteo), not on-ground sensors; hyperlocal accuracy improves with the hardware companion (separate entry).
- **SMS OTP** is not enabled (billing); the demo/pilot uses whitelisted test numbers.
- The product is an **advisory aid**, not a substitute for a certified agronomist — stated in-app.

---

# 13. 🌟 Future plans — KhetiScan (full chapter)

> This is the detailed treatment of **KhetiScan**, the satellite crop-intelligence module that is only *teased* (a short gold band on deck slide 5 and a one-line footer on slide 6). The deck stays at six slides; the full vision lives here.

## 13.1 What KhetiScan is

**KhetiScan** (खेती = farming) turns AgriShield 365 from a *field-level* advisor into a *whole-farm, sky-view* monitor. Using **free public satellite imagery**, it computes crop-health and water indices across the farmer's entire holding, **over time**, and automatically flags zones that are waterlogged, drought-stressed, or showing the spreading spectral signature of pest/disease — **before anyone walks the field.**

Where the leaf scan answers *"what is wrong with *this* leaf?"*, KhetiScan answers *"which corner of my *entire farm* is in trouble, and how is it changing week to week?"*

## 13.2 How it works

1. **Imagery source:** **Copernicus Sentinel-2** (10 m optical/near-infrared, ~5-day revisit) and **Landsat** (30 m, long historical archive) — both free and open.
2. **Geospatial pipeline:** the farm boundary (drawn on a map or from the profile's village/area) is used to clip satellite scenes, processed with **PostGIS** (spatial database) and **Rasterio** (raster processing) on the backend.
3. **Vegetation & water indices** are computed per pixel for each cloud-free pass:
   - **NDVI** (vegetation greenness / biomass) = (NIR − Red) / (NIR + Red)
   - **NDWI** (water content / waterlogging) = (Green − NIR) / (Green + NIR)
4. **Multi-temporal anomaly detection:** the system compares each new pass against the farm's own recent history and the crop's expected stage curve. A zone whose NDVI drops suddenly, or whose NDWI spikes (waterlogging) or collapses (drought), is flagged.
5. **Advisory output:** a simple farm map with colour-coded zones ("this low-lying patch is waterlogged", "this corner shows stress consistent with pest spread — scout here first") plus a prioritised scouting list, pushed as an alert and explained by AgriSaathi.

## 13.3 Why it is a leap forward

- **Lead time, again.** Spectral changes appear in satellite data **before** symptoms are clearly visible to the eye — the same "warn before damage" principle as the weather engine, but from above and at whole-farm scale.
- **Targets the walking.** Instead of scanning every plant, the farmer is told *exactly which rows to walk first* — saving labour and catching outbreaks early.
- **Catches what weather can't.** Waterlogging and drought stress are spatial (a low-lying corner floods while the rest is fine); only a map shows that.
- **Free data, server-side heavy lifting.** The expensive processing runs in the cloud; the farmer still just sees a simple, localised, voice-readable alert on the same phone.

🖼️ **FIGURE R12 — KhetiScan pipeline** (report-only; deck Diagram D11).
**Mermaid:**
```mermaid
flowchart LR
  SAT["🛰️ Sentinel-2 / Landsat<br/>(free, open)"] --> CLIP["🗺️ Clip to farm boundary<br/>PostGIS + Rasterio"]
  CLIP --> IDX["📊 Compute indices per pixel<br/>NDVI = (NIR−Red)/(NIR+Red)<br/>NDWI = (Green−NIR)/(Green+NIR)"]
  IDX --> TIME["🕑 Multi-temporal comparison<br/>(vs farm history & stage curve)"]
  TIME --> FLAG["🚩 Anomaly zones:<br/>waterlogged · drought ·<br/>pest-spread signature"]
  FLAG --> MAP["🗺️ Farm map + priority<br/>scouting list"]
  MAP --> ALERT["🔔 Alert via app +<br/>AgriSaathi (voice/localised)"]
  style SAT fill:#dbeafe,stroke:#2563eb
  style FLAG fill:#fee2e2,stroke:#dc2626
  style ALERT fill:#d1fae5,stroke:#047857
```
**Napkin AI prompt:** *A left-to-right satellite pipeline. Start with a satellite icon "Sentinel-2 / Landsat (free, open)", then a map-clip card "Clip to farm boundary — PostGIS + Rasterio", then a chart card "Compute indices per pixel — NDVI = (NIR−Red)/(NIR+Red); NDWI = (Green−NIR)/(Green+NIR)", then a clock card "Multi-temporal comparison vs farm history", then a red flag card "Anomaly zones — waterlogged, drought, pest-spread", then a farm-map card "Map + priority scouting list", ending in a green bell card "Alert via app + AgriSaathi (voice, localised)". Blue for data, red for anomalies, green for the farmer-facing alert, white background.*

## 13.4 Privacy & access
- Uses **open, public satellite data** — no private imagery, no cameras on the farmer's land.
- Farm boundaries are consent-provided by the farmer.
- Heavy processing is server-side; the phone only receives lightweight, localised map tiles and alerts, preserving the offline-first ethos (the last KhetiScan report is cached like other advisories).

## 13.5 Phased rollout
1. **Phase 1 — NDVI/NDWI farm map** with cloud-free composites, manual farm boundary.
2. **Phase 2 — Multi-temporal anomaly flags** (waterlogged / stressed zones) with scouting priorities.
3. **Phase 3 — Pest-signature correlation**, cross-referenced with the existing weather disease engine and AI leaf scans to raise confidence before alerting.

---

# 14. Roadmap beyond KhetiScan

- **More crops & regions** — extend the crop/stage/threat library beyond paddy, potato and cotton; add region-specific advisories.
- **More languages** — extend the four-language system to additional Indian languages.
- **Live mandi feed** — replace seeded reference prices with a real-time Agmarknet/mandi data feed.
- **Organic produce guidance** — organic pest management and certification-aligned advice.
- **Indigenous & rare seed library** — a searchable library of 100+ rare/indigenous seeds with sowing and care guidance.
- **Community features** — farmer-to-farmer alerting, village-level shared risk maps, and cooperative dashboards (building on the WhatsApp-sharing behaviour already in the app).
- **Hardware companion** *(separate SIH entry)* — on-field sensors and edge-AI camera for soil moisture, micro-weather and on-device vision; the software app remains the farmer-facing layer.

---

# 15. References & research sources

🖼️ **FIGURE R13 — Source chain (hexagon style, same as deck slide 6).** Place here.
**Mermaid:**
```mermaid
flowchart LR
  H1["FAO-56<br/>Irrigation &<br/>Drainage Paper 56"] --> H2["ICAR / CICR<br/>Nagpur<br/>(~40% pest loss)"]
  H2 --> H3["IMD Agromet &<br/>TNAU Agritech<br/>(3–5 day lead)"]
  H3 --> H4["Open-Meteo<br/>(live weather,<br/>keyless)"]
  H4 --> H5["Agmarknet /<br/>local market board<br/>(mandi prices)"]
  H5 --> H6["Copernicus Sentinel<br/>+ Landsat<br/>(KhetiScan)"]
  style H1 fill:#ecfdf5,stroke:#047857
  style H2 fill:#ecfdf5,stroke:#047857
  style H3 fill:#ecfdf5,stroke:#047857
  style H4 fill:#ecfdf5,stroke:#047857
  style H5 fill:#ecfdf5,stroke:#047857
  style H6 fill:#ecfdf5,stroke:#047857
```
**Napkin AI prompt:** *A horizontal chain of six hexagons connected by arrows (zig-zag top/bottom like the winning reference deck), each a cited source with a small "LINK" tag: FAO-56 Irrigation & Drainage Paper 56; ICAR / CICR Nagpur (~40% pest loss); IMD Agromet & TNAU Agritech (3–5 day warning lead); Open-Meteo (keyless live weather); Agmarknet / local market board (mandi prices); Copernicus Sentinel + Landsat (KhetiScan satellite). Soft green hexagons, white background.*

**Key sources:**
1. **FAO Irrigation and Drainage Paper 56 (FAO-56)** — Penman-Monteith reference evapotranspiration and crop coefficients (Kc) used by JalRakshak.
2. **ICAR – Central Institute for Cotton Research (CICR), Nagpur** — pest & disease crop-loss estimates (~40%) for Vidarbha cotton.
3. **IMD Agromet Advisory Services & TNAU Agritech Portal** — weather-warning lead-time guidance (3–5 days) and crop-weather advisories.
4. **Open-Meteo** — free, keyless weather forecast API (WMO weather codes) used live in the app.
5. **Agmarknet / local market board** — mandi commodity price reference (₹/quintal).
6. **Copernicus Sentinel-2 & USGS Landsat** — free, open satellite imagery for the KhetiScan module; indices NDVI/NDWI per standard remote-sensing practice; processing via PostGIS/Rasterio.
7. **Firebase documentation** — phone authentication and test-number (fixed OTP) behaviour for development/demo.

---

# Appendix A — Figures index

| Fig | Title | Format | Deck counterpart |
|---|---|---|---|
| R1 | Problem → solution chain | Flow | D2/D3 |
| R2 | Services mind map | Mind map | D1 |
| R3 | Farmer journey cycle | Flow | D4 |
| R4 | Early-warning logic | Flow | D5 (local brain) |
| R5 | Two diagnosis paths (AI + offline) | Flow | D5 |
| R6 | Offline & fallback behaviour | Flow | D5 |
| R7 | Two-brain architecture | Architecture | D5 |
| R8 | Tech-stack mind map | Mind map | D6 |
| R9 | Impact wheel | Wheel | D8 |
| R10 | Crisis vs AgriShield bars | Bar chart | D9 |
| R11 | Revenue tree | Tree | D7 |
| R12 | KhetiScan pipeline | Flow | D11 (report-only) |
| R13 | References hexagon chain | Hex chain | Slide 6 |

All Mermaid blocks can be rendered at https://mermaid.live (export high-res PNG) or rebuilt in Napkin AI with the provided prompts.

# Appendix B — API endpoints (FastAPI on Render)

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/` | Service root / status |
| `GET` | `/health` | Health check; returns threat count (`threats: 8`) and service status — used to wake the cold backend |
| `POST` | `/get-advisory` | Server-side rule-engine advisory from farm profile + weather (Gemini key stays server-side) |
| `POST` | `/scan` | Accepts a leaf image; runs Gemini vision; returns structured diagnosis JSON |
| `GET` | `/scan/health` | Diagnostic — verifies Gemini key/models without a photo (explains exactly why scan fails) |

**Frontend storage keys:** `agrishield365_phone`, `agrishield365_session` (both cleared on sign-out), `agrishield365_lang`, `agrishield365_story_music`, `agrishield365_tour_done_v1`.
**Demo OTP:** `123456`.

# Appendix C — Team & demo notes

- **Team:** RAVEN ROOTS 🐦‍⬛ · **Theme:** Agriculture, FoodTech & Rural Development · **PS ID:** SIH26131 (Software).
- **Live demo:** https://agrishield365.web.app (OTP `123456`) · **API health:** https://agrishield365-api.onrender.com/health.
- **Before demo:** open the API `/health` ~2 minutes early to wake Render; use an incognito window; verify footer version; have airplane-mode ready to show offline; keep the walkthrough video (unlisted YouTube) and QR code handy.
- **Companion entry:** the hardware problem statement (PS 26180, "AgriShield EDGE") is a *separate* entry with its own report and is intentionally not detailed here.

---

*AgriShield 365 — Every farmer, every season, protected. 🌾🛡️*
