import { DashboardShell, Panel, StatusBadge } from "@/app/components/ui";

export default function RejectedCompaniesPage() {
  return (
    <DashboardShell role="admin" title="Rejected Companies" subtitle="Преглеждайте отхвърлени регистрации и причини за отказ.">
      <Panel title="Отхвърлени профили" description="Профили, които не са одобрени и изискват действие.">
        <StatusBadge variant="neutral">Няма отхвърлени компании в момента.</StatusBadge>
      </Panel>
    </DashboardShell>
  );
}
