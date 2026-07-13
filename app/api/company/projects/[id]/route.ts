import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { enforceRateLimit } from "@/app/lib/security/rate-limit";
import { getCompanyForUser } from "@/app/lib/services/ownership";
import { invalidJsonResponse, validationErrorResponse } from "@/app/lib/validation/http";
import {
  deleteCompanyProject,
  sanitizeUpdateProjectInput,
  updateCompanyProject,
  validateUpdateProjectInput,
} from "@/app/lib/projects";
import type { ApiErrorResponse, CompanyProjectResponse, UpdateProjectInput } from "@/app/lib/projects";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const rateLimited = enforceRateLimit(request, "companyProjectWrite");
  if (rateLimited) {
    return rateLimited;
  }

  const session = await auth();
  const email = session?.user?.email;
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!email) {
    return NextResponse.json<ApiErrorResponse>({ error: "Unauthorized" }, { status: 401 });
  }

  const company = await getCompanyForUser({ userId, email });

  if (!company) {
    return NextResponse.json<ApiErrorResponse>({ error: "Company not found" }, { status: 404 });
  }

  let body: UpdateProjectInput;

  try {
    body = (await request.json()) as UpdateProjectInput;
  } catch {
    return invalidJsonResponse();
  }

  const errors = validateUpdateProjectInput(body);

  if (errors.length > 0) {
    return validationErrorResponse(errors);
  }

  const { id } = await context.params;
  const project = await updateCompanyProject(company.id, id, sanitizeUpdateProjectInput(body));

  if (!project) {
    return NextResponse.json<ApiErrorResponse>({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json<CompanyProjectResponse>({ project }, { status: 200 });
}

export async function DELETE(request: Request, context: RouteContext) {
  const rateLimited = enforceRateLimit(request, "companyProjectWrite");
  if (rateLimited) {
    return rateLimited;
  }

  const session = await auth();
  const email = session?.user?.email;
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!email) {
    return NextResponse.json<ApiErrorResponse>({ error: "Unauthorized" }, { status: 401 });
  }

  const company = await getCompanyForUser({ userId, email });

  if (!company) {
    return NextResponse.json<ApiErrorResponse>({ error: "Company not found" }, { status: 404 });
  }

  const { id } = await context.params;
  const deleted = await deleteCompanyProject(company.id, id);

  if (!deleted) {
    return NextResponse.json<ApiErrorResponse>({ error: "Project not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
