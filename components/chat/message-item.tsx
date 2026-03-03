"use client";

import type { UIMessage } from "ai";
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
        "px-4 py-3",
        isUser ? "flex justify-end" : ""
      )}
    >
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
                    className="inline-block rounded-2xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-sans leading-relaxed"
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
    </div>
  );
}
