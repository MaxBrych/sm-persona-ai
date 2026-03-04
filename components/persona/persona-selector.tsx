"use client";

import Image from "next/image";
import { Check, ChevronsUpDown, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/hooks/use-app-store";
import type { Persona } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PersonaSelector({ personas }: { personas: Persona[] }) {
  const { selectedPersonaIds, togglePersona, selectAllPersonas, clearPersonas } =
    useAppStore();

  // Group by category
  const grouped = personas.reduce(
    (acc, p) => {
      if (!acc[p.category]) acc[p.category] = [];
      acc[p.category].push(p);
      return acc;
    },
    {} as Record<string, Persona[]>
  );

  const allSelected = selectedPersonaIds.length === personas.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between text-sm h-9"
        >
          <span className="flex items-center gap-2 truncate">
            <Users className="h-3.5 w-3.5 shrink-0" />
            {selectedPersonaIds.length === 0
              ? "Personas auswählen..."
              : `${selectedPersonaIds.length} Persona${selectedPersonaIds.length !== 1 ? "s" : ""} ausgewählt`}
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <span className="text-xs font-medium">Personas</span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-[10px] px-2"
              onClick={() =>
                allSelected
                  ? clearPersonas()
                  : selectAllPersonas(personas.map((p) => p.id))
              }
            >
              {allSelected ? "Keine" : "Alle"}
            </Button>
          </div>
        </div>
        <ScrollArea className="max-h-[400px]">
          <div className="p-1">
            {Object.entries(grouped).map(([category, categoryPersonas]) => (
              <div key={category}>
                <div className="px-2 py-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  {category}
                </div>
                {categoryPersonas.map((persona) => {
                  const isSelected = selectedPersonaIds.includes(persona.id);
                  return (
                    <button
                      key={persona.id}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent transition-colors",
                        isSelected && "bg-accent"
                      )}
                      onClick={() => togglePersona(persona.id)}
                    >
                      <div
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-input"
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      {persona.image_url ? (
                        <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full">
                          <Image
                            src={persona.image_url}
                            alt={persona.name}
                            fill
                            className="object-cover"
                            sizes="20px"
                          />
                        </div>
                      ) : (
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                          {persona.name[0]}
                        </div>
                      )}
                      <div className="flex-1 text-left">
                        <span className="text-sm">{persona.name}</span>
                        <span className="ml-1.5 text-[10px] text-muted-foreground">
                          {persona.type}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
