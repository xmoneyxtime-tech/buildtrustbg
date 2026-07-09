"use client";

import { useTranslation } from "@/app/lib/i18n";
import Link from "next/link";

interface QuickAction {
  icon: string;
  label: string;
  href: string;
  color: "blue" | "orange" | "emerald" | "purple";
}

interface QuickActionsCardProps {
  actions?: QuickAction[];
}

export function QuickActionsCard({ actions }: QuickActionsCardProps) {
  const { t } = useTranslation();

  const defaultActions: QuickAction[] = [
    {
      icon: "✏️",
      label: t("quickActions.editProfile"),
      href: "/company/dashboard/edit-profile",
      color: "blue",
    },
    {
      icon: "📷",
      label: t("quickActions.uploadPhotos"),
      href: "/company/dashboard/gallery",
      color: "orange",
    },
    {
      icon: "🏗️",
      label: t("quickActions.addProject"),
      href: "/company/dashboard/projects",
      color: "emerald",
    },
    {
      icon: "⚙️",
      label: t("quickActions.manageServices"),
      href: "/company/dashboard/services",
      color: "purple",
    },
  ];

  const displayActions = actions || defaultActions;

  const getColorClasses = (color: string) => {
    switch (color) {
      case "orange":
        return "bg-[#FFF7EE] hover:bg-[#FFE8D0] border-[#F58220]/20 hover:border-[#F58220]/40 text-[#F58220]";
      case "emerald":
        return "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 hover:border-emerald-300 text-emerald-700";
      case "purple":
        return "bg-purple-50 hover:bg-purple-100 border-purple-200 hover:border-purple-300 text-purple-700";
      case "blue":
      default:
        return "bg-blue-50 hover:bg-blue-100 border-blue-200 hover:border-blue-300 text-blue-700";
    }
  };

  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white p-8 shadow-[0_18px_50px_-24px_rgba(15,76,129,0.16)]">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">{t("quickActions.title")}</h2>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {displayActions.map((action, idx) => (
          <Link
            key={idx}
            href={action.href}
            className={`flex flex-col items-center justify-center gap-3 rounded-2xl border p-6 transition duration-200 ${getColorClasses(
              action.color
            )}`}
          >
            <span className="text-3xl">{action.icon}</span>
            <span className="text-sm font-semibold text-center">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
