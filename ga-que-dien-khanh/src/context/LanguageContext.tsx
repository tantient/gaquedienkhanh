import { createContext, useContext, useState } from "react";
import type { Lang } from "@/lib/translations";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "vi",
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("vi");
  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
