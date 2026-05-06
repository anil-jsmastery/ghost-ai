"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { ProjectData } from "@/lib/data/projects";

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

function shortId(): string {
  return Math.random().toString(36).slice(2, 8);
}

export function useProjectActions(
  initialOwned: ProjectData[],
  initialShared: ProjectData[]
) {
  const router = useRouter();
  const pathname = usePathname();

  const [ownedProjects, setOwnedProjects] = useState(initialOwned);
  const [sharedProjects] = useState(initialShared);
  const [openDialog, setOpenDialog] = useState<DialogType>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [formName, setFormName] = useState("");
  const [suffix, setSuffix] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const slug = slugify(formName);
  const roomId = formName.trim() ? `${slug}-${suffix}` : "";

  const openCreateDialog = () => {
    setFormName("");
    setSelectedProject(null);
    setSuffix(shortId());
    setOpenDialog("create");
  };

  const openRenameDialog = (project: ProjectData) => {
    setFormName(project.name);
    setSelectedProject(project);
    setOpenDialog("rename");
  };

  const openDeleteDialog = (project: ProjectData) => {
    setSelectedProject(project);
    setOpenDialog("delete");
  };

  const closeDialog = () => {
    setOpenDialog(null);
    setSelectedProject(null);
    setFormName("");
  };

  const handleCreate = async () => {
    if (!formName.trim()) return;
    setIsLoading(true);
    try {
      const id = `${slugify(formName.trim())}-${suffix}`;
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name: formName.trim() }),
      });
      if (!res.ok) throw new Error("Failed to create project");
      const project: ProjectData = await res.json();
      closeDialog();
      router.push(`/editor/${project.id}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRename = async () => {
    if (!formName.trim() || !selectedProject) return;
    setIsLoading(true);
    const snapshot = ownedProjects;
    setOwnedProjects((p) =>
      p.map((x) =>
        x.id === selectedProject.id ? { ...x, name: formName.trim() } : x
      )
    );
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName.trim() }),
      });
      if (!res.ok) throw new Error("Failed to rename project");
      closeDialog();
      router.refresh();
    } catch {
      setOwnedProjects(snapshot);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProject) return;
    setIsLoading(true);
    const snapshot = ownedProjects;
    setOwnedProjects((p) => p.filter((x) => x.id !== selectedProject.id));
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete project");
      closeDialog();
      if (pathname === `/editor/${selectedProject.id}`) {
        router.push("/editor");
      } else {
        router.refresh();
      }
    } catch {
      setOwnedProjects(snapshot);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    ownedProjects,
    sharedProjects,
    openDialog,
    selectedProject,
    formName,
    setFormName,
    isLoading,
    roomId,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    handleCreate,
    handleRename,
    handleDelete,
  };
}
