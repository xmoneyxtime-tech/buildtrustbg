import { DashboardShell, Panel, StatusBadge } from "@/app/components/ui";

export default function HomepagePage() {
  return (
    <DashboardShell role="admin" title="Homepage" subtitle="Управлявайте главната страница и ключови секции.">
      <Panel title="Начална страница" description="Подготвено място за редакция на hero, категории и CTA секции.">
        <StatusBadge variant="neutral">Началната страница ще бъде управлявана след добавяне на CMS.</StatusBadge>
      </Panel>
    </DashboardShell>
  );
}
