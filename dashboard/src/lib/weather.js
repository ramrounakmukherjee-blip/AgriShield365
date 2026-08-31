// WMO weather-code → emoji + rough label (Open-Meteo uses WMO codes).
export function weatherEmoji(code = 0) {
  if (code === 0) return "☀️";
  if ([1, 2].includes(code)) return "🌤️";
  if (code === 3) return "☁️";
  if ([45, 48].includes(code)) return "🌫️";
  if ([51, 53, 55, 56, 57].includes(code)) return "🌦️";
  if ([61, 63, 66, 67, 80, 81].includes(code)) return "🌧️";
  if ([65, 82].includes(code)) return "🌧️";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "🌨️";
  if ([95, 96, 99].includes(code)) return "⛈️";
  return "🌤️";
}

export function weekday(dateStr, locale) {
  const d = new Date(dateStr.length === 10 ? dateStr + "T00:00:00" : dateStr);
  return d.toLocaleDateString(locale, { weekday: "short" });
}

export function shortDate(dateStr, locale) {
  const d = new Date(dateStr.length === 10 ? dateStr + "T00:00:00" : dateStr);
  return d.toLocaleDateString(locale, { day: "numeric", month: "short" });
}

export function hourLabel(iso, locale) {
  const d = new Date(iso);
  return d.toLocaleTimeString(locale, { hour: "numeric" });
}
