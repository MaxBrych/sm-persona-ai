"use client";

import { useRef, useEffect } from "react";
import type { UIMessage } from "ai";
import { MessageItem } from "./message-item";
import { PersonaGrid } from "./persona-grid";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { useAppStore } from "@/hooks/use-app-store";
import type { Persona } from "@/lib/types";

export function MessageList({
  messages,
  status,
  personas,
}: {
  messages: UIMessage[];
  status: string;
  personas: Persona[];
}) {
  const { selectedPersonaIds } = useAppStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const isStreaming = status === "streaming";
  const isSubmitted = status === "submitted";

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center px-8">
        <div className="text-center space-y-6">
          <div>
            <h2 className="text-2xl font-serif font-bold mb-2">Persona AI</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Wähle Personas aus und stelle Fragen zu
              Produktentscheidungen, Zielgruppenanalysen oder Content-Strategien.
            </p>
          </div>
          {personas.length > 0 && <PersonaGrid personas={personas} />}
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="mx-auto max-w-3xl py-4">
        {messages.map((message, index) => (
          <MessageItem
            key={message.id}
            message={message}
            personas={personas}
            selectedPersonaIds={selectedPersonaIds}
            isStreaming={
              isStreaming && index === messages.length - 1 && message.role === "assistant"
            }
          />
        ))}

        {isSubmitted && (
          <div className="flex gap-3 px-4 py-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            </div>
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground">Denkt nach...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
