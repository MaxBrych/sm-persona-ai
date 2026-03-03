"use client";

import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/hooks/use-app-store";
import { getModelInfo } from "@/lib/ai-providers";

export function ChatHeader() {
  const { selectedModel, selectedPersonaIds } = useAppStore();
  const modelInfo = getModelInfo(selectedModel);

  return (
    <div className="flex h-12 shrink-0 items-center border-b px-4">
      <div className="flex items-center gap-2">
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
    </div>
  );
}
