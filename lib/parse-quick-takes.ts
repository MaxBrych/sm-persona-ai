import type { Persona } from "./types";

export interface PersonaVoice {
  personaId: string;
  name: string;
  type: string;
  markdown: string;
}

export interface SplitResponse {
  voices: PersonaVoice[];
  rest: string;
}

/**
 * Split the AI markdown response into persona voices ("Stimmen vom Tisch")
 * and the remaining analysis sections.
 */
export function splitAiResponse(
  markdown: string,
  personas: Persona[]
): SplitResponse {
  if (!markdown || personas.length === 0) {
    return { voices: [], rest: markdown || "" };
  }

  // Find the "Stimmen vom Tisch" section
  const stimmenMatch = markdown.match(
    /###?\s*Stimmen vom Tisch\s*\n/i
  );

  if (!stimmenMatch || stimmenMatch.index === undefined) {
    // Single persona format or no section found — return as-is
    return { voices: [], rest: markdown };
  }

  const stimmenStart = stimmenMatch.index + stimmenMatch[0].length;

  // Find the next ### heading after Stimmen vom Tisch
  const afterStimmen = markdown.slice(stimmenStart);
  const nextSectionMatch = afterStimmen.match(/\n###?\s+(?!Stimmen)/);
  const stimmenEnd = nextSectionMatch?.index !== undefined
    ? stimmenStart + nextSectionMatch.index
    : markdown.length;

  const stimmenBlock = markdown.slice(stimmenStart, stimmenEnd).trim();
  const rest = nextSectionMatch?.index !== undefined
    ? markdown.slice(stimmenEnd).trim()
    : "";

  // Parse individual persona blocks from the Stimmen section
  const voices: PersonaVoice[] = [];

  for (const persona of personas) {
    const escaped = persona.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Match **Name** (Type): or **Name (Type):**
    const pattern = new RegExp(
      `\\*\\*${escaped}\\*\\*\\s*\\([^)]+\\)\\s*:?|\\*\\*${escaped}\\s*\\([^)]+\\)\\s*\\*\\*\\s*:?`,
      "i"
    );
    const match = stimmenBlock.match(pattern);

    if (match && match.index !== undefined) {
      const blockStart = match.index + match[0].length;

      // Find the next persona block or end of section
      let blockEnd = stimmenBlock.length;
      for (const otherPersona of personas) {
        if (otherPersona.id === persona.id) continue;
        const otherEscaped = otherPersona.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const otherPattern = new RegExp(
          `\\*\\*${otherEscaped}\\*\\*\\s*\\(|\\*\\*${otherEscaped}\\s*\\(`,
          "i"
        );
        const otherMatch = stimmenBlock.slice(blockStart).match(otherPattern);
        if (otherMatch?.index !== undefined && blockStart + otherMatch.index < blockEnd) {
          blockEnd = blockStart + otherMatch.index;
        }
      }

      const blockText = stimmenBlock.slice(blockStart, blockEnd).trim();

      voices.push({
        personaId: persona.id,
        name: persona.name,
        type: persona.type,
        markdown: blockText,
      });
    }
  }

  return { voices, rest };
}
