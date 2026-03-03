"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Persona, PersonaData } from "@/lib/types";

const EMPTY_DATA: PersonaData = {
  kurzprofil: {
    alter: 30,
    geschlecht: "",
    familie: "",
    bildung: "",
    beruf: "",
    eigenschaften: [],
  },
  markentreue: [],
  zitat: "",
  beduerfnisseMotive: [],
  kerneigenschaften: [
    { name: "News-Interesse", wert: 3 },
    { name: "Medien-Devices", wert: 3 },
    { name: "Anzahl Abos", wert: 3 },
    { name: "Social Media Aktivität", wert: 3 },
    { name: "Regionale Verbundenheit", wert: 3 },
  ],
  emotionaleTreiber: [],
  emotionaleSegmente: {
    hauptsegment: "",
    sekundaereSegmente: "",
    kurzbegruendung: "",
  },
  produktFit: [],
};

export function PersonaForm({
  open,
  onOpenChange,
  persona,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  persona?: Persona;
  onSave: (data: {
    name: string;
    type: string;
    category: string;
    image_url?: string;
    data: PersonaData;
  }) => Promise<void>;
}) {
  const [name, setName] = useState(persona?.name || "");
  const [type, setType] = useState(persona?.type || "");
  const [category, setCategory] = useState(persona?.category || "");
  const [imageUrl, setImageUrl] = useState(persona?.image_url || "");
  const [data, setData] = useState<PersonaData>(
    persona?.data || { ...EMPTY_DATA }
  );
  const [saving, setSaving] = useState(false);

  const updateKurzprofil = (field: string, value: string | number | string[]) => {
    setData((prev) => ({
      ...prev,
      kurzprofil: { ...prev.kurzprofil, [field]: value },
    }));
  };

  const updateKerneigenschaft = (index: number, wert: number) => {
    setData((prev) => ({
      ...prev,
      kerneigenschaften: prev.kerneigenschaften.map((k, i) =>
        i === index ? { ...k, wert } : k
      ),
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await onSave({ name, type, category, image_url: imageUrl || undefined, data });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] p-0">
        <DialogHeader className="px-4 pt-4 pb-0">
          <DialogTitle className="text-base">
            {persona ? "Persona bearbeiten" : "Neue Persona"}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profil" className="px-4">
          <TabsList className="w-full h-8">
            <TabsTrigger value="profil" className="text-xs flex-1">
              Profil
            </TabsTrigger>
            <TabsTrigger value="eigenschaften" className="text-xs flex-1">
              Eigenschaften
            </TabsTrigger>
            <TabsTrigger value="emotionen" className="text-xs flex-1">
              Emotionen
            </TabsTrigger>
            <TabsTrigger value="produkt" className="text-xs flex-1">
              Produkt
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[50vh] mt-3">
            <TabsContent value="profil" className="space-y-3 pr-3 mt-0">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Typ</Label>
                  <Input
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    placeholder="z.B. Neokultureller"
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">Kategorie</Label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="z.B. Digital-stark & einordnungsaffin"
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Bild-URL</Label>
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="h-8 text-sm"
                />
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Vorschau"
                    className="mt-2 h-16 w-16 rounded-full object-cover"
                  />
                )}
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Alter</Label>
                  <Input
                    type="number"
                    value={data.kurzprofil.alter}
                    onChange={(e) =>
                      updateKurzprofil("alter", parseInt(e.target.value) || 0)
                    }
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Geschlecht</Label>
                  <Input
                    value={data.kurzprofil.geschlecht}
                    onChange={(e) => updateKurzprofil("geschlecht", e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">Familie</Label>
                <Input
                  value={data.kurzprofil.familie}
                  onChange={(e) => updateKurzprofil("familie", e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Bildung</Label>
                <Input
                  value={data.kurzprofil.bildung}
                  onChange={(e) => updateKurzprofil("bildung", e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Beruf</Label>
                <Input
                  value={data.kurzprofil.beruf}
                  onChange={(e) => updateKurzprofil("beruf", e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Zitat</Label>
                <Input
                  value={data.zitat}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, zitat: e.target.value }))
                  }
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">
                  Eigenschaften (eine pro Zeile)
                </Label>
                <Textarea
                  value={data.kurzprofil.eigenschaften.join("\n")}
                  onChange={(e) =>
                    updateKurzprofil(
                      "eigenschaften",
                      e.target.value.split("\n").filter(Boolean)
                    )
                  }
                  rows={3}
                  className="text-sm"
                />
              </div>
            </TabsContent>

            <TabsContent value="eigenschaften" className="space-y-3 pr-3 mt-0">
              <div>
                <Label className="text-xs mb-2 block">
                  Kerneigenschaften (1-5)
                </Label>
                {data.kerneigenschaften.map((k, i) => (
                  <div key={k.name} className="flex items-center gap-3 mb-2">
                    <span className="text-xs w-36 shrink-0">{k.name}</span>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={k.wert}
                      onChange={(e) =>
                        updateKerneigenschaft(i, parseInt(e.target.value))
                      }
                      className="flex-1 accent-primary"
                    />
                    <span className="text-xs w-4 text-right">{k.wert}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div>
                <Label className="text-xs">
                  Bedürfnisse & Motive (eine pro Zeile)
                </Label>
                <Textarea
                  value={data.beduerfnisseMotive.join("\n")}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      beduerfnisseMotive: e.target.value
                        .split("\n")
                        .filter(Boolean),
                    }))
                  }
                  rows={4}
                  className="text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">
                  Markentreue (Format: Marke | Wohnort | Einkommen, eine pro Zeile)
                </Label>
                <Textarea
                  value={data.markentreue
                    .map((m) => `${m.marke} | ${m.wohnort} | ${m.einkommen}`)
                    .join("\n")}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      markentreue: e.target.value
                        .split("\n")
                        .filter(Boolean)
                        .map((line) => {
                          const [marke, wohnort, einkommen] = line
                            .split("|")
                            .map((s) => s.trim());
                          return {
                            marke: marke || "",
                            wohnort: wohnort || "",
                            einkommen: einkommen || "",
                          };
                        }),
                    }))
                  }
                  rows={3}
                  className="text-sm"
                />
              </div>
            </TabsContent>

            <TabsContent value="emotionen" className="space-y-3 pr-3 mt-0">
              <div>
                <Label className="text-xs">
                  Emotionale Treiber (eine pro Zeile)
                </Label>
                <Textarea
                  value={data.emotionaleTreiber.join("\n")}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      emotionaleTreiber: e.target.value
                        .split("\n")
                        .filter(Boolean),
                    }))
                  }
                  rows={4}
                  className="text-sm"
                />
              </div>
              <Separator />
              <div>
                <Label className="text-xs">Hauptsegment</Label>
                <Input
                  value={data.emotionaleSegmente.hauptsegment}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      emotionaleSegmente: {
                        ...prev.emotionaleSegmente,
                        hauptsegment: e.target.value,
                      },
                    }))
                  }
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Sekundäre Segmente</Label>
                <Input
                  value={data.emotionaleSegmente.sekundaereSegmente}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      emotionaleSegmente: {
                        ...prev.emotionaleSegmente,
                        sekundaereSegmente: e.target.value,
                      },
                    }))
                  }
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Kurzbegründung</Label>
                <Textarea
                  value={data.emotionaleSegmente.kurzbegruendung}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      emotionaleSegmente: {
                        ...prev.emotionaleSegmente,
                        kurzbegruendung: e.target.value,
                      },
                    }))
                  }
                  rows={2}
                  className="text-sm"
                />
              </div>
            </TabsContent>

            <TabsContent value="produkt" className="space-y-3 pr-3 mt-0">
              <p className="text-xs text-muted-foreground">
                Produkt-Fit Einträge. Format pro Eintrag: Zeile 1 = Produktname |
                Typ, weitere Zeilen = Beschreibungspunkte. Einträge durch leere
                Zeile trennen.
              </p>
              <Textarea
                value={data.produktFit
                  .map(
                    (pf) =>
                      `${pf.produkt} | ${pf.typ}\n${pf.beschreibung.join("\n")}`
                  )
                  .join("\n\n")}
                onChange={(e) => {
                  const blocks = e.target.value
                    .split("\n\n")
                    .filter(Boolean);
                  const produktFit = blocks.map((block) => {
                    const lines = block.split("\n").filter(Boolean);
                    const [header, ...rest] = lines;
                    const [produkt, typ] = (header || "")
                      .split("|")
                      .map((s) => s.trim());
                    return {
                      produkt: produkt || "",
                      typ: typ || "Produkt",
                      beschreibung: rest,
                    };
                  });
                  setData((prev) => ({ ...prev, produktFit }));
                }}
                rows={10}
                className="text-sm font-mono"
              />
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="flex justify-end gap-2 border-t px-4 py-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Abbrechen
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!name.trim() || !type.trim() || saving}
          >
            {saving ? "Speichern..." : persona ? "Aktualisieren" : "Erstellen"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
