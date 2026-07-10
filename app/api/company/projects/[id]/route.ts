import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  deleteCompanyProject,
  findCompanyByUserEmail,
  sanitizeUpdateProjectInput,
  updateCompanyProject,
  validateUpdateProjectInput,
} from "@/app/lib/projects";
import type { ApiErrorResponse, CompanyProjectResponse, UpdateProjectInput } from "@/app/lib/projects";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json<ApiErrorResponse>({ error: "Unauthorized" }, { status: 401 });
  }

  const company = await findCompanyByUserEmail(email);

  if (!company) {
    return NextResponse.json<ApiErrorResponse>({ error: "Company not found" }, { status: 404 });
  }

  let body: UpdateProjectInput;

  try {
    body = (await request.json()) as UpdateProjectInput;
  } catch {
    return NextResponse.json<ApiErrorResponse>({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const errors = validateUpdateProjectInput(body);

  if (errors.length > 0) {
    return NextResponse.json<ApiErrorResponse>({ error: errors.join(" ") }, { status: 400 });
  }

  const { id } = await context.params;
  const project = await updateCompanyProject(company.id, id, sanitizeUpdateProjectInput(body));

  if (!project) {
    return NextResponse.json<ApiErrorResponse>({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json<CompanyProjectResponse>({ project }, { status: 200 });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json<ApiErrorResponse>({ error: "Unauthorized" }, { status: 401 });
  }

  const company = await findCompanyByUserEmail(email);

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
