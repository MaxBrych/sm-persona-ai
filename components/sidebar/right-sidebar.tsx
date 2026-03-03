"use client";

import { useState } from "react";
import { Plus, PanelRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PersonaSelector } from "@/components/persona/persona-selector";
import { PersonaDisplay } from "@/components/persona/persona-display";
import { PersonaProfile } from "@/components/persona/persona-profile";
import { PersonaForm } from "@/components/persona/persona-form";
import { usePersonas } from "@/hooks/use-personas";
import { useAppStore } from "@/hooks/use-app-store";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { Persona, PersonaData } from "@/lib/types";

export function RightSidebar() {
  const { personas, loading, createPersona, updatePersona, deletePersona } =
    usePersonas();
  const { selectedPersonaIds, rightSidebarOpen, toggleRightSidebar } = useAppStore();
  const [formOpen, setFormOpen] = useState(false);
  const [editingPersona, setEditingPersona] = useState<Persona | undefined>();
  const [viewingPersona, setViewingPersona] = useState<Persona | null>(null);

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

  if (!rightSidebarOpen) {
    return (
      <div className="flex h-full flex-col items-center py-2 gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={toggleRightSidebar}
        >
          <PanelRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (viewingPersona) {
    return (
      <div className="flex h-full flex-col min-w-[320px]">
        <PersonaProfile
          persona={viewingPersona}
          onBack={() => setViewingPersona(null)}
          onEdit={() => {
            handleEdit(viewingPersona);
            setViewingPersona(null);
          }}
          onDelete={() => {
            handleDelete(viewingPersona.id);
            setViewingPersona(null);
          }}
        />
        <PersonaForm
          open={formOpen}
          onOpenChange={setFormOpen}
          persona={editingPersona}
          onSave={handleSave}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col min-w-[320px]">
      <div className="flex h-12 shrink-0 items-center justify-between border-b px-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={toggleRightSidebar}
          >
            <PanelRight className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold">Personas</span>
        </div>
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
          onViewProfile={setViewingPersona}
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
