import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const categoryIds = Array.isArray(body.categoryIds)
      ? body.categoryIds.map((value: unknown) => String(value)).filter(Boolean)
      : [];

    if (categoryIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "At least one category is required.",
        },
        { status: 400 }
      );
    }

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
      return NextResponse.json(
        {
          success: false,
          message: "Invalid category selection.",
        },
        { status: 400 }
      );
    }

    const categoryServiceText = categories
      .map((category) => category.translations[0]?.name || category.slug)
      .join(", ");

    const application = await prisma.companyApplication.create({
      data: {
        companyName: body.companyName,
        email: body.email,
        phone: body.phone,
        city: body.city,
        service: categoryServiceText || body.service,
        website: body.website || null,
        description: body.description,
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