import Link from "next/link";
import { AppShell, Button, FeatureCard, Footer, SectionTitle } from "./components/ui";
import { cities, featuredCategories, serviceOptions } from "./lib/mock-data";

const trustFeatures = [
  {
    title: "Проверени фирми",
    description: "Само компании, които преминават проверка.",
    icon: "✓",
  },
  {
    title: "Реални отзиви",
    description: "Отзиви от истински клиенти.",
    icon: "★",
  },
  {
    title: "Сравнете фирми",
    description: "Сравнете услуги, рейтинг и проекти.",
    icon: "⇄",
  },
  {
    title: "Безплатно търсене",
    description: "Използването на платформата е безплатно.",
    icon: "⟲",
  },
];

const steps = [
  {
    title: "Изберете услуга",
    description: "Открийте подходяща категория за проекта си.",
  },
  {
    title: "Изберете град",
    description: "Филтрирайте по населено място и регион.",
  },
  {
    title: "Сравнете фирмите",
    description: "Сравнявайте услуги, отзиви и опит.",
  },
  {
    title: "Свържете се с избраната фирма",
    description: "Изпратете заявка директно към подходящия изпълнител.",
  },
];

export default function Home() {
  return (
    <AppShell>
      <section className="mx-auto flex max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10 lg:py-8">
        <section id="home" className="fade-up rounded-[32px] border border-slate-200/80 bg-white/90 px-6 py-12 shadow-[0_30px_90px_-40px_rgba(15,76,129,0.22)] backdrop-blur sm:px-8 lg:px-12 lg:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full border border-[#F58220]/25 bg-[#FFF7EE] px-3 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-[#F58220]">
                ПРОВЕРЕНИ СТРОИТЕЛНИ ФИРМИ
              </span>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Намерете доверени строителни компании в България.
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-700 sm:text-xl">
                BuildTrustBG Ви помага лесно да откриете проверени строителни фирми, да сравните услуги, проекти и клиентски отзиви, за да изберете най-подходящия изпълнител за Вашия проект.
              </p>

              <div className="mt-8 rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_24px_80px_-30px_rgba(15,76,129,0.24)] sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Започнете търсенето</h2>
                    <p className="mt-1 text-sm text-slate-600">Търсете по услуга, град и готовност за контакт.</p>
                  </div>
                  <div className="rounded-full border border-[#0F4C81]/10 bg-[#F8FAFC] px-3 py-2 text-sm font-semibold text-[#0F4C81]">
                    Премиум търсене
                  </div>
                </div>

                <div className="mt-6 grid gap-4 xl:grid-cols-[1.1fr_1.1fr_auto]">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Услуга</span>
                    <select defaultValue="" className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-[#0F4C81] focus:bg-white">
                      <option value="" disabled>
                        Изберете услуга
                      </option>
                      {serviceOptions.map((service) => (
                        <option key={service.value} value={service.value}>
                          {service.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Град</span>
                    <select defaultValue="" className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-[#0F4C81] focus:bg-white">
                      <option value="" disabled>
                        Изберете град
                      </option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="flex items-end">
                    <Button className="w-full justify-center bg-[#F58220] hover:bg-[#E36F00] xl:w-[170px]">
                      Търси
                    </Button>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/companies" className="inline-flex h-12 items-center justify-center rounded-[12px] border border-[#0F4C81]/20 bg-white px-6 text-sm font-medium text-[#0F4C81] transition hover:border-[#0F4C81]/40 hover:bg-[#F8FAFC]">
                    Разгледай компании
                  </Link>
                </div>
                <div className="mt-6 flex flex-wrap gap-3 text-sm font-medium text-slate-700">
                  <span className="rounded-full border border-slate-200 bg-[#F8FAFC] px-3 py-2">✔ Проверени фирми</span>
                  <span className="rounded-full border border-slate-200 bg-[#F8FAFC] px-3 py-2">✔ Реални отзиви</span>
                  <span className="rounded-full border border-slate-200 bg-[#F8FAFC] px-3 py-2">✔ Цяла България</span>
                </div>
              </div>
            </div>

            <div className="relative min-h-[360px] overflow-hidden rounded-[28px] border border-slate-200/80 bg-[linear-gradient(135deg,_#F8FBFD_0%,_#EEF4FA_100%)] p-6 shadow-[0_20px_70px_-30px_rgba(15,76,129,0.24)] sm:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(245,130,32,0.16),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(15,76,129,0.14),_transparent_50%)]" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="rounded-2xl border border-[#0F4C81]/10 bg-white/80 p-3 shadow-sm">
                    <svg viewBox="0 0 64 64" className="h-10 w-10 text-[#0F4C81]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="12" y="16" width="40" height="32" rx="4" />
                      <path d="M20 28h24" />
                      <path d="M20 36h16" />
                      <path d="M36 36h8" />
                      <path d="M22 16v-4" />
                      <path d="M42 16v-4" />
                    </svg>
                  </div>
                  <div className="rounded-full border border-[#F58220]/20 bg-[#FFF7EE] px-3 py-1 text-sm font-semibold text-[#F58220]">
                    BuildTrustBG
                  </div>
                </div>

                <div className="mt-8 rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-[0_16px_50px_-24px_rgba(15,76,129,0.2)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0F4C81] text-lg font-semibold text-white">
                      BT
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Платформа за доверени фирми</p>
                      <p className="text-sm text-slate-600">Откривайте подходящи изпълнители с по-малко риск.</p>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#F58220]">Сравнение</p>
                      <p className="mt-1 text-sm font-medium text-slate-800">Сравнявайте услуги и подход</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#F58220]">Проверка</p>
                      <p className="mt-1 text-sm font-medium text-slate-800">Откривайте надеждни фирми</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      <section id="services" className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
        <SectionTitle
          eyebrow="Защо BuildTrustBG"
          title="Доверена платформа за сравнение и избор"
          description="Подобрете процеса на търсене, сравняване и контакт с строителни фирми в България."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {trustFeatures.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={<span className="text-2xl">{feature.icon}</span>}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>

      <section id="services-categories" className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
        <SectionTitle
          eyebrow="Популярни категории"
          title="Открийте услуги по категории"
          description="Разгледайте най-търсените услуги и намерете подходящ изпълнител за вашия проект."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featuredCategories.map((category) => (
            <div
              key={category.title}
              className="group rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_60px_-32px_rgba(15,76,129,0.2)] transition duration-300 hover:-translate-y-1 hover:border-[#0F4C81]/20 hover:shadow-[0_24px_80px_-30px_rgba(15,76,129,0.28)]"
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${category.accent}`}>
                <span className="text-2xl">{category.icon}</span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">{category.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{category.description}</p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0F4C81]">
                Виж фирми
                <span className="transition group-hover:translate-x-1">↗</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="companies" className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="rounded-[32px] border border-slate-200/80 bg-[linear-gradient(135deg,_#ffffff_0%,_#f8fbff_100%)] px-8 py-14 shadow-[0_24px_80px_-32px_rgba(15,76,129,0.24)] sm:px-10 lg:px-14">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex rounded-full border border-[#F58220]/25 bg-[#FFF7EE] px-3 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-[#F58220]">
              Проверени строителни фирми
            </span>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              BuildTrustBG изгражда мрежа от проверени строителни компании в България.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-700 sm:text-lg">
              В момента извършваме проверка на първите кандидатстващи фирми.
            </p>

            <div className="mt-8 rounded-[28px] border border-[#F58220]/20 bg-white p-8 shadow-[0_24px_80px_-36px_rgba(15,76,129,0.24)] sm:p-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF7EE] text-3xl shadow-sm">
                🛡️
              </div>
              <p className="mt-6 text-xl font-semibold text-slate-900">
                Първите проверени фирми ще се появят скоро.
              </p>
              <Link href="/register" className="mt-8 inline-flex h-12 items-center justify-center rounded-[12px] bg-[#F58220] px-6 text-sm font-semibold text-white transition hover:bg-[#E36F00]">
                Регистрирай фирма
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
        <SectionTitle
          eyebrow="Как работи"
          title="Прост процес от четири стъпки"
          description="Открийте, сравнете и се свържете с подходяща строителна фирма за вашия проект."
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-[0_16px_50px_-28px_rgba(15,76,129,0.2)]">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0F4C81] text-sm font-semibold text-white">
                  {index + 1}
                </div>
                {index < steps.length - 1 ? (
                  <span className="hidden text-2xl text-[#F58220] lg:block">↓</span>
                ) : null}
              </div>
              <div className="mt-5">
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#F58220]">Стъпка {index + 1}</div>
                <p className="mt-3 text-lg font-semibold text-slate-900">{step.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-6 pb-20 pt-16 sm:px-8 lg:px-10">
        <div className="rounded-[32px] border border-slate-200/80 bg-[linear-gradient(135deg,_#0A3E6D_0%,_#0E4F81_45%,_#135C93_100%)] px-8 py-16 text-white shadow-[0_30px_90px_-32px_rgba(15,76,129,0.45)] sm:px-12 lg:px-16">
          <SectionTitle
            align="center"
            eyebrow="Започнете с яснота"
            title="Намерете правилния изпълнител още днес."
            description="Разгледайте проверени строителни компании от цяла България."
          />
          <div className="mt-8 flex justify-center gap-3">
            <Button className="bg-white text-[#0B3D67] hover:bg-[#F8FAFC] shadow-[0_10px_30px_-12px_rgba(255,255,255,0.45)]">Започнете търсенето</Button>
            <Link href="/register" className="inline-flex h-12 items-center justify-center rounded-[12px] border border-white/30 bg-white/10 px-6 text-sm font-medium text-white transition hover:bg-white/20">
              Регистрирай компания
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </AppShell>
  );
}
