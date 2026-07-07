import { DashboardShell, Panel } from "@/app/components/ui";

export default function CompanyOverviewPage() {
  return (
    <DashboardShell
      role="company"
      title="Overview"
      subtitle="Преглед на профила и готовност за пускане в публичен каталог."
    >
      <Panel title="Профил" description="Подготвен за бъдеща интеграция с CRM и файлово хранилище.">
        <p className="text-sm leading-7 text-slate-700">Тук ще се показват ключови метрики, статус и напомняния за попълване.</p>
      </Panel>
    </DashboardShell>
  );
}
