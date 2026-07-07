import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  href?: string;
};

export function Button({
  children,
  variant = "primary",
  className = "",
  href,
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-[12px] h-12 px-6 text-sm font-medium transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg";

  const variants = {
    primary: "bg-[#0F4C81] text-white hover:bg-[#0B3D67]",
    secondary:
      "border border-[#0F4C81]/20 bg-white text-[#0F4C81] hover:border-[#0F4C81]/40 hover:bg-[#F8FAFC]",
  };

  const content = <span className={`${baseClasses} ${variants[variant]} ${className}`}>{children}</span>;

  if (href) {
    return (
      <a href={href} className="inline-block">
        {content}
      </a>
    );
  }

  return content;
}
