"use client";

import { DashboardShell, Panel } from "@/app/components/ui";
import { useTranslation } from "@/app/lib/i18n";
import { CompanyProfileEditForm } from "@/app/components/forms/CompanyProfileEditForm";
import { useState } from "react";

export default function EditProfilePage() {
  const { t } = useTranslation();
  const [successNotification, setSuccessNotification] = useState(false);

  const handleSuccess = () => {
    setSuccessNotification(true);
    setTimeout(() => setSuccessNotification(false), 5000);
    // Optionally refresh profile data here
  };

  const handleError = (error: string) => {
    // Error is already shown in the form
    console.error("Profile update error:", error);
  };

  return (
    <DashboardShell role="company">
      <Panel
        title={t("dashboardCompany.editProfile")}
        description={t("dashboardCompany.editProfileDescription")}
      >
        <CompanyProfileEditForm
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </Panel>

      {/* Helpful Info Box */}
      <Panel title="💡 Tips for Better Profile" className="mt-8">
        <div className="space-y-4 text-sm text-slate-700">
          <div>
            <h4 className="font-semibold text-slate-900">Complete Your Profile</h4>
            <p className="mt-1">
              A complete profile increases your trust score and helps clients find you.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">Add a Logo & Cover Image</h4>
            <p className="mt-1">
              High-quality images make your profile more professional and trustworthy.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">Detailed Description</h4>
            <p className="mt-1">
              Tell clients about your expertise, experience, and what makes you unique.
            </p>
          </div>
        </div>
      </Panel>
    </DashboardShell>
  );
}
