import { DashboardShell, Panel } from "@/app/components/ui";

export default function MessagesPage() {
  return (
    <DashboardShell role="company" title="Messages" subtitle="Получавайте и управлявайте заявки от посетители.">
      <Panel title="Съобщения" description="Тук ще се показват входящи запитвания и контакти.">
        <p className="text-sm leading-7 text-slate-700">Ще бъде добавено в следващ етап.</p>
      </Panel>
    </DashboardShell>
  );
}
