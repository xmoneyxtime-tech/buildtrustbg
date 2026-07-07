import { DashboardShell, Panel, StatusBadge } from "@/app/components/ui";

export default function PendingCompaniesPage() {
  return (
    <DashboardShell
      role="admin"
      title="Pending Companies"
      subtitle="Преглеждайте профили, които чакат одобрение." 
    >
      <Panel title="Чакащи регистрации" description="Профили, които ще бъдат одобрени или отхвърлени след преглед.">
        <StatusBadge variant="warning">Няма чакащи компании в момента.</StatusBadge>
      </Panel>
    </DashboardShell>
  );
}
