type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionTitleProps) {
  const alignment = align === "center" ? "text-center items-center" : "text-left items-start";
  const isDarkVariant = align === "center";

  return (
    <div className={`flex flex-col gap-3 ${alignment}`}>
      {eyebrow ? (
        <span className="text-sm font-semibold uppercase tracking-[0.24em] text-[#F58220]">
          {eyebrow}
        </span>
      ) : null}
      <h2
        className={`text-3xl font-semibold tracking-tight sm:text-4xl ${
          isDarkVariant ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`max-w-2xl text-base leading-8 sm:text-lg ${
            isDarkVariant ? "text-white/95" : "text-slate-700"
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
