"use client";

import { DashboardShell } from "@/app/components/ui";
import { EmptyState } from "@/app/components/ui/EmptyState";
import { useTranslation } from "@/app/lib/i18n";

export default function ProjectsPage() {
  const { t } = useTranslation();

  return (
    <DashboardShell role="company">
      <EmptyState
        icon="🏗️"
        title={t("emptyStates.noProjects")}
        description={t("emptyStates.noProjectsAction")}
        action={{ label: t("buttons.add"), href: "#" }}
      />
    </DashboardShell>
  );
}
