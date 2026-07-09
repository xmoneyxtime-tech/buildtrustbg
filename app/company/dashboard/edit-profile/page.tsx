"use client";

import { useState } from "react";
import { DashboardShell, Panel } from "@/app/components/ui";
import { useTranslation } from "@/app/lib/i18n";
import { CompanyRegistrationForm } from "@/app/lib/marketplace/types";

const initialProfile: CompanyRegistrationForm = {
  companyName: "Светлина Строй",
  email: "contact@svetlinastroy.bg",
  phone: "+359 888 123 456",
  city: "София",
  service: "Строителство на къщи",
  description: "Професионална компания за строителство и ремонтни дейности.",
  website: "https://svetlinastroy.bg",
};

export default function EditProfilePage() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState(initialProfile);

  return (
    <DashboardShell role="company">
      <Panel title={t("dashboardCompany.basicInfo")} description={t("dashboardCompany.basicInfoDescription")}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm text-slate-700">
            <span className="mb-2 block font-medium">{t("formLabels.companyName")}</span>
            <input
              value={profile.companyName}
              onChange={(event) => setProfile({ ...profile, companyName: event.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 outline-none transition focus:border-[#0F4C81]"
            />
          </label>
          <label className="block text-sm text-slate-700">
            <span className="mb-2 block font-medium">{t("formLabels.email")}</span>
            <input
              type="email"
              value={profile.email}
              onChange={(event) => setProfile({ ...profile, email: event.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 outline-none transition focus:border-[#0F4C81]"
            />
          </label>
          <label className="block text-sm text-slate-700">
            <span className="mb-2 block font-medium">{t("formLabels.phone")}</span>
            <input
              value={profile.phone}
              onChange={(event) => setProfile({ ...profile, phone: event.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 outline-none transition focus:border-[#0F4C81]"
            />
          </label>
          <label className="block text-sm text-slate-700">
            <span className="mb-2 block font-medium">{t("formLabels.city")}</span>
            <input
              value={profile.city}
              onChange={(event) => setProfile({ ...profile, city: event.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 outline-none transition focus:border-[#0F4C81]"
            />
          </label>
          <label className="block text-sm text-slate-700">
            <span className="mb-2 block font-medium">{t("formLabels.service")}</span>
            <input
              value={profile.service}
              onChange={(event) => setProfile({ ...profile, service: event.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 outline-none transition focus:border-[#0F4C81]"
            />
          </label>
          <label className="block text-sm text-slate-700">
            <span className="mb-2 block font-medium">{t("formLabels.website")}</span>
            <input
              value={profile.website}
              onChange={(event) => setProfile({ ...profile, website: event.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 outline-none transition focus:border-[#0F4C81]"
            />
          </label>
        </div>
        <label className="mt-4 block text-sm text-slate-700">
          <span className="mb-2 block font-medium">{t("formLabels.description")}</span>
          <textarea
            rows={4}
            value={profile.description}
            onChange={(event) => setProfile({ ...profile, description: event.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 outline-none transition focus:border-[#0F4C81]"
          />
        </label>
        <button type="button" className="mt-6 inline-flex h-12 items-center justify-center rounded-[12px] bg-[#0F4C81] px-6 text-sm font-semibold text-white transition hover:bg-[#0B3D67]">
          {t("buttons.save")}
        </button>
      </Panel>
    </DashboardShell>
  );
}
