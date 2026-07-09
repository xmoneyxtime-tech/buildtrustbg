"use client";

import { useTranslation } from "@/app/lib/i18n";

interface ActivityItem {
  icon: string;
  title: string;
  description?: string;
  time?: string;
}

interface ActivityTimelineProps {
  items?: ActivityItem[];
}

export function ActivityTimeline({ items }: ActivityTimelineProps) {
  const { t } = useTranslation();

  // Demo activities - in a real app, these would come from data
  const activities: ActivityItem[] = items || [
    {
      icon: "✏️",
      title: t("dashboardCompany.activityProfileUpdated"),
      time: t("dashboardCompany.activityHoursAgo"),
    },
    {
      icon: "🖼️",
      title: t("dashboardCompany.activityGalleryUploaded"),
      time: t("dashboardCompany.activityDayAgo"),
    },
  ];

  if (activities.length === 0) {
    return (
      <div className="rounded-[24px] border border-slate-200/80 bg-white p-8 text-center shadow-[0_12px_32px_-16px_rgba(15,76,129,0.12)]">
        <p className="text-2xl">📭</p>
        <p className="mt-2 text-sm font-medium text-slate-600">{t("dashboardCompany.activityNoActivity")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-[0_12px_32px_-16px_rgba(15,76,129,0.12)]">
      <h3 className="mb-6 text-base font-semibold text-slate-900">{t("dashboardCompany.activityTimeline")}</h3>
      <div className="space-y-0">
        {activities.map((activity, idx) => (
          <div key={idx} className="flex gap-4 pb-6 last:pb-0">
            {/* Timeline dot */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#F58220]/20 bg-[#FFF7EE] text-lg">
                {activity.icon}
              </div>
              {idx < activities.length - 1 && (
                <div className="h-8 w-0.5 bg-slate-200" />
              )}
            </div>
            {/* Activity content */}
            <div className="flex-1 pt-1">
              <p className="font-medium text-slate-900">{activity.title}</p>
              {activity.description && (
                <p className="mt-1 text-sm text-slate-600">{activity.description}</p>
              )}
              {activity.time && (
                <p className="mt-2 text-xs text-slate-500">{activity.time}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
