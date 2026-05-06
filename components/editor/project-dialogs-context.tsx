"use client";

import { createContext, useContext } from "react";
import type { useProjectActions } from "@/hooks/use-project-actions";

type ProjectActionsContextValue = ReturnType<typeof useProjectActions>;

const ProjectActionsContext = createContext<ProjectActionsContextValue | null>(null);

export function ProjectDialogsProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: ProjectActionsContextValue;
}) {
  return (
    <ProjectActionsContext.Provider value={value}>
      {children}
    </ProjectActionsContext.Provider>
  );
}

export function useProjectDialogsContext() {
  const ctx = useContext(ProjectActionsContext);
  if (!ctx) throw new Error("useProjectDialogsContext must be used within ProjectDialogsProvider");
  return ctx;
}
