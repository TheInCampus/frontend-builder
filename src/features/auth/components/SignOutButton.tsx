"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { submitAuthAction } from "@/features/auth/api";
import { useLocale } from "@/i18n/LocaleProvider";

export function SignOutButton({ className = "sidebar-signout" }: { className?: string }) {
  const { t } = useLocale();
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function signOut() {
    if (pending) return;
    setPending(true);
    setError("");
    try {
      await submitAuthAction("signout");
    } catch {
      setError(t("signOutFailed"));
      setPending(false);
      return;
    }
    router.replace("/login");
    router.refresh();
  }

  return (
    <>
      <button className={className} disabled={pending} onClick={signOut} type="button">{t("signOut")}</button>
      {error && <p className="auth-error" role="alert">{error}</p>}
    </>
  );
}
