import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
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
    slug: slugify(company.companyName),
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
      companyName: true,
      description: true,
      city: true,
      website: true,
      email: true,
      phone: true,
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

  const companyProfile = toCompanyPublicProfile(company);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="space-y-6">
        <CompanyHeader company={companyProfile} />
        <CompanyHero company={companyProfile} />

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
