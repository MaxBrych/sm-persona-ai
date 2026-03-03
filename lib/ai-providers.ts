import { createProviderRegistry } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import type { AIModel } from "./types";

export const registry = createProviderRegistry({
  anthropic,
  openai,
  google,
});

export const AVAILABLE_MODELS: AIModel[] = [
  {
    id: "anthropic:claude-sonnet-4-5-20250514",
    name: "Claude Sonnet 4.5",
    provider: "anthropic",
    supportsImages: true,
    supportsReasoning: true,
  },
  {
    id: "anthropic:claude-haiku-4-5-20250514",
    name: "Claude Haiku 4.5",
    provider: "anthropic",
    supportsImages: true,
    supportsReasoning: false,
  },
  {
    id: "openai:gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    supportsImages: true,
    supportsReasoning: false,
  },
  {
    id: "openai:gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    supportsImages: true,
    supportsReasoning: false,
  },
  {
    id: "google:gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "google",
    supportsImages: true,
    supportsReasoning: false,
  },
];

export const DEFAULT_MODEL = "anthropic:claude-sonnet-4-5-20250514";

export function getModelInfo(modelId: string): AIModel | undefined {
  return AVAILABLE_MODELS.find((m) => m.id === modelId);
}
