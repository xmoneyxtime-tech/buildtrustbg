import Link from "next/link";
import { AppShell, Panel, StatusBadge } from "@/app/components/ui";
import { companyProfilePlaceholder } from "@/app/lib/mock-data";

export default function CompanyProfilePage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10 lg:py-16">
        <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-[0_24px_80px_-32px_rgba(15,76,129,0.2)] sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#F58220]">Профил на компания</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                {companyProfilePlaceholder.name}
              </h1>
            </div>
            <StatusBadge variant="info">BuildTrust Verified</StatusBadge>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Panel title="Описание" description="Подготвен публичен профил за бъдещи реални компании.">
              <p className="text-sm leading-8 text-slate-700">{companyProfilePlaceholder.description}</p>
            </Panel>
            <Panel title="Контакти" description="Информация, която ще бъде попълвана от компанията.">
              <div className="space-y-3 text-sm leading-7 text-slate-700">
                <p>Телефон: {companyProfilePlaceholder.phone}</p>
                <p>Email: {companyProfilePlaceholder.email}</p>
                <p>Website: {companyProfilePlaceholder.website}</p>
                <p>Град: {companyProfilePlaceholder.city}</p>
                <p>Адрес: {companyProfilePlaceholder.address}</p>
              </div>
            </Panel>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Panel title="Услуги" description="Списъкът ще бъде управляван от компанията.">
              <div className="flex flex-wrap gap-3">
                {companyProfilePlaceholder.services.map((service) => (
                  <span key={service} className="rounded-full border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-sm font-medium text-slate-700">
                    {service}
                  </span>
                ))}
              </div>
            </Panel>
            <Panel title="Работно време" description="Ще бъде редактирано от компанията в собствения ѝ профил.">
              <p className="text-sm leading-7 text-slate-700">{companyProfilePlaceholder.workingHours}</p>
            </Panel>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Panel title="Проекти" description="Завършени проекти и реализирани обекти.">
              <ul className="space-y-2 text-sm leading-7 text-slate-700">
                {companyProfilePlaceholder.projectNotes.map((project) => (
                  <li key={project}>• {project}</li>
                ))}
              </ul>
            </Panel>
            <Panel title="Галерия" description="Снимки и визуална презентация на работата.">
              <ul className="space-y-2 text-sm leading-7 text-slate-700">
                {companyProfilePlaceholder.galleryItems.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </Panel>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Panel title="Отзиви" description="Публични мнения от клиенти и партньори.">
              <ul className="space-y-2 text-sm leading-7 text-slate-700">
                {companyProfilePlaceholder.reviews.map((review) => (
                  <li key={review}>• {review}</li>
                ))}
              </ul>
            </Panel>
            <Panel title="Социални мрежи" description="Връзки за контакт и проверка на компанията.">
              <div className="space-y-3 text-sm leading-7 text-slate-700">
                <p>Facebook: {companyProfilePlaceholder.facebook}</p>
                <p>Instagram: {companyProfilePlaceholder.instagram}</p>
                <p>LinkedIn: {companyProfilePlaceholder.linkedin}</p>
              </div>
            </Panel>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="rounded-full bg-[#F58220] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#E36F00]">
              Контактирай фирмата
            </Link>
            <Link href="/companies" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-[#F8FAFC]">
              Обратно към компаниите
            </Link>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
