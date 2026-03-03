"use client";

import { useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { useAppStore } from "@/hooks/use-app-store";
import { cn } from "@/lib/utils";
import type { Persona } from "@/lib/types";

export function PersonaGrid({ personas }: { personas: Persona[] }) {
  const {
    selectedPersonaIds,
    togglePersona,
    rightSidebarOpen,
    setRightSidebarOpen,
  } = useAppStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    const wasEmpty = selectedPersonaIds.length === 0;
    const isRemoving = selectedPersonaIds.includes(id);
    togglePersona(id);
    if (wasEmpty && !isRemoving && !rightSidebarOpen) {
      setRightSidebarOpen(true);
    }
  };

  return (
    <div className="flex items-center justify-center gap-3 h-[320px]">
      {personas.map((persona) => {
        const isHovered = hoveredId === persona.id;
        const isSelected = selectedPersonaIds.includes(persona.id);
        const isExpanded = isHovered || isSelected;

        return (
          <button
            key={persona.id}
            onClick={() => handleToggle(persona.id)}
            onMouseEnter={() => setHoveredId(persona.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={cn(
              "relative h-[280px] overflow-hidden rounded-[2rem] transition-all duration-500 ease-out cursor-pointer flex-shrink-0",
              isExpanded ? "w-[140px]" : "w-[72px]",
              isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background"
            )}
          >
            {persona.image_url ? (
              <Image
                src={persona.image_url}
                alt={persona.name}
                fill
                className={cn(
                  "object-cover transition-all duration-500 ease-out",
                  isHovered ? "brightness-110 scale-105" : "brightness-90"
                )}
                sizes="(max-width: 768px) 80px, 140px"
              />
            ) : (
              <div
                className={cn(
                  "flex h-full w-full items-center justify-center bg-muted text-2xl font-bold text-muted-foreground transition-all duration-500",
                  isHovered && "brightness-110"
                )}
              >
                {persona.name[0]}
              </div>
            )}

            {/* Gradient overlay at bottom */}
            <div
              className={cn(
                "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-all duration-500 ease-out",
                isExpanded ? "h-24 opacity-100" : "h-16 opacity-0"
              )}
            />

            {/* Name label */}
            <div
              className={cn(
                "absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-4 px-2 transition-all duration-500 ease-out",
                isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              )}
            >
              <span className="text-white text-sm font-semibold drop-shadow-lg truncate max-w-full">
                {persona.name}
              </span>
            </div>

            {/* Selected checkmark */}
            {isSelected && (
              <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                <Check className="h-3.5 w-3.5" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
