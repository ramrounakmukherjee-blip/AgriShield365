# SIH PPT — winner-deck style analysis (AgriShield 365 / RAVEN ROOTS)

Source: 12 slides from past SIH winning teams (DevWise 2024, Tech_Busters 2024,
GeoGuards 2025, Innovators/WSI 2024). We must use the OFFICIAL 6-slide SIH 2026
template; this note records the visual/content patterns winners use WITHIN it.

## Recurring winning patterns

1. **Diagrams over paragraphs.** Mind maps with a central node + rounded colored
   boxes connected by DASHED lines (DevWise tech-stack; WSI APP node fanning to
   Police/Family/Friends/Alerts/SOS). One short phrase per node.
2. **Two-panel slides**: left panel = text/bullets, right panel = diagram or
   REAL PRODUCT SCREENSHOTS.
3. **Color-coded category bands** stacked vertically: teal / purple / pink
   (or green/orange/blue) header blocks, each with a light bullet box beside it
   (WSI feasibility: FEASIBILITY / CHALLENGES & RISKS / STRATEGIES).
4. **Vertical step pipeline** for methodology: Step I → II → III → IV → V in
   colored rounded boxes; side boxes for sub-technologies (GeoGuards technical);
   branch-out ovals for outcomes (DATA → Low/Medium/High risk).
5. **Chevron/arrow benefit chain**: Social → Economic → Environmental, each
   chevron pointing into an outcome box.
6. **Beneficiary matrix table**: colored column headers (group A / B / C),
   bullet rows per group (WSI: women / law enforcement / urban communities).
7. **Pie/donut charts** for risk/challenge breakdown with % and callout boxes
   around segments (GeoGuards); half-pie + links table for references.
8. **Winding road timeline** with numbered milestone dots for the roadmap
   (Tech_Busters 01–06).
9. **Numbered circular badges around a central illustration** (Tech_Busters
   01 Frontend … 06 Chatbot).
10. **Thematic anchor image** on solution slide (GeoGuards mine cross-section) —
    WE use our cinematic story paintings / mascot.
11. **Rounded black-outline boxes** for emphasis (GeoGuards impact/problem).
12. Team logo in the top-left OVAL (our RAVEN ROOTS raven); SIH bulb top-right.

## What WE have that beats most of these examples
- A LIVE deployed app (agrishield365.web.app) + QR code on slide 3 — judges scan.
- Real screenshots: cinematic story w/ sound, OTP auth, map onboarding, alerts
  with Why?, JalRakshak litres, forecast charts, AgriSaathi sprout chat, coach tour.
- Two-brain architecture = a clean central-node diagram (phone PWA ↔ FastAPI ↔
  Firebase/Open-Meteo/Gemini) with an "works in airplane mode" badge.
- Big numbers: 40% yield loss (CICR), 30% water (FAO-56), 3–5 day lead (IMD/TNAU).
- The sprout mascot + story art give us character most decks lack.

## Mapping onto the 6 official slides
- **S1 Title**: form-fill (PS ID, title, theme, Software, Team ID, RAVEN ROOTS);
  raven logo in oval top-left.
- **S2 Proposed Solution**: GeoGuards-style 3 columns — left "addresses the
  problem" box; center story screenshot/scene art; right solution-overview
  boxes (8 threats engine, FAO-56 irrigation, AgriSaathi, Crop Health, offline);
  innovation/uniqueness strip; live link + QR.
- **S3 Technical Approach**: left = vertical pipeline (Language → phone OTP →
  GPS pin → Open-Meteo → rule engine [8 pest models, ICAR/TNAU thresholds] +
  FAO-56 Kc irrigation → alerts + Why → voice/share/AgriSaathi; Gemini scan
  side box; FastAPI cloud brain side box); right = tech-stack mind map (React/
  Vite/Tailwind, FastAPI/Python, Firebase, Open-Meteo, Gemini, Leaflet/OSM,
  Web Speech/Audio, PWA) + 3 real screenshots + QR.
- **S4 Feasibility & Viability**: 3 colored bands — Feasibility (technical:
  live; financial: ~₹0 free tiers, scales to Blaze; social: 4 languages+voice);
  Challenges & risks (village connectivity, SMS billing/BILLING_NOT_ENABLED,
  Gemini quota, digital literacy, advice accuracy); Strategies (offline-first
  PWA, whitelisted test auth + Blaze path, local rule engine + premium AI tier,
  story onboarding + AgriSaathi coach + voice, ICAR/TNAU/FAO grounding + KVK
  disclaimer). Viability footer: distribution via KVK/state agri dept/WHATSAPP
  share; premium AI tier.
- **S5 Impact & Benefits**: beneficiary matrix (smallholder farmers / extension
  workers-KVK / govt-agriculture dept) × outcomes; chevron chain Social
  (language+voice inclusion, 3–5d disaster lead) → Economic (protect ~40%
  yield, sell/hold mandi, ~30% water saving) → Environmental (threshold-based
  spraying cuts chemicals, timed irrigation saves water); winding-road roadmap
  (pilot 3 crops → all SIH districts → Blaze real SMS + push → live Agmarknet
  feed → 22 languages → KVK dashboards).
- **S6 Research & References**: organized links — ICAR CICR Nagpur, TNAU
  Agritech Portal, FAO-56 Paper 56, IMD Agromet, Agmarknet, Open-Meteo docs,
  Firebase/Render/Gemini docs; live app URL, GitHub repo, API health endpoint;
  mention our pest-threshold matrix (rules.json/rules.js) built from sources.

## Style rules when drafting text
- Short phrase nodes, not sentences (diagram labels ≤ 5 words).
- Every slide max 6–8 bullets; bold key numbers.
- Speaker notes carry the sentences; slides stay visual.
- Palette: SIH navy heading + our emerald/green brand accents; keep the blue
  footer bar from the official template.
