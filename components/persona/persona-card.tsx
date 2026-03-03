"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
}: {
  persona: Persona;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const [open, setOpen] = useState(false);
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
            <p className="text-xs text-muted-foreground">{persona.type}</p>
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
              className="h-6 w-6 text-muted-foreground hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      <p className="mt-1.5 text-xs italic text-muted-foreground">„{d.zitat}"</p>

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
            <span className="text-[10px] text-muted-foreground truncate">
              {k.name}
            </span>
            <RatingBar value={k.wert} />
          </div>
        ))}
      </div>

      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="mt-2 flex w-full items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
          <ChevronDown
            className={cn("h-3 w-3 transition-transform", open && "rotate-180")}
          />
          {open ? "Weniger anzeigen" : "Mehr anzeigen"}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-3 text-xs">
          <div>
            <h5 className="font-medium mb-1">Bedürfnisse & Motive</h5>
            <ul className="space-y-0.5 text-muted-foreground">
              {d.beduerfnisseMotive.map((b, i) => (
                <li key={i}>• {b}</li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-medium mb-1">Emotionale Treiber</h5>
            <ul className="space-y-0.5 text-muted-foreground">
              {d.emotionaleTreiber.map((e, i) => (
                <li key={i}>• {e}</li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-medium mb-1">Emotionale Segmente</h5>
            <div className="text-muted-foreground space-y-0.5">
              <p>
                <span className="text-foreground">Hauptsegment:</span>{" "}
                {d.emotionaleSegmente.hauptsegment}
              </p>
              <p>
                <span className="text-foreground">Sekundär:</span>{" "}
                {d.emotionaleSegmente.sekundaereSegmente}
              </p>
              <p className="italic">{d.emotionaleSegmente.kurzbegruendung}</p>
            </div>
          </div>

          <div>
            <h5 className="font-medium mb-1">Kurzprofil</h5>
            <div className="text-muted-foreground space-y-0.5">
              <p>Familie: {d.kurzprofil.familie}</p>
              <p>Bildung: {d.kurzprofil.bildung}</p>
              {d.kurzprofil.eigenschaften.map((e, i) => (
                <p key={i}>• {e}</p>
              ))}
            </div>
          </div>

          <div>
            <h5 className="font-medium mb-1">Markentreue</h5>
            {d.markentreue.map((m, i) => (
              <p key={i} className="text-muted-foreground">
                {m.marke}: {m.wohnort}, {m.einkommen}
              </p>
            ))}
          </div>

          <div>
            <h5 className="font-medium mb-1">Produkt-Fit</h5>
            {d.produktFit.map((pf, i) => (
              <div key={i} className="mb-1.5">
                <p className="font-medium text-foreground">
                  {pf.produkt}{" "}
                  <span className="font-normal text-muted-foreground">
                    ({pf.typ})
                  </span>
                </p>
                <ul className="text-muted-foreground">
                  {pf.beschreibung.map((b, j) => (
                    <li key={j}>• {b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
