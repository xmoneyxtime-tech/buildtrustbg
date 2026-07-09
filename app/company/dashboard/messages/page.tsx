"use client";

import { DashboardShell } from "@/app/components/ui";
import { EmptyState } from "@/app/components/ui/EmptyState";
import { useTranslation } from "@/app/lib/i18n";

export default function MessagesPage() {
  const { t } = useTranslation();

  return (
    <DashboardShell
      role="company"
      title={t("dashboardCompany.messagesTitle")}
      subtitle={t("dashboardCompany.messagesDescription")}
    >
      <EmptyState
        icon="💌"
        title={t("emptyStates.noMessages")}
        description={t("emptyStates.noMessagesAction")}
      />
    </DashboardShell>
  );
}
