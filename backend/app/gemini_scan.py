"""
Gemini Vision leaf-disease scan for AgriShield 365.

The API key lives ONLY on the server (Render env var GEMINI_API_KEY) — it is
never shipped to the browser. We call Gemini's REST endpoint directly with the
`requests` library (already a dependency), so no extra SDK is needed.

Models are discovered at runtime via the ListModels API, so the scan keeps
working as Google renames/retire models (the v1beta name can change between
years). Focus crops/threats: paddy (rice blast, sheath blight, bacterial
blight), potato (late/early blight), cotton (fusarium wilt, bollworm,
whitefly) — but the model can report any leaf condition it sees.
"""

import json
import os
import re

import requests

API_KEY = os.environ.get("GEMINI_API_KEY", "").strip()

# Preferred model order (newest/cheap first). These are only a preference — the
# live ListModels discovery below picks whichever actually exist for the key.
PREFERRED_MODELS = [m for m in [
    os.environ.get("GEMINI_MODEL", "").strip(),
    "gemini-3-flash",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
] if m]

PROMPT = """You are an agricultural plant-pathologist assistant helping a
smallholder farmer in India. Look at the photo.

If it shows a plant leaf or crop:
- Identify the likely disease or pest damage. Prioritise these common threats:
  rice blast, sheath blight, bacterial blight (paddy/rice); late blight,
  early blight (potato); fusarium wilt, bollworm damage, whitefly (cotton).
- Judge severity and how confident you are.
- Give the cause, and 3-5 practical, low-cost treatment steps a farmer can act
  on, plus 2-3 prevention tips. Use simple, clear language.

Respond with ONLY a minified JSON object (no markdown, no code fences), with
exactly this shape:
{"isLeaf": true, "crop": "<paddy|potato|cotton|other>", "disease": "<name>",
 "severity": "<low|medium|high>", "confidence": <0-100 integer>,
 "summary": "<one or two sentences>", "causes": ["..."],
 "treatment": ["..."], "prevention": ["..."]}

If the photo is NOT a plant leaf or crop (e.g. a person, object, blurry/empty),
respond with:
{"isLeaf": false, "crop": null, "disease": null, "severity": null,
 "confidence": 0, "summary": "<why it can't be scanned>", "causes": [],
 "treatment": [], "prevention": []}
"""


def configured() -> bool:
    return bool(API_KEY)


def _list_models_raw():
    """Return (status, list_of_model_names, message). Names support
    generateContent."""
    try:
        r = requests.get(
            f"https://generativelanguage.googleapis.com/v1beta/models?key={API_KEY}",
            timeout=20,
        )
    except requests.RequestException as e:
        return None, [], f"network: {e}"[:200]
    if r.status_code != 200:
        try:
            msg = r.json().get("error", {}).get("message", r.text[:300])
        except Exception:
            msg = r.text[:300]
        print(f"[scan] ListModels HTTP {r.status_code}: {msg}")
        return r.status_code, [], msg
    try:
        data = r.json().get("models", [])
    except ValueError:
        data = []
    names = [
        m.get("name", "").replace("models/", "")
        for m in data
        if "generateContent" in (m.get("supportedGenerationMethods") or [])
    ]
    names = [n for n in names if n]
    return 200, names, ""


_models_cache = None


def candidate_models():
    """Models to try, in order: discovered (preferred first, then flash), then
    static fallbacks."""
    global _models_cache
    if _models_cache is None:
        status, names, _msg = _list_models_raw()
        _models_cache = names if status == 200 else []
        if _models_cache:
            print(f"[scan] available generateContent models: {_models_cache[:8]}")
    avail = _models_cache or []
    ordered = []
    for m in PREFERRED_MODELS:
        if m in avail and m not in ordered:
            ordered.append(m)
    for m in avail:
        if "flash" in m and m not in ordered:
            ordered.append(m)
    for m in avail:
        if m not in ordered:
            ordered.append(m)
    for m in PREFERRED_MODELS:
        if m not in ordered:
            ordered.append(m)
    return ordered


def _extract_data_url(data_url: str):
    """Turn a browser data URL into (base64, mime)."""
    m = re.match(r"data:([\w/+-]+);base64,(.*)", data_url or "", re.S)
    if m:
        return m.group(2).strip(), m.group(1)
    return (data_url or "").strip(), "image/jpeg"


def scan_leaf_image(image_data_url: str, crop_hint: str | None = None) -> dict:
    """Send the leaf photo to Gemini and return a structured diagnosis dict."""
    if not API_KEY:
        raise RuntimeError("SCAN_NOT_CONFIGURED")
    if not image_data_url:
        raise RuntimeError("NO_IMAGE")

    b64, mime = _extract_data_url(image_data_url)
    if not b64:
        raise RuntimeError("NO_IMAGE")

    prompt = PROMPT
    if crop_hint:
        prompt += f"\nThe farmer's crop is: {crop_hint}."

    body = {
        "contents": [{"parts": [
            {"text": prompt},
            {"inline_data": {"mime_type": mime, "data": b64}},
        ]}],
        "generationConfig": {
            "temperature": 0.2,
            "responseMimeType": "application/json",
            "maxOutputTokens": 1024,
        },
    }

    last_status, last_msg = None, ""
    for model in candidate_models():
        url = (
            f"https://generativelanguage.googleapis.com/v1beta/models/"
            f"{model}:generateContent?key={API_KEY}"
        )
        try:
            resp = requests.post(url, json=body, timeout=60)
        except requests.RequestException as e:
            print(f"[scan] request failed ({model}): {e}")
            raise RuntimeError("SCAN_PROVIDER_UNAVAILABLE")

        if resp.status_code == 200:
            try:
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                result = json.loads(text)
            except (KeyError, IndexError, ValueError) as e:
                print(f"[scan] parse error ({model}): {e}; body={resp.text[:400]}")
                raise RuntimeError("SCAN_PARSE_ERROR")
            result.setdefault("source", "gemini")
            result.setdefault("model", model)
            return result

        try:
            last_msg = resp.json().get("error", {}).get("message", resp.text[:300])
        except ValueError:
            last_msg = resp.text[:300]
        last_status = resp.status_code
        print(f"[scan] gemini HTTP {resp.status_code} ({model}): {last_msg}")
        if resp.status_code != 404:
            break  # real error — stop trying models

    if last_status in (400, 401, 403):
        raise RuntimeError("SCAN_KEY_ERROR")
    raise RuntimeError("SCAN_PROVIDER_ERROR")


def ping() -> dict:
    """Diagnostic used by GET /scan/health: verifies the key, lists the models
    the key can actually use, and makes a tiny text generation call."""
    if not API_KEY:
        return {"ok": False, "reason": "NO_KEY"}

    status, names, msg = _list_models_raw()
    if status != 200:
        return {
            "ok": False,
            "reason": f"LIST_HTTP_{status}" if status else "NETWORK",
            "message": msg,
        }

    # Prefer a flash model that exists.
    chosen = None
    for m in PREFERRED_MODELS:
        if m in names:
            chosen = m
            break
    if not chosen:
        flash = [n for n in names if "flash" in n]
        chosen = flash[0] if flash else (names[0] if names else None)
    if not chosen:
        return {"ok": False, "reason": "NO_GENERATE_MODEL", "available": names[:30]}

    body = {
        "contents": [{"parts": [{"text": "Reply with the word OK."}]}],
        "generationConfig": {"temperature": 0, "maxOutputTokens": 10},
    }
    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{chosen}:generateContent?key={API_KEY}"
    )
    try:
        r = requests.post(url, json=body, timeout=30)
    except requests.RequestException as e:
        return {"ok": False, "reason": "NETWORK", "model": chosen, "error": str(e)[:200]}
    if r.status_code == 200:
        return {
            "ok": True,
            "model": chosen,
            "availableFlash": [n for n in names if "flash" in n][:12],
        }
    try:
        emsg = r.json().get("error", {}).get("message", r.text[:300])
    except ValueError:
        emsg = r.text[:300]
    print(f"[scan-ping] generate HTTP {r.status_code} ({chosen}): {emsg}")
    return {"ok": False, "reason": f"GENERATE_HTTP_{r.status_code}", "model": chosen, "message": emsg}
