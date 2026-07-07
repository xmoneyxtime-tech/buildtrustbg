import Link from "next/link";
import { AppShell, Panel } from "@/app/components/ui";

export default function LoginPage() {
  return (
    <AppShell showCTA={false}>
      <section className="mx-auto flex max-w-5xl items-center justify-center px-6 py-10 sm:px-8 lg:px-10 lg:py-16">
        <Panel title="Вход" description="Подготвена страница за бъдеща автентикация и роли." className="w-full max-w-xl">
          <div className="space-y-4">
            <div className="rounded-[20px] border border-slate-200 bg-[#F8FAFC] p-4 text-sm text-slate-700">
              Влизането ще бъде добавено в следващ етап. В момента страницата служи като маршрут за бъдещо внедряване.
            </div>
            <Link href="/register" className="inline-flex rounded-full bg-[#0F4C81] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0B3D67]">
              Към регистрация
            </Link>
          </div>
        </Panel>
      </section>
    </AppShell>
  );
}
