# AgriShield 365 🛡️🌾

Every farmer, every season, protected — early disaster warnings, crop disease
detection, and weather/market advisories in the farmer's language, on their phone,
365 days a year.

## The experience

The web app tells a story first, then becomes a tool:

1. **Cinematic story** — seven illustrated scenes following a farmer's journey:
   hope at sowing → thriving crop → pest shock → flood disaster → help arrives
   via smartphone → AgriShield 365 → a confident new beginning.
2. **Farmer login** — simple phone + OTP (no passwords; demo OTP is `1357`).
3. **Farm setup** — name, farm location (tap/drag on a map or use GPS), standing
   crop, field area, soil & irrigation details.
4. **Dashboard** — today's advisories: weather alerts (English + Hindi),
   temperature/moisture/humidity/wind, crop growth stage & progress, a risk
   gauge, the field on a map, step-by-step recommendations, and market prices.

The dashboard is **mobile-first and fully responsive**, with bilingual
(English / हिन्दी) labels throughout.

## Tech stack

- React 19 + Vite
- Tailwind CSS 4
- Framer Motion (animations)
- Leaflet / react-leaflet (maps)
- lucide-react (icons)

## Running the app

```bash
cd dashboard
npm install
npm run dev      # start dev server
npm run build    # production build
npm run preview  # preview the build
```

## Repository structure

| Path | What it is |
| --- | --- |
| `dashboard/` | The AgriShield 365 web app (main project) |
| `assests-agrishield365/` | SIH project asset PDFs and logo |
| `lets-scroll-main/` | Reference scroll-animation toolkit |
| `scratch/` | Asset extraction / PDF helper scripts |
