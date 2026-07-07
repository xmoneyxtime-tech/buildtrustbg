import { DashboardShell, Panel } from "@/app/components/ui";

export default function SubscriptionPage() {
  return (
    <DashboardShell role="company" title="Subscription" subtitle="Планирано място за абонамент и премиум функции.">
      <Panel title="Абонамент" description="Планирана секция за бъдещи пакети и разширения.">
        <p className="text-sm leading-7 text-slate-700">В момента е placeholder.</p>
      </Panel>
    </DashboardShell>
  );
}
