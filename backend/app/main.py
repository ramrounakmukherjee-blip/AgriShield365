"""
AgriShield 365 — FastAPI backend.

Design (demo-proof hybrid):
  * The React PWA computes advisories locally first (instant + offline).
  * It calls this service in the BACKGROUND to (a) persist readings to
    Firestore and (b) run the official Python rule engine / future Gemini scan.
  * If this server is asleep (free Render tier) or offline, the app keeps
    working — nothing in the UI waits on it.

Run locally:
    pip install -r requirements.txt
    uvicorn app.main:app --reload --port 8000
Docs at  http://localhost:8000/docs
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .weather_api import get_weather
from .rules_engine import compute_advisory, THREATS, CROPS
from . import firestore_db
from . import gemini_scan

app = FastAPI(title="AgriShield 365 API", version="1.0")

# Browser PWA calls us directly — allow all origins in the demo (lock down later).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def _startup():
    firestore_db.init_firebase()


@app.get("/")
def root():
    return {"name": "AgriShield 365 API", "docs": "/docs", "health": "/health"}


@app.get("/health")
def health():
    # Lightweight route used to wake the free Render instance before a demo.
    import os
    return {
        "status": "ok",
        "crops": list(CROPS.keys()),
        "threats": len(THREATS),
        "firebase": firestore_db.db() is not None,
        "version": os.environ.get("RENDER_GIT_COMMIT", "local"),
    }


class AdvisoryRequest(BaseModel):
    lat: float = Field(..., ge=-90, le=90)
    lng: float = Field(..., ge=-180, le=180)
    crop: str
    idToken: str | None = None       # Firebase Auth ID token (preferred)
    uid: str | None = None           # fallback; only trusted when no token env
    daysElapsed: int | None = None   # if omitted, defaults to 42 in engine
    irrigation: str = "flood"
    soil: str = "loamy"
    area: float = 1.0
    weather: dict | None = None      # client-supplied live weather (preferred)


def _verify_token(idToken: str | None) -> str | None:
    """Return the verified uid from a Firebase ID token, else None."""
    if not idToken:
        return None
    client = firestore_db.db()
    if client is None:
        return None
    try:
        from firebase_admin import auth
        decoded = auth.verify_id_token(idToken)
        return decoded.get("uid")
    except Exception as e:
        print(f"[auth] token verify failed: {e}")
        return None


@app.post("/get-advisory")
def get_advisory(req: AdvisoryRequest):
    if req.crop not in CROPS:
        raise HTTPException(status_code=400, detail=f"Unknown crop '{req.crop}'.")

    # Auth: trust the verified token uid; fall back to provided uid in demo mode.
    uid = _verify_token(req.idToken) or req.uid

    # Prefer the weather the app already fetched (same shape, instant, avoids a
    # redundant server call); fall back to the server fetching it itself.
    weather = req.weather if (req.weather and req.weather.get("daily")) else get_weather(req.lat, req.lng)
    if weather.get("source") == "error" or not weather.get("daily"):
        raise HTTPException(status_code=502, detail="Weather provider unavailable.")

    advisory = compute_advisory(
        weather, req.crop,
        days_elapsed=req.daysElapsed if req.daysElapsed is not None else 42,
        irrigation=req.irrigation, soil=req.soil, area=req.area,
    )

    saved = firestore_db.save_advisory(uid, req.crop, req.lat, req.lng, advisory) if uid else False

    return {
        "status": "ok",
        "uid": uid,
        "persisted": saved,
        "weather": weather,
        "advisory": advisory,
    }


class ScanRequest(BaseModel):
    # Leaf photo is sent as a browser data URL (data:image/jpeg;base64,...).
    # The Gemini key stays on the server; only the diagnosis JSON is returned.
    lat: float | None = None
    lng: float | None = None
    crop: str | None = None
    image: str | None = None
    imageUrl: str | None = None  # accepted for compatibility
    idToken: str | None = None
    uid: str | None = None


_SCAN_ERROR_STATUS = {
    "SCAN_NOT_CONFIGURED": (503, "Leaf scan is not configured on the server (GEMINI_API_KEY missing)."),
    "NO_IMAGE": (400, "No leaf image was provided."),
    "SCAN_PROVIDER_UNAVAILABLE": (502, "The AI scan service is unavailable. Please try again."),
    "SCAN_PROVIDER_ERROR": (502, "The AI scan service rejected the request. Please try again."),
    "SCAN_KEY_ERROR": (502, "AI scan key rejected — ask the team to check GEMINI_API_KEY."),
    "SCAN_PARSE_ERROR": (502, "Could not read the AI diagnosis. Please retake the photo."),
}


@app.post("/scan")
def scan_leaf(req: ScanRequest):
    image = req.image or req.imageUrl
    if not gemini_scan.configured():
        # Graceful: frontend falls back to the offline symptom checker.
        raise HTTPException(status_code=503, detail=_SCAN_ERROR_STATUS["SCAN_NOT_CONFIGURED"][1])
    if not image:
        raise HTTPException(status_code=400, detail=_SCAN_ERROR_STATUS["NO_IMAGE"][1])
    try:
        result = gemini_scan.scan_leaf_image(image, crop_hint=req.crop)
    except RuntimeError as e:
        code = str(e)
        status, msg = _SCAN_ERROR_STATUS.get(code, (502, "Leaf scan failed. Please try again."))
        print(f"[scan] returning {status} {code}: {msg}")
        raise HTTPException(status_code=status, detail=f"[{code}] {msg}")

    # Best-effort persistence of the scan (only if a Firebase admin is set up).
    uid = _verify_token(req.idToken) or req.uid
    saved = False
    if uid:
        try:
            saved = firestore_db.save_scan(uid, req.crop, result)
        except Exception:
            saved = False

    return {"status": "ok", "uid": uid, "persisted": saved, "scan": result}


@app.get("/scan/health")
def scan_health():
    """Diagnostic: verifies the Gemini key/models without a photo. Open
    https://<service>/scan/health to see exactly why scan fails."""
    return {"configured": gemini_scan.configured(), **gemini_scan.ping()}
