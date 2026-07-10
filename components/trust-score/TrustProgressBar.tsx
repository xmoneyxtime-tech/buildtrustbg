type TrustProgressBarProps = {
  score: number;
};

export function TrustProgressBar({ score }: TrustProgressBarProps) {
  const clamped = Math.max(0, Math.min(score, 100));

  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#0F4C81] to-[#F58220] transition-all"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
