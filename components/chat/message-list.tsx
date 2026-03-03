"use client";

import { useRef, useEffect } from "react";
import type { UIMessage } from "ai";
import { MessageItem } from "./message-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

export function MessageList({
  messages,
  status,
}: {
  messages: UIMessage[];
  status: string;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const isStreaming = status === "streaming";
  const isSubmitted = status === "submitted";

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center px-8">
        <div className="max-w-md text-center">
          <h2 className="text-lg font-semibold mb-2">Persona AI Chat</h2>
          <p className="text-sm text-muted-foreground">
            Wähle Personas im rechten Panel aus und stelle Fragen zu
            Produktentscheidungen, Zielgruppenanalysen oder Content-Strategien.
          </p>
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
