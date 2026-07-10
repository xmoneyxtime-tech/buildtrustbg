import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { calculateTrustScore } from "@/app/lib/trust-score";

export async function GET() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const companies = await prisma.companyApplication.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      companyName: true,
      email: true,
      phone: true,
      description: true,
      industry: true,
      website: true,
      country: true,
      city: true,
      address: true,
      logoUrl: true,
      coverUrl: true,
      isVerified: true,
      identityVerified: true,
      phoneVerified: true,
      portfolioCount: true,
      projects: {
        where: {
          status: {
            not: "ARCHIVED",
          },
        },
        select: {
          id: true,
        },
      },
      reviewsCount: true,
      averageRating: true,
      yearsInBusiness: true,
      certificatesCount: true,
      galleryCount: true,
      responseTimeHours: true,
      activeSubscription: true,
      status: true,
    },
  });

  const result = companies.map((company) => ({
    id: company.id,
    name: company.companyName,
    status: company.status,
    trust: calculateTrustScore({
      ...company,
      projectsCount: company.projects.length,
    }),
  }));

  return NextResponse.json({ companies: result });
}
