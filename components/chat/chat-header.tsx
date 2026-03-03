"use client";

import { PanelLeft, PanelRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/hooks/use-app-store";
import { getModelInfo } from "@/lib/ai-providers";

export function ChatHeader() {
  const {
    selectedModel,
    selectedPersonaIds,
    leftSidebarOpen,
    toggleLeftSidebar,
    toggleRightSidebar,
    rightSidebarOpen,
  } = useAppStore();
  const modelInfo = getModelInfo(selectedModel);

  return (
    <div className="flex h-12 shrink-0 items-center justify-between border-b px-4">
      <div className="flex items-center gap-2">
        {!leftSidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleLeftSidebar}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        )}
        <h1 className="text-sm font-semibold">Persona AI</h1>
        {modelInfo && (
          <Badge variant="secondary" className="text-[10px] font-normal">
            {modelInfo.name}
          </Badge>
        )}
        {selectedPersonaIds.length > 0 && (
          <Badge variant="outline" className="text-[10px] font-normal gap-1">
            <Users className="h-2.5 w-2.5" />
            {selectedPersonaIds.length} Persona{selectedPersonaIds.length !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={toggleRightSidebar}
      >
        <PanelRight className={`h-4 w-4 ${rightSidebarOpen ? "text-primary" : ""}`} />
      </Button>
    </div>
  );
}
