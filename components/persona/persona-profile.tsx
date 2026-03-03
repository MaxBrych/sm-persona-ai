"use client";

import Image from "next/image";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h5 className="text-xs font-semibold mb-1.5">{title}</h5>
      {children}
    </div>
  );
}

export function PersonaProfile({
  persona,
  onBack,
  onEdit,
  onDelete,
}: {
  persona: Persona;
  onBack: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const d = persona.data;

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-semibold">Zurück</span>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4 text-sm">
          {/* Header */}
          <div className="flex items-center gap-3">
            {persona.image_url ? (
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={persona.image_url}
                  alt={persona.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-semibold">
                {persona.name[0]}
              </div>
            )}
            <div>
              <h3 className="text-base font-semibold">{persona.name}</h3>
              <p className="text-sm">{persona.type}</p>
            </div>
          </div>

          <p className="text-xs italic">„{d.zitat}"</p>

          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-[10px]">
              {d.kurzprofil.alter}J, {d.kurzprofil.geschlecht}
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              {d.kurzprofil.beruf}
            </Badge>
          </div>

          <Separator />

          {/* Kerneigenschaften */}
          <Section title="Kerneigenschaften">
            <div className="space-y-1">
              {d.kerneigenschaften.map((k) => (
                <div key={k.name} className="flex items-center justify-between gap-2">
                  <span className="text-xs">{k.name}</span>
                  <RatingBar value={k.wert} />
                </div>
              ))}
            </div>
          </Section>

          <Separator />

          {/* Kurzprofil */}
          <Section title="Kurzprofil">
            <div className="space-y-0.5 text-xs">
              <p>Familie: {d.kurzprofil.familie}</p>
              <p>Bildung: {d.kurzprofil.bildung}</p>
              {d.kurzprofil.eigenschaften.map((e, i) => (
                <p key={i}>• {e}</p>
              ))}
            </div>
          </Section>

          <Separator />

          {/* Bedürfnisse & Motive */}
          <Section title="Bedürfnisse & Motive">
            <ul className="space-y-0.5 text-xs">
              {d.beduerfnisseMotive.map((b, i) => (
                <li key={i}>• {b}</li>
              ))}
            </ul>
          </Section>

          <Separator />

          {/* Emotionale Treiber */}
          <Section title="Emotionale Treiber">
            <ul className="space-y-0.5 text-xs">
              {d.emotionaleTreiber.map((e, i) => (
                <li key={i}>• {e}</li>
              ))}
            </ul>
          </Section>

          <Separator />

          {/* Emotionale Segmente */}
          <Section title="Emotionale Segmente">
            <div className="space-y-0.5 text-xs">
              <p>
                <span className="font-medium">Hauptsegment:</span>{" "}
                {d.emotionaleSegmente.hauptsegment}
              </p>
              <p>
                <span className="font-medium">Sekundär:</span>{" "}
                {d.emotionaleSegmente.sekundaereSegmente}
              </p>
              <p className="italic">{d.emotionaleSegmente.kurzbegruendung}</p>
            </div>
          </Section>

          <Separator />

          {/* Markentreue */}
          <Section title="Markentreue">
            <div className="space-y-0.5 text-xs">
              {d.markentreue.map((m, i) => (
                <p key={i}>
                  {m.marke}: {m.wohnort}, {m.einkommen}
                </p>
              ))}
            </div>
          </Section>

          <Separator />

          {/* Produkt-Fit */}
          <Section title="Produkt-Fit">
            <div className="space-y-2 text-xs">
              {d.produktFit.map((pf, i) => (
                <div key={i}>
                  <p className="font-medium">
                    {pf.produkt}{" "}
                    <span className="font-normal">({pf.typ})</span>
                  </p>
                  <ul>
                    {pf.beschreibung.map((b, j) => (
                      <li key={j}>• {b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          {/* Actions */}
          {(onEdit || onDelete) && (
            <>
              <Separator />
              <div className="flex gap-2">
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs gap-1.5"
                    onClick={onEdit}
                  >
                    <Pencil className="h-3 w-3" />
                    Bearbeiten
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1.5 hover:text-destructive hover:border-destructive"
                    onClick={onDelete}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
