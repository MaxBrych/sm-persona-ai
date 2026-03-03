// === Persona Types ===

export interface PersonaKurzprofil {
  alter: number;
  geschlecht: string;
  familie: string;
  bildung: string;
  beruf: string;
  eigenschaften: string[];
}

export interface PersonaMarkentreue {
  marke: string;
  wohnort: string;
  einkommen: string;
}

export interface PersonaKerneigenschaft {
  name: string;
  wert: number; // 1-5
}

export interface PersonaEmotionaleSegmente {
  hauptsegment: string;
  sekundaereSegmente: string;
  kurzbegruendung: string;
}

export interface PersonaProduktFit {
  produkt: string;
  typ: string; // "Produkt" | "Touchpoint"
  beschreibung: string[];
}

export interface PersonaData {
  kurzprofil: PersonaKurzprofil;
  markentreue: PersonaMarkentreue[];
  zitat: string;
  beduerfnisseMotive: string[];
  kerneigenschaften: PersonaKerneigenschaft[];
  emotionaleTreiber: string[];
  emotionaleSegmente: PersonaEmotionaleSegmente;
  produktFit: PersonaProduktFit[];
}

export interface Persona {
  id: string;
  name: string;
  type: string;
  category: string;
  data: PersonaData;
  created_at: string;
  updated_at: string;
}

// === Chat Types ===

export interface Chat {
  id: string;
  title: string;
  model: string;
  persona_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  parts: unknown;
  created_at: string;
}

// === AI Model Types ===

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  supportsImages: boolean;
  supportsReasoning: boolean;
}
