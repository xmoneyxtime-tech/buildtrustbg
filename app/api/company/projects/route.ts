import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { enforceRateLimit } from "@/app/lib/security/rate-limit";
import { getCompanyForUser } from "@/app/lib/services/ownership";
import { invalidJsonResponse, validationErrorResponse } from "@/app/lib/validation/http";
import {
  createCompanyProject,
  listCompanyProjects,
  sanitizeCreateProjectInput,
  validateCreateProjectInput,
} from "@/app/lib/projects";
import type {
  ApiErrorResponse,
  CompanyProjectResponse,
  CompanyProjectsResponse,
  CreateProjectInput,
} from "@/app/lib/projects";

export async function GET() {
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

  const projects = await listCompanyProjects(company.id);

  return NextResponse.json<CompanyProjectsResponse>({ projects }, { status: 200 });
}

export async function POST(request: Request) {
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

  let body: CreateProjectInput;

  try {
    body = (await request.json()) as CreateProjectInput;
  } catch {
    return invalidJsonResponse();
  }

  const errors = validateCreateProjectInput(body);

  if (errors.length > 0) {
    return validationErrorResponse(errors);
  }

  const project = await createCompanyProject(company.id, sanitizeCreateProjectInput(body));

  return NextResponse.json<CompanyProjectResponse>({ project }, { status: 201 });
}
