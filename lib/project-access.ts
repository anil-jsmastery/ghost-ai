import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ProjectData } from "@/lib/data/projects";

export async function getCurrentUserIdentity(): Promise<{
  userId: string;
  email: string;
} | null> {
  const user = await currentUser();
  if (!user) return null;
  return {
    userId: user.id,
    email: user.emailAddresses?.[0]?.emailAddress ?? "",
  };
}

export async function getProjectWithAccess(
  projectId: string,
  userId: string,
  email: string
): Promise<ProjectData | null> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, name: true, ownerId: true },
  });

  if (!project) return null;
  if (project.ownerId === userId) return project;

  if (email) {
    const collab = await prisma.projectCollaborator.findUnique({
      where: {
        projectId_collaboratorEmail: {
          projectId: project.id,
          collaboratorEmail: email,
        },
      },
    });
    if (collab) return project;
  }

  return null;
}
