import { DashboardShell, Panel } from "@/app/components/ui";

export default function GalleryPage() {
  return (
    <DashboardShell role="company" title="Gallery" subtitle="Качете снимки и визуално представяне на компанията си.">
      <Panel title="Галерия" description="Планирано място за снимки от обекти, екип и процеси.">
        <p className="text-sm leading-7 text-slate-700">Ще бъде добавено в следващ етап.</p>
      </Panel>
    </DashboardShell>
  );
}
