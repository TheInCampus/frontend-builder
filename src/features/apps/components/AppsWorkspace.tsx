"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { apiRequest } from "@/lib/api/client";
import { useLocale } from "@/i18n/LocaleProvider";

type AppRecord = { id: string; name: string };
type AppsResponse = { apps: AppRecord[] };
type AppResponse = { app: AppRecord };

export function AppsWorkspace() {
  const { t } = useLocale();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const apps = useQuery({
    queryKey: ["apps"],
    queryFn: () => apiRequest<AppsResponse>("metaplatform/apps"),
  });
  const createApp = useMutation({
    mutationFn: (appName: string) => apiRequest<AppResponse>("metaplatform/apps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: appName }),
    }),
    onSuccess: () => {
      setName("");
      void queryClient.invalidateQueries({ queryKey: ["apps"] });
    },
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName) createApp.mutate(trimmedName);
  }

  return (
    <div className="page-content">
      <div className="page-heading">
        <div><div className="eyebrow">{t("workspaceEyebrow")}</div><h1>{t("myApps")}</h1><p>{t("appsIntro")}</p></div>
        <form className="apps-create-form" onSubmit={submit}>
          <input
            aria-label={t("appName")}
            maxLength={120}
            onChange={(event) => setName(event.target.value)}
            placeholder={t("appName")}
            required
            value={name}
          />
          <button className="button" disabled={createApp.isPending} type="submit">
            {createApp.isPending ? t("creatingApp") : t("createApp")}
          </button>
        </form>
      </div>
      {apps.isPending && <p role="status">{t("loadingApps")}</p>}
      {(apps.isError || createApp.isError) && <p className="auth-error" role="alert">{t("appsLoadError")}</p>}
      {apps.data?.apps.map((app) => (
        <Link className="app-card" href={`/apps/${encodeURIComponent(app.id)}`} key={app.id}>
          <div className="app-card-icon">◈</div>
          <div className="app-card-body"><h2>{app.name}</h2><p>{t("appDescription")}</p><span className="app-card-meta">{t("draft")}</span></div>
          <span className="app-card-arrow" aria-hidden="true">↗</span>
        </Link>
      ))}
      {!apps.isPending && apps.data?.apps.length === 0 && <div className="empty-note">{t("appsEmpty")}</div>}
    </div>
  );
}
