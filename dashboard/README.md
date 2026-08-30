# AgriShield 365 — Dashboard

Story-first farmer protection app. Journey: **language picker → cinematic story →
phone/OTP login → farm setup (map, crop, inputs) → personalized advisory dashboard**.

## Languages

The entire app is available in **English, हिन्दी, বাংলা and मराठी**. Users choose
their language on the welcome screen and can switch anytime via the 🌐 button.
The choice is persisted in `localStorage`; fonts (Noto Sans Devanagari / Bengali)
switch automatically. All translations live in `src/lib/i18n.js`, and domain
data labels in `src/lib/agri.js`.

## Scripts

```bash
npm install
npm run dev      # development server
npm run build    # production build
npm run lint     # oxlint
npm run preview  # preview production build
```

## Notes

- Demo OTP code is **`1357`** (no backend in this build; sessions persist in
  `localStorage`).
- Farm location defaults to central India — tap/drag the map pin or press
  **Use my GPS** during setup.
- Insights (weather, risk, alerts, market prices) are deterministically generated
  from the farmer's location/crop in `src/lib/agri.js`, so each demo farm is
  stable and unique. Ready to be swapped for real API calls.
