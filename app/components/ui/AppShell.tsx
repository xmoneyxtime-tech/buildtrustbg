import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { Button } from "./Button";

type AppShellProps = {
  children: ReactNode;
  showCTA?: boolean;
};

export function AppShell({ children, showCTA = true }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)] text-slate-900">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 sm:px-8 lg:px-10">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Image
            src="/logo-main.png"
            alt="BuildTrustBG"
            width={72}
            height={72}
            priority
            className="h-auto w-[56px] shrink-0 sm:w-[72px]"
            style={{ objectFit: "contain" }}
          />
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-[#0F4C81]">BuildTrustBG</p>
            <p className="truncate text-sm font-medium text-slate-700">Платформа за доверени строителни фирми</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          <Link href="/" className="transition hover:text-[#0F4C81]">Начало</Link>
          <Link href="/companies" className="transition hover:text-[#0F4C81]">Компании</Link>
          <Link href="/contact" className="transition hover:text-[#0F4C81]">Контакти</Link>
        </nav>

        {showCTA ? (
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden text-sm font-medium text-[#0F4C81] transition hover:text-[#0B3D67] sm:inline-flex">
              Вход
            </Link>
            <Button href="/register" variant="secondary">
              Регистрация
            </Button>
          </div>
        ) : null}
      </header>

      <main>{children}</main>

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-slate-200/80 px-6 py-8 text-sm text-slate-600 sm:px-8 lg:px-10">
        <p>BuildTrustBG е платформа за доверени строителни фирми в България.</p>
        <p>Всички профили и статуси се управляват с контролирано одобрение.</p>
      </footer>
    </div>
  );
}
