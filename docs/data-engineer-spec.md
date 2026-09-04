# AgriShield 365 — Data Engineer Spec: Weather API

**For:** Data engineer
**Goal:** One Python file, `weather_api.py`, with one function
`get_weather(lat, lon)` that fetches the forecast from the free **Open-Meteo**
API (no API key needed) and returns a **clean dictionary** in the **exact shape**
our app uses.

### Why the exact shape matters
The frontend already renders the 7-day forecast, the 72-hour charts, and the
irrigation advice from this data. If you return the field names below
**verbatim**, it plugs in with zero changes. (If names differ, we have to
rewrite code — so please keep them exactly as written, including `tempMax`,
`rainPct`, `et0`, etc.)

### The complete code is already written below
You can hand in the file as-is if it runs. We'd love you to **test it**,
**document the data**, and optionally improve it (retries, caching, units).

---

## ✅ The exact output format
`get_weather(lat, lon)` returns a dict like this:

```python
{
  "source": "open-meteo",          # or "mock" if the call failed
  "current": {                     # conditions right now
     "temp": 29.4, "humidity": 84, "rain": 0.0, "wind": 11.2, "code": 63
  },
  "daily": [                       # 7 entries (one per day)
     {
       "date": "2026-09-04",       # YYYY-MM-DD
       "tempMax": 31.2,            # day max temp °C
       "tempMin": 24.8,            # day min temp °C
       "rain": 12.4,               # total rainfall mm
       "rainPct": 80,              # max precipitation probability % (0-100)
       "humidity": 85,             # mean relative humidity %
       "et0": 4.1,                 # reference evapotranspiration mm (FAO-56)
       "wind": 14.0,               # max wind km/h
       "code": 63                  # WMO weather code (for the icon)
     },
     # ... 6 more days
  ],
  "hourly": [                      # every 3 hours for ~72h = 24 entries
     {
       "time": "2026-09-04T09:00", # ISO string
       "temp": 28.9,
       "humidity": 86,
       "rain": 0.2,
       "rainPct": 70,
       "code": 61
     },
     # ... 23 more
  ]
}
```

**Field meanings / source variables (Open-Meteo):**
| Our field | Open-Meteo variable |
|---|---|
| `current.temp` | `current=temperature_2m` |
| `current.humidity` | `current=relative_humidity_2m` |
| `current.rain` | `current=precipitation` |
| `current.wind` | `current=wind_speed_10m` |
| `current.code` | `current=weather_code` |
| `daily.tempMax / tempMin` | `daily=temperature_2m_max / temperature_2m_min` |
| `daily.rain` | `daily=precipitation_sum` |
| `daily.rainPct` | `daily=precipitation_probability_max` |
| `daily.humidity` | `daily=relative_humidity_2m_mean` |
| `daily.et0` | `daily=et0_fao_evapotranspiration` ← **important for irrigation** |
| `daily.wind` | `daily=wind_speed_10m_max` |
| `daily.code` | `daily=weather_code` |
| `hourly.*` | `hourly=temperature_2m,relative_humidity_2m,precipitation,precipitation_probability,weather_code` |

> `et0_fao_evapotranspiration` is what powers our **JalRakshak** smart-irrigation
> math — make sure it's requested. Round numbers to ~1 decimal; percentages as
> whole numbers 0–100.

---

## 📄 `weather_api.py` — working reference implementation
Save this as `weather_api.py`. Install dependency once: `pip install requests`.

```python
"""
weather_api.py — clean Open-Meteo forecast for AgriShield 365.
Usage:
    from weather_api import get_weather
    data = get_weather(21.15, 79.09)   # e.g. Nagpur (cotton / Vidarbha)
    print(data["daily"][0])
Run directly to test:  python weather_api.py
"""
import requests

OPEN_METEO = "https://api.open-meteo.com/v1/forecast"
TIMEOUT_SECONDS = 8


def get_weather(lat: float, lon: float) -> dict:
    """Fetch the 7-day + hourly forecast. Returns a clean dict (see spec)."""
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
    try:
        r = requests.get(OPEN_METEO, params=params, timeout=TIMEOUT_SECONDS)
        r.raise_for_status()
        return _normalize(r.json())
    except Exception as e:
        print(f"[weather_api] Open-Meteo fetch failed: {e}")
        return {"source": "error", "error": str(e),
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
            "rainPct": int(d.get("precipitation_probability_max", [0]*7)[i] or 0),
            "humidity": int(d.get("relative_humidity_2m_mean", [70]*7)[i] or 70),
            "et0": _round1(d.get("et0_fao_evapotranspiration", [4.0]*7)[i]),
            "wind": _round1(d.get("wind_speed_10m_max", [8.0]*7)[i]),
            "code": int(d["weather_code"][i] or 0),
        }
        for i in range(len(d["time"]))
    ]

    h = data["hourly"]
    hourly = []
    for i in range(0, len(h["time"]), 3):          # every 3rd hour -> ~24 points
        hourly.append({
            "time": h["time"][i],
            "temp": _round1(h["temperature_2m"][i]),
            "humidity": int(h["relative_humidity_2m"][i] or 0),
            "rain": _round1(h["precipitation"][i]),
            "rainPct": int((h.get("precipitation_probability") or [0]*len(h["time"]))[i] or 0),
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
    # Test with three locations matching our 3 crops:
    tests = {"Paddy (WB ~Burdwan)": (23.23, 87.86),
             "Potato (WB ~Hooghly)": (22.90, 88.39),
             "Cotton (Vidarbha ~Nagpur)": (21.15, 79.09)}
    for name, (la, lo) in tests.items():
        w = get_weather(la, lo)
        print(f"\n=== {name} === source={w.get('source')}, days={len(w['daily'])}, hours={len(w['hourly'])}")
        print("today:", json.dumps(w["daily"][0], ensure_ascii=False))
```

---

## ✅ How we'll know it's done (acceptance checks)
Run `python weather_api.py`. It should print, for each of the 3 test locations:
- `source=open-meteo`
- `days=7` and `hours=24`
- a `today` dict with all keys: `date, tempMax, tempMin, rain, rainPct,
  humidity, et0, wind, code`

Then send back:
1. The working `weather_api.py` file, and
2. A short note with **1 sample JSON output** for the Nagpur location (we'll use
   it to test the rules engine offline).

### Nice-to-haves (optional, only if you have time)
- A small fallback that returns reasonable **mock** data if there's no internet.
- Cache the response for ~30 min so repeated calls don't re-hit the API.
- A `requirements.txt` containing `requests`.

Thank you! 🙏 This feeds the live forecast + the disease and irrigation logic.
