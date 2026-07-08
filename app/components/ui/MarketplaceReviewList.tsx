import { CompanyProfile } from "@/app/lib/marketplace/types";

type MarketplaceReviewListProps = {
  companies: CompanyProfile[];
  onReview?: (id: string, action: "approve" | "reject") => void;
};

export function MarketplaceReviewList({ companies, onReview }: MarketplaceReviewListProps) {
  return (
    <div className="space-y-4">
      {companies.map((company) => (
        <div key={company.id} className="rounded-[24px] border border-slate-200 bg-[#F8FAFC] p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-lg font-semibold text-slate-900">{company.companyName}</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{company.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1">{company.city}</span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1">{company.service}</span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1">{company.email}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onReview?.(company.id, "approve")}
                className="rounded-full bg-[#0F4C81] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B3D67]"
              >
                Одобри
              </button>
              <button
                type="button"
                onClick={() => onReview?.(company.id, "reject")}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Отхвърли
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
