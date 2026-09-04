"""
Gemini Vision leaf-disease scan for AgriShield 365.

The API key lives ONLY on the server (Render env var GEMINI_API_KEY) — it is
never shipped to the browser. We call Gemini's REST endpoint directly with the
`requests` library (already a dependency), so no extra SDK is needed.

Focus crops/threats match the product scope: paddy (rice blast, sheath blight,
bacterial blight), potato (late/early blight), cotton (fusarium wilt, bollworm,
whitefly) — but the model can report any leaf condition it sees.
"""

import base64
import json
import os
import re

import requests

# Try current models in order (override with GEMINI_MODEL). Newer API keys may
# only have access to the latest model; we fall back so the scan always finds a
# model that works.
MODELS = [m for m in [
    os.environ.get("GEMINI_MODEL", "").strip(),
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
] if m]
API_KEY = os.environ.get("GEMINI_API_KEY", "").strip()

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


def _extract_data_url(data_url: str):
    """Turn a browser data URL ('data:image/jpeg;base64,XXXX') into (b64, mime)."""
    m = re.match(r"data:([\w/+-]+);base64,(.*)", data_url or "", re.S)
    if m:
        return m.group(2).strip(), m.group(1)
    # Already raw base64.
    return (data_url or "").strip(), "image/jpeg"


def scan_leaf_image(image_data_url: str, crop_hint: str | None = None) -> dict:
    """Send the leaf photo to Gemini and return a structured diagnosis dict.

    Raises RuntimeError with a user-safe message on failure.
    """
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

    last_status = None
    last_body = ""
    for model in MODELS:
        url = (
            f"https://generativelanguage.googleapis.com/v1beta/models/"
            f"{model}:generateContent?key={API_KEY}"
        )
        try:
            resp = requests.post(url, json=body, timeout=60)
        except requests.RequestException as e:
            print(f"[scan] gemini request failed ({model}): {e}")
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

        # 404 = model name not available -> try the next model. Anything else is
        # a real error (bad/missing key, quota, policy).
        last_status, last_body = resp.status_code, resp.text
        print(f"[scan] gemini HTTP {resp.status_code} ({model}): {resp.text[:300]}")
        if resp.status_code != 404:
            break

    if last_status in (400, 401, 403):
        # Most likely an invalid/missing/forbidden API key.
        raise RuntimeError("SCAN_KEY_ERROR")
    raise RuntimeError("SCAN_PROVIDER_ERROR")


def ping() -> dict:
    """Tiny text-only call to verify the API key/models work. Used by the
    /scan/health diagnostic URL so we can see Google's exact error without
    uploading a photo."""
    if not API_KEY:
        return {"ok": False, "reason": "NO_KEY"}
    body = {
        "contents": [{"parts": [{"text": "Reply with the word OK."}]}],
        "generationConfig": {"temperature": 0, "maxOutputTokens": 10},
    }
    for model in MODELS:
        url = (
            f"https://generativelanguage.googleapis.com/v1beta/models/"
            f"{model}:generateContent?key={API_KEY}"
        )
        try:
            r = requests.post(url, json=body, timeout=30)
        except requests.RequestException as e:
            return {"ok": False, "reason": "NETWORK", "model": model, "error": str(e)[:200]}
        if r.status_code == 200:
            return {"ok": True, "model": model}
        print(f"[scan-ping] {model} HTTP {r.status_code}: {r.text[:300]}")
        if r.status_code != 404:
            try:
                msg = r.json().get("error", {}).get("message", r.text[:200])
            except Exception:
                msg = r.text[:200]
            return {"ok": False, "reason": f"HTTP_{r.status_code}", "model": model, "message": msg}
    return {"ok": False, "reason": "NO_MODEL"}
