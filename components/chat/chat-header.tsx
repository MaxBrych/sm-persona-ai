"use client";

import Image from "next/image";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/hooks/use-app-store";

export function ChatHeader() {
  const { selectedPersonaIds } = useAppStore();

  return (
    <div className="flex h-12 shrink-0 items-center border-b px-4">
      <div className="flex items-center gap-2">
        <Image src="/logo.svg" alt="Logo" width={24} height={24} />
        <h1 className="text-sm font-semibold">Persona Chat</h1>
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
