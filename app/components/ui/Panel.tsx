import { ReactNode } from "react";

type PanelProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function Panel({ title, description, children, className = "" }: PanelProps) {
  return (
    <section className={`rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_50px_-24px_rgba(15,76,129,0.16)] ${className}`}>
      {title ? <h3 className="text-xl font-semibold text-slate-900">{title}</h3> : null}
      {description ? <p className="mt-2 text-sm leading-7 text-slate-700">{description}</p> : null}
      {title || description ? <div className="mt-5">{children}</div> : children}
    </section>
  );
}
