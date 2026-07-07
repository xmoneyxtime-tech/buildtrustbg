import { DashboardShell, Panel, StatusBadge } from "@/app/components/ui";

export default function CategoriesPage() {
  return (
    <DashboardShell role="admin" title="Categories" subtitle="Управлявайте категории услуги и специализации.">
      <Panel title="Категории" description="Списък с основни категории за търсене и филтриране.">
        <StatusBadge variant="neutral">Категориите ще бъдат управлявани след backend интеграция.</StatusBadge>
      </Panel>
    </DashboardShell>
  );
}
