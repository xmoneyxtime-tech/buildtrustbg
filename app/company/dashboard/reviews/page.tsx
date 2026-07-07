import { DashboardShell, Panel } from "@/app/components/ui";

export default function ReviewsPage() {
  return (
    <DashboardShell role="company" title="Reviews" subtitle="Проследявайте отзиви и обратна връзка от клиенти.">
      <Panel title="Отзиви" description="Секция за публични и вътрешни отзиви.">
        <p className="text-sm leading-7 text-slate-700">Ще бъде добавено в следващ етап.</p>
      </Panel>
    </DashboardShell>
  );
}
