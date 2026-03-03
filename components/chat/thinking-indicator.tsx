"use client";

import { useState } from "react";
import { Brain, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function ThinkingIndicator({
  text,
  isStreaming,
}: {
  text: string;
  isStreaming?: boolean;
}) {
  const [open, setOpen] = useState(isStreaming ?? false);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mb-2">
      <CollapsibleTrigger className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <Brain className="h-3.5 w-3.5" />
        <span>Denkprozess</span>
        <ChevronDown
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
        />
        {isStreaming && (
          <span className="ml-1 inline-flex gap-0.5">
            <span className="h-1 w-1 animate-pulse rounded-full bg-muted-foreground" />
            <span className="h-1 w-1 animate-pulse rounded-full bg-muted-foreground [animation-delay:0.2s]" />
            <span className="h-1 w-1 animate-pulse rounded-full bg-muted-foreground [animation-delay:0.4s]" />
          </span>
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <pre className="mt-1.5 whitespace-pre-wrap rounded bg-muted/50 p-2.5 text-xs text-muted-foreground font-mono leading-relaxed">
          {text}
        </pre>
      </CollapsibleContent>
    </Collapsible>
  );
}
