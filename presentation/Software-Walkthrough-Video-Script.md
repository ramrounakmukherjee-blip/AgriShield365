# AgriShield 365 — Full Walkthrough Video Script (YouTube, Unlisted)

**For:** Team RAVEN ROOTS · SIH 2026 · PS SIH26131 — *Early detection and management of crop diseases and pest infestations* (Software)
**Length target:** ~8 minutes · **Tone:** confident, warm, farmer-first · **Pace:** ~130 words/min — slow down, the demo pauses carry time
**You read:** only the lines in **「 」quote blocks**. Everything else is stage direction.
**Pairs with:** slide 2 of the live deck (75% of that slide = the 1:30 cut of THIS video) and the Google Docs detailed report (KhetiScan's full chapter lives there — this video teases it).

---

## 0. Before you hit record — pre-flight checklist

- [ ] **Wake the backend 2 minutes early:** open `https://agrishield365-api.onrender.com/health` in a tab (Render free tier sleeps; cold start is 30–60 s). Wait for the JSON.
- [ ] Use an **Incognito/Private window** so the service worker doesn't serve stale JS. After load, confirm the footer shows **v c83fc52**.
- [ ] **Record in a phone-shaped viewport** — this is a farmer's phone app. Best: real phone screen mirror (scrcpy / QuickTime), or Chrome DevTools → Device Toolbar → iPhone/Pixel (~390 px wide) at 1080p.
- [ ] Turn off desktop/phone notifications, Slack, WhatsApp pop-ups.
- [ ] Have the **demo OTP `123456`** ready. Have a profile already created AND a fresh sign-out ready so you can show onboarding cleanly.
- [ ] Set sowing date so the crop lands in a **critical (red) growth stage** if possible (e.g. paddy day ~70 = heading/flowering) — makes the JalRakshak "critical" note pop.
- [ ] Dry-run once. The AI leaf scan can hit a quota (429) — if it does, show the analyzing moment then gracefully pivot: *"and if the network or service is unavailable, the offline symptom checker below works every single time"* — that fallback is a FEATURE, not an apology.
- [ ] For the offline beat: toggle **airplane mode AFTER the app has loaded once** (cached weather + Saathi + symptom checker still work; live refresh won't — that's the honest demo).
- [ ] TTS: tap the speaker/mic once early — some browsers unlock audio only after a tap.

**YouTube settings:** Unlisted · Title suggestion below · paste the description (with timestamps) · thumbnail = app home screen with a red alert, or the raven logo + tagline.

---

## 1. Timestamp map (also paste into YouTube description)

| Time | Section |
|---|---|
| 0:00 | The problem & intro |
| 0:40 | Language, login & farm setup |
| 1:30 | Today tab — pest & disease early warnings |
| 2:45 | Crop Health — AI leaf scan + offline symptom checker |
| 3:45 | Forecast — 7-day weather & storm lead time |
| 4:35 | JalRakshak — smart irrigation |
| 5:25 | Market — real mandi prices & sell/hold |
| 6:10 | AgriSaathi, offline mode & how it's built |
| 7:05 | Future plans — KhetiScan & beyond |
| 7:45 | Outro & link |

---

## 2. The script

### ▶ SCENE 1 — Hook: the problem (0:00 – 0:40)
**On screen:** Let the in-app **cinematic intro story** play for ~15 s (the farmer, spotted leaves, the black sky), OR open on the Home tab with a red alert visible. Hold the raven logo / tagline at the end.

> 「Every year, a farmer plays a guessing game with everything they own. One morning, the leaves carry spots he has never seen — and by the time he notices, the pest has already spread. Then the sky turns black, and a single night of flood washes away a year of hope — no warning, no time to act.
>
> We are Team RAVEN ROOTS, and this is **AgriShield 365** — early pest and disease warnings, smart irrigation, disaster alerts, and live weather-and-market guidance, in the farmer's own language, on the phone he already owns. *Every farmer, every season, protected.*
>
> This is the live app — agrishield365 dot web app — and I'll walk you through exactly how it works.」

---

### ▶ SCENE 2 — Language, login & one-time farm setup (0:40 – 1:30)
**On screen:** Open the site → tap the 🌐 language button, switch to **हिन्दी** (whole app flips) → back to English → sign in with phone → enter OTP **123456** → walk the onboarding form slowly (name, crop, region, sowing date, irrigation method, soil) → land on Home.

> 「It starts in the farmer's language. AgriShield speaks four — English, Hindi, Bengali, and Marathi — and one tap switches the entire app, because the farmers we built this for in West Bengal and Maharashtra should never have to read English to protect their crop.
>
> You sign in with just a phone number and an OTP — on screen I'm using the demo code, 1-2-3-4-5-6.
>
> Then a one-minute setup: your name, your crop, your sowing date, how you irrigate, your soil. We launch with three crops — Aman paddy and potato for West Bengal, and cotton for Vidarbha in Maharashtra. That sowing date isn't just a form field: the app counts the days and knows exactly which growth stage the crop is in — and that powers almost everything you're about to see.」

---

### ▶ SCENE 3 — "Today" tab: pest & disease early warnings (1:30 – 2:45)
**On screen:** Home tab. Point at the risk banner → open an active alert → tap **"Why this alert?"** → show the plain-language reason → show the **Disease & pest watch** card (or the all-clear state).

> 「This is the home screen — *Today.* Every morning the app pulls the hourly forecast and runs it against a rule engine built from real plant-pathology research: the temperature, humidity and rain windows that trigger specific diseases and pests.
>
> We model eight of the region's biggest threats — rice blast and sheath blight in paddy; late and early blight in potato; bacterial blight, fusarium wilt, bollworm and whitefly in cotton. Rice blast, for example, fires when humidity stays above ninety percent with cool mornings for about three days — the exact damp conditions the fungus needs.
>
> When risk rises, a red alert appears here — *days before visible damage*. And when the farmer taps "Why this alert?", he gets a plain-language explanation — never a black box. Pests and diseases can destroy up to forty percent of a crop before it's even noticed. This moves detection from guesswork to early warning.」

---

### ▶ SCENE 4 — Crop Health: AI leaf scan + offline symptom checker (2:45 – 3:45)
**On screen:** Home → **Crop health** → **"Scan a leaf for disease"** → show camera/photo → "analyzing" screen (spots, wilting, pests, discoloration) → result card with the advisory line. Back out → open the **symptom checker** → answer 2–3 questions → diagnosis.

> 「Under Crop Health there are two ways to check a plant. The first is an **AI leaf scan**: point the camera at a leaf, and a vision model checks for spots, wilting, pests and discoloration — then names the likely threat and what to do about it. We always show this line: it is an AI advisory — confirm with your KVK or agriculture officer before spraying.
>
> The second works with **no internet at all** — a symptom checker that asks simple questions: where are the spots, what colour, which part of the plant? It reasons to the same threat library, fully offline, right on the phone. So even standing in a field with no signal, the farmer is never alone.」

---

### ▶ SCENE 5 — Forecast: 7-day weather & storm lead time (3:45 – 4:35)
**On screen:** **Forecast tab** (calendar icon) → scroll the 7-day cards → show hourly rain probability → point at a heavy-rain day.

> 「The Forecast tab shows a seven-day outlook plus a 24-hour hourly view, powered by a free, keyless global weather service. The subtitle says it all — *rain probability drives disease warnings*. The same forecast that flags a wet week for blight also gives flood and heavy-rain lead time.
>
> Remember that night the flood came with no warning? Here, the farmer sees the storm **three to five days ahead** — time to move harvested grain to higher ground, open the drainage channels, delay spraying. His phone knows the sky is turning black — before it does.」

---

### ▶ SCENE 6 — JalRakshak: smart irrigation (4:35 – 5:25)
**On screen:** **Water tab** (droplet icon). Show the growth-stage label, the red **critical stage** note, today's irrigation plan, and (if shown) the green *"No irrigation needed — forecast rain covers your crop's water need."*

> 「The Water tab is **JalRakshak** — our smart irrigation planner. It follows the FAO-56 standard — the same crop-water method researchers use — with a crop coefficient for every growth stage. Because the app knows the sowing date, it knows the crop is, say, in flowering — its most water-sensitive stage, where missing one irrigation causes the highest yield loss. It flags that in red.
>
> Then it subtracts the rain that's actually coming. If rain is forecast, it tells the farmer plainly: no irrigation needed — the rain covers your crop. That saves diesel, saves water, and prevents both drought stress and over-watering. And it recalculates every single day.」

---

### ▶ SCENE 7 — Market: real mandi prices & sell/hold (5:25 – 6:10)
**On screen:** **Market tab** (trending icon). Show today's price ₹/quintal, the cost-of-production margin, the 14-day trend chart, the sell/hold advice, "Local market board · Updated today."

> 「The Market tab answers the question every farmer asks at harvest: *sell now, or hold?* It shows today's local mandi price per quintal — sourced from the local market board, updated today — next to the cost of production, so the farmer sees his actual margin. A fourteen-day trend shows which way prices are moving, and the app gives simple sell-or-hold guidance.
>
> No more selling in panic to the first trader, because he never knew the real price.」

---

### ▶ SCENE 8 — AgriSaathi, offline & the architecture (6:10 – 7:05)
**On screen:** Tap the **AgriSaathi mascot** → tap a quick chip ("Any pest risk?" / "When to irrigate?") → tap the speaker to hear Hindi/English voice → tap **Share** on an advisory (WhatsApp sheet) → then **toggle airplane mode** → tap through tabs and the symptom checker — everything still works → toggle back.

> 「Meet **AgriSaathi** — the farmer's companion, built right into the app. Ask about the weather, pest risk, when to irrigate, or whether to sell — or just tap the microphone and speak. She answers in the farmer's language and can even talk back, in Hindi and English.
>
> Here's what makes her different: there is no expensive chatbot service behind her. Her answers are generated locally, from the farmer's own live data — which means she works in airplane mode, never fails, and never runs out of quota. And every advisory card can be shared straight to WhatsApp, so warnings spread farmer to farmer.
>
> This is our two-brain design: a **local rule engine** that always works — weather, irrigation, market, symptoms — and a **cloud AI brain** for the heavy vision task. The app is a progressive web app: install it to the home screen once and it keeps working offline. The backend is a lightweight FastAPI cloud service — and if it ever sleeps, the app never blocks; it quietly falls back to local logic.」

---

### ▶ SCENE 9 — Future plans: KhetiScan & beyond (7:05 – 7:45)
**On screen:** Simple roadmap visuals / the gold KhetiScan teaser band from deck slide 5 / satellite-field concept imagery. Keep it moving — this is a tease; the full chapter is in the written report.

> 「So where does this go next? Our biggest upcoming module is **KhetiScan** — satellite crop intelligence. Using free Sentinel and Landsat imagery, we compute NDVI and NDWI — vegetation and water indices — across the entire farm, over time, and automatically flag waterlogged fields and spreading pest zones *before anyone walks the field*. The farmer sees trouble from above, days early.
>
> Beyond that: guidance for organic produce, a library of over a hundred rare and indigenous seeds, support for many more crops and regions, and community features so farmers can warn and help each other. The vision is the one we started with — protection for every farmer, every season.」

---

### ▶ SCENE 10 — Outro (7:45 – 8:00)
**On screen:** QR code (use `presentation/assets/agrishield365-qr-labeled.png`) + the URL `agrishield365.web.app` + raven logo + team name.

> 「AgriShield 365 is live right now — the link and QR code are on screen. Open it, log in with the demo code, and try it yourself.
>
> We are Team RAVEN ROOTS. Thank you for watching — and here's to every farmer, every season, protected.」

---

## 3. YouTube description (copy-paste)

```
AgriShield 365 — early pest & disease warnings, smart irrigation, disaster alerts
and live weather–market guidance, in the farmer's own language. Built for SIH 2026
by Team RAVEN ROOTS.

🔗 Try the live app: https://agrishield365.web.app
📱 Demo login OTP: 123456
📄 Full detailed report: [paste Google Docs link]

⏱ Timestamps:
0:00  The problem & intro
0:40  Language, login & farm setup
1:30  Today tab — pest & disease early warnings
2:45  Crop Health — AI leaf scan + offline symptom checker
3:45  Forecast — 7-day weather & storm lead time
4:35  JalRakshak — smart irrigation
5:25  Market — real mandi prices & sell/hold
6:10  AgriSaathi, offline mode & how it's built
7:05  Future plans — KhetiScan & beyond
7:45  Outro & link

Crops: Aman Paddy (West Bengal), Potato (West Bengal), Cotton (Vidarbha, Maharashtra).
Languages: English, हिन्दी, বাংলা, मराठी. Works offline as an installable app.
```

## 4. Recording tips

- **Smile when you say the tagline** — "Every farmer, every season, protected" is the earworm; land it twice (intro + outro).
- Read slowly. If you finish under 7 minutes, you went too fast — let the screens breathe.
- Click first, speak second — let the viewer see the screen change, then explain it.
- If any live feature glitches, use the line: *"and even without connection, the app keeps working"* — then show the offline path. The fallback IS the story.
- Export at 1080p. Keep it **unlisted**. After upload, paste the YouTube link into deck slide 2 and generate/replace the QR if you make a QR for the video.
