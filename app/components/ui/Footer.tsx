"use client";

import Image from "next/image";
import Link from "next/link";
import { getLocalizedCategories } from "@/app/lib/localized-data";
import { useTranslation } from "@/app/lib/i18n";

export function Footer() {
  const { t, language } = useTranslation();
  
  // Get localized categories
  const categories = getLocalizedCategories(language);

  const footerLinks = [
    { href: "/", label: t("footer.navHome") },
    { href: "/companies", label: t("footer.navCompanies") },
  ];

  const companyLinks = [
    { href: "/register", label: t("footer.registerCompany") },
    { href: "/login", label: t("footer.companyLogin") },
  ];

  const legalLinks = [
    { href: "/terms", label: t("footer.terms") },
    { href: "/privacy", label: t("footer.privacy") },
    { href: "/cookies", label: t("footer.cookies") },
    { href: "/reviews-policy", label: t("footer.reviewsPolicy") },
    { href: "/pricing", label: t("footer.pricing") },
    { href: "/contact", label: t("footer.contact") },
  ];

  const contactInfo = [
    { label: t("footer.email"), value: "buildtrustbg@abv.bg", href: "mailto:buildtrustbg@abv.bg" },
    { label: t("footer.facebook"), value: "BuildTrustBG", href: "https://facebook.com/buildtrustbg" },
  ];

  return (
    <footer className="border-t border-slate-200/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-10 sm:px-8 lg:px-10 lg:py-12">
        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr_0.8fr]">
          {/* Branding + Contact */}
          <div>
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo-main.png"
                alt={t("header.title")}
                width={56}
                height={56}
                priority
                className="h-auto w-[48px] shrink-0 sm:w-[56px]"
                style={{ objectFit: "contain" }}
              />
              <div>
                <p className="text-base font-semibold text-[#0F4C81]">{t("header.title")}</p>
                <p className="text-sm font-medium text-slate-700">{t("header.tagline")}</p>
              </div>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-600">
              {t("footer.tagline")}
            </p>
            <div className="mt-5 space-y-2 text-sm text-slate-600">
              {contactInfo.map((info) => (
                <a
                  key={info.label}
                  href={info.href}
                  className="block transition hover:text-[#0F4C81]"
                >
                  <span className="font-medium">{info.label}:</span> {info.value}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#F58220]">
              {t("footer.navigation")}
            </p>
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

          {/* Company */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#F58220]">
              {t("footer.company")}
            </p>
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

          {/* Categories */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#F58220]">
              {t("footer.categories")}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {categories.map((category) => (
                <li key={category}>{category}</li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#F58220]">
              {t("footer.legal")}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-[#0F4C81]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200/80" />

        {/* Footer Bottom */}
        <div className="flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("footer.copyright")} {t("footer.rightsReserved")}</p>
          <p>{t("footer.tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
