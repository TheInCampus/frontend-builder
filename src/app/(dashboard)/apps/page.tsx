"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";

export default function AppsPage() {
  const { t } = useLocale();

  return (
    <div className="page-content">
      <div className="page-heading">
        <div><div className="eyebrow">{t("workspaceEyebrow")}</div><h1>{t("myApps")}</h1><p>{t("appsIntro")}</p></div>
        <Link className="button" href="/apps/demo/builder">{t("openStarter")} <span aria-hidden="true">↗</span></Link>
      </div>
      <Link className="app-card" href="/apps/demo">
        <div className="app-card-icon">◈</div>
        <div className="app-card-body"><h2>{t("untitledApp")}</h2><p>{t("appDescription")}</p><span className="app-card-meta">{t("updatedJustNow")} <span>·</span> {t("draft")}</span></div>
        <span className="app-card-arrow" aria-hidden="true">↗</span>
      </Link>
      <div className="empty-note">{t("appsEmpty")}</div>
    </div>
  );
}
