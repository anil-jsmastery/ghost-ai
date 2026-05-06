import { redirect } from "next/navigation";
import { getCurrentUserIdentity, getProjectWithAccess } from "@/lib/project-access";
import { getProjectsForUser } from "@/lib/data/projects";
import { AccessDenied } from "@/components/editor/access-denied";
import { WorkspaceClient } from "@/components/editor/workspace-client";

export default async function EditorRoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;

  const identity = await getCurrentUserIdentity();
  if (!identity) redirect("/sign-in");

  const [project, { owned, shared }] = await Promise.all([
    getProjectWithAccess(roomId, identity.userId, identity.email),
    getProjectsForUser(),
  ]);

  if (!project) return <AccessDenied />;

  return (
    <WorkspaceClient
      project={project}
      isOwner={project.ownerId === identity.userId}
      ownedProjects={owned}
      sharedProjects={shared}
    />
  );
}
