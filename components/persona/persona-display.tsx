"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { PersonaCard } from "./persona-card";
import type { Persona } from "@/lib/types";

export function PersonaDisplay({
  personas,
  selectedIds,
  onEdit,
  onDelete,
  onViewProfile,
}: {
  personas: Persona[];
  selectedIds: string[];
  onEdit?: (persona: Persona) => void;
  onDelete?: (id: string) => void;
  onViewProfile?: (persona: Persona) => void;
}) {
  const selectedPersonas = personas.filter((p) => selectedIds.includes(p.id));

  if (selectedPersonas.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <p className="text-center text-xs text-muted-foreground">
          Wähle Personas aus, um deren Kontext hier anzuzeigen und als Grundlage für den
          AI-Chat zu nutzen.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-2 p-3">
        {selectedPersonas.map((persona) => (
          <PersonaCard
            key={persona.id}
            persona={persona}
            onEdit={onEdit ? () => onEdit(persona) : undefined}
            onDelete={onDelete ? () => onDelete(persona.id) : undefined}
            onViewProfile={onViewProfile ? () => onViewProfile(persona) : undefined}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
