import { useState, useEffect } from "react";
import LanguagePicker from "./components/LanguagePicker";
import CinematicStory from "./components/CinematicStory";
import Login from "./components/Login";
import Onboarding from "./components/Onboarding";
import Analyzing from "./components/Analyzing";
import AppShell from "./components/app/AppShell";
import { LANGUAGES } from "./lib/i18n";
import { getProfile, saveProfile, getPhone, savePhone } from "./lib/api";
import { stopSpeaking, warmVoices } from "./lib/useVoice";
import { cloudSaveFarm } from "./lib/firebase";

const LANG_KEY = "agrishield365_lang";
const SESSION_KEY = "agrishield365_session";

function hasSavedLanguage() {
  try {
    return LANGUAGES.some((l) => l.id === localStorage.getItem(LANG_KEY));
  } catch {
    return false;
  }
}

function getSessionPhone() {
  try {
    return localStorage.getItem(SESSION_KEY) || "";
  } catch {
    return "";
  }
}

// Returning farmers skip the story + OTP entirely: if a verified session
// exists and its farm profile is on this device, open straight in the app.
function bootStage(savedPhone, savedProfile) {
  if (savedPhone) {
    if (savedProfile && savedProfile.phone === savedPhone) return "app";
    return "onboarding"; // verified once, but farm setup was never finished
  }
  return hasSavedLanguage() ? "story" : "welcome";
}

export default function App() {
  // welcome -> story -> login -> onboarding -> analyzing -> app
  const [phone, setPhone] = useState(() => getSessionPhone() || getPhone());
  const [profile, setProfile] = useState(() => getProfile());
  const [stage, setStage] = useState(() => bootStage(getSessionPhone() || getPhone(), getProfile()));

  useEffect(() => {
    window.scrollTo(0, 0);
    stopSpeaking();
  }, [stage]);

  // Load the browser's TTS voice list as early as possible (it loads
  // asynchronously in Chrome/Edge) so the first Listen tap works.
  useEffect(() => {
    warmVoices();
  }, []);

  const handleLanguageChosen = () => setStage("story");

  const handleVerified = (verifiedPhone) => {
    setPhone(verifiedPhone);
    savePhone(verifiedPhone);
    try {
      localStorage.setItem(SESSION_KEY, verifiedPhone); // stay signed in
    } catch {
      /* ignore */
    }
    const saved = getProfile();
    if (saved && saved.phone === verifiedPhone) {
      setProfile(saved);
      cloudSaveFarm(saved);        // sync a returning farmer to the cloud too
      setStage("app");
    } else {
      setStage("onboarding");
    }
  };

  const handleOnboardingComplete = (farm) => {
    const full = { ...farm, phone };
    setProfile(full);
    saveProfile(full);            // local (instant + offline)
    cloudSaveFarm(full);          // cloud (best-effort, never blocks)
    setStage("analyzing");
  };

  const handleProfileChange = (updated) => {
    setProfile(updated);
    saveProfile(updated);         // local
    cloudSaveFarm(updated);       // cloud
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem("agrishield365_phone"); // legacy key — must clear too
    } catch {
      /* ignore */
    }
    setPhone("");
    setProfile(null);
    setStage("login");
  };

  switch (stage) {
    case "welcome":
      return <LanguagePicker onChoose={handleLanguageChosen} />;
    case "story":
      return (
        <CinematicStory
          onComplete={() => setStage("login")}
          onSkip={() => setStage("login")}
        />
      );
    case "login":
      return <Login onVerified={handleVerified} returningName={profile?.name} />;
    case "onboarding":
      return <Onboarding onComplete={handleOnboardingComplete} />;
    case "analyzing":
      return <Analyzing onDone={() => setStage("app")} />;
    case "app":
      return (
        <AppShell
          profile={profile}
          onSignOut={handleSignOut}
          onProfileChange={handleProfileChange}
          onResetSetup={() => setStage("onboarding")}
        />
      );
    default:
      return null;
  }
}
