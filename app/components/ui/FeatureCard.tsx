import { ReactNode } from "react";

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <article className="group rounded-[20px] border border-slate-200/70 bg-white p-8 shadow-[0_20px_60px_-28px_rgba(15,76,129,0.22)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_80px_-30px_rgba(15,76,129,0.28)]">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8FAFC] text-[#0F4C81]">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-700">{description}</p>
    </article>
  );
}
