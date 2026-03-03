"use client";

import type { UIMessage } from "ai";
import { Bot, User } from "lucide-react";
import { MarkdownRenderer } from "./markdown-renderer";
import { ThinkingIndicator } from "./thinking-indicator";
import { cn } from "@/lib/utils";

export function MessageItem({
  message,
  isStreaming,
}: {
  message: UIMessage;
  isStreaming?: boolean;
}) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 px-4 py-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
      </div>

      <div
        className={cn(
          "max-w-[80%] space-y-1",
          isUser ? "text-right" : "text-left"
        )}
      >
        {message.parts.map((part, index) => {
          switch (part.type) {
            case "text":
              if (!part.text) return null;
              return (
                <div
                  key={index}
                  className={cn(
                    "inline-block rounded-lg px-3.5 py-2.5 text-sm leading-relaxed",
                    isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{part.text}</p>
                  ) : (
                    <MarkdownRenderer content={part.text} />
                  )}
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
    </div>
  );
}
