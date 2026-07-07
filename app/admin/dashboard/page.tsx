import { DashboardShell, Panel, StatusBadge } from "@/app/components/ui";

export default function AdminDashboardPage() {
  return (
    <DashboardShell
      role="admin"
      title="Dashboard"
      subtitle="Управлявайте регистрации, одобрения, потребители, ревюта и съдържание на платформата."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Чакащи компании" description="Компании с подадени профили и готовност за преглед.">
          <StatusBadge variant="warning">0 чакащи одобрение</StatusBadge>
        </Panel>
        <Panel title="Одобрени компании" description="Компании, които вече са публични и видими в каталога.">
          <StatusBadge variant="info">0 одобрени профила</StatusBadge>
        </Panel>
      </div>
    </DashboardShell>
  );
}
