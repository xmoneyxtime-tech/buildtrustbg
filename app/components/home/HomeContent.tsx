"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, FeatureCard, SectionTitle } from "../ui";
import { getLocalizedCities, getLocalizedFeaturedCategories } from "@/app/lib/localized-data";
import { useTranslation } from "@/app/lib/i18n";
import { normalizeLocale } from "@/app/lib/categories/shared";

type HomeCategoryOption = {
  id: string;
  name: string;
  slug: string;
};

type HomeCompany = {
  id: string;
  slug: string;
  companyName: string;
  city: string;
  description: string;
  isVerified: boolean;
};

export function HomeContent({ companies }: { companies: HomeCompany[] }) {
  const { t, language } = useTranslation();
  const [serviceOptions, setServiceOptions] = useState<Array<{ value: string; label: string }>>([]);
  
  const cities = getLocalizedCities(language);
  const featuredCategories = getLocalizedFeaturedCategories(language);

  useEffect(() => {
    async function loadCategoryOptions() {
      const locale = normalizeLocale(language);
      const response = await fetch(`/api/categories?locale=${encodeURIComponent(locale)}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        setServiceOptions([]);
        return;
      }

      const data = (await response.json()) as { categories: HomeCategoryOption[] };
      setServiceOptions(
        data.categories.map((category) => ({
          value: category.slug,
          label: category.name,
        }))
      );
    }

    void loadCategoryOptions();
  }, [language]);

  const trustFeatures = [
    {
      title: t("homeExtended.verifiedCompaniesTitle"),
      description: t("homeExtended.verifiedCompaniesDesc"),
      icon: "✓",
    },
    {
      title: t("homeExtended.realReviewsTitle"),
      description: t("homeExtended.realReviewsDesc"),
      icon: "★",
    },
    {
      title: t("homeExtended.compareCompaniesTitle"),
      description: t("homeExtended.compareCompaniesDesc"),
      icon: "⇄",
    },
    {
      title: t("homeExtended.freeSearchTitle"),
      description: t("homeExtended.freeSearchDesc"),
      icon: "⟲",
    },
  ];

  const steps = [
    {
      title: t("homeExtended.step1"),
      description: t("homeExtended.step1Desc"),
    },
    {
      title: t("homeExtended.step2"),
      description: t("homeExtended.step2Desc"),
    },
    {
      title: t("homeExtended.step3"),
      description: t("homeExtended.step3Desc"),
    },
    {
      title: t("homeExtended.step4"),
      description: t("homeExtended.step4Desc"),
    },
  ];

  return (
    <>
      <section className="mx-auto flex max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10 lg:py-8">
        <section id="home" className="fade-up rounded-[32px] border border-slate-200/80 bg-white/90 px-6 py-12 shadow-[0_30px_90px_-40px_rgba(15,76,129,0.22)] backdrop-blur sm:px-8 lg:px-12 lg:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full border border-[#F58220]/25 bg-[#FFF7EE] px-3 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-[#F58220]">
                {t("homeExtended.badge")}
              </span>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                {t("homeExtended.mainTitle")}
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-700 sm:text-xl">
                {t("homeExtended.mainDescription")}
              </p>

              <div className="mt-8 rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_24px_80px_-30px_rgba(15,76,129,0.24)] sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{t("homeExtended.searchTitle")}</h2>
                    <p className="mt-1 text-sm text-slate-600">{t("homeExtended.searchDescription")}</p>
                  </div>
                  <div className="rounded-full border border-[#0F4C81]/10 bg-[#F8FAFC] px-3 py-2 text-sm font-semibold text-[#0F4C81]">
                    {t("homeExtended.premiumSearch")}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 xl:grid-cols-[1.1fr_1.1fr_auto]">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">{t("homeExtended.serviceLabel")}</span>
                    <select defaultValue="" className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-[#0F4C81] focus:bg-white">
                      <option value="" disabled>
                        {t("homeExtended.serviceSelect")}
                      </option>
                      {serviceOptions.map((service) => (
                        <option key={service.value} value={service.value}>
                          {service.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">{t("homeExtended.cityLabel")}</span>
                    <select defaultValue="" className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-[#0F4C81] focus:bg-white">
                      <option value="" disabled>
                        {t("homeExtended.citySelect")}
                      </option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="flex items-end">
                    <Button className="w-full justify-center bg-[#F58220] hover:bg-[#E36F00] xl:w-[170px]">
                      {t("homeExtended.searchButton")}
                    </Button>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/companies" className="inline-flex h-12 items-center justify-center rounded-[12px] border border-[#0F4C81]/20 bg-white px-6 text-sm font-medium text-[#0F4C81] transition hover:border-[#0F4C81]/40 hover:bg-[#F8FAFC]">
                    {t("homeExtended.browseButton")}
                  </Link>
                </div>
                <div className="mt-6 flex flex-wrap gap-3 text-sm font-medium text-slate-700">
                  <span className="rounded-full border border-slate-200 bg-[#F8FAFC] px-3 py-2">{t("homeExtended.features")}</span>
                  <span className="rounded-full border border-slate-200 bg-[#F8FAFC] px-3 py-2">{t("homeExtended.realReviews")}</span>
                  <span className="rounded-full border border-slate-200 bg-[#F8FAFC] px-3 py-2">{t("homeExtended.wholeBulgaria")}</span>
                </div>
              </div>
            </div>

            <div className="relative min-h-[360px] overflow-hidden rounded-[28px] border border-slate-200/80 bg-[linear-gradient(135deg,_#F8FBFD_0%,_#EEF4FA_100%)] p-6 shadow-[0_20px_70px_-30px_rgba(15,76,129,0.24)] sm:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(245,130,32,0.16),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(15,76,129,0.14),_transparent_50%)]" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="rounded-2xl border border-[#0F4C81]/10 bg-white/80 p-3 shadow-sm">
                    <svg viewBox="0 0 64 64" className="h-10 w-10 text-[#0F4C81]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="12" y="16" width="40" height="32" rx="4" />
                      <path d="M20 28h24" />
                      <path d="M20 36h16" />
                      <path d="M36 36h8" />
                      <path d="M22 16v-4" />
                      <path d="M42 16v-4" />
                    </svg>
                  </div>
                  <div className="rounded-full border border-[#F58220]/20 bg-[#FFF7EE] px-3 py-1 text-sm font-semibold text-[#F58220]">
                    BuildTrustBG
                  </div>
                </div>

                <div className="mt-8 rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-[0_16px_50px_-24px_rgba(15,76,129,0.2)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0F4C81] text-lg font-semibold text-white">
                      BT
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{t("header.tagline")}</p>
                      <p className="text-sm text-slate-600">{t("homeExtended.platformTagline")}</p>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#F58220]">{t("homeExtended.comparisonLabel")}</p>
                      <p className="mt-1 text-sm font-medium text-slate-800">{t("homeExtended.comparisonValue")}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#F58220]">{t("homeExtended.verificationLabel")}</p>
                      <p className="mt-1 text-sm font-medium text-slate-800">{t("homeExtended.verificationValue")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      <section id="services" className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
        <SectionTitle
          eyebrow={t("homeExtended.whyBuildTrust")}
          title={t("homeExtended.whyTitle")}
          description={t("homeExtended.whyDescription")}
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {trustFeatures.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={<span className="text-2xl">{feature.icon}</span>}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>

      <section id="services-categories" className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
        <SectionTitle
          eyebrow={t("homeExtended.popularCategories")}
          title={t("homeExtended.categoriesTitle")}
          description={t("homeExtended.categoriesDescription")}
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featuredCategories.map((category) => (
            <div
              key={category.title}
              className="group rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_60px_-32px_rgba(15,76,129,0.2)] transition duration-300 hover:-translate-y-1 hover:border-[#0F4C81]/20 hover:shadow-[0_24px_80px_-30px_rgba(15,76,129,0.28)]"
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${category.accent}`}>
                <span className="text-2xl">{category.icon}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{category.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{category.description}</p>
              <Link href="/companies" className="mt-4 inline-flex text-sm font-medium text-[#0F4C81] transition hover:text-[#0B3D67]">
                {t("buttons.viewMore")} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
        <SectionTitle
          eyebrow={t("homeExtended.howItWorks")}
          title={t("homeExtended.howTitle")}
          description={t("homeExtended.howDescription")}
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_60px_-32px_rgba(15,76,129,0.2)]">
              <div className="absolute -left-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#F58220] text-center font-semibold text-white shadow-lg">
                {index + 1}
              </div>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="companies" className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="rounded-[32px] border border-slate-200/80 bg-[linear-gradient(135deg,_#ffffff_0%,_#f8fbff_100%)] px-8 py-14 shadow-[0_24px_80px_-32px_rgba(15,76,129,0.24)] sm:px-10 lg:px-14">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex rounded-full border border-[#F58220]/25 bg-[#FFF7EE] px-3 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-[#F58220]">
              {t("homeExtended.companiesSection")}
            </span>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              {t("homeExtended.companiesSectionTitle")}
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-700 sm:text-lg">
              {t("homeExtended.companiesSectionDescription")}
            </p>
          </div>

          {companies.length > 0 ? (
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {companies.map((company) => (
                <article
                  key={company.id}
                  className="rounded-[24px] border border-slate-200/80 bg-white p-6 text-left shadow-[0_18px_60px_-32px_rgba(15,76,129,0.2)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-slate-900">{company.companyName}</h3>
                    {company.isVerified ? (
                      <span className="rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                        Verified
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm font-medium text-[#0F4C81]">{company.city}</p>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{company.description}</p>
                  <Link
                    href={`/companies/${company.slug}`}
                    className="mt-5 inline-flex text-sm font-semibold text-[#0F4C81] transition hover:text-[#0B3D67]"
                  >
                    {t("buttons.viewMore")} →
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="mx-auto mt-8 max-w-3xl rounded-[28px] border border-[#F58220]/20 bg-white p-8 text-center shadow-[0_24px_80px_-36px_rgba(15,76,129,0.24)] sm:p-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF7EE] text-3xl shadow-sm">
                🛡️
              </div>
              <p className="mt-6 text-xl font-semibold text-slate-900">{t("homeExtended.comingSoon")}</p>
              <Link href="/register" className="mt-8 inline-flex h-12 items-center justify-center rounded-[12px] bg-[#F58220] px-6 text-sm font-semibold text-white transition hover:bg-[#E36F00]">
                {t("homeExtended.registerCompanyButton")}
              </Link>
            </div>
          )}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-6 pb-20 pt-16 sm:px-8 lg:px-10">
        <div className="rounded-[32px] border border-slate-200/80 bg-[linear-gradient(135deg,_#0A3E6D_0%,_#0E4F81_45%,_#135C93_100%)] px-8 py-16 text-white shadow-[0_30px_90px_-32px_rgba(15,76,129,0.45)] sm:px-12 lg:px-16">
          <SectionTitle
            align="center"
            eyebrow={t("homeExtended.whyBuildTrust")}
            title={t("homeExtended.ctaTitle")}
            description={t("homeExtended.ctaDescription")}
          />
          <div className="mt-8 flex justify-center gap-3">
            <Button className="bg-white text-[#0B3D67] hover:bg-[#F8FAFC] shadow-[0_10px_30px_-12px_rgba(255,255,255,0.45)]">
              {t("homeExtended.startSearch")}
            </Button>
            <Link href="/register" className="inline-flex h-12 items-center justify-center rounded-[12px] border border-white/30 bg-white/10 px-6 text-sm font-medium text-white transition hover:bg-white/20">
              {t("homeExtended.registerCompanyButton")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
