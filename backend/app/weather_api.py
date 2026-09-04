"""
weather_api.py — clean Open-Meteo forecast for AgriShield 365.

This is the Data Engineer's module (reference implementation). It fetches the
7-day + hourly forecast and returns a dict in the EXACT shape the frontend
uses. No API key required.

    from weather_api import get_weather
    data = get_weather(21.15, 79.09)   # Nagpur (cotton / Vidarbha)
    print(data["daily"][0])

Run directly to self-test:  python weather_api.py
"""

import requests

OPEN_METEO = "https://api.open-meteo.com/v1/forecast"
TIMEOUT_SECONDS = 15


def get_weather(lat: float, lon: float) -> dict:
    """Fetch the forecast. Returns a clean dict (see shape in data spec)."""
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": ",".join([
            "temperature_2m", "relative_humidity_2m", "precipitation",
            "weather_code", "wind_speed_10m",
        ]),
        "hourly": ",".join([
            "temperature_2m", "relative_humidity_2m", "precipitation",
            "precipitation_probability", "weather_code",
        ]),
        "daily": ",".join([
            "temperature_2m_max", "temperature_2m_min", "precipitation_sum",
            "precipitation_probability_max", "relative_humidity_2m_mean",
            "et0_fao_evapotranspiration", "wind_speed_10m_max", "weather_code",
        ]),
        "timezone": "auto",
        "forecast_days": 7,
    }
    last_err = None
    for attempt in (1, 2):  # one retry on transient failure
        try:
            r = requests.get(OPEN_METEO, params=params, timeout=TIMEOUT_SECONDS)
            r.raise_for_status()
            return _normalize(r.json())
        except Exception as e:  # network/API problem — retry, then signal failure
            last_err = e
            print(f"[weather_api] Open-Meteo fetch attempt {attempt} failed: {e}")
    return {"source": "error", "error": str(last_err),
            "current": None, "daily": [], "hourly": []}


def _round1(x):
    return round(float(x), 1) if x is not None else 0.0


def _normalize(data: dict) -> dict:
    d = data["daily"]
    daily = [
        {
            "date": d["time"][i],
            "tempMax": _round1(d["temperature_2m_max"][i]),
            "tempMin": _round1(d["temperature_2m_min"][i]),
            "rain": _round1(d["precipitation_sum"][i]),
            "rainPct": int((d.get("precipitation_probability_max") or [0] * 7)[i] or 0),
            "humidity": int((d.get("relative_humidity_2m_mean") or [70] * 7)[i] or 70),
            "et0": _round1((d.get("et0_fao_evapotranspiration") or [4.0] * 7)[i]),
            "wind": _round1((d.get("wind_speed_10m_max") or [8.0] * 7)[i]),
            "code": int(d["weather_code"][i] or 0),
        }
        for i in range(len(d["time"]))
    ]

    h = data["hourly"]
    hourly = []
    for i in range(0, len(h["time"]), 3):  # every 3rd hour -> ~24 points
        hourly.append({
            "time": h["time"][i],
            "temp": _round1(h["temperature_2m"][i]),
            "humidity": int(h["relative_humidity_2m"][i] or 0),
            "rain": _round1(h["precipitation"][i]),
            "rainPct": int((h.get("precipitation_probability") or [0] * len(h["time"]))[i] or 0),
            "code": int(h["weather_code"][i] or 0),
        })
        if len(hourly) >= 24:
            break

    c = data.get("current", {})
    return {
        "source": "open-meteo",
        "current": {
            "temp": _round1(c.get("temperature_2m")),
            "humidity": int(c.get("relative_humidity_2m", 0) or 0),
            "rain": _round1(c.get("precipitation")),
            "wind": _round1(c.get("wind_speed_10m")),
            "code": int(c.get("weather_code", 0) or 0),
        },
        "daily": daily,
        "hourly": hourly,
    }


if __name__ == "__main__":
    import json
    tests = {"Paddy (WB ~Burdwan)": (23.23, 87.86),
             "Potato (WB ~Hooghly)": (22.90, 88.39),
             "Cotton (Vidarbha ~Nagpur)": (21.15, 79.09)}
    for name, (la, lo) in tests.items():
        w = get_weather(la, lo)
        print(f"\n=== {name} === source={w.get('source')}, "
              f"days={len(w['daily'])}, hours={len(w['hourly'])}")
        if w["daily"]:
            print("today:", json.dumps(w["daily"][0], ensure_ascii=False))
