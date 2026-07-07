import Link from "next/link";
import { AppShell, Button, FeatureCard, SectionTitle } from "./components/ui";

const categories = [
  "Строителство на къщи",
  "Основни ремонти",
  "Покриви",
  "Изолации",
  "Електро",
  "ВиК",
  "Архитекти",
  "Интериорен дизайн",
];

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
  "Изберете услуга",
  "Изберете град",
  "Сравнете фирмите",
  "Свържете се с избраната компания",
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

              <div className="mt-8 rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-[0_20px_70px_-30px_rgba(15,76,129,0.24)] sm:p-7">
                <h2 className="text-xl font-semibold text-slate-900">Започнете търсенето</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Каква услуга търсите?</span>
                    <select defaultValue="" className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3.5 text-sm text-slate-700 outline-none focus:border-[#0F4C81]">
                      <option value="" disabled>
                        Изберете услуга
                      </option>
                      <option>Строителство на къщи</option>
                      <option>Основни ремонти</option>
                      <option>Покриви</option>
                      <option>Изолации</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">В кой град?</span>
                    <select defaultValue="" className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3.5 text-sm text-slate-700 outline-none focus:border-[#0F4C81]">
                      <option value="" disabled>
                        Изберете град
                      </option>
                      <option>София</option>
                      <option>Пловдив</option>
                      <option>Варна</option>
                      <option>Бургас</option>
                    </select>
                  </label>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button className="w-full justify-center bg-[#F58220] hover:bg-[#E36F00] md:w-auto">
                    Намери фирма
                  </Button>
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
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <div key={category} className="rounded-[20px] border border-slate-200/80 bg-white px-5 py-4 text-sm font-medium text-slate-700 shadow-[0_12px_40px_-24px_rgba(15,76,129,0.2)]">
              {category}
            </div>
          ))}
        </div>
      </section>

      <section id="companies" className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
        <SectionTitle
          eyebrow="Избрани компании"
          title="Площ за фирми, които ще бъдат добавени по-късно"
          description="Тази секция остава празна като placeholder, докато не бъдат добавени реални профили и данни."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="rounded-[24px] border border-dashed border-slate-300 bg-[#F8FAFC] p-8 text-center text-slate-600">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#F58220]">Placeholder</p>
              <p className="mt-3 text-base leading-7">Тук ще се показват фирми след добавяне на реални профили.</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
        <SectionTitle
          eyebrow="Как работи"
          title="Прост процес от четири стъпки"
          description="Открийте, сравнете и се свържете с подходяща строителна фирма за вашия проект."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step} className="rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-[0_16px_50px_-28px_rgba(15,76,129,0.2)]">
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#F58220]">Стъпка {index + 1}</div>
              <p className="mt-3 text-lg font-semibold text-slate-900">{step}</p>
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
    </AppShell>
  );
}
