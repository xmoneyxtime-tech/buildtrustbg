import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-12 sm:px-8 lg:px-10">
      <div className="space-y-3">
        <span className="inline-flex rounded-full border border-[#F58220]/25 bg-[#FFF7EE] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#F58220]">
          Правна информация
        </span>
        <h1 className="text-4xl font-semibold text-slate-900">Политика за поверителност</h1>
        <p className="text-lg text-slate-600">Защита на вашите лични данни</p>
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
            Тази политика ще описва как BuildTrustBG събира, използва и защитава вашите данни:
          </p>
          <ul className="space-y-2 text-slate-700">
            <li className="flex gap-3">
              <span className="text-[#F58220]">•</span>
              <span><strong>Събиране на данни</strong> - какъв вид информация събираме</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#F58220]">•</span>
              <span><strong>Използване на данни</strong> - как използваме вашата информация</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#F58220]">•</span>
              <span><strong>Защита на данни</strong> - мерки за сигурност</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#F58220]">•</span>
              <span><strong>Права на потребителя</strong> - достъп, изправка и изтриване</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#F58220]">•</span>
              <span><strong>Отговорни за данни</strong> - контактни данни</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#F58220]">•</span>
              <span><strong>GDPR съответствие</strong> - правата на ЕС</span>
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-slate-900">Вашата безопасност</h2>
          <p className="text-slate-700">
            BuildTrustBG е поета на защитата на вашите лични данни и работи в съответствие със всички приложими закони за защита на данните.
          </p>
        </div>
      </div>

      <Link href="/" className="text-[#0F4C81] hover:text-[#0B3D67]">
        ← Назад към началната страница
      </Link>
    </div>
  );
}
