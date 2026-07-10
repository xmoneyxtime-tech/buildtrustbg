import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { calculateTrustScore } from "@/app/lib/trust-score";

export async function GET() {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const company = await prisma.companyApplication.findFirst({
    where: { email },
    orderBy: { updatedAt: "desc" },
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
    },
  });

  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  const trust = calculateTrustScore({
    ...company,
    projectsCount: company.projects.length,
  });

  return NextResponse.json({
    companyId: company.id,
    companyName: company.companyName,
    trust,
  });
}
