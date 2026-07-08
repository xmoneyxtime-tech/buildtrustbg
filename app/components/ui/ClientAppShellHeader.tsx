"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./Button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "@/app/lib/i18n";

interface ClientAppShellHeaderProps {
  showCTA?: boolean;
}

export function ClientAppShellHeader({ showCTA = true }: ClientAppShellHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 sm:px-8 lg:px-10">
      <Link href="/" className="flex min-w-0 items-center gap-3">
        <Image
          src="/logo-main.png"
          alt={t("header.title")}
          width={72}
          height={72}
          priority
          className="h-auto w-[56px] shrink-0 sm:w-[72px]"
          style={{ objectFit: "contain" }}
        />
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-[#0F4C81]">{t("header.title")}</p>
          <p className="truncate text-sm font-medium text-slate-700">{t("header.tagline")}</p>
        </div>
      </Link>

      <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
        <Link href="/" className="transition hover:text-[#0F4C81]">
          {t("navigation.home")}
        </Link>
        <Link href="/companies" className="transition hover:text-[#0F4C81]">
          {t("navigation.companies")}
        </Link>
        <Link href="/contact" className="transition hover:text-[#0F4C81]">
          {t("navigation.contact")}
        </Link>
      </nav>

      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        {showCTA ? (
          <>
            <Link
              href="/login"
              className="hidden text-sm font-medium text-[#0F4C81] transition hover:text-[#0B3D67] sm:inline-flex"
            >
              {t("navigation.login")}
            </Link>
            <Button href="/register" variant="secondary">
              {t("navigation.register")}
            </Button>
          </>
        ) : null}
      </div>
    </header>
  );
}
