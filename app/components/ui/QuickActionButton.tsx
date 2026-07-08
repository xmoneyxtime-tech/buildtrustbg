import Link from "next/link";

type QuickActionButtonProps = {
  href: string;
  icon: string;
  label: string;
  description: string;
};

export function QuickActionButton({ href, icon, label, description }: QuickActionButtonProps) {
  return (
    <Link
      href={href}
      className="group rounded-[20px] border border-slate-200/80 bg-white p-6 transition hover:border-[#F58220]/30 hover:bg-[#FFF7EE]/50 hover:shadow-[0_12px_32px_-16px_rgba(245,130,32,0.16)]"
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl">{icon}</div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-slate-900 group-hover:text-[#F58220]">{label}</h4>
          <p className="mt-1 text-xs text-slate-600">{description}</p>
        </div>
      </div>
    </Link>
  );
}
