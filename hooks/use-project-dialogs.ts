"use client";

import { useState } from "react";

export interface Project {
  id: string;
  name: string;
  slug: string;
  isOwned: boolean;
}

const INITIAL_PROJECTS: Project[] = [
  { id: "1", name: "My First Project", slug: "my-first-project", isOwned: true },
  { id: "2", name: "Architecture Workspace", slug: "architecture-workspace", isOwned: true },
  { id: "3", name: "Shared Design", slug: "shared-design", isOwned: false },
];

type DialogType = "create" | "rename" | "delete" | null;

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function useProjectDialogs() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [openDialog, setOpenDialog] = useState<DialogType>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formName, setFormName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const openCreateDialog = () => {
    setFormName("");
    setSelectedProject(null);
    setOpenDialog("create");
  };

  const openRenameDialog = (project: Project) => {
    setFormName(project.name);
    setSelectedProject(project);
    setOpenDialog("rename");
  };

  const openDeleteDialog = (project: Project) => {
    setSelectedProject(project);
    setOpenDialog("delete");
  };

  const closeDialog = () => {
    setOpenDialog(null);
    setSelectedProject(null);
    setFormName("");
  };

  const handleCreate = () => {
    if (!formName.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      const newProject: Project = {
        id: Date.now().toString(),
        name: formName.trim(),
        slug: slugify(formName),
        isOwned: true,
      };
      setProjects((prev) => [...prev, newProject]);
      setIsLoading(false);
      closeDialog();
    }, 400);
  };

  const handleRename = () => {
    if (!formName.trim() || !selectedProject) return;
    setIsLoading(true);
    setTimeout(() => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === selectedProject.id
            ? { ...p, name: formName.trim(), slug: slugify(formName) }
            : p
        )
      );
      setIsLoading(false);
      closeDialog();
    }, 400);
  };

  const handleDelete = () => {
    if (!selectedProject) return;
    setIsLoading(true);
    setTimeout(() => {
      setProjects((prev) => prev.filter((p) => p.id !== selectedProject.id));
      setIsLoading(false);
      closeDialog();
    }, 400);
  };

  return {
    projects,
    openDialog,
    selectedProject,
    formName,
    setFormName,
    isLoading,
    slug: slugify(formName),
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    handleCreate,
    handleRename,
    handleDelete,
  };
}
