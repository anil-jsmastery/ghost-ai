import { getProjectsForUser } from "@/lib/data/projects";
import { EditorHomeClient } from "@/components/editor/editor-home-client";

export default async function EditorPage() {
  const { owned, shared } = await getProjectsForUser();
  return <EditorHomeClient ownedProjects={owned} sharedProjects={shared} />;
}
