import { DashboardShell, Panel, StatusBadge } from "@/app/components/ui";

export default function AdminReviewsPage() {
  return (
    <DashboardShell role="admin">
      <Panel title="Отзиви" description="Планирана секция за справка и модерация.">
        <StatusBadge variant="neutral">Отзивите ще бъдат управлявани след добавяне на данни.</StatusBadge>
      </Panel>
    </DashboardShell>
  );
}
