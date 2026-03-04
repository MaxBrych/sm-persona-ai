"use client";

import Image from "next/image";
import type { UIMessage } from "ai";
import { RefreshCw, Share2, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "./markdown-renderer";
import { ThinkingIndicator } from "./thinking-indicator";
import { cn } from "@/lib/utils";
import type { Persona } from "@/lib/types";

export function MessageItem({
  message,
  isStreaming,
  personas,
  selectedPersonaIds,
  onRegenerate,
  allMessages,
}: {
  message: UIMessage;
  isStreaming?: boolean;
  personas?: Persona[];
  selectedPersonaIds?: string[];
  onRegenerate?: () => void;
  allMessages?: UIMessage[];
}) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const selectedPersonas =
    isUser && personas && selectedPersonaIds
      ? personas.filter((p) => selectedPersonaIds.includes(p.id))
      : [];

  return (
    <div
      className={cn(
        "px-4 py-3",
        isUser ? "flex flex-col items-end" : ""
      )}
    >
      {selectedPersonas.length > 0 && (
        <div className="flex -space-x-2 mb-1.5 mr-1">
          {selectedPersonas.map((persona) => (
            <div
              key={persona.id}
              className="relative h-6 w-6 rounded-full ring-2 ring-background overflow-hidden bg-muted"
            >
              {persona.image_url ? (
                <Image
                  src={persona.image_url}
                  alt={persona.name}
                  fill
                  className="object-cover"
                  sizes="24px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] font-medium text-muted-foreground">
                  {persona.name[0]}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div
        className={cn(
          isUser ? "max-w-[80%]" : "max-w-none"
        )}
      >
        {message.parts.map((part, index) => {
          switch (part.type) {
            case "text":
              if (!part.text) return null;
              if (isUser) {
                return (
                  <div
                    key={index}
                    className="inline-block rounded-2xl rounded-tr-none bg-muted text-foreground px-4 py-2.5 text-sm font-sans leading-relaxed"
                  >
                    <p className="whitespace-pre-wrap">{part.text}</p>
                  </div>
                );
              }
              return (
                <div key={index} className="font-serif text-[15px] leading-relaxed">
                  <MarkdownRenderer content={part.text} />
                </div>
              );
            case "reasoning":
              return (
                <ThinkingIndicator
                  key={index}
                  text={part.text}
                  isStreaming={isStreaming}
                />
              );
            case "file":
              if (part.mediaType?.startsWith("image/")) {
                return (
                  <img
                    key={index}
                    src={part.url}
                    alt=""
                    className="max-w-sm rounded-lg"
                  />
                );
              }
              return null;
            default:
              return null;
          }
        })}
      </div>
      {!isUser && onRegenerate && !isStreaming && (
        <div className="flex items-center gap-1 mt-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={onRegenerate}
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={() => {
              if (!allMessages) return;
              const text = allMessages
                .map((m) => {
                  const role = m.role === "user" ? "Du" : "Persona AI";
                  const content = m.parts
                    .filter((p): p is { type: "text"; text: string } => p.type === "text")
                    .map((p) => p.text)
                    .join("");
                  return `${role}:\n${content}`;
                })
                .join("\n\n---\n\n");
              if (navigator.share) {
                navigator.share({ title: "Persona AI Konversation", text });
              } else {
                navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }
            }}
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
          </Button>
        </div>
      )}
    </div>
  );
}
