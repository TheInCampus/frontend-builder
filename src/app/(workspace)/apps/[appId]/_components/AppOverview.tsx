"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";

export function AppOverview({ appId }: { appId: string }) {
  const { t } = useLocale();
  return (
    <div className="page-content">
      <div className="eyebrow">{t("appOverview")}</div>
      <h1>{t("untitledApp")}</h1>
      <p className="page-lead">{t("blankCanvas")}</p>
      <div className="overview-actions">
        <Link className="button" href={`/apps/${appId}/builder`}>{t("openBuilder")} <span aria-hidden="true">↗</span></Link>
        <Link className="button button-secondary" href={`/apps/${appId}/basemodel`}>{t("dataModel")}</Link>
        <Link className="button button-secondary" href={`/preview/${appId}`}>{t("previewApp")}</Link>
      </div>
      <section className="overview-panel"><span className="panel-icon">✳</span><div><h2>{t("readyWhenYouAre")}</h2><p>{t("overviewTip")}</p></div></section>
    </div>
  );
}
