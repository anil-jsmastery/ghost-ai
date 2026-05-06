"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjectDialogsContext } from "@/components/editor/project-dialogs-context";

export default function EditorPage() {
  const { openCreateDialog } = useProjectDialogsContext();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-xl font-semibold text-foreground">
        Create a project or open an existing one
      </h1>
      <p className="text-sm text-muted-foreground">
        Start a new architecture workspace, or choose a project from the sidebar.
      </p>
      <Button onClick={openCreateDialog}>
        <Plus className="h-4 w-4" />
        New Project
      </Button>
    </div>
  );
}
