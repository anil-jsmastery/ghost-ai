import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserIdentity, getProjectWithAccess } from "@/lib/project-access";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const identity = await getCurrentUserIdentity();
  if (!identity) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId } = await params;

  const project = await getProjectWithAccess(projectId, identity.userId, identity.email);
  if (!project) return Response.json({ error: "Forbidden" }, { status: 403 });

  const rows = await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    select: { collaboratorEmail: true },
  });

  const emails = rows.map((r) => r.collaboratorEmail);

  const clerk = await clerkClient();

  const [ownerUser, collaboratorUsers] = await Promise.all([
    clerk.users.getUser(project.ownerId).catch(() => null),
    emails.length > 0
      ? clerk.users.getUserList({ emailAddress: emails, limit: 100 }).then((r) => r.data)
      : Promise.resolve([]),
  ]);

  const enrichedMap: Record<string, { displayName: string | null; avatarUrl: string | null }> = {};
  for (const u of collaboratorUsers) {
    const email = u.emailAddresses[0]?.emailAddress;
    if (email) {
      enrichedMap[email] = {
        displayName: [u.firstName, u.lastName].filter(Boolean).join(" ") || null,
        avatarUrl: u.imageUrl ?? null,
      };
    }
  }

  const owner = {
    userId: project.ownerId,
    email: ownerUser?.emailAddresses[0]?.emailAddress ?? "",
    displayName: ownerUser
      ? [ownerUser.firstName, ownerUser.lastName].filter(Boolean).join(" ") || null
      : null,
    avatarUrl: ownerUser?.imageUrl ?? null,
  };

  const collaborators = emails.map((email) => ({
    email,
    displayName: enrichedMap[email]?.displayName ?? null,
    avatarUrl: enrichedMap[email]?.avatarUrl ?? null,
  }));

  return Response.json({ owner, collaborators });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId } = await params;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });
  if (!project) return Response.json({ error: "Not found" }, { status: 404 });
  if (project.ownerId !== userId)
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const email: string =
    typeof body?.email === "string" && body.email.trim()
      ? body.email.trim().toLowerCase()
      : "";

  if (!email) return Response.json({ error: "Email is required" }, { status: 400 });

  try {
    const collab = await prisma.projectCollaborator.create({
      data: { projectId, collaboratorEmail: email },
    });
    return Response.json(collab, { status: 201 });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return Response.json({ error: "Already a collaborator" }, { status: 409 });
    }
    throw error;
  }
}
