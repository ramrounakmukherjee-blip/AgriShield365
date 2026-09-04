"""
firestore_db.py — optional Firebase Admin persistence.

Initializes lazily from the FIREBASE_CREDENTIALS env var. If it is not set
(Firebase service-account JSON not configured yet), `enabled` stays False and
every function becomes a safe no-op, so the API runs fully in local/demo mode.

When deploying: add the service-account JSON as an environment variable /
secret named FIREBASE_CREDENTIALS (the raw JSON text). NEVER commit that file.
"""

import json
import os

_db = None
_ready = False


def init_firebase() -> bool:
    global _db, _ready
    if _ready:
        return _db is not None
    _ready = True
    cred_json = os.environ.get("FIREBASE_CREDENTIALS")
    if not cred_json:
        print("[firestore] FIREBASE_CREDENTIALS not set — running WITHOUT persistence (demo mode).")
        return False
    try:
        import firebase_admin
        from firebase_admin import credentials, firestore

        if not firebase_admin._apps:
            cred = credentials.Certificate(json.loads(cred_json))
            firebase_admin.initialize_app(cred)
        _db = firestore.client()
        print("[firestore] Firebase Admin initialized.")
        return True
    except Exception as e:
        print(f"[firestore] init failed ({e}) — running WITHOUT persistence.")
        _db = None
        return False


def db():
    return _db if init_firebase() else None


def save_advisory(uid: str, crop: str, lat: float, lng: float, advisory: dict) -> bool:
    """Persist one advisory reading under the user's history subcollection."""
    client = db()
    if client is None or not uid:
        return False
    try:
        from datetime import datetime, timezone
        client.collection("users").document(uid).collection("advisories").add({
            "crop": crop, "lat": lat, "lng": lng,
            "advisory": advisory,
            "createdAt": datetime.now(timezone.utc).isoformat(),
        })
        return True
    except Exception as e:
        print(f"[firestore] save failed: {e}")
        return False


def save_farm(uid: str, farm: dict) -> bool:
    client = db()
    if client is None or not uid:
        return False
    try:
        client.collection("farms").document(uid).set(farm, merge=True)
        return True
    except Exception as e:
        print(f"[firestore] farm save failed: {e}")
        return False
