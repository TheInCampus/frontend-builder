"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { submitAuthAction } from "@/features/auth/api";
import type { ForgetPasswordRequest, SignInRequest, SignUpRequest } from "@/features/auth/types";
import { useLocale } from "@/i18n/LocaleProvider";

type AuthFormMode = "signin" | "signup" | "forget";
type AuthFormValues = { name?: string; email: string; password?: string };

export function AuthForm({
  mode,
  redirectTo,
}: {
  mode: AuthFormMode;
  redirectTo?: string;
}) {
  const { t } = useLocale();
  const router = useRouter();
  const [complete, setComplete] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>();

  const schema = z.object({
    name: z.string().optional(),
    email: z.string().trim().email(),
    password: z.string().optional(),
  }).superRefine((values, context) => {
    if (mode === "signup" && !values.name?.trim()) {
      context.addIssue({ code: "custom", path: ["name"], message: "nameRequired" });
    }
    if (mode === "signup" && (values.password?.length ?? 0) < 8) {
      context.addIssue({ code: "custom", path: ["password"], message: "passwordTooShort" });
    }
    if (mode === "signin" && !values.password) {
      context.addIssue({ code: "custom", path: ["password"], message: "passwordRequired" });
    }
  });

  async function submit(values: AuthFormValues) {
    const result = schema.safeParse(values);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (field === "email" || field === "name" || field === "password") {
          const message = issue.message === "nameRequired" ? t("nameRequired")
            : issue.message === "passwordTooShort" ? t("passwordTooShort")
              : issue.message === "passwordRequired" ? t("passwordRequired")
                : t("invalidEmail");
          setError(field, { type: "validate", message });
        }
      }
      return;
    }

    const { email, name = "", password = "" } = result.data;
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
      setError("root.server", { type: "server", message: t("authError") });
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
          <form className="auth-form" noValidate onSubmit={handleSubmit(submit)}>
            {mode === "signup" && (
              <label>{t("name")}<input autoComplete="name" maxLength={120} {...register("name")} /></label>
            )}
            <label>{t("email")}<input autoComplete="email" maxLength={254} type="email" {...register("email")} /></label>
            {mode !== "forget" && (
              <label>
                {t("password")}
                <input
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  type="password"
                  {...register("password")}
                />
              </label>
            )}
            {errors.email && <p className="auth-error" role="alert">{errors.email.message}</p>}
            {errors.name && <p className="auth-error" role="alert">{errors.name.message}</p>}
            {errors.password && <p className="auth-error" role="alert">{errors.password.message}</p>}
            {errors.root?.server && <p className="auth-error" role="alert">{errors.root.server.message}</p>}
            <button className="button button-full" disabled={isSubmitting} type="submit">
              {isSubmitting
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
