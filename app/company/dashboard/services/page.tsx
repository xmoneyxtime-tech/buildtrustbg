"use client";

import { DashboardShell } from "@/app/components/ui";
import { EmptyState } from "@/app/components/ui/EmptyState";
import { useTranslation } from "@/app/lib/i18n";

export default function ServicesPage() {
  const { t } = useTranslation();

  return (
    <DashboardShell
      role="company"
      title={t("dashboardCompany.servicesTitle")}
      subtitle={t("dashboardCompany.servicesDescription")}
    >
      <EmptyState
        icon="⚙️"
        title={t("emptyStates.noServices")}
        description={t("emptyStates.noServicesAction")}
        action={{ label: t("buttons.add"), href: "#" }}
      />
    </DashboardShell>
  );
}
