"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translate, type Locale, type MessageKey } from "@/i18n/config";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  const [locale, setLocale] = useState(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `canvas_locale=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
  }, [locale]);

  const value = useMemo(
    () => ({ locale, setLocale, t: (key: MessageKey) => translate(locale, key) }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within LocaleProvider.");
  return context;
}
