"use client";

import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Persona } from "@/lib/types";
import { cn } from "@/lib/utils";

function RatingBar({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 w-3 rounded-sm",
            i < value ? "bg-primary" : "bg-border"
          )}
        />
      ))}
    </div>
  );
}

export function PersonaCard({
  persona,
  onEdit,
  onDelete,
  onViewProfile,
}: {
  persona: Persona;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewProfile?: () => void;
}) {
  const d = persona.data;

  return (
    <div className="rounded-lg border bg-card/80 p-3 text-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          {persona.image_url ? (
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
              <Image
                src={persona.image_url}
                alt={persona.name}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
              {persona.name[0]}
            </div>
          )}
          <div>
            <h4 className="font-semibold leading-tight">{persona.name}</h4>
            <p className="text-xs">{persona.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {onEdit && (
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onEdit}>
              <Pencil className="h-3 w-3" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      <p className="mt-1.5 text-xs italic">„{d.zitat}"</p>

      <div className="mt-2 flex flex-wrap gap-1">
        <Badge variant="outline" className="text-[10px]">
          {d.kurzprofil.alter}J, {d.kurzprofil.geschlecht}
        </Badge>
        <Badge variant="outline" className="text-[10px]">
          {d.kurzprofil.beruf}
        </Badge>
      </div>

      <div className="mt-2.5 space-y-1">
        {d.kerneigenschaften.map((k) => (
          <div key={k.name} className="flex items-center justify-between gap-2">
            <span className="text-[10px] truncate">{k.name}</span>
            <RatingBar value={k.wert} />
          </div>
        ))}
      </div>

      {onViewProfile && (
        <Button
          variant="outline"
          size="sm"
          className="mt-3 w-full text-xs cursor-pointer"
          onClick={onViewProfile}
        >
          Profil anzeigen
        </Button>
      )}
    </div>
  );
}
