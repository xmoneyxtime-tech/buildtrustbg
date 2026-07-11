import { AppShell } from "./components/ui";
import { HomeContent } from "./components/home/HomeContent";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "BuildTrustBG | Платформа за строителни компании",
  description: "Намерете, сравнете и изберете проверени строителни фирми в България",
};

export default function Home() {
  return <HomePage />;
}

async function HomePage() {
  const companies = await prisma.companyApplication.findMany({
    where: {
      status: "APPROVED",
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      slug: true,
      companyName: true,
      city: true,
      description: true,
      isVerified: true,
    },
  });

  const toSlug = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const normalizedCompanies = companies.map((company) => ({
    ...company,
    slug: company.slug || toSlug(company.companyName),
  }));

  return (
    <AppShell>
      <HomeContent companies={normalizedCompanies} />
    </AppShell>
  );
}

