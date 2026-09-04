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

function hasSavedLanguage() {
  try {
    return LANGUAGES.some((l) => l.id === localStorage.getItem(LANG_KEY));
  } catch {
    return false;
  }
}

export default function App() {
  // welcome -> story -> login -> onboarding -> analyzing -> app
  const [stage, setStage] = useState(hasSavedLanguage() ? "story" : "welcome");
  const [phone, setPhone] = useState(() => getPhone());
  const [profile, setProfile] = useState(() => getProfile());

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
    localStorage.removeItem("agrishield365_phone");
    setPhone("");
    setStage("story");
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
