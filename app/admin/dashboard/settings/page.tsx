"use client";

import { useState } from "react";
import { DashboardShell } from "@/app/components/ui";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    platformName: "BuildTrustBG",
    platformEmail: "admin@buildtrustbg.bg",
    supportPhone: "+359 2 123 4567",
    maxGalleryImages: 50,
    premiumPrice: 49.99,
    goldVerificationFee: 29.99,
    maintenanceMode: false,
    allowNewRegistrations: true,
    emailNotifications: true,
  });

  const handleChange = (field: string, value: unknown) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log("Settings saved:", settings);
  };

  return (
    <DashboardShell role="admin">
      <div className="space-y-6">
        {/* General Settings */}
        <div className="rounded-[20px] border border-slate-200/80 bg-white p-8 shadow-[0_12px_32px_-16px_rgba(15,76,129,0.12)]">
          <h2 className="text-xl font-semibold text-slate-900">Общи настройки</h2>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900">Название на платформата</label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => handleChange("platformName", e.target.value)}
                className="mt-2 w-full rounded-[12px] border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-900 focus:border-[#0F4C81]/50 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/10"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900">Admin Email</label>
              <input
                type="email"
                value={settings.platformEmail}
                onChange={(e) => handleChange("platformEmail", e.target.value)}
                className="mt-2 w-full rounded-[12px] border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-900 focus:border-[#0F4C81]/50 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/10"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900">Support телефон</label>
              <input
                type="tel"
                value={settings.supportPhone}
                onChange={(e) => handleChange("supportPhone", e.target.value)}
                className="mt-2 w-full rounded-[12px] border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-900 focus:border-[#0F4C81]/50 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/10"
              />
            </div>
          </div>
        </div>

        {/* Pricing Settings */}
        <div className="rounded-[20px] border border-slate-200/80 bg-white p-8 shadow-[0_12px_32px_-16px_rgba(15,76,129,0.12)]">
          <h2 className="text-xl font-semibold text-slate-900">Ценообразуване</h2>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900">Max снимки в галерия</label>
              <input
                type="number"
                value={settings.maxGalleryImages}
                onChange={(e) => handleChange("maxGalleryImages", parseInt(e.target.value))}
                className="mt-2 w-full rounded-[12px] border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-900 focus:border-[#0F4C81]/50 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/10"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900">Premium абонамент цена (BGN)</label>
              <input
                type="number"
                step="0.01"
                value={settings.premiumPrice}
                onChange={(e) => handleChange("premiumPrice", parseFloat(e.target.value))}
                className="mt-2 w-full rounded-[12px] border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-900 focus:border-[#0F4C81]/50 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/10"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900">Gold верификация цена (BGN)</label>
              <input
                type="number"
                step="0.01"
                value={settings.goldVerificationFee}
                onChange={(e) => handleChange("goldVerificationFee", parseFloat(e.target.value))}
                className="mt-2 w-full rounded-[12px] border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-900 focus:border-[#0F4C81]/50 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/10"
              />
            </div>
          </div>
        </div>

        {/* Platform Settings */}
        <div className="rounded-[20px] border border-slate-200/80 bg-white p-8 shadow-[0_12px_32px_-16px_rgba(15,76,129,0.12)]">
          <h2 className="text-xl font-semibold text-slate-900">Режим на платформата</h2>

          <div className="mt-6 space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => handleChange("maintenanceMode", e.target.checked)}
                className="h-4 w-4 rounded border-slate-200"
              />
              <span className="text-sm font-medium text-slate-700">Режим на поддръжка</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.allowNewRegistrations}
                onChange={(e) => handleChange("allowNewRegistrations", e.target.checked)}
                className="h-4 w-4 rounded border-slate-200"
              />
              <span className="text-sm font-medium text-slate-700">Позволи нови регистрации</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleChange("emailNotifications", e.target.checked)}
                className="h-4 w-4 rounded border-slate-200"
              />
              <span className="text-sm font-medium text-slate-700">Email известяния</span>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="rounded-[12px] bg-[#0F4C81] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0B3D67]"
        >
          Запази настройки
        </button>
      </div>
    </DashboardShell>
  );
}
