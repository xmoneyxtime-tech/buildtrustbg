type ProjectCardProps = {
  title: string;
  description: string;
  category: string;
};

export function ProjectCard({ title, description, category }: ProjectCardProps) {
  return (
    <article className="group overflow-hidden rounded-[20px] border border-slate-200/70 bg-white shadow-[0_22px_60px_-28px_rgba(15,76,129,0.24)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_-28px_rgba(15,76,129,0.3)]">
      <div className="h-44 bg-[linear-gradient(135deg,_rgba(15,76,129,0.12),_rgba(245,130,32,0.16))]" />
      <div className="p-7">
        <div className="inline-flex rounded-full bg-[#F8FAFC] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#F58220]">
          {category}
        </div>
        <h3 className="mt-4 text-xl font-semibold text-slate-900">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
      </div>
    </article>
  );
}
