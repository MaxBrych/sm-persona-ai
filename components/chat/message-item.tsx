"use client";

import type { UIMessage } from "ai";
import { RefreshCw, Copy, Check, ThumbsUp, ThumbsDown } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { MarkdownRenderer } from "./markdown-renderer";
import { ThinkingIndicator } from "./thinking-indicator";
import { cn } from "@/lib/utils";

export function MessageItem({
  message,
  isStreaming,
  onRegenerate,
  activeChatId,
  overrideContent,
  hideImages,
}: {
  message: UIMessage;
  isStreaming?: boolean;
  onRegenerate?: () => void;
  activeChatId?: string | null;
  overrideContent?: string;
  hideImages?: boolean;
}) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"thumbs_up" | "thumbs_down" | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const messageContent = message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");

  const handleFeedback = async (type: "thumbs_up" | "thumbs_down") => {
    const newFeedback = feedback === type ? null : type;
    setFeedback(newFeedback);

    if (!activeChatId) return;
    await supabase
      .from("messages")
      .update({ feedback: newFeedback })
      .eq("chat_id", activeChatId)
      .eq("role", "assistant")
      .eq("content", messageContent);
  };

  return (
    <div
      className={cn(
        "px-4 py-3",
        isUser ? "flex flex-col items-end" : ""
      )}
    >
      <div
        className={cn(
          isUser ? "max-w-[80%] flex flex-col items-end gap-2" : "max-w-none"
        )}
      >
        {/* When overrideContent is provided, render it instead of normal text parts */}
        {overrideContent !== undefined && !isUser ? (
          <div className="font-serif text-[15px] leading-relaxed">
            <MarkdownRenderer content={overrideContent} />
          </div>
        ) : message.parts.map((part, index) => {
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
              if (hideImages && part.mediaType?.startsWith("image/")) return null;
              if (part.mediaType?.startsWith("image/")) {
                const isLoaded = loadedImages.has(index);
                return (
                  <div key={index} className="relative">
                    {!isLoaded && (
                      <Skeleton
                        className={cn(
                          "rounded-lg",
                          isUser ? "h-48 w-48" : "h-64 w-64"
                        )}
                      />
                    )}
                    <img
                      src={part.url}
                      alt={part.filename || ""}
                      className={cn(
                        "rounded-lg",
                        isUser ? "max-h-48 max-w-48" : "max-h-64 max-w-xs",
                        "cursor-pointer hover:opacity-90 transition-opacity",
                        !isLoaded && "absolute top-0 left-0 opacity-0"
                      )}
                      onLoad={() => setLoadedImages((prev) => new Set(prev).add(index))}
                      onClick={() => setLightboxUrl(part.url)}
                    />
                  </div>
                );
              }
              return null;
            default:
              return null;
          }
        })}
      </div>
      {!isUser && !isStreaming && (
        <div className="flex items-center gap-1 mt-1.5">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-7 w-7 cursor-pointer",
              feedback === "thumbs_up" ? "text-green-600" : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => handleFeedback("thumbs_up")}
          >
            <ThumbsUp className={cn("h-3.5 w-3.5", feedback === "thumbs_up" && "fill-current")} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-7 w-7 cursor-pointer",
              feedback === "thumbs_down" ? "text-red-500" : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => handleFeedback("thumbs_down")}
          >
            <ThumbsDown className={cn("h-3.5 w-3.5", feedback === "thumbs_down" && "fill-current")} />
          </Button>
          {onRegenerate && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={onRegenerate}
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(globalThis.location.href);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
        </div>
      )}

      <Dialog open={!!lightboxUrl} onOpenChange={() => setLightboxUrl(null)}>
        <DialogContent className="max-w-4xl p-2 bg-transparent border-none shadow-none">
          <DialogTitle className="sr-only">Bild-Vorschau</DialogTitle>
          {lightboxUrl && (
            <img
              src={lightboxUrl}
              alt=""
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
