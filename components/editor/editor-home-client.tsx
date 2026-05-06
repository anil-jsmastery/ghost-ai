"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ProjectDialogsProvider } from "@/components/editor/project-dialogs-context";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { useProjectActions } from "@/hooks/use-project-actions";
import type { ProjectData } from "@/lib/data/projects";

interface EditorHomeClientProps {
  ownedProjects: ProjectData[];
  sharedProjects: ProjectData[];
}

export function EditorHomeClient({
  ownedProjects,
  sharedProjects,
}: EditorHomeClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const actions = useProjectActions(ownedProjects, sharedProjects);

  return (
    <ProjectDialogsProvider value={actions}>
      <div className="flex h-screen flex-col">
        <EditorNavbar
          isSidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <ProjectSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex flex-1 overflow-hidden">
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-xl font-semibold text-foreground">
              Create a project or open an existing one
            </h1>
            <p className="text-sm text-muted-foreground">
              Start a new architecture workspace, or choose a project from the
              sidebar.
            </p>
            <Button onClick={actions.openCreateDialog}>
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </div>
        </main>
        <ProjectDialogs />
      </div>
    </ProjectDialogsProvider>
  );
}
