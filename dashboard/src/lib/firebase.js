// Firebase integration for AgriShield 365.
//  - Real phone OTP auth when Firebase Auth is configured & available.
//  - Firestore cloud save for farm profile / advisory history.
// Everything is wrapped in safe guards: if the SDK is missing, the network
// is off, or a domain isn't authorized, the app transparently falls back to
// the local demo (OTP 123456 / localStorage), so the product never breaks.
import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, doc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";

// Public web config — safe to ship in frontend code (data is protected by
// Firestore security rules, not by hiding this config).
const firebaseConfig = {
  apiKey: "AIzaSyARyoWBrgxCD2Xd0IzSCinbbUSX9xW-Zkg",
  authDomain: "agrishield365.firebaseapp.com",
  projectId: "agrishield365",
  storageBucket: "agrishield365.firebasestorage.app",
  messagingSenderId: "88799151182",
  appId: "1:88799151182:web:c50c2621695ad4bf352f1f",
  measurementId: "G-2EG7FERMCN",
};

let app = null;
let auth = null;
let db = null;
let initError = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  // Test mode for the hackathon demo: reCAPTCHA auto-resolves and whitelisted
  // "Phone numbers for testing" sign in with their fixed 6-digit code (no SMS,
  // no card / Blaze required). Real SMS to arbitrary numbers needs the Blaze
  // plan; when you upgrade, delete this line to restore normal app verification.
  try { auth.settings.appVerificationDisabledForTesting = true; } catch {}
} catch (e) {
  initError = e;
  console.warn("[firebase] init disabled:", e?.message || e);
}

export function firebaseReady() {
  return !!app && !!auth && !initError;
}

// ---- Phone OTP auth --------------------------------------------------------

let recaptcha = null;

// Create a fresh reCAPTCHA verifier for each attempt. In test mode
// (appVerificationDisabledForTesting) it auto-resolves invisibly and whitelisted
// test numbers sign in with their fixed code — no human interaction, no SMS.
function createRecaptcha() {
  if (!auth) return null;
  try {
    return new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });
  } catch (e) {
    console.warn("[firebase] recaptcha failed:", e?.message);
    return null;
  }
}

/**
 * Send a real OTP via Firebase. Returns { ok: true } on success, or
 * { ok:false, reason } so the UI can fall back to the demo flow.
 */
export async function sendRealOtp(fullPhone) {
  if (!auth) return { ok: false, reason: "unavailable" };
  try {
    // Use a fresh verifier for each attempt (Firebase recommends this).
    try { recaptcha?.clear?.(); } catch {}
    recaptcha = createRecaptcha();
    if (!recaptcha) return { ok: false, reason: "recaptcha" };
    const confirmation = await signInWithPhoneNumber(auth, fullPhone, recaptcha);
    window.__agriConfirmation = confirmation;
    return { ok: true };
  } catch (e) {
    console.warn("[firebase] sendOtp failed:", e?.code || e?.message);
    // reset recaptcha so a retry can create a fresh one
    try { recaptcha?.clear?.(); } catch {}
    recaptcha = null;
    return { ok: false, reason: e?.code || "error" };
  }
}

/**
 * Confirm the OTP. On success returns { ok:true, uid }. Whitelisted test
 * numbers accept their fixed code via real auth too.
 */
export async function confirmRealOtp(code) {
  if (!window.__agriConfirmation) return { ok: false, reason: "no-confirmation" };
  try {
    const result = await window.__agriConfirmation.confirm(code);
    const uid = result?.user?.uid || null;
    return { ok: true, uid };
  } catch (e) {
    console.warn("[firebase] confirm failed:", e?.code || e?.message);
    return { ok: false, reason: e?.code || "error" };
  }
}

export function watchAuth(cb) {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, (user) => cb(user ? { uid: user.uid, phone: user.phoneNumber } : null));
}

export function currentUid() {
  return auth?.currentUser?.uid || null;
}

// ---- Firestore cloud sync (best-effort, never blocks) ----------------------

// Save the farmer's profile to Firestore under a phone-derived id.
export async function cloudSaveFarm(profile) {
  if (!db || !profile?.phone) return false;
  try {
    const id = "p" + String(profile.phone);
    await setDoc(doc(db, "farms", id), { ...profile, updatedAt: serverTimestamp() }, { merge: true });
    console.log("[firebase] farm saved to cloud: farms/" + id);
    return true;
  } catch (e) {
    console.warn("[firebase] farm save failed:", e?.code || e?.message || e);
    return false;
  }
}

// Append an advisory reading to history.
export async function cloudSaveAdvisory(profile, payload) {
  if (!db || !profile?.phone) return false;
  try {
    const id = "p" + String(profile.phone);
    await addDoc(collection(db, "farms", id, "advisories"), {
      ...payload,
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (e) {
    console.warn("[firebase] advisory save failed:", e?.message || e);
    return false;
  }
}
