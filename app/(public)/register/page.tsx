import Link from "next/link";
import { AppShell, Panel } from "@/app/components/ui";

export default function RegisterPage() {
  return (
    <AppShell showCTA={false}>
      <section className="mx-auto flex max-w-5xl items-center justify-center px-6 py-10 sm:px-8 lg:px-10 lg:py-16">
        <Panel title="Регистрация" description="Подготвена страница за регистрация на компания и избор на роля." className="w-full max-w-xl">
          <div className="space-y-4">
            <div className="rounded-[20px] border border-slate-200 bg-[#F8FAFC] p-4 text-sm text-slate-700">
              Регистрацията ще бъде внедрена по-късно. Сега страницата осигурява маршрута и структурата за компания и администратор.
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/company/dashboard" className="rounded-full bg-[#0F4C81] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0B3D67]">
                Компания Dashboard
              </Link>
              <Link href="/admin/dashboard" className="rounded-full border border-[#0F4C81]/20 bg-white px-5 py-3 text-sm font-semibold text-[#0F4C81] transition hover:bg-[#F8FAFC]">
                Admin Dashboard
              </Link>
            </div>
          </div>
        </Panel>
      </section>
    </AppShell>
  );
}
