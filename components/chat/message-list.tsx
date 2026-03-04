"use client";

import { useRef, useEffect } from "react";
import type { UIMessage } from "ai";
import { MessageItem } from "./message-item";
import { PersonaGrid } from "./persona-grid";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/hooks/use-app-store";
import type { Persona } from "@/lib/types";

export function MessageList({
  messages,
  status,
  personas,
  loading,
}: {
  messages: UIMessage[];
  status: string;
  personas: Persona[];
  loading?: boolean;
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
            <h2 className="text-4xl font-sans font-bold mb-2">Persona Chat</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Wähle Personas aus und stelle Fragen zu
              Produktentscheidungen, Zielgruppenanalysen oder Content-Strategien.
            </p>
          </div>
          {loading ? (
            <div className="flex items-center justify-center gap-3 h-[320px]">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-[280px] w-[72px] rounded-[2rem] shrink-0"
                />
              ))}
            </div>
          ) : (
            personas.length > 0 && <PersonaGrid personas={personas} />
          )}
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
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="flex items-end gap-0.5">
              {[14, 22, 14].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full bg-muted-foreground/40 animate-pulse"
                  style={{
                    height: h,
                    animationDelay: `${i * 150}ms`,
                    animationDuration: "1s",
                  }}
                />
              ))}
            </div>
            <span
              className="text-sm animate-shimmer bg-[length:200%_100%] bg-clip-text bg-gradient-to-r from-muted-foreground via-foreground to-muted-foreground"
              style={{ WebkitTextFillColor: "transparent" }}
            >
              Denkt nach...
            </span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
