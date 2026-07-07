import Link from "next/link";
import { AppShell, Panel } from "@/app/components/ui";
import { categories, cities } from "@/app/lib/mock-data";

export default function CompaniesPage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10 lg:py-16">
        <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-[0_24px_80px_-32px_rgba(15,76,129,0.2)] sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#F58220]">Компании</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Открийте доверени строителни компании в България.
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
            Платформата ще показва публични профили само след одобрение от администратор.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Panel title="Категории" description="Възможност за филтриране по услуги и специализации.">
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <span key={category} className="rounded-full border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-sm font-medium text-slate-700">
                    {category}
                  </span>
                ))}
              </div>
            </Panel>
            <Panel title="Градове" description="Търсене по населени места и региони.">
              <div className="flex flex-wrap gap-3">
                {cities.map((city) => (
                  <span key={city} className="rounded-full border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-sm font-medium text-slate-700">
                    {city}
                  </span>
                ))}
              </div>
            </Panel>
          </div>

          <div className="mt-8 rounded-[24px] border border-dashed border-slate-300 bg-[#F8FAFC] p-8 text-center text-slate-600">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#F58220]">Публичен каталог</p>
            <p className="mt-3 text-base leading-7">Тук ще се появяват само одобрени компании след интеграция с база данни.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/register" className="rounded-full bg-[#0F4C81] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0B3D67]">
                Регистрирай компания
              </Link>
              <Link href="/login" className="rounded-full border border-[#0F4C81]/20 bg-white px-5 py-3 text-sm font-semibold text-[#0F4C81] transition hover:bg-[#F8FAFC]">
                Вход за фирми
              </Link>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
