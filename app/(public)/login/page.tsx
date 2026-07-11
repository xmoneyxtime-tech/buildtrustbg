"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { AppShell, Panel } from "@/app/components/ui";
import { useTranslation } from "@/app/lib/i18n";

export default function LoginPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setAuthError(null);

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/login",
      });

      if (!result || result.error) {
        setAuthError("Invalid email or password.");
        return;
      }

      window.location.assign(result.url || "/login");
    } catch {
      setAuthError("Authentication failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell showCTA={false}>
      <section className="mx-auto flex max-w-5xl items-center justify-center px-6 py-10 sm:px-8 lg:px-10 lg:py-16">
        <Panel title={t("auth.loginTitle")} description={t("auth.loginDescription")} className="w-full max-w-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block text-sm text-slate-700">
              <span className="mb-2 block font-medium">{t("auth.emailLabel")}</span>
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 outline-none transition focus:border-[#0F4C81]"
                placeholder={t("auth.emailPlaceholder")}
              />
            </label>
            <label className="block text-sm text-slate-700">
              <span className="mb-2 block font-medium">{t("auth.passwordLabel")}</span>
              <input
                required
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 outline-none transition focus:border-[#0F4C81]"
                placeholder={t("auth.passwordPlaceholder")}
              />
            </label>
            {authError && <p className="text-sm text-red-600">{authError}</p>}
            <button type="submit" disabled={isSubmitting} className="inline-flex h-12 items-center justify-center rounded-[12px] bg-[#0F4C81] px-6 text-sm font-semibold text-white transition hover:bg-[#0B3D67] disabled:cursor-not-allowed disabled:opacity-70">
              {isSubmitting ? "Signing in..." : t("auth.loginButton")}
            </button>
          </form>

          <div className="mt-6 rounded-[20px] border border-slate-200 bg-[#F8FAFC] p-4 text-sm text-slate-700">
            {t("auth.noAccount")} <Link href="/register" className="font-semibold text-[#0F4C81]">{t("auth.registerLink")}</Link>
          </div>
        </Panel>
      </section>
    </AppShell>
  );
}
