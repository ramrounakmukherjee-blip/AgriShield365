import { useState } from "react";
import StoryJourney from "./components/StoryJourney";
import Login from "./components/Login";
import Onboarding from "./components/Onboarding";
import Analyzing from "./components/Analyzing";
import Dashboard from "./components/Dashboard";

const PHONE_KEY = "agrishield365_phone";
const PROFILE_KEY = "agrishield365_profile";

function loadJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function App() {
  // story -> login -> onboarding -> analyzing -> dashboard
  const [stage, setStage] = useState("story");
  const [phone, setPhone] = useState(() => localStorage.getItem(PHONE_KEY) || "");
  const [profile, setProfile] = useState(() => loadJSON(PROFILE_KEY));

  const handleVerified = (verifiedPhone) => {
    setPhone(verifiedPhone);
    localStorage.setItem(PHONE_KEY, verifiedPhone);
    // Returning farmer with a saved farm goes straight to the dashboard.
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
    // Keep the saved farm profile so the next login is instant.
    setPhone("");
    setStage("story");
  };

  switch (stage) {
    case "story":
      return (
        <StoryJourney
          onComplete={() => setStage("login")}
          onSkip={() => setStage("login")}
        />
      );
    case "login":
      return (
        <Login
          onVerified={handleVerified}
          returningName={profile?.name}
        />
      );
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
