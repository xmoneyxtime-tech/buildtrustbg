import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { calculateTrustScore } from "@/app/lib/trust-score";
import { calculateCompanyReviewStats } from "@/app/lib/reviews";

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
      yearsInBusiness: true,
      certificatesCount: true,
      galleryCount: true,
      responseTimeHours: true,
      activeSubscription: true,
      status: true,
    },
  });

  const result = await Promise.all(
    companies.map(async (company) => {
      const reviewStats = await calculateCompanyReviewStats(company.id);

      return {
        id: company.id,
        name: company.companyName,
        status: company.status,
        trust: calculateTrustScore({
          ...company,
          projectsCount: company.projects.length,
          reviewsCount: reviewStats.reviewCount,
          averageRating: reviewStats.averageRating,
        }),
      };
    })
  );

  return NextResponse.json({ companies: result });
}
