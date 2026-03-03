"use client";

import { useAppStore } from "@/hooks/use-app-store";
import { LeftSidebar } from "./sidebar/left-sidebar";
import { ChatInterface } from "./chat/chat-interface";
import { RightSidebar } from "./sidebar/right-sidebar";

export function LayoutShell() {
  const { rightSidebarOpen } = useAppStore();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="w-64 shrink-0 border-r border-border bg-sidebar flex flex-col">
        <LeftSidebar />
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <ChatInterface />
      </main>

      {rightSidebarOpen && (
        <aside className="w-80 shrink-0 border-l border-border bg-sidebar flex flex-col overflow-hidden">
          <RightSidebar />
        </aside>
      )}
    </div>
  );
}
