import { DashboardShell, Panel, StatusBadge } from "@/app/components/ui";

export default function UsersPage() {
  return (
    <DashboardShell role="admin">
      <Panel title="Потребители" description="Секция за контрол на акаунти и роли.">
        <StatusBadge variant="neutral">Потребителите ще бъдат управлявани след backend интеграция.</StatusBadge>
      </Panel>
    </DashboardShell>
  );
}
