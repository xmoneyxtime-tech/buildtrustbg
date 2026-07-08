import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-12 sm:px-8 lg:px-10">
      <div className="space-y-3">
        <span className="inline-flex rounded-full border border-[#F58220]/25 bg-[#FFF7EE] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#F58220]">
          Правна информация
        </span>
        <h1 className="text-4xl font-semibold text-slate-900">Общи условия</h1>
        <p className="text-lg text-slate-600">BuildTrustBG - условия за използване</p>
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
            Този документ ще съдържа следните секции:
          </p>
          <ul className="space-y-2 text-slate-700">
            <li className="flex gap-3">
              <span className="text-[#F58220]">•</span>
              <span><strong>Определения и терминология</strong> - основни условия и дефиниции</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#F58220]">•</span>
              <span><strong>Правила за използване</strong> - как да използвате платформата</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#F58220]">•</span>
              <span><strong>Отговорност на потребителя</strong> - ваши задължения като потребител</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#F58220]">•</span>
              <span><strong>Правата на компаниите</strong> - защита на данни и информация</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#F58220]">•</span>
              <span><strong>Ограничения на отговорността</strong> - защита на платформата</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#F58220]">•</span>
              <span><strong>Трудови разрешения и икономически дейности</strong> - верификационни процеси</span>
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-slate-900">Забележка</h2>
          <p className="text-slate-700">
            BuildTrustBG запазва правото да актуализира тези общи условия. Всички промени ще бъдат публикувани на тази страница с ясно обозначена дата на вступление в сила.
          </p>
        </div>
      </div>

      <Link href="/" className="text-[#0F4C81] hover:text-[#0B3D67]">
        ← Назад към началната страница
      </Link>
    </div>
  );
}
