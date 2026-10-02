"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";

export function StandalonePreviewBar({ appId }: { appId: string }) {
  const { t } = useLocale();
  return (
    <header className="standalone-preview-bar">
      <Link className="brand" href="/apps"><span className="brand-mark">C</span> Canvas</Link>
      <span>{t("preview")} · {t("untitledApp")}</span>
      <Link className="text-link" href={`/apps/${appId}/builder`}>{t("backToEditor")} ↗</Link>
    </header>
  );
}
