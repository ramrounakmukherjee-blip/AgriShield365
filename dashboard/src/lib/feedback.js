// AgriShield 365 — device-local feedback store.
//
// Everything here stays on the farmer's phone (localStorage only). Nothing is
// uploaded, so feedback works in airplane mode and no personal data leaves the
// device. Entries are kept in a small capped list for later analysis.

const ALERT_FEEDBACK_KEY = "agrishield365_alert_feedback";
const MAX_ENTRIES = 200;

function readList(key) {
  try {
    const raw = localStorage.getItem(key);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function pushEntry(key, entry) {
  try {
    const next = [{ ...entry, timestamp: new Date().toISOString() }, ...readList(key)].slice(
      0,
      MAX_ENTRIES
    );
    localStorage.setItem(key, JSON.stringify(next));
    return true;
  } catch {
    return false;
  }
}

/**
 * Save one "was this alert correct?" answer.
 * vote: "yes" | "no" | "unsure"
 */
export function saveAlertFeedback(entry) {
  return pushEntry(ALERT_FEEDBACK_KEY, entry);
}

export function getAlertFeedback() {
  return readList(ALERT_FEEDBACK_KEY);
}
