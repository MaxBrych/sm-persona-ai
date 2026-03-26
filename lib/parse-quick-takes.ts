import type { Persona } from "./types";

export interface QuickTake {
  personaId: string;
  name: string;
  text: string;
}

/**
 * Extract the first sentence of each persona's feedback from the AI markdown response.
 * Looks for bold persona names (**Name**) or heading patterns (### Name).
 */
export function parseQuickTakes(
  markdown: string,
  personas: Persona[]
): QuickTake[] {
  if (!markdown || personas.length === 0) return [];

  const takes: QuickTake[] = [];

  for (const persona of personas) {
    // Match patterns like **Niklas**, ### Niklas, **Niklas (Neokultureller)**
    const escaped = persona.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(
      `(?:\\*\\*${escaped}[^*]*\\*\\*|###?\\s*${escaped}[^\\n]*)\\s*[:\\n]?\\s*([^\\n]+)`,
      "i"
    );
    const match = markdown.match(pattern);

    if (match?.[1]) {
      // Extract first sentence (up to first period, exclamation, or question mark)
      const firstSentence = match[1]
        .replace(/^\s*[:\-–—]\s*/, "")
        .match(/^[^.!?]+[.!?]?/)?.[0]
        ?.trim();

      if (firstSentence && firstSentence.length > 5) {
        takes.push({
          personaId: persona.id,
          name: persona.name,
          text: firstSentence,
        });
        continue;
      }
    }

    // Fallback: no match found
    takes.push({
      personaId: persona.id,
      name: persona.name,
      text: "...",
    });
  }

  return takes;
}
