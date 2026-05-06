"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProjectDialogsContext } from "@/components/editor/project-dialogs-context";

export function ProjectDialogs() {
  const {
    openDialog,
    selectedProject,
    formName,
    setFormName,
    isLoading,
    roomId,
    closeDialog,
    handleCreate,
    handleRename,
    handleDelete,
  } = useProjectDialogsContext();

  return (
    <>
      <Dialog
        open={openDialog === "create"}
        onOpenChange={(open) => { if (!open) closeDialog(); }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Project</DialogTitle>
            <DialogDescription>
              Give your project a name to get started.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Input
              autoFocus
              placeholder="Project name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
            {formName.trim() && (
              <p className="text-xs text-muted-foreground">
                Room ID: <span className="font-mono">{roomId}</span>
              </p>
            )}
          </div>
          <DialogFooter showCloseButton>
            <Button
              onClick={handleCreate}
              disabled={!formName.trim() || isLoading}
            >
              {isLoading ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDialog === "rename"}
        onOpenChange={(open) => { if (!open) closeDialog(); }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
            <DialogDescription>
              Renaming &ldquo;{selectedProject?.name}&rdquo;.
            </DialogDescription>
          </DialogHeader>
          <Input
            autoFocus
            placeholder="New project name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
          />
          <DialogFooter showCloseButton>
            <Button
              onClick={handleRename}
              disabled={!formName.trim() || isLoading}
            >
              {isLoading ? "Renaming…" : "Rename"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDialog === "delete"}
        onOpenChange={(open) => { if (!open) closeDialog(); }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{selectedProject?.name}&rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
