import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export interface ProjectData {
  id: string;
  name: string;
  ownerId: string;
}

export async function getProjectsForUser(): Promise<{
  owned: ProjectData[];
  shared: ProjectData[];
}> {
  const user = await currentUser();
  if (!user) return { owned: [], shared: [] };

  const email = user.emailAddresses?.[0]?.emailAddress ?? "";

  const [owned, collaborations] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, ownerId: true },
    }),
    email
      ? prisma.projectCollaborator.findMany({
          where: { collaboratorEmail: email },
          include: {
            project: { select: { id: true, name: true, ownerId: true } },
          },
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve([]),
  ]);

  return {
    owned,
    shared: collaborations.map((c) => c.project),
  };
}
