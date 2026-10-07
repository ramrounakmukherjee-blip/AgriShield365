import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WifiOff, Wifi } from "lucide-react";
import { useLang } from "../../lib/useLang";

// Network status banner.
// Offline → reassures the farmer that the local-first features still work.
// Reconnected → short "back online" confirmation, then fades away.
export default function OfflineBanner() {
  const { t } = useLang();
  const [online, setOnline] = useState(() =>
    typeof navigator === "undefined" ? true : navigator.onLine
  );
  const [justBack, setJustBack] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      setJustBack(true);
    };
    const handleOffline = () => {
      setOnline(false);
      setJustBack(false);
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!justBack) return undefined;
    const id = setTimeout(() => setJustBack(false), 3500);
    return () => clearTimeout(id);
  }, [justBack]);

  const show = !online || justBack;
  const offline = !online;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          role="status"
          className={`mb-4 flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-sm font-semibold ${
            offline
              ? "bg-amber-50 border-amber-300 text-amber-900"
              : "bg-emerald-50 border-emerald-300 text-emerald-900"
          }`}
        >
          {offline ? (
            <WifiOff className="w-5 h-5 mt-0.5 shrink-0" />
          ) : (
            <Wifi className="w-5 h-5 mt-0.5 shrink-0" />
          )}
          <p className="leading-snug">{offline ? t("app.offlineBanner") : t("app.backOnline")}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
