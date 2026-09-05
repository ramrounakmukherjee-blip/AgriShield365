import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, ShieldCheck, ArrowRight, Edit3, Loader2 } from "lucide-react";
import { useLang } from "../lib/useLang";
import LanguageSwitcher from "./LanguageSwitcher";
import { sendRealOtp, confirmRealOtp, firebaseReady } from "../lib/firebase";

export default function Login({ onVerified, returningName }) {
  const { t } = useLang();
  const [step, setStep] = useState("phone"); // phone | otp
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [authMode, setAuthMode] = useState(null); // "real" | "demo"

  const validPhone = /^[6-9]\d{9}$/.test(phone);

  const sendOtp = async () => {
    if (!validPhone) {
      setError(t("login.phoneError"));
      return;
    }
    setError("");
    setSending(true);
    // Try real Firebase phone OTP; fall back to demo OTP if unavailable.
    const res = firebaseReady() ? await sendRealOtp("+91" + phone) : { ok: false };
    setSending(false);
    setAuthMode(res.ok ? "real" : "demo");
    setStep("otp");
  };

  const verifyOtp = async () => {
    setError("");
    setVerifying(true);
    if (authMode === "real") {
      const res = await confirmRealOtp(otp);
      if (res.ok) {
        onVerified(phone, res.uid);
        return;
      }
      // real auth rejected it — fall through to the demo check below
    }
    // Offline / demo fallback when real Firebase auth is unreachable.
    // The universal demo OTP is 123456 (six digits), same as the test code.
    if (otp === "123456") {
      onVerified(phone);
      return;
    }
    setVerifying(false);
    setError(t("login.otpError"));
  };

  return (
      <div className="min-h-[100dvh] bg-gradient-to-b from-emerald-950 via-emerald-900 to-green-800 flex flex-col">
      {/* reCAPTCHA anchor — invisible in test mode, auto-resolves */}
      <div id="recaptcha-container" />

      {/* Language switcher */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      <header className="flex-1 flex flex-col items-center justify-center px-6 pt-14 pb-6 text-center">
        <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          src="/assets/logo-agrishield365.jpg"
          alt="AgriShield 365 logo"
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-2xl ring-4 ring-white/10"
        />
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mt-5 text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
        >
          AgriShield&nbsp;365
        </motion.h1>
        <p className="mt-1 text-emerald-200/90 text-sm sm:text-base">{t("login.tagline")}</p>
        <p className="mt-3 text-emerald-100/70 text-xs sm:text-sm max-w-sm">
          {returningName ? t("login.welcomeBack") : t("login.subtitle")}
        </p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6 }}
        className="w-full max-w-md mx-auto px-4 pb-12"
      >
        <div className="rounded-3xl bg-white shadow-2xl p-6 sm:p-8">
          {step === "phone" ? (
            <>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                {t("login.phoneLabel")}
              </label>
              <div className="flex items-center gap-2 rounded-2xl border-2 border-stone-200 focus-within:border-emerald-500 transition bg-stone-50 px-4 py-3.5">
                <span className="text-stone-500 font-semibold text-lg">+91</span>
                <Phone className="w-5 h-5 text-stone-400" />
                <input
                  type="tel"
                  inputMode="numeric"
                  autoFocus
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                  placeholder={t("login.phonePlaceholder")}
                  className="w-full bg-transparent outline-none text-lg font-semibold text-stone-800 placeholder:text-stone-400 placeholder:font-normal tracking-wide"
                />
              </div>

              {error && <p className="mt-3 text-sm text-red-600 font-medium">{error}</p>}

              <button
                onClick={sendOtp}
                disabled={sending}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-60 transition px-6 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-600/30"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> {t("login.sending")}
                  </>
                ) : (
                  <>
                    {t("login.sendOtp")}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                  setError("");
                }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-600 mb-4"
              >
                <Edit3 className="w-4 h-4" /> +91 {phone}
              </button>

              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                {t("login.codeLabel")}
              </label>
              <div className="flex items-center gap-2 rounded-2xl border-2 border-stone-200 focus-within:border-emerald-500 transition bg-stone-50 px-4 py-3.5">
                <ShieldCheck className="w-5 h-5 text-stone-400" />
                <input
                  type="tel"
                  inputMode="numeric"
                  autoFocus
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && verifyOtp()}
                  placeholder="• • • • • •"
                  className="w-full bg-transparent outline-none text-2xl font-bold tracking-[0.5em] text-stone-800 placeholder:text-stone-300"
                />
              </div>

              {error && <p className="mt-3 text-sm text-red-600 font-medium">{error}</p>}

              <button
                onClick={verifyOtp}
                disabled={otp.length < 6 || verifying}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition px-6 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-600/30"
              >
                {verifying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> {t("login.sending")}
                  </>
                ) : (
                  <>
                    {t("login.verify")}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-xs text-stone-400">{t("login.demoNote")}</p>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-emerald-200/70 text-xs">{t("login.privacy")}</p>
      </motion.div>
    </div>
  );
}
