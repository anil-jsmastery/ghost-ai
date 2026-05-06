"use client";

import { createContext, useContext } from "react";
import type { useProjectDialogs } from "@/hooks/use-project-dialogs";

type ProjectDialogsContextValue = ReturnType<typeof useProjectDialogs>;

const ProjectDialogsContext = createContext<ProjectDialogsContextValue | null>(null);

export function ProjectDialogsProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: ProjectDialogsContextValue;
}) {
  return (
    <ProjectDialogsContext.Provider value={value}>
      {children}
    </ProjectDialogsContext.Provider>
  );
}

export function useProjectDialogsContext() {
  const ctx = useContext(ProjectDialogsContext);
  if (!ctx) throw new Error("useProjectDialogsContext must be used within ProjectDialogsProvider");
  return ctx;
}
