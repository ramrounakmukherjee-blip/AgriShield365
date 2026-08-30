import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, ShieldCheck, ArrowRight, Edit3, Loader2, Sprout } from "lucide-react";

export default function Login({ onVerified, returningName }) {
  const [step, setStep] = useState("phone"); // phone | otp
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const validPhone = /^[6-9]\d{9}$/.test(phone);

  const sendOtp = () => {
    if (!validPhone) {
      setError("Enter a valid 10-digit Indian mobile number. / सही 10 अंकों का नंबर डालें।");
      return;
    }
    setError("");
    setSending(true);
    // Simulated OTP send (demo build)
    setTimeout(() => {
      setSending(false);
      setStep("otp");
    }, 900);
  };

  const verifyOtp = () => {
    // Demo OTP: 1357
    if (otp !== "1357") {
      setError("Incorrect code. Hint for this demo: 1357 / गलत कोड। डेमो कोड: 1357");
      return;
    }
    setError("");
    onVerified(phone);
  };

  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-b from-emerald-950 via-emerald-900 to-green-800 flex flex-col">
      {/* Brand header */}
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
        <p className="font-hindi mt-1 text-emerald-200/90 text-sm sm:text-base">
          आपके खेत का रखवाला, हर दिन
        </p>
        <p className="mt-3 text-emerald-100/70 text-xs sm:text-sm max-w-sm">
          {returningName
            ? `Welcome back, ${returningName}. Log in to see today's advisories.`
            : "Log in with your mobile number — no passwords to remember."}
        </p>
      </header>

      {/* Card */}
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
                Mobile number <span className="font-hindi font-semibold">· मोबाइल नंबर</span>
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
                  placeholder="98765 43210"
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
                    <Loader2 className="w-5 h-5 animate-spin" /> Sending OTP…
                  </>
                ) : (
                  <>
                    Send OTP <span className="font-hindi font-semibold">· OTP भेजें</span>
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
                Enter the 4-digit code <span className="font-hindi font-semibold">· कोड डालें</span>
              </label>
              <div className="flex items-center gap-2 rounded-2xl border-2 border-stone-200 focus-within:border-emerald-500 transition bg-stone-50 px-4 py-3.5">
                <ShieldCheck className="w-5 h-5 text-stone-400" />
                <input
                  type="tel"
                  inputMode="numeric"
                  autoFocus
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && verifyOtp()}
                  placeholder="• • • •"
                  className="w-full bg-transparent outline-none text-2xl font-bold tracking-[0.5em] text-stone-800 placeholder:text-stone-300"
                />
              </div>

              {error && <p className="mt-3 text-sm text-red-600 font-medium">{error}</p>}

              <button
                onClick={verifyOtp}
                disabled={otp.length !== 4}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition px-6 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-600/30"
              >
                Verify & Continue <span className="font-hindi font-semibold">· सत्यापित करें</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="mt-4 text-center text-xs text-stone-400">
                Demo build — use code{" "}
                <span className="font-bold text-emerald-700">1357</span>{" "}
                <span className="font-hindi">(डेमो कोड)</span>
              </p>
            </>
          )}
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-emerald-200/70 text-xs">
          <Sprout className="w-3.5 h-3.5" />
          Your data stays on this device in the demo version.
        </p>
      </motion.div>
    </div>
  );
}
