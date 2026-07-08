"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell, MarketplaceForm, Panel } from "@/app/components/ui";
import { CompanyRegistrationForm } from "@/app/lib/marketplace/types";

export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (form: CompanyRegistrationForm) => {
    console.info("Company registration submitted", form);
    setSubmitted(true);
  };

  return (
    <AppShell showCTA={false}>
      <section className="mx-auto flex max-w-5xl items-center justify-center px-6 py-10 sm:px-8 lg:px-10 lg:py-16">
        <Panel title="Регистрация на фирма" description="Подайте заявка за участие в BuildTrustBG и започнете процеса на проверка." className="w-full max-w-3xl">
          <div className="space-y-5">
            <div className="rounded-[20px] border border-[#F58220]/20 bg-[#FFF7EE] p-4 text-sm leading-7 text-slate-700">
              След подадена заявка вашият профил ще бъде прегледан от администратор и впоследствие ще може да бъде публикуван в каталога.
            </div>

            {submitted ? (
              <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                Заявката беше записана успешно. Ще получите следваща стъпка след одобрението на администратора.
              </div>
            ) : null}

            <MarketplaceForm onSubmit={handleSubmit} submitLabel="Изпрати заявка" />

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/company/dashboard" className="rounded-full bg-[#0F4C81] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0B3D67]">
                Компания Dashboard
              </Link>
              <Link href="/admin/dashboard" className="rounded-full border border-[#0F4C81]/20 bg-white px-5 py-3 text-sm font-semibold text-[#0F4C81] transition hover:bg-[#F8FAFC]">
                Admin Dashboard
              </Link>
            </div>
          </div>
        </Panel>
      </section>
    </AppShell>
  );
}
