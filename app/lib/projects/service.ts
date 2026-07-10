import type { Prisma, ProjectStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { CreateProjectInput, ProjectDto, UpdateProjectInput } from "./types";
import { slugifyProjectTitle } from "./slug";

const projectInclude = {
  images: {
    orderBy: {
      order: "asc" as const,
    },
  },
} satisfies Prisma.ProjectInclude;

type ProjectWithImages = Prisma.ProjectGetPayload<{
  include: typeof projectInclude;
}>;

function mapProject(project: ProjectWithImages): ProjectDto {
  return {
    id: project.id,
    companyId: project.companyId,
    slug: project.slug,
    title: project.title,
    shortDescription: project.shortDescription,
    description: project.description,
    category: project.category,
    city: project.city,
    completedAt: project.completedAt ? project.completedAt.toISOString() : null,
    featured: project.featured,
    published: project.published,
    status: project.status,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    images: project.images.map((image) => ({
      id: image.id,
      imageUrl: image.imageUrl,
      altText: image.altText,
      order: image.order,
    })),
  };
}

async function generateUniqueProjectSlug(title: string): Promise<string> {
  const baseSlug = slugifyProjectTitle(title) || "project";
  const existing = await prisma.project.findMany({
    where: {
      slug: {
        startsWith: baseSlug,
      },
    },
    select: { slug: true },
  });

  const existingSet = new Set(existing.map((item) => item.slug));

  if (!existingSet.has(baseSlug)) {
    return baseSlug;
  }

  let suffix = 2;
  while (existingSet.has(`${baseSlug}-${suffix}`)) {
    suffix += 1;
  }

  return `${baseSlug}-${suffix}`;
}

async function syncProjectsTrustCounters(companyId: string): Promise<void> {
  const [projectsCount, galleryCount] = await Promise.all([
    prisma.project.count({
      where: {
        companyId,
        status: {
          not: "ARCHIVED",
        },
      },
    }),
    prisma.projectImage.count({
      where: {
        project: {
          companyId,
          status: {
            not: "ARCHIVED",
          },
        },
      },
    }),
  ]);

  await prisma.companyApplication.update({
    where: { id: companyId },
    data: {
      projectsCount,
      galleryCount,
    },
  });
}

export async function findCompanyByUserEmail(email: string) {
  return prisma.companyApplication.findFirst({
    where: {
      email,
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      companyName: true,
      email: true,
    },
  });
}

export async function createCompanyProject(companyId: string, input: CreateProjectInput): Promise<ProjectDto> {
  const slug = await generateUniqueProjectSlug(input.title);

  return prisma.$transaction(async (tx) => {
    if (input.featured) {
      await tx.project.updateMany({
        where: {
          companyId,
          featured: true,
        },
        data: {
          featured: false,
        },
      });
    }

    const project = await tx.project.create({
      data: {
        companyId,
        slug,
        title: input.title,
        shortDescription: input.shortDescription,
        description: input.description,
        category: input.category,
        city: input.city,
        completedAt: input.completedAt ? new Date(input.completedAt) : null,
        featured: Boolean(input.featured),
        published: Boolean(input.published),
        status: input.published ? "PUBLISHED" : "DRAFT",
        images: {
          create: input.images.map((image) => ({
            imageUrl: image.imageUrl,
            altText: image.altText || null,
            order: image.order,
          })),
        },
      },
      include: projectInclude,
    });

    await syncProjectsTrustCounters(companyId);

    return mapProject(project);
  });
}

export async function listCompanyProjects(companyId: string): Promise<ProjectDto[]> {
  const projects = await prisma.project.findMany({
    where: {
      companyId,
      status: {
        not: "ARCHIVED",
      },
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    include: projectInclude,
  });

  return projects.map(mapProject);
}

export async function updateCompanyProject(
  companyId: string,
  projectId: string,
  input: UpdateProjectInput
): Promise<ProjectDto | null> {
  const existing = await prisma.project.findFirst({
    where: {
      id: projectId,
      companyId,
    },
    include: projectInclude,
  });

  if (!existing) {
    return null;
  }

  return prisma.$transaction(async (tx) => {
    if (input.featured === true) {
      await tx.project.updateMany({
        where: {
          companyId,
          featured: true,
          id: {
            not: projectId,
          },
        },
        data: {
          featured: false,
        },
      });
    }

    let slug = existing.slug;
    if (input.title && input.title !== existing.title) {
      slug = await generateUniqueProjectSlug(input.title);
    }

    const status: ProjectStatus | undefined =
      input.status ?? (input.published === true ? "PUBLISHED" : input.published === false ? "DRAFT" : undefined);

    const updated = await tx.project.update({
      where: {
        id: projectId,
      },
      data: {
        slug,
        title: input.title,
        shortDescription: input.shortDescription,
        description: input.description,
        category: input.category,
        city: input.city,
        completedAt:
          input.completedAt === undefined
            ? undefined
            : input.completedAt
              ? new Date(input.completedAt)
              : null,
        featured: input.featured,
        published: input.published,
        status,
      },
      include: projectInclude,
    });

    if (input.images) {
      await tx.projectImage.deleteMany({
        where: {
          projectId,
        },
      });

      if (input.images.length > 0) {
        await tx.projectImage.createMany({
          data: input.images.map((image) => ({
            projectId,
            imageUrl: image.imageUrl,
            altText: image.altText || null,
            order: image.order,
          })),
        });
      }
    }

    await syncProjectsTrustCounters(companyId);

    const reloaded = await tx.project.findUnique({
      where: {
        id: projectId,
      },
      include: projectInclude,
    });

    if (!reloaded) {
      return null;
    }

    return mapProject(reloaded);
  });
}

export async function deleteCompanyProject(companyId: string, projectId: string): Promise<boolean> {
  const existing = await prisma.project.findFirst({
    where: {
      id: projectId,
      companyId,
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    return false;
  }

  await prisma.$transaction(async (tx) => {
    await tx.project.delete({
      where: {
        id: projectId,
      },
    });

    await syncProjectsTrustCounters(companyId);
  });

  return true;
}

export async function getPublicProjectBySlug(slug: string): Promise<ProjectDto | null> {
  const project = await prisma.project.findFirst({
    where: {
      slug,
      published: true,
      status: "PUBLISHED",
      company: {
        status: "APPROVED",
      },
    },
    include: projectInclude,
  });

  if (!project) {
    return null;
  }

  return mapProject(project);
}

export async function listPublicProjectsByCompany(companyId: string): Promise<ProjectDto[]> {
  const projects = await prisma.project.findMany({
    where: {
      companyId,
      published: true,
      status: "PUBLISHED",
    },
    orderBy: [{ featured: "desc" }, { completedAt: "desc" }, { createdAt: "desc" }],
    include: projectInclude,
  });

  return projects.map(mapProject);
}
