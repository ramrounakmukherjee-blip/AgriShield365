"""
rules_engine.py — AgriShield 365 rule engine (Python mirror of the frontend
src/lib/rules.js). It scores disease/pest risk from the forecast and the crop
growth stage. Thresholds are loaded from data/rules.json (researcher-editable).

NOTE: advisory TEXT (titles/translated actions) lives in the frontend; the
backend returns structured ids/severity/scores that the client maps to its
existing multilingual content.
"""

import json
from pathlib import Path

_DATA = json.loads((Path(__file__).parent / "data" / "rules.json").read_text())
CROPS = _DATA["crops"]
THREATS = _DATA["threats"]

# Irrigation efficiency (per method) and soil water factor — mirrors agri.js.
IRRIGATION_EFFICIENCY = {"drip": 0.9, "sprinkler": 0.75, "flood": 0.55, "rainfed": 1.0}
SOIL_FACTOR = {"loamy": 1.0, "clay": 1.1, "black": 1.15, "red": 0.9, "sandy": 0.8}


def get_stage(crop_id: str, days_elapsed: int) -> dict:
    crop = CROPS[crop_id]
    days = max(0, int(days_elapsed or 0))
    idx = 0
    for i, st in enumerate(crop["stages"]):
        if days >= st["days"][0]:
            idx = i
    stage = crop["stages"][idx]
    progress = max(3, min(99, round(days / crop["baseDays"] * 100)))
    return {"stageIndex": idx, "kc": stage["kc"],
            "critical": bool(stage.get("critical")), "progress": progress, "days": days}


def _day_matches(day: dict, t: dict) -> bool:
    temp_ok = day["tempMax"] >= t["minTemp"] and day["tempMin"] <= t["maxTemp"]
    hum_ok = True
    if t.get("minHumidity", 0) > 0:
        hum_ok = day["humidity"] >= t["minHumidity"]
    if t.get("maxHumidity"):
        hum_ok = hum_ok and day["humidity"] <= t["maxHumidity"]
    rain_ok = True
    if t.get("rainNeeded", 0) > 0:
        rain_ok = day["rain"] >= t["rainNeeded"]
    return temp_ok and hum_ok and rain_ok


def evaluate_threats(daily: list, crop_id: str, stage_index: int) -> list:
    results = []
    for t in THREATS:
        if t["crop"] != crop_id:
            continue
        window = daily[:7]
        best_run = run = trigger_day = 0
        run_start = -1
        total_rain = 0.0
        for i, d in enumerate(window):
            total_rain += d.get("rain", 0)
            match = _day_matches(d, t)
            if t.get("waterlogging"):
                special = d["rain"] >= 20
            elif t.get("dry"):
                special = d["rain"] < 1 and d["tempMax"] >= t["minTemp"]
            else:
                special = True
            if match and special:
                if run == 0:
                    run_start = i
                run += 1
                if run > best_run:
                    best_run = run
                    trigger_day = run_start
            else:
                run = 0
        if trigger_day == 0 and best_run == 0:
            trigger_day = 0

        weather_score = min(1.0, best_run / t["windowDays"])
        rain_bonus = 0.25 if (t.get("rainNeeded", 0) > 0 and total_rain >= t["rainNeeded"] * 2) else 0
        stage_score = 1.0 if stage_index in t["vulnerableStages"] else 0.45
        score = round(min(1.0, weather_score * 0.65 + rain_bonus * 0.65) * stage_score * 100
                      + (15 if weather_score > 0 and stage_index in t["vulnerableStages"] else 0))
        score = min(99, score)
        if score >= 60:
            results.append({"id": t["id"], "threatType": t["type"],
                            "kind": "critical" if score >= 80 else "warning",
                            "score": score, "daysAhead": trigger_day})
    results.sort(key=lambda r: r["score"], reverse=True)
    return results


def evaluate_weather(daily: list, hourly: list) -> list:
    alerts = []
    rain3 = sum(h.get("rain", 0) for h in (hourly or [])[:72])
    heavy_day = next((i for i, d in enumerate(daily[:3]) if d.get("rain", 0) >= 60), None)
    if rain3 > 60 or heavy_day is not None:
        alerts.append({"id": "heavy_rain", "kind": "critical",
                       "daysAhead": heavy_day if heavy_day is not None else 1})
    hot_run = sum(1 for d in daily[:4] if d.get("tempMax", 0) >= 38)
    if hot_run >= 2:
        alerts.append({"id": "heatwave", "kind": "warning",
                       "daysAhead": next((i for i, d in enumerate(daily[:4]) if d["tempMax"] >= 38), 0)})
    dry_days = sum(1 for d in daily[:6] if d.get("rain", 0) < 1)
    if dry_days >= 5 and heavy_day is None:
        alerts.append({"id": "dry_spell", "kind": "info", "daysAhead": 4})
    return alerts


def compute_advisory(weather: dict, crop_id: str, days_elapsed: int = 42,
                     irrigation: str = "flood", soil: str = "loamy", area: float = 1) -> dict:
    """Combine weather + stage + rules into the structured advisory payload."""
    stage = get_stage(crop_id, days_elapsed)
    daily = weather.get("daily", [])
    hourly = weather.get("hourly", [])
    threat_alerts = evaluate_threats(daily, crop_id, stage["stageIndex"])
    weather_alerts = evaluate_weather(daily, hourly)

    # FAO-56 irrigation plan (mm + litres), mirrors getIrrigation().
    eff = IRRIGATION_EFFICIENCY.get(irrigation, 0.9)
    soil_f = SOIL_FACTOR.get(soil, 1.0)
    plan = []
    for i, d in enumerate(daily[:4]):
        crop_need = stage["kc"] * d.get("et0", 4)
        net_need = max(0.0, crop_need - d.get("rain", 0))
        need_mm = round((net_need / eff) * soil_f, 1)
        plan.append({"date": d["date"], "rainMm": d.get("rain", 0), "needMm": need_mm,
                     "skip": d.get("rain", 0) >= crop_need * 0.8,
                     "critical": bool(stage["critical"] and i == 0)})
    today = dict(plan[0]) if plan else {"needMm": 0.0, "skip": False}
    litres_per_acre = round(today.get("needMm", 0) * 4047)
    today.update({"litresPerAcre": litres_per_acre,
                  "litresTotal": round(litres_per_acre * (area or 1)), "area": area or 1})

    return {"crop": crop_id, "stage": stage, "kc": stage["kc"],
            "alerts": threat_alerts + weather_alerts,
            "irrigation": {"kc": stage["kc"], "plan": plan, "today": today},
            "weatherSource": weather.get("source")}
