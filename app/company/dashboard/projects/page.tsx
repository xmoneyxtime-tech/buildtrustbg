import { DashboardShell, Panel } from "@/app/components/ui";

export default function ProjectsPage() {
  return (
    <DashboardShell role="company" title="Projects" subtitle="Покажете завършени проекти и качества в работата си.">
      <Panel title="Проекти" description="Подготвено място за добавяне на реализирани обекти.">
        <p className="text-sm leading-7 text-slate-700">Ще бъде добавено в следващ етап.</p>
      </Panel>
    </DashboardShell>
  );
}
