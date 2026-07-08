import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Начало" },
  { href: "/companies", label: "Компании" },
  { href: "/contact", label: "Контакти" },
];

const companyLinks = [
  { href: "/register", label: "Регистрирай компания" },
  { href: "/login", label: "Вход за фирми" },
];

const categories = [
  "Строителство на къщи",
  "Основни ремонти",
  "Покриви",
  "Интериорен дизайн",
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-10 sm:px-8 lg:px-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo-main.png"
                alt="BuildTrustBG"
                width={56}
                height={56}
                priority
                className="h-auto w-[48px] shrink-0 sm:w-[56px]"
                style={{ objectFit: "contain" }}
              />
              <div>
                <p className="text-base font-semibold text-[#0F4C81]">BuildTrustBG</p>
                <p className="text-sm font-medium text-slate-700">Платформа за доверени строителни фирми</p>
              </div>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-600">
              BuildTrustBG помага на клиенти да откриват, сравняват и свързват с проверени строителни фирми в България.
            </p>
            <div className="mt-5 space-y-2 text-sm text-slate-600">
              <a href="mailto:buildtrustbg@abv.bg" className="block transition hover:text-[#0F4C81]">
                buildtrustbg@abv.bg
              </a>
              <a href="https://facebook.com" className="block transition hover:text-[#0F4C81]">
                Facebook: BuildTrustBG
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#F58220]">Навигация</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-[#0F4C81]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#F58220]">Компания</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-[#0F4C81]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#F58220]">Категории</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {categories.map((category) => (
                <li key={category}>{category}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200/80 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© BuildTrustBG. Всички права запазени.</p>
          <p>Платформа за доверени строителни фирми в България.</p>
        </div>
      </div>
    </footer>
  );
}
