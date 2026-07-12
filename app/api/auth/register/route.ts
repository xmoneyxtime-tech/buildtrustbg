import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/app/lib/security/rate-limit";
import { validateRegisterInput } from "@/app/lib/validation/auth";
import { invalidJsonResponse, validationErrorResponse } from "@/app/lib/validation/http";

export async function POST(request: Request) {
  const rateLimited = enforceRateLimit(request, "register");
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

    const parsed = validateRegisterInput(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.issues);
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: parsed.data.email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(parsed.data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Internal server error.",
      },
      { status: 500 }
    );
  }
}