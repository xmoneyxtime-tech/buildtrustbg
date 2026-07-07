import { DashboardShell, Panel, StatusBadge } from "@/app/components/ui";

export default function ApprovedCompaniesPage() {
  return (
    <DashboardShell role="admin" title="Approved Companies" subtitle="Управлявайте вече одобрени и публични компании.">
      <Panel title="Одобрени компании" description="Публични профили, които са видими в каталога.">
        <StatusBadge variant="info">Няма одобрени компании в момента.</StatusBadge>
      </Panel>
    </DashboardShell>
  );
}
