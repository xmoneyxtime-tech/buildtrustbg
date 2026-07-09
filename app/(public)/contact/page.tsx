import { AppShell, Panel } from "@/app/components/ui";

export default function ContactPage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Panel title="Контакти" description="Връзка с BuildTrustBG за партньорства, регистрации и заявки за одобрение.">
            <div className="space-y-4 text-sm leading-7 text-slate-700">
              <p><span className="font-semibold text-slate-900">Имейл:</span> buildtrustbg@abv.bg</p>
              {/* TODO: Re-enable Facebook link when social media presence is ready */}
              {/* <p><span className="font-semibold text-slate-900">Facebook:</span> <span className="text-[#0F4C81]">https://facebook.com/buildtrustbg</span></p> */}
              {/* <p>Фейсбук секцията е подготвена като placeholder за бъдещо актуализиране.</p> */}
            </div>
          </Panel>
          <Panel title="Как да започнете" description="Поддържаме чист и прозрачен процес за фирми и администратори.">
            <div className="space-y-3 text-sm leading-7 text-slate-700">
              <p>• Регистрирайте компанията си.</p>
              <p>• Попълнете профил и документи.</p>
              <p>• Изчаквайте одобрение от администратор.</p>
            </div>
          </Panel>
        </div>
      </section>
    </AppShell>
  );
}
