import { DashboardShell, Panel, StatusBadge } from "@/app/components/ui";

export default function SettingsPage() {
  return (
    <DashboardShell role="admin" title="Settings" subtitle="Настройки за платформата и бъдещи интеграции.">
      <Panel title="Настройки" description="Секция за глобални параметри и конфигурации.">
        <StatusBadge variant="neutral">Настройките ще бъдат добавени в следващ етап.</StatusBadge>
      </Panel>
    </DashboardShell>
  );
}
