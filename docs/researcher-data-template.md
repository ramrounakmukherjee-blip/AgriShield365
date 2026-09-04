# AgriShield 365 — Researcher Data Template (Missions 1, 2, 3)

**For:** Researcher / agronomy lead
**What this is:** The exact numbers our app needs to turn from "placeholder" into
"verified by research." You do **NOT** need to code. Just fill in / correct the
numbers in the tables below.

### How to give it back (any one is fine)
1. Fill the tables in this file and send it back, **or**
2. Make your own table (Word/Excel/Google Sheets/PDF) with the **same columns and
   the same rows** — do **not** add or remove rows, and do **not** rename the
   **Code** values, **or**
3. Write your usual report PDF, but make sure it contains, for each disease, the
   numbers listed in Mission 1 (temperature range, humidity, rain trigger, crop
   stage). We will convert it.

> ⚠️ **Units matter:** temperature in **°C**, humidity in **%**, rainfall in
> **mm**, time in **days after sowing**. If you are unsure of an exact number,
> give a **range** and note your **source**.
>
> 📚 Trusted sources to cite: **ICAR (icar.org.in)**, **TNAU Agritech Portal**,
> **FAO‑56** (Irrigation & Drainage Paper 56, for Kc values), **CICR Nagpur**
> (cotton), **NCRB** (farmer distress/loss stats), state agriculture departments.

The grey/placeholder numbers already in the tables are our **temporary guesses** —
please correct them with verified values.

---

## 🌾 Mission 1 — Disease & Pest trigger matrix

The app compares the **weather forecast** against these thresholds to warn the
farmer *before* a disease/pest outbreak. Fill in the conditions for each of the
**8 rows below (do not add/remove rows or change the Code).**

**How to read the columns**
- **Min temp / Max temp (°C):** the temperature band in which the problem thrives.
- **Min humidity / Max humidity (%):** humidity band. Leave Max humidity blank if
  there is no upper limit.
- **Rain needed (mm):** minimum rainfall that helps it spread. Put **0** if rain is
  not required.
- **Risk window (days):** how many days in-a-row of matching weather are needed
  before risk becomes high.
- **Vulnerable stages:** which crop growth stages are at risk (see stage guide
  under Mission 2). Use numbers 0–3. Example: `1,2`.
- **Trigger condition:** one line in plain words (e.g. "2 days of leaf wetness
  after rain").
- **Preventive action (English):** 1–2 sentences of what the farmer should *do*.
  (We will translate it to Hindi/Bengali/Marathi.)

| Code (do not change) | Disease / Pest | Crop | Type | Min temp °C | Max temp °C | Min humidity % | Max humidity % | Rain needed mm | Risk window (days) | Vulnerable stages (0–3) | Trigger condition (plain words) | Preventive action (English, 1–2 lines) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `rice_blast` | Rice Blast (*Magnaporthe oryzae*) | Paddy | disease | 22 | 28 | 90 |  | 0 | 3 | 1,2 | Cool humid mornings, leaf wetness | Avoid excess nitrogen; ensure drainage; keep preventative fungicide ready if humidity stays high. |
| `sheath_blight` | Sheath Blight (*Rhizoctonia solani*) | Paddy | disease | 28 | 33 | 85 |  | 0 | 3 | 1,2 | Hot humid weather, dense canopy | Reduce dense spacing, avoid over-watering, inspect lower leaf sheaths for grey lesions. |
| `late_blight` | Late Blight (*Phytophthora infestans*) | Potato | disease | 10 | 24 | 90 |  | 2 | 2 | 1,2,3 | Cool wet spell; spray BEFORE the rain | Spray preventative fungicide before the wet spell; stop irrigation while foliage is wet. |
| `early_blight` | Early Blight (*Alternaria solani*) | Potato | disease | 24 | 30 | 75 |  | 0 | 4 | 1,2,3 | Warm humid weather, older leaves | Rotate fungicide sprays, remove affected lower leaves, maintain potassium nutrition. |
| `bacterial_blight` | Bacterial Blight / Angular Leaf Spot (*Xanthomonas…malvacearum*) | Cotton | disease | 25 | 35 | 70 |  | 5 | 2 | 1,2 | Rain-splash spreads bacteria after ≥5mm rain | Avoid field work on wet plants, ensure drainage, copper-based spray after rain. |
| `fusarium_wilt` | Fusarium Wilt (*Fusarium oxysporum f.sp. vasinfectum*) | Cotton | disease | 30 | 38 | 0 |  | 20 (waterlogging) | 5 | 1,2 | Standing water + heat (waterlogging) | Prevent all standing water, improve drainage, scout for wilting plants. |
| `bollworm` | Bollworm (*Helicoverpa armigera*) | Cotton | pest | 25 | 33 | 60 |  | 0 | 5 | 2 | Warm humid weather at flowering/boll stage | Install pheromone traps, scout bolls for holes, use IPM spray at economic threshold. |
| `whitefly` | Whitefly (*Bemisia tabaci*) | Cotton | pest | 30 | 42 | 0 | 65 | 0 (dry) | 5 | 1,2 | Hot dry weather; flies up on shaking | Avoid broad insecticides that kill predators; use yellow sticky traps. |

✅ **Please verify/correct every number in the table above** (especially
temperature/humidity bands and the rain thresholds) and add your source in a note.

---

## 💧 Mission 2 — JalRakshak: crop water need (FAO‑56 Kc) by growth stage

The app tells the farmer **how much to irrigate** using the FAO‑56 formula
`water need = Kc × evaporation`. We need the **Kc coefficient** for each growth
stage of each crop. Fill in the **day ranges** and **Kc values**.

**Stage numbering used by the app:** stage **0** = first / nursery,
**1** = mid vegetative, **2** = flowering / critical (peak water),
**3** = ripening / maturity. Mark **Critical? = yes** for the stage where missing
irrigation causes the biggest yield loss.

### 🌾 Paddy / Aman Rice  (total crop ≈ 120 days)
| Stage | Name | From day | To day | Kc value | Critical? (yes/no) |
|---|---|---|---|---|---|
| 0 | Nursery / early transplant | 0 | 30 | 1.05 | no |
| 1 | Tillering | 30 | 65 | 1.15 | no |
| 2 | Heading & flowering | 65 | 100 | 1.20 | **yes** |
| 3 | Ripening | 100 | 120 | 0.85 | no |

### 🥔 Potato  (total crop ≈ 90–110 days)
| Stage | Name | From day | To day | Kc value | Critical? (yes/no) |
|---|---|---|---|---|---|
| 0 | Emergence | 0 | 25 | 0.50 | no |
| 1 | Tuber initiation | 25 | 50 | 0.75 | no |
| 2 | Tuber bulking | 50 | 80 | 1.15 | **yes** |
| 3 | Maturation | 80 | 110 | 0.85 | no |

### 🌱 Cotton  (total crop ≈ 150–180 days)
| Stage | Name | From day | To day | Kc value | Critical? (yes/no) |
|---|---|---|---|---|---|
| 0 | Emergence | 0 | 30 | 0.35 | no |
| 1 | Squaring | 30 | 75 | 0.75 | no |
| 2 | Flowering & boll formation | 75 | 120 | 1.18 | **yes** |
| 3 | Boll opening & harvest | 120 | 180 | 0.75 | no |

> Note our cotton peak Kc ≈ **1.18** around day 75–120 — please confirm against
> FAO‑56 Table 12 / CICR guidance and correct the day ranges for the Vidarbha
> sowing window.

---

## 📊 Mission 3 — "Why it matters" impact stats (for the pitch)

The home screen shows 3 headline numbers to explain why the product matters.
Please give **verified figures with a source**. Replace our placeholders.

| # | Stat (short value) | One-line text (English) | Source |
|---|---|---|---|
| 1 | **40%** | of Vidarbha cotton yield is lost to pests & disease each year | _(verify: CICR / state agri dept)_ |
| 2 | **3–5 days** | is the lead time early weather warnings give a farmer | _(verify / cite)_ |
| 3 | **30%** | water saving possible with stage-timed irrigation | _(verify: FAO / irrigation studies)_ |

If you have a stronger, well-sourced stat for West Bengal (paddy/potato loss,
farmer indebtedness from NCRB, pesticide over-spend), feel free to suggest a
replacement — we want the most credible, citable numbers available.

---

### ✅ Checklist before you send it back
- [ ] All 8 disease rows have verified temp/humidity/rain/window/stage values
- [ ] Each disease has a short preventive action (English is fine)
- [ ] Kc tables for paddy, potato, cotton are confirmed (day ranges + Kc)
- [ ] 3 impact stats have a source
- [ ] Units are °C / % / mm / days

Thank you! 🙏 This data is what makes the advisories trustworthy.
