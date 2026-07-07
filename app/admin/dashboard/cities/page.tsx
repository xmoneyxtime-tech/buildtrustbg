import { DashboardShell, Panel, StatusBadge } from "@/app/components/ui";

export default function CitiesPage() {
  return (
    <DashboardShell role="admin" title="Cities" subtitle="Управлявайте градове и регионални филтри.">
      <Panel title="Градове" description="Списък с налични градове за търсене и филтриране.">
        <StatusBadge variant="neutral">Градовете ще бъдат управлявани след backend интеграция.</StatusBadge>
      </Panel>
    </DashboardShell>
  );
}
