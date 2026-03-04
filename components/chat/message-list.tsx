"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import type { UIMessage } from "ai";
import { MessageItem } from "./message-item";
import { PersonaGrid } from "./persona-grid";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/hooks/use-app-store";
import type { Persona } from "@/lib/types";

export function MessageList({
  messages,
  status,
  personas,
  loading,
  onRegenerate,
  activeChatId,
  optimisticMessage,
}: {
  messages: UIMessage[];
  status: string;
  personas: Persona[];
  loading?: boolean;
  onRegenerate?: () => void;
  activeChatId?: string | null;
  optimisticMessage?: { text: string; filePreviews: string[] } | null;
}) {
  const { selectedPersonaIds } = useAppStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status, optimisticMessage]);

  const isStreaming = status === "streaming";
  const isSubmitted = status === "submitted";

  if (messages.length === 0 && !optimisticMessage) {
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

  const activePersonas = personas.filter((p) => selectedPersonaIds.includes(p.id));

  return (
    <ScrollArea className="h-full">
      <div className="mx-auto max-w-3xl py-4">
        {activePersonas.length > 0 && (
          <div className="flex items-center gap-1 px-4 pb-3">
            <div className="flex -space-x-2">
              {activePersonas.map((p) => (
                <div key={p.id} className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full ring-2 ring-background">
                  {p.image_url ? (
                    <Image src={p.image_url} alt={p.name} fill className="object-cover" sizes="28px" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-xs font-semibold">
                      {p.name[0]}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-1">
              {activePersonas.map((p) => p.name).join(", ")}
            </span>
          </div>
        )}
        {messages.map((message, index) => {
          const isLastAssistant =
            message.role === "assistant" &&
            index === messages.length - 1;
          return (
            <MessageItem
              key={message.id}
              message={message}
              personas={personas}
              selectedPersonaIds={selectedPersonaIds}
              isStreaming={
                isStreaming && isLastAssistant
              }
              onRegenerate={isLastAssistant ? onRegenerate : undefined}
              activeChatId={activeChatId}
            />
          );
        })}

        {optimisticMessage && (
          <div className="px-4 py-3 flex flex-col items-end">
            <div className="max-w-[80%] flex flex-col items-end gap-2">
              {optimisticMessage.filePreviews.map((url, i) => (
                <div key={i} className="relative">
                  <img
                    src={url}
                    alt=""
                    className="max-h-48 max-w-48 rounded-lg opacity-50"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-foreground drop-shadow-md" />
                  </div>
                </div>
              ))}
              {optimisticMessage.text && (
                <div className="inline-block rounded-2xl rounded-tr-none bg-muted text-foreground px-4 py-2.5 text-sm font-sans leading-relaxed">
                  <p className="whitespace-pre-wrap">{optimisticMessage.text}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {isSubmitted && (
          <div className="flex items-center gap-3 px-4 py-3">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
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
