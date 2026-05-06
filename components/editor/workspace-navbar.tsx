"use client";

import { UserButton } from "@clerk/nextjs";
import { MessageSquare, PanelLeftClose, PanelLeftOpen, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WorkspaceNavbarProps {
  projectName: string;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isAiSidebarOpen: boolean;
  onToggleAiSidebar: () => void;
  onShare: () => void;
}

export function WorkspaceNavbar({
  projectName,
  isSidebarOpen,
  onToggleSidebar,
  isAiSidebarOpen,
  onToggleAiSidebar,
  onShare,
}: WorkspaceNavbarProps) {
  return (
    <header className="flex h-12 items-center border-b border-border bg-card px-3 shrink-0">
      <div className="flex flex-1 items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex flex-1 justify-center">
        <span className="max-w-xs truncate text-sm font-medium text-foreground">
          {projectName}
        </span>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onShare}>
          <Share2 className="h-4 w-4" />
          Share
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleAiSidebar}
          aria-label={isAiSidebarOpen ? "Close AI sidebar" : "Open AI sidebar"}
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
        <UserButton />
      </div>
    </header>
  );
}
