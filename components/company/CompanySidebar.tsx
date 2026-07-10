import Link from "next/link";
import type { CompanyPublicProfile } from "./types";

type CompanySidebarProps = {
  company: CompanyPublicProfile;
};

export function CompanySidebar({ company }: CompanySidebarProps) {
  return (
    <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
      <h3 className="text-lg font-semibold text-slate-900">Контакти</h3>
      <div className="space-y-2 text-sm leading-7 text-slate-700">
        <p>Имейл: {company.email}</p>
        <p>Телефон: {company.phone}</p>
        <p>Град: {company.city}</p>
        {company.website ? (
          <p>
            Уебсайт: <a href={company.website} className="text-[#0F4C81] underline" target="_blank" rel="noreferrer">{company.website}</a>
          </p>
        ) : (
          <p>Уебсайт: няма публикуван</p>
        )}
      </div>

      <div className="pt-4">
        <Link
          href="/contact"
          className="inline-flex rounded-full bg-[#F58220] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#E36F00]"
        >
          Изпрати запитване
        </Link>
      </div>
    </aside>
  );
}
