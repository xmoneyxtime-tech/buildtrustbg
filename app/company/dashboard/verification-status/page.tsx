import { DashboardShell, Panel, StatusBadge } from "@/app/components/ui";

export default function VerificationStatusPage() {
  return (
    <DashboardShell
      role="company"
      title="Verification Status"
      subtitle="Следете текущия статус на профила и версификацията."
    >
      <Panel title="Статус" description="Верификацията се управлява от администратор.">
        <div className="flex flex-wrap gap-3">
          <StatusBadge variant="warning">Регистрирана фирма</StatusBadge>
          <StatusBadge variant="info">Pending Approval</StatusBadge>
        </div>
      </Panel>
    </DashboardShell>
  );
}
