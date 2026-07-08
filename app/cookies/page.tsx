import Link from "next/link";

export default function CookiesPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-12 sm:px-8 lg:px-10">
      <div className="space-y-3">
        <span className="inline-flex rounded-full border border-[#F58220]/25 bg-[#FFF7EE] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#F58220]">
          Правна информация
        </span>
        <h1 className="text-4xl font-semibold text-slate-900">Политика за бисквитки</h1>
        <p className="text-lg text-slate-600">Как използваме бисквитки и подобни технологии</p>
      </div>

      <div className="prose prose-slate max-w-none space-y-6 rounded-[28px] border border-slate-200/80 bg-white p-8 shadow-[0_18px_50px_-24px_rgba(15,76,129,0.16)]">
        <div className="space-y-4">
          <div className="rounded-[16px] border-l-4 border-[#F58220] bg-[#FFF7EE] p-4">
            <p className="font-semibold text-slate-900">Статус на документа</p>
            <p className="mt-2 text-sm text-slate-700">
              Този документ ще бъде финализиран преди официалното стартиране на платформата.
            </p>
          </div>

          <h2 className="text-2xl font-semibold text-slate-900">Съдържание</h2>
          <p className="text-slate-700">
            Тази политика ще обяснява как платформата използва бисквитки:
          </p>
          <ul className="space-y-2 text-slate-700">
            <li className="flex gap-3">
              <span className="text-[#F58220]">•</span>
              <span><strong>Какво са бисквитки</strong> - определение и предназначение</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#F58220]">•</span>
              <span><strong>Видове бисквитки</strong> - аналитични, функционални, маркетингови</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#F58220]">•</span>
              <span><strong>Как ги използваме</strong> - целите на всеки тип бисквитка</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#F58220]">•</span>
              <span><strong>Контрол на бисквитките</strong> - как да управлявате предпочетения си</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#F58220]">•</span>
              <span><strong>Трети страни</strong> - услуги и партньори</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#F58220]">•</span>
              <span><strong>Съответствие</strong> - GDPR и законодателство на ЕС</span>
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-slate-900">Правата ви</h2>
          <p className="text-slate-700">
            Винаги имате контрол над това кои бисквитки приемате. Можете да променяте своите предпочетания всяко време чрез настройките на браузъра си.
          </p>
        </div>
      </div>

      <Link href="/" className="text-[#0F4C81] hover:text-[#0B3D67]">
        ← Назад към началната страница
      </Link>
    </div>
  );
}
