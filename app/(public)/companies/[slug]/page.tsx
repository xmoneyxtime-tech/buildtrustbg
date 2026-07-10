import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { calculateTrustScore } from "@/app/lib/trust-score";
import {
  CompanyAbout,
  CompanyGallery,
  CompanyHeader,
  CompanyHero,
  CompanyProjects,
  CompanyReviews,
  CompanyServices,
  CompanySidebar,
  type CompanyPublicProfile,
} from "@/components/company";
import { TrustProgressBar, TrustScoreBadge } from "@/components/trust-score";

type CompanyProfilePageProps = {
  params: Promise<{ slug: string }>;
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toCompanyPublicProfile(company: {
  id: string;
  slug: string | null;
  companyName: string;
  description: string;
  city: string;
  website: string | null;
  email: string;
  phone: string;
  service: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
  updatedAt: Date;
}): CompanyPublicProfile {
  const services = company.service
    .split(",")
    .map((service) => service.trim())
    .filter(Boolean);

  return {
    id: company.id,
    slug: company.slug ?? slugify(company.companyName),
    name: company.companyName,
    description: company.description,
    city: company.city,
    website: company.website,
    email: company.email,
    phone: company.phone,
    status: company.status,
    services,
    createdAt: company.createdAt,
    updatedAt: company.updatedAt,
    galleryItems: [],
    projects: [],
    reviews: [],
  };
}

export default async function CompanyProfilePage({ params }: CompanyProfilePageProps) {
  const { slug } = await params;

  const companies = await prisma.companyApplication.findMany({
    where: {
      status: "APPROVED",
    },
    select: {
      id: true,
      slug: true,
      companyName: true,
      description: true,
      industry: true,
      city: true,
      country: true,
      address: true,
      website: true,
      email: true,
      phone: true,
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
      service: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const company = companies.find((item) => slugify(item.companyName) === slug);

  if (!company) {
    notFound();
  }

  const trust = calculateTrustScore({
    id: company.id,
    companyName: company.companyName,
    email: company.email,
    phone: company.phone,
    description: company.description,
    industry: company.industry,
    website: company.website,
    country: company.country,
    city: company.city,
    address: company.address,
    logoUrl: company.logoUrl,
    coverUrl: company.coverUrl,
    isVerified: company.isVerified,
    identityVerified: company.identityVerified,
    phoneVerified: company.phoneVerified,
    portfolioCount: company.portfolioCount,
    projectsCount: company.projectsCount,
    reviewsCount: company.reviewsCount,
    averageRating: company.averageRating,
    yearsInBusiness: company.yearsInBusiness,
    certificatesCount: company.certificatesCount,
    galleryCount: company.galleryCount,
    responseTimeHours: company.responseTimeHours,
    activeSubscription: company.activeSubscription,
  });

  const companyProfile = toCompanyPublicProfile(company);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="space-y-6">
        <CompanyHeader company={companyProfile} />
        <CompanyHero company={companyProfile} />

        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">BuildTrust Score</h2>
            <TrustScoreBadge level={trust.level} />
          </div>

          <div className="mt-4 flex items-end gap-3">
            <span className="text-4xl font-bold tracking-tight text-slate-900">{trust.score}</span>
            <span className="pb-1 text-sm text-slate-500">/ 100</span>
          </div>

          <div className="mt-4">
            <TrustProgressBar score={trust.score} />
          </div>

          {trust.verifiedBadges.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {trust.verifiedBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <CompanyAbout company={companyProfile} />
            <CompanyServices company={companyProfile} />
            <CompanyGallery company={companyProfile} />
            <CompanyProjects company={companyProfile} />
            <CompanyReviews company={companyProfile} />
          </div>
          <div className="lg:sticky lg:top-6 lg:h-fit">
            <CompanySidebar company={companyProfile} />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/companies"
            className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Обратно към компаниите
          </Link>
        </div>
      </div>
    </section>
  );
}
