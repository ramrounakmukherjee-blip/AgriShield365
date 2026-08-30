import { createContext, useContext, useState, useEffect, useCallback } from "react";
import translations, { LANGUAGES } from "./i18n";

const LangContext = createContext({ lang: "en", setLang: () => {} });

const LANG_KEY = "agrishield365_lang";

function readSavedLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && LANGUAGES.some((l) => l.id === saved)) return saved;
  } catch {
    /* ignore */
  }
  return "en";
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(readSavedLang);

  // Apply to <html> for CSS font switching
  useEffect(() => {
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  const setLang = useCallback((code) => {
    setLangState(code);
    try {
      localStorage.setItem(LANG_KEY, code);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);

  // tr(translationObject) -> string in current language
  const tr = useCallback(
    (entry) => {
      if (!entry) return "";
      if (typeof entry === "string") return entry;
      return entry[ctx.lang] || entry.en || "";
    },
    [ctx.lang]
  );

  // lookup dotted path through the translation tree
  const t = useCallback(
    (path) => {
      const parts = path.split(".");
      let node = translations;
      for (const p of parts) {
        if (node == null) return "";
        node = node[p];
      }
      if (node == null) return "";
      if (typeof node === "string") return node;
      return node[ctx.lang] || node.en || "";
    },
    [ctx.lang]
  );

  return { ...ctx, tr, t };
}
