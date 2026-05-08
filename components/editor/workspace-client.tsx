"use client";

import { useState } from "react";
import { WorkspaceNavbar } from "@/components/editor/workspace-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ProjectDialogsProvider } from "@/components/editor/project-dialogs-context";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { ShareDialog } from "@/components/editor/share-dialog";
import { CanvasWrapper } from "@/components/editor/canvas-wrapper";
import { useProjectActions } from "@/hooks/use-project-actions";
import type { ProjectData } from "@/lib/data/projects";

interface WorkspaceClientProps {
  project: ProjectData;
  isOwner: boolean;
  ownedProjects: ProjectData[];
  sharedProjects: ProjectData[];
}

export function WorkspaceClient({
  project,
  isOwner,
  ownedProjects,
  sharedProjects,
}: WorkspaceClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const actions = useProjectActions(ownedProjects, sharedProjects);

  return (
    <ProjectDialogsProvider value={actions}>
      <div className="flex h-screen flex-col overflow-hidden">
        <WorkspaceNavbar
          projectName={project.name}
          isSidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          isAiSidebarOpen={aiSidebarOpen}
          onToggleAiSidebar={() => setAiSidebarOpen((prev) => !prev)}
          onShare={() => setShareDialogOpen(true)}
        />
        <div className="relative flex-1 overflow-hidden">
          <ProjectSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            activeProjectId={project.id}
          />
          <main className="absolute inset-0 flex bg-[#0d0d0d]">
            <CanvasWrapper roomId={project.id} />
          </main>
          {aiSidebarOpen && (
            <aside className="fixed right-0 top-12 z-30 flex h-[calc(100vh-3rem)] w-80 flex-col border-l border-border bg-card">
              <div className="flex flex-1 items-center justify-center">
                <p className="text-sm text-muted-foreground">AI chat coming soon</p>
              </div>
            </aside>
          )}
        </div>
        <ProjectDialogs />
        <ShareDialog
          projectId={project.id}
          isOwner={isOwner}
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
        />
      </div>
    </ProjectDialogsProvider>
  );
}
