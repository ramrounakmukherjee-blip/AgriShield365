import { useState } from "react";
import LanguagePicker from "./components/LanguagePicker";
import StoryJourney from "./components/StoryJourney";
import Login from "./components/Login";
import Onboarding from "./components/Onboarding";
import Analyzing from "./components/Analyzing";
import Dashboard from "./components/Dashboard";
import { LANGUAGES } from "./lib/i18n";

const LANG_KEY = "agrishield365_lang";
const PHONE_KEY = "agrishield365_phone";
const PROFILE_KEY = "agrishield365_profile_v2";

function loadJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function hasSavedLanguage() {
  try {
    const lang = localStorage.getItem(LANG_KEY);
    return LANGUAGES.some((l) => l.id === lang);
  } catch {
    return false;
  }
}

export default function App() {
  // welcome -> story -> login -> onboarding -> analyzing -> dashboard
  const [stage, setStage] = useState(hasSavedLanguage() ? "story" : "welcome");
  const [phone, setPhone] = useState(() => localStorage.getItem(PHONE_KEY) || "");
  const [profile, setProfile] = useState(() => loadJSON(PROFILE_KEY));

  const handleLanguageChosen = () => setStage("story");

  const handleVerified = (verifiedPhone) => {
    setPhone(verifiedPhone);
    localStorage.setItem(PHONE_KEY, verifiedPhone);
    const saved = loadJSON(PROFILE_KEY);
    if (saved && saved.phone === verifiedPhone) {
      setProfile(saved);
      setStage("dashboard");
    } else {
      setStage("onboarding");
    }
  };

  const handleOnboardingComplete = (farm) => {
    const full = { ...farm, phone };
    setProfile(full);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(full));
    setStage("analyzing");
  };

  const handleSignOut = () => {
    localStorage.removeItem(PHONE_KEY);
    setPhone("");
    setStage("story");
  };

  switch (stage) {
    case "welcome":
      return <LanguagePicker onChoose={handleLanguageChosen} />;
    case "story":
      return (
        <StoryJourney
          onComplete={() => setStage("login")}
          onSkip={() => setStage("login")}
        />
      );
    case "login":
      return <Login onVerified={handleVerified} returningName={profile?.name} />;
    case "onboarding":
      return <Onboarding onComplete={handleOnboardingComplete} />;
    case "analyzing":
      return <Analyzing onDone={() => setStage("dashboard")} />;
    case "dashboard":
      return <Dashboard profile={profile} onSignOut={handleSignOut} />;
    default:
      return null;
  }
}
