import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Droplets, Zap, Bug } from "lucide-react";
import { useLang } from "../../lib/useLang";
import { getIrrigation } from "../../lib/api";

// Today's single most important job, distilled from the alerts + water plan.
// One clear decision for the farmer instead of asking them to read everything.
const TONES = {
  critical: { box: "bg-red-50 border-red-300 text-red-900", Icon: AlertTriangle },
  warning: { box: "bg-amber-50 border-amber-300 text-amber-900", Icon: AlertTriangle },
  info: { box: "bg-sky-50 border-sky-300 text-sky-900", Icon: Bug },
  water: { box: "bg-sky-50 border-sky-300 text-sky-900", Icon: Droplets },
  clear: { box: "bg-emerald-50 border-emerald-300 text-emerald-900", Icon: CheckCircle2 },
};

function whenLabel(daysAhead, t) {
  if (daysAhead === 0) return t("app.today");
  if (daysAhead === 1) return t("app.tomorrow");
  return t("app.inDays").replace("{n}", daysAhead ?? 2);
}

function buildAction({ alerts, profile, weather, t, tr }) {
  // Priority 1: the most urgent alert that is in front of the farmer.
  for (const kind of ["critical", "warning", "info"]) {
    const a = alerts.find((x) => x.kind === kind);
    if (a) {
      return {
        tone: kind,
        chip: a.threatType ? t("home.cropHealth") : t("home.weatherChip"),
        when: whenLabel(a.daysAhead, t),
        title: tr(a.title),
        body: tr(a.detail),
      };
    }
  }

  // Priority 2: the water decision for today.
  const rec = getIrrigation(profile, weather).today;
  if (!rec.skip && rec.needMm > 0) {
    return {
      tone: "water",
      chip: t("tabs.irrigation"),
      when: t("app.today"),
      title: t("irrigation.irrigate"),
      body: `${t("irrigation.perAcre")
        .replace("{mm}", rec.needMm)
        .replace("{l}", rec.litresPerAcre.toLocaleString("en-IN"))} · ${t("irrigation.bestTime")}`,
    };
  }
  if (rec.skip) {
    return {
      tone: "water",
      chip: t("tabs.irrigation"),
      when: t("app.today"),
      title: t("irrigation.noNeed"),
      body: t("irrigation.rainCovers"),
    };
  }

  // Priority 3: nothing pending — give a useful default action.
  return {
    tone: "clear",
    chip: t("home.cropHealth"),
    when: t("app.today"),
    title: t("home.actClear"),
    body: t("home.actClearBody"),
  };
}

export default function TopAction({ alerts = [], profile, weather }) {
  const { t, tr } = useLang();
  const action = buildAction({ alerts, profile, weather, t, tr });
  const { box, Icon } = TONES[action.tone] || TONES.clear;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border-2 p-4 sm:p-5 ${box}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" /> {t("home.topAction")}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wide bg-black/10 rounded-full px-2 py-0.5">
          {action.chip}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wide bg-black/10 rounded-full px-2 py-0.5">
          {action.when}
        </span>
      </div>

      <div className="mt-3 flex items-start gap-3">
        <div className="w-11 h-11 shrink-0 rounded-2xl bg-black/10 grid place-items-center">
          <Icon className="w-6 h-6" />
        </div>
        <div className="min-w-0">
          <p className="font-extrabold text-base sm:text-lg leading-snug">{action.title}</p>
          <p className="text-sm mt-1 leading-relaxed opacity-90">{action.body}</p>
        </div>
      </div>
    </motion.section>
  );
}
