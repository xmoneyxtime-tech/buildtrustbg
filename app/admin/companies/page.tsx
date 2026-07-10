import { DashboardShell } from "@/app/components/ui";
import { AdminNotice } from "@/app/components/ui/AdminNotice";
import { calculateTrustScore } from "@/app/lib/trust-score";
import { prisma } from "@/lib/prisma";
import { TrustBreakdown, TrustScoreBadge } from "@/components/trust-score";

export default async function AdminCompaniesPage() {
  const companies = await prisma.companyApplication.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      companyName: true,
      email: true,
      city: true,
      status: true,
      phone: true,
      description: true,
      industry: true,
      website: true,
      country: true,
      address: true,
      logoUrl: true,
      coverUrl: true,
      isVerified: true,
      identityVerified: true,
      phoneVerified: true,
      portfolioCount: true,
      projectsCount: true,
      reviewsCount: true,
      averageRating: true,
      yearsInBusiness: true,
      certificatesCount: true,
      galleryCount: true,
      responseTimeHours: true,
      activeSubscription: true,
    },
  });

  return (
    <DashboardShell role="admin">
      <div className="space-y-6">
        <AdminNotice />

        {companies.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            Няма фирми за анализ.
          </div>
        )}

        {companies.map((company) => {
          const trust = calculateTrustScore(company);

          return (
            <section key={company.id} className="rounded-3xl border border-slate-200 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{company.companyName}</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {company.email} • {company.city} • {company.status}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-bold text-slate-900">{trust.score}</p>
                  <div className="mt-1">
                    <TrustScoreBadge level={trust.level} />
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <TrustBreakdown breakdown={trust.breakdown} suggestions={trust.suggestions} />
              </div>
            </section>
          );
        })}
      </div>
    </DashboardShell>
  );
}
