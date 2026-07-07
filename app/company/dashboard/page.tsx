import Link from "next/link";
import { DashboardShell, Panel, StatusBadge } from "@/app/components/ui";

export default function CompanyDashboardPage() {
  return (
    <DashboardShell
      role="company"
      title="Обзор"
      subtitle="Управлявайте профила си, съобщенията и статуса на одобрение в едно място."
    >
      <Panel title="Статус на профила" description="Профилът остава скрит до одобрение от администратор.">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge variant="warning">Вашият профил очаква одобрение от администратор.</StatusBadge>
          <StatusBadge variant="neutral">Регистрирана фирма</StatusBadge>
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Бързи действия" description="Подготвени секции за управление на вашия профил.">
          <div className="flex flex-wrap gap-3">
            <Link href="/company/dashboard/edit-profile" className="rounded-full bg-[#0F4C81] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B3D67]">Редактирай профил</Link>
            <Link href="/company/dashboard/gallery" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#F8FAFC]">Галерия</Link>
            <Link href="/company/dashboard/projects" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#F8FAFC]">Проекти</Link>
          </div>
        </Panel>

        <Panel title="Проверка" description="Състояние на верификация и готовност за публичен профил.">
          <div className="space-y-3 text-sm leading-7 text-slate-700">
            <p>• Лого: Очаква се качване</p>
            <p>• Описание: Частично попълнено</p>
            <p>• Услуги: Очаква се редакция</p>
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}
