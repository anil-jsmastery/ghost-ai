"use client";

import Link from "next/link";
import { X, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjectDialogsContext } from "@/components/editor/project-dialogs-context";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeProjectId?: string;
}

export function ProjectSidebar({ isOpen, onClose, activeProjectId }: ProjectSidebarProps) {
  const { ownedProjects, sharedProjects, openCreateDialog, openRenameDialog, openDeleteDialog } =
    useProjectDialogsContext();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 sm:bg-transparent"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* overflow-hidden clips the shadow so it never peeks into the viewport when closed */}
      <div
        className={`fixed left-0 top-12 z-30 h-[calc(100vh-3rem)] w-72 overflow-hidden ${
          !isOpen ? "pointer-events-none" : ""
        }`}
      >
      <aside
        className={`absolute inset-0 flex flex-col border-r border-border bg-card shadow-xl transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm font-semibold text-foreground">
            Projects
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden p-4">
          <Tabs defaultValue="my-projects" className="flex flex-1 flex-col">
            <TabsList className="w-full">
              <TabsTrigger value="my-projects" className="flex-1">
                My Projects
              </TabsTrigger>
              <TabsTrigger value="shared" className="flex-1">
                Shared
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="my-projects"
              className="mt-2 flex flex-1 flex-col overflow-y-auto"
            >
              {ownedProjects.length === 0 ? (
                <div className="flex flex-1 items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    No projects yet.
                  </p>
                </div>
              ) : (
                <ul className="flex flex-col gap-0.5">
                  {ownedProjects.map((project) => (
                    <li
                      key={project.id}
                      className={`group flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50 ${
                        activeProjectId === project.id ? "bg-muted" : ""
                      }`}
                    >
                      <Link
                        href={`/editor/${project.id}`}
                        className="flex-1 truncate text-sm text-foreground"
                        onClick={onClose}
                      >
                        {project.name}
                      </Link>
                      <div className="hidden items-center gap-0.5 group-hover:flex">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => openRenameDialog(project)}
                          aria-label={`Rename ${project.name}`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => openDeleteDialog(project)}
                          aria-label={`Delete ${project.name}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>

            <TabsContent
              value="shared"
              className="mt-2 flex flex-1 flex-col overflow-y-auto"
            >
              {sharedProjects.length === 0 ? (
                <div className="flex flex-1 items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    No shared projects.
                  </p>
                </div>
              ) : (
                <ul className="flex flex-col gap-0.5">
                  {sharedProjects.map((project) => (
                    <li
                      key={project.id}
                      className={`flex items-center rounded-md px-2 py-1.5 hover:bg-muted/50 ${
                        activeProjectId === project.id ? "bg-muted" : ""
                      }`}
                    >
                      <Link
                        href={`/editor/${project.id}`}
                        className="flex-1 truncate text-sm text-foreground"
                        onClick={onClose}
                      >
                        {project.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="border-t border-border p-4">
          <Button className="w-full" size="sm" onClick={openCreateDialog}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </aside>
      </div>
    </>
  );
}
