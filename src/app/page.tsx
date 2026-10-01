"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";

export default function HomePage() {
  const { t } = useLocale();

  return (
    <main className="landing">
      <div className="eyebrow"><span className="status-dot" /> {t("yourIdeas")}</div>
      <h1>{t("landingTitle")}<br /><span>{t("landingTitleAccent")}</span></h1>
      <p className="landing-copy">
        {t("landingCopy")}
      </p>
      <div className="landing-actions">
        <Link className="button" href="/apps">{t("openWorkspace")} <span aria-hidden="true">↗</span></Link>
        <Link className="text-link" href="/signup">{t("createAccount")}</Link>
      </div>
      <div className="landing-preview" aria-label="Builder workspace preview">
        <div className="preview-window-bar"><i /><i /><i /><span>Untitled app · Builder</span></div>
        <div className="preview-window-content">
          <div className="preview-mini-sidebar"><b /><b /><b /><b /></div>
          <div className="preview-mini-canvas">
            <div className="mini-heading" /><div className="mini-copy" />
            <div className="mini-button" /><div className="mini-card" />
          </div>
          <div className="preview-mini-inspector"><b /><i /><i /><i /></div>
        </div>
      </div>
    </main>
  );
}
