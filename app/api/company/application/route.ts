import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const application = await prisma.companyApplication.create({
      data: {
        companyName: body.companyName,
        email: body.email,
        phone: body.phone,
        city: body.city,
        service: body.service,
        website: body.website || null,
        description: body.description,
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