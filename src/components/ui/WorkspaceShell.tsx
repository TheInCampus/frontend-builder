"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";

export function WorkspaceShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { t } = useLocale();
  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="sidebar-label">{t("workspace")}</div>
        <Link className="sidebar-link active" href="/apps"><span>▦</span> {t("allApps")}</Link>
        <div className="sidebar-label sidebar-label-spaced">{t("yourSpace")}</div>
        <Link className="sidebar-link" href="/apps/demo"><span>◈</span> {t("untitledApp")}</Link>
        <Link className="sidebar-link" href="/apps/demo/basemodel"><span>▤</span> {t("dataModel")}</Link>
        <div className="sidebar-bottom">{t("dashboardMotto")}</div>
      </aside>
      <main className="dashboard-main">{children}</main>
    </div>
  );
}
