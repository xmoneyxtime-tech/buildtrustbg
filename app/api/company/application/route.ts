import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/app/lib/security/rate-limit";
import { validateCompanyApplicationInput } from "@/app/lib/validation/company-application";
import { invalidJsonResponse, validationErrorResponse } from "@/app/lib/validation/http";

export async function POST(request: Request) {
  const rateLimited = enforceRateLimit(request, "companyApplication");
  if (rateLimited) {
    return rateLimited;
  }

  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return invalidJsonResponse();
    }

    const parsed = validateCompanyApplicationInput(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.issues, {
        success: false,
        message: parsed.issues[0]?.message || "Validation failed.",
      });
    }

    const categoryIds = parsed.data.categoryIds;

    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: categoryIds,
        },
      },
      include: {
        translations: {
          where: {
            locale: "bg",
          },
          select: {
            name: true,
          },
        },
      },
    });

    if (categories.length !== categoryIds.length) {
      return validationErrorResponse(["Invalid category selection."], {
        success: false,
        message: "Invalid category selection.",
      });
    }

    const categoryServiceText = categories
      .map((category) => category.translations[0]?.name || category.slug)
      .join(", ");

    const application = await prisma.companyApplication.create({
      data: {
        companyName: parsed.data.companyName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        city: parsed.data.city,
        service: categoryServiceText || parsed.data.service,
        website: parsed.data.website || null,
        description: parsed.data.description,
        categories: {
          connect: categoryIds.map((id: string) => ({ id })),
        },
      },
      include: {
        categories: {
          select: {
            id: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        application,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Company application error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit application.",
      },
      { status: 500 }
    );
  }
}