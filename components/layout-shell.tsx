"use client";

import { useEffect, useState, useCallback } from "react";
import { useAppStore } from "@/hooks/use-app-store";
import { LeftSidebar } from "./sidebar/left-sidebar";
import { ChatInterface } from "./chat/chat-interface";
import { RightSidebar } from "./sidebar/right-sidebar";
import { cn } from "@/lib/utils";

export function LayoutShell() {
  const {
    leftSidebarOpen,
    rightSidebarOpen,
    selectedPersonaIds,
    setRightSidebarOpen,
    setLeftSidebarOpen,
  } = useAppStore();

  const [leftHovered, setLeftHovered] = useState(false);
  const [rightHovered, setRightHovered] = useState(false);

  const leftOpen = leftSidebarOpen || leftHovered;
  const rightOpen = rightSidebarOpen || rightHovered;

  useEffect(() => {
    if (selectedPersonaIds.length === 0) {
      setRightSidebarOpen(false);
    }
  }, [selectedPersonaIds, setRightSidebarOpen]);

  const handleLeftEnter = useCallback(() => {
    if (!leftSidebarOpen) setLeftHovered(true);
  }, [leftSidebarOpen]);

  const handleLeftLeave = useCallback(() => {
    setLeftHovered(false);
  }, []);

  const handleRightEnter = useCallback(() => {
    if (!rightSidebarOpen) setRightHovered(true);
  }, [rightSidebarOpen]);

  const handleRightLeave = useCallback(() => {
    setRightHovered(false);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside
        onMouseEnter={handleLeftEnter}
        onMouseLeave={handleLeftLeave}
        className={cn(
          "shrink-0 border-r border-border bg-sidebar flex flex-col overflow-hidden transition-all duration-500 ease-in-out",
          leftOpen ? "w-64" : "w-12"
        )}
      >
        <LeftSidebar isOpen={leftOpen} />
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <ChatInterface />
      </main>

      <aside
        onMouseEnter={handleRightEnter}
        onMouseLeave={handleRightLeave}
        className={cn(
          "shrink-0 border-l border-border bg-sidebar flex flex-col overflow-hidden transition-all duration-500 ease-in-out",
          rightOpen ? "w-80" : "w-12"
        )}
      >
        <RightSidebar isOpen={rightOpen} />
      </aside>
    </div>
  );
}
