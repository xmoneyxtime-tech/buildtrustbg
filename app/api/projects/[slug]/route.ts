import { NextResponse } from "next/server";
import { getPublicProjectBySlug } from "@/app/lib/projects";
import type { ApiErrorResponse, CompanyProjectResponse } from "@/app/lib/projects";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const project = await getPublicProjectBySlug(slug);

  if (!project) {
    return NextResponse.json<ApiErrorResponse>({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json<CompanyProjectResponse>({ project }, { status: 200 });
}
