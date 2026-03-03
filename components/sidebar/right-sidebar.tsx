"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PersonaSelector } from "@/components/persona/persona-selector";
import { PersonaDisplay } from "@/components/persona/persona-display";
import { PersonaForm } from "@/components/persona/persona-form";
import { usePersonas } from "@/hooks/use-personas";
import { useAppStore } from "@/hooks/use-app-store";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { Persona, PersonaData } from "@/lib/types";

export function RightSidebar() {
  const { personas, loading, createPersona, updatePersona, deletePersona } =
    usePersonas();
  const { selectedPersonaIds } = useAppStore();
  const [formOpen, setFormOpen] = useState(false);
  const [editingPersona, setEditingPersona] = useState<Persona | undefined>();

  const handleCreate = () => {
    setEditingPersona(undefined);
    setFormOpen(true);
  };

  const handleEdit = (persona: Persona) => {
    setEditingPersona(persona);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePersona(id);
      toast.success("Persona gelöscht");
    } catch {
      toast.error("Fehler beim Löschen");
    }
  };

  const handleSave = async (data: {
    name: string;
    type: string;
    category: string;
    image_url?: string;
    data: PersonaData;
  }) => {
    try {
      if (editingPersona) {
        await updatePersona(editingPersona.id, data);
        toast.success("Persona aktualisiert");
      } else {
        await createPersona(data);
        toast.success("Persona erstellt");
      }
    } catch {
      toast.error("Fehler beim Speichern");
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-12 shrink-0 items-center justify-between border-b px-3">
        <span className="text-sm font-semibold">Personas</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleCreate}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="px-3 pt-3">
        {loading ? (
          <Skeleton className="h-9 w-full" />
        ) : (
          <PersonaSelector personas={personas} />
        )}
      </div>

      <Separator className="mt-3" />

      {loading ? (
        <div className="space-y-2 p-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <PersonaDisplay
          personas={personas}
          selectedIds={selectedPersonaIds}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <PersonaForm
        open={formOpen}
        onOpenChange={setFormOpen}
        persona={editingPersona}
        onSave={handleSave}
      />
    </div>
  );
}
