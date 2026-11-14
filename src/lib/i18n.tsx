import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "fr" | "en";

const KEY = "aun-lang";

/* Langue mémorisée dans le navigateur (français par défaut) */
const read = (): Lang => {
  try {
    const s = localStorage.getItem(KEY);
    if (s === "fr" || s === "en") return s;
  } catch {
    /* stockage indisponible : on garde le français */
  }
  return "fr";
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void };
const LangContext = createContext<Ctx>({ lang: "fr", setLang: () => {} });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setL] = useState<Lang>(read);

  const setLang = useCallback((l: Lang) => {
    setL(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);