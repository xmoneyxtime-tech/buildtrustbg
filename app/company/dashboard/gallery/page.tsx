"use client";

import { DashboardShell } from "@/app/components/ui";
import { EmptyState } from "@/app/components/ui/EmptyState";
import { useTranslation } from "@/app/lib/i18n";

export default function GalleryPage() {
  const { t } = useTranslation();

  return (
    <DashboardShell
      role="company"
      title={t("dashboardCompany.galleryTitle")}
      subtitle={t("dashboardCompany.galleryDescription")}
    >
      <EmptyState
        icon="🖼️"
        title={t("emptyStates.noGallery")}
        description={t("emptyStates.noGalleryAction")}
        action={{ label: t("buttons.add"), href: "#" }}
      />
    </DashboardShell>
  );
}
