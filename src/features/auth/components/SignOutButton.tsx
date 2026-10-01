"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { submitAuthAction } from "@/features/auth/api";
import { useLocale } from "@/i18n/LocaleProvider";

export function SignOutButton() {
  const { t } = useLocale();
  const router = useRouter();
  const [error, setError] = useState("");

  async function signOut() {
    setError("");
    try {
      await submitAuthAction("signout");
    } catch {
      setError(t("signOutFailed"));
      return;
    }
    router.replace("/login");
    router.refresh();
  }

  return (
    <>
      <button className="sidebar-signout" onClick={signOut} type="button">{t("signOut")}</button>
      {error && <p className="auth-error" role="alert">{error}</p>}
    </>
  );
}
