import { DashboardShell, Panel, StatusBadge } from "@/app/components/ui";

export default function ApprovedCompaniesPage() {
  return (
    <DashboardShell role="admin">
      <Panel title="Одобрени компании" description="Публични профили, които са видими в каталога.">
        <StatusBadge variant="info">Няма одобрени компании в момента.</StatusBadge>
      </Panel>
    </DashboardShell>
  );
}
