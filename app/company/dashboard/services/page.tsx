import { DashboardShell, Panel } from "@/app/components/ui";

export default function ServicesPage() {
  return (
    <DashboardShell role="company" title="Services" subtitle="Редактирайте предлаганите услуги и специализации.">
      <Panel title="Услуги" description="Списъкът ще бъде управляван от компанията след интеграция с данни.">
        <p className="text-sm leading-7 text-slate-700">Ще бъде добавено в следващ етап.</p>
      </Panel>
    </DashboardShell>
  );
}
