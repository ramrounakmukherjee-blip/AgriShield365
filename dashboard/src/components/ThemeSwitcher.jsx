import { useEffect, useRef, useState } from "react";
import { Check, Monitor, Moon, Palette, Sun } from "lucide-react";

const THEME_KEY = "agrishield365_theme";

const OPTIONS = [
  { id: "default", label: "Default", helper: "Use device theme", icon: Monitor },
  { id: "light", label: "Light", helper: "Bright field view", icon: Sun },
  { id: "dark", label: "Dark", helper: "Low-light view", icon: Moon },
];

function readTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    return OPTIONS.some((o) => o.id === saved) ? saved : "default";
  } catch {
    return "default";
  }
}

function resolveTheme(choice) {
  if (choice === "dark" || choice === "light") return choice;
  if (typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

function applyTheme(choice) {
  const resolved = resolveTheme(choice);
  document.documentElement.setAttribute("data-theme-choice", choice);
  document.documentElement.setAttribute("data-theme", resolved);
  document.documentElement.style.colorScheme = resolved;
}

// Compact palette button + dropdown for Default / Light / Dark app themes.
export default function ThemeSwitcher({ className = "" }) {
  const [theme, setTheme] = useState(readTheme);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const active = OPTIONS.find((o) => o.id === theme) || OPTIONS[0];
  const ActiveIcon = active.icon;

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  useEffect(() => {
    if (theme !== "default") return undefined;
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!media) return undefined;
    const handler = () => applyTheme("default");
    media.addEventListener?.("change", handler);
    return () => media.removeEventListener?.("change", handler);
  }, [theme]);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change theme"
        className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 text-white hover:bg-white/25 backdrop-blur px-3 py-2 text-xs sm:text-sm font-semibold transition active:scale-95"
      >
        <Palette className="w-4 h-4 sm:hidden" />
        <ActiveIcon className="hidden sm:block w-4 h-4" />
        <span className="hidden lg:inline">{active.label}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-white shadow-2xl border border-stone-200 overflow-hidden z-50">
          {OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => {
                  setTheme(option.id);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-stone-700 hover:bg-emerald-50 transition"
              >
                <Icon className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="flex-1">
                  <span className="block">{option.label}</span>
                  <span className="block text-xs font-normal text-stone-400">{option.helper}</span>
                </span>
                {theme === option.id && <Check className="w-4 h-4 text-emerald-600" strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
