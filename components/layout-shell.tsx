"use client";

import { useEffect } from "react";
import { useAppStore } from "@/hooks/use-app-store";
import { LeftSidebar } from "./sidebar/left-sidebar";
import { ChatInterface } from "./chat/chat-interface";
import { RightSidebar } from "./sidebar/right-sidebar";
import { cn } from "@/lib/utils";

export function LayoutShell() {
  const { leftSidebarOpen, rightSidebarOpen, selectedPersonaIds, setRightSidebarOpen } = useAppStore();

  useEffect(() => {
    if (selectedPersonaIds.length === 0) {
      setRightSidebarOpen(false);
    }
  }, [selectedPersonaIds, setRightSidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside
        className={cn(
          "shrink-0 border-r border-border bg-sidebar flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
          leftSidebarOpen ? "w-64" : "w-12"
        )}
      >
        <LeftSidebar />
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <ChatInterface />
      </main>

      <aside
        className={cn(
          "shrink-0 border-l border-border bg-sidebar flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
          rightSidebarOpen ? "w-80" : "w-12"
        )}
      >
        <RightSidebar />
      </aside>
    </div>
  );
}
