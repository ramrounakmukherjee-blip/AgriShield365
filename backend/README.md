# AgriShield 365 — FastAPI backend

The cloud "memory + AI" for AgriShield 365. The React PWA does the fast/offline
advisory math itself; this service runs the official Python rule engine,
persists readings to **Firebase Firestore**, and (later) hosts the **Gemini
leaf-scan** so its API key never reaches the browser.

> Demo-proof: every endpoint works without Firebase credentials (it just skips
> saving). The frontend never blocks waiting on this server.

## Run locally
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
- API docs: http://localhost:8000/docs
- Health (used to wake the server): http://localhost:8000/health

## Test an advisory
```bash
curl -X POST http://localhost:8000/get-advisory \
  -H "Content-Type: application/json" \
  -d '{"lat":21.15,"lng":79.09,"crop":"cotton","area":3,"irrigation":"drip","soil":"black"}'
```

## Layout
- `app/main.py` — FastAPI routes (`/health`, `/get-advisory`, `/scan` stub).
- `app/weather_api.py` — Data Engineer's Open-Meteo module (`get_weather`).
- `app/rules_engine.py` — Python rule engine (mirrors the frontend logic).
- `app/data/rules.json` — crop Kc stages + disease thresholds (researcher-editable).
- `app/firestore_db.py` — optional Firebase Admin persistence (no-op if unconfigured).

## Firebase
Set `FIREBASE_CREDENTIALS` to the full service-account JSON (Firebase Console →
Project settings → Service accounts → Generate new private key). Never commit
that key. On Render add it as an environment variable.

## Deploy (free, no card)
[Render.com] → New Web Service → root dir `backend` (see `render.yaml`). Free
tier sleeps when idle; open `/health` once before the demo to wake it.
