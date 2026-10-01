"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import type { Locale } from "@/i18n/messages";

export function SiteHeader() {
  const { locale, setLocale, t } = useLocale();

  return (
    <header className="topbar">
      <Link className="brand" href="/">
        <span className="brand-mark">C</span>
        Canvas
      </Link>
      <nav aria-label={t("workspaceNav")} className="topbar-nav">
        <Link href="/apps">{t("myApps")}</Link>
        <label className="locale-select">
          <span className="visually-hidden">{t("language")}</span>
          <select aria-label={t("language")} onChange={(event) => setLocale(event.target.value as Locale)} value={locale}>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </label>
        <Link className="button button-small" href="/login">{t("signIn")}</Link>
      </nav>
    </header>
  );
}
