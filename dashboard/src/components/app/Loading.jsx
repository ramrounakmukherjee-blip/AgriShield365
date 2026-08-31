import { useLang } from "../../lib/useLang";

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-2xl bg-stone-200/80 ${className}`} />;
}

export default function Loading() {
  const { t } = useLang();
  return (
    <div className="flex flex-col gap-4 px-1">
      <p className="text-sm font-semibold text-stone-500 flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        {t("app.loading")}
      </p>
      <Skeleton className="h-24" />
      <Skeleton className="h-24" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
      <Skeleton className="h-40" />
      <Skeleton className="h-32" />
    </div>
  );
}
