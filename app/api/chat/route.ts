import { streamText, type UIMessage } from "ai";
import { convertToModelMessages } from "ai";
import { registry } from "@/lib/ai-providers";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Persona } from "@/lib/types";

export const maxDuration = 60;

export async function POST(req: Request) {
  const {
    messages,
    model: modelId,
    personaIds,
  }: {
    messages: UIMessage[];
    model: string;
    personaIds: string[];
  } = await req.json();

  // Fetch persona data for system prompt
  const supabase = createServerSupabase();
  let systemPrompt =
    "Du bist ein hilfreicher KI-Assistent der Schwäbisch Media / Schwäbische Verlag Redaktion. Antworte auf Deutsch, es sei denn der Nutzer schreibt auf Englisch.";

  if (personaIds && personaIds.length > 0) {
    const { data: personas } = await supabase
      .from("personas")
      .select("*")
      .in("id", personaIds);

    if (personas && personas.length > 0) {
      systemPrompt = buildPersonaSystemPrompt(personas as Persona[]);
    }
  }

  const result = streamText({
    model: registry.languageModel(modelId as Parameters<typeof registry.languageModel>[0]),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
  });
}

function buildPersonaSystemPrompt(personas: Persona[]): string {
  const personaDescriptions = personas
    .map((p) => {
      const d = p.data;
      return `
## Persona: ${p.name} (${p.type})
**Kategorie**: ${p.category}

### Kurzprofil
- Alter: ${d.kurzprofil.alter} Jahre, ${d.kurzprofil.geschlecht}
- Familie: ${d.kurzprofil.familie}
- Bildung: ${d.kurzprofil.bildung}
- Beruf: ${d.kurzprofil.beruf}
- Eigenschaften: ${d.kurzprofil.eigenschaften.join("; ")}

### Zitat
„${d.zitat}"

### Bedürfnisse & Motive
${d.beduerfnisseMotive.map((b) => `- ${b}`).join("\n")}

### Kerneigenschaften (Skala 1-5)
${d.kerneigenschaften.map((k) => `- ${k.name}: ${k.wert}/5`).join("\n")}

### Emotionale Treiber
${d.emotionaleTreiber.map((e) => `- ${e}`).join("\n")}

### Emotionale Segmente
- Hauptsegment: ${d.emotionaleSegmente.hauptsegment}
- Sekundäre Segmente: ${d.emotionaleSegmente.sekundaereSegmente}
- Begründung: ${d.emotionaleSegmente.kurzbegruendung}

### Markentreue
${d.markentreue.map((m) => `- ${m.marke}: Wohnort ${m.wohnort}, Einkommen ${m.einkommen}`).join("\n")}

### Produkt-Fit
${d.produktFit.map((pf) => `- **${pf.produkt}** (${pf.typ}): ${pf.beschreibung.join("; ")}`).join("\n")}
`;
    })
    .join("\n---\n");

  return `Du bist ein KI-Assistent der Schwäbisch Media (Schwäbische Verlag, der auch den Nordkurier besitzt). Du hilfst dem Produktteam, nutzerzentrierte Produktentscheidungen zu treffen.

Berücksichtige bei deinen Antworten IMMER die folgenden Leser-Personas. Analysiere Fragen, Inhalte und Produktideen im Kontext dieser Zielgruppen. Antworte auf Deutsch, es sei denn der Nutzer schreibt auf Englisch.

Wenn der Nutzer ein Bild teilt, analysiere es im Kontext der Personas (z.B. UI-Screenshots, Produktentwürfe, Wettbewerbsanalysen).

${personaDescriptions}

---

## Anweisungen für deine Antworten:
1. Beziehe dich **konkret** auf die relevanten Personas mit Namen
2. Berücksichtige ihre Bedürfnisse, emotionalen Treiber und Mediennutzung
3. Bewerte den Produkt-Fit für die jeweiligen Personas
4. Nutze die Kerneigenschaften-Ratings (1-5) für quantitative Einschätzungen
5. Wenn mehrere Personas ausgewählt sind, vergleiche deren unterschiedliche Perspektiven
6. Gib konkrete, umsetzbare Empfehlungen für Produktentscheidungen
`;
}
