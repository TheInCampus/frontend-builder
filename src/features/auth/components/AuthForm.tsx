"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { submitAuthAction } from "@/features/auth/api";
import type { ForgetPasswordRequest, SignInRequest, SignUpRequest } from "@/features/auth/types";
import { useLocale } from "@/i18n/LocaleProvider";

type AuthFormMode = "signin" | "signup" | "forget";

export function AuthForm({
  mode,
  redirectTo,
}: {
  mode: AuthFormMode;
  redirectTo?: string;
}) {
  const { t } = useLocale();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const email = String(form.get("email") ?? "").trim();
    const name = String(form.get("name") ?? "").trim();
    const password = String(form.get("password") ?? "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t("invalidEmail"));
      return;
    }
    if (mode === "signup" && !name) {
      setError(t("nameRequired"));
      return;
    }
    if (mode !== "forget" && mode === "signup" && password.length < 8) {
      setError(t("passwordTooShort"));
      return;
    }
    if (mode === "signin" && !password) {
      setError(t("passwordRequired"));
      return;
    }
    setPending(true);

    try {
      if (mode === "signin") {
        await submitAuthAction<SignInRequest>("signin", {
          email,
          password,
        });
        router.replace(redirectTo ?? "/apps");
        router.refresh();
      } else if (mode === "signup") {
        await submitAuthAction<SignUpRequest>("signup", {
          name,
          email,
          password,
        });
        router.replace(redirectTo ?? "/apps");
        router.refresh();
      } else {
        await submitAuthAction<ForgetPasswordRequest>("forget", { email });
        setComplete(true);
      }
    } catch {
      setError(t("authError"));
    } finally {
      setPending(false);
    }
  }

  const title = mode === "signin" ? t("signInTitle") : mode === "signup" ? t("signUpTitle") : t("resetTitle");
  const intro = mode === "signin" ? t("signInIntro") : mode === "signup" ? t("signUpIntro") : t("resetIntro");

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="eyebrow">{mode === "signin" ? t("welcomeBack") : t("startBuilding")}</div>
        <h1>{title}</h1>
        <p>{intro}</p>
        {complete ? (
          <>
            <p className="auth-success" role="status">{t("resetSent")}</p>
            <p className="auth-footer"><Link href="/login">{t("backToSignIn")}</Link></p>
          </>
        ) : (
          <form className="auth-form" noValidate onSubmit={submit}>
            {mode === "signup" && (
              <label>{t("name")}<input autoComplete="name" maxLength={120} name="name" required /></label>
            )}
            <label>{t("email")}<input autoComplete="email" maxLength={254} name="email" required type="email" /></label>
            {mode !== "forget" && (
              <label>
                {t("password")}
                <input
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  name="password"
                  required
                  type="password"
                />
              </label>
            )}
            {error && <p className="auth-error" role="alert">{error}</p>}
            <button className="button button-full" disabled={pending} type="submit">
              {pending
                ? mode === "signin" ? t("signingIn") : mode === "signup" ? t("creatingAccount") : t("sendingReset")
                : mode === "signin" ? t("continue") : mode === "signup" ? t("signUp") : t("sendReset")}
            </button>
          </form>
        )}
        {!complete && (
          <p className="auth-footer">
            {mode === "signin" ? (
              <>{t("newToCanvas")} <Link href="/signup">{t("createAccount")}</Link><br /><Link href="/forget">{t("forgotPassword")}</Link></>
            ) : mode === "signup" ? (
              <>{t("alreadyHaveAccount")} <Link href="/login">{t("signIn")}</Link></>
            ) : (
              <Link href="/login">{t("backToSignIn")}</Link>
            )}
          </p>
        )}
      </section>
    </main>
  );
}
