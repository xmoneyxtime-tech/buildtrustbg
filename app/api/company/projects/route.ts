import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  createCompanyProject,
  findCompanyByUserEmail,
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

  if (!email) {
    return NextResponse.json<ApiErrorResponse>({ error: "Unauthorized" }, { status: 401 });
  }

  const company = await findCompanyByUserEmail(email);

  if (!company) {
    return NextResponse.json<ApiErrorResponse>({ error: "Company not found" }, { status: 404 });
  }

  const projects = await listCompanyProjects(company.id);

  return NextResponse.json<CompanyProjectsResponse>({ projects }, { status: 200 });
}

export async function POST(request: Request) {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json<ApiErrorResponse>({ error: "Unauthorized" }, { status: 401 });
  }

  const company = await findCompanyByUserEmail(email);

  if (!company) {
    return NextResponse.json<ApiErrorResponse>({ error: "Company not found" }, { status: 404 });
  }

  let body: CreateProjectInput;

  try {
    body = (await request.json()) as CreateProjectInput;
  } catch {
    return NextResponse.json<ApiErrorResponse>({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const errors = validateCreateProjectInput(body);

  if (errors.length > 0) {
    return NextResponse.json<ApiErrorResponse>({ error: errors.join(" ") }, { status: 400 });
  }

  const project = await createCompanyProject(company.id, sanitizeCreateProjectInput(body));

  return NextResponse.json<CompanyProjectResponse>({ project }, { status: 201 });
}
