"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MarkdownRenderer } from "./markdown-renderer";
import { splitAiResponse, type PersonaVoice } from "@/lib/parse-quick-takes";
import { cn } from "@/lib/utils";
import type { Persona } from "@/lib/types";

const PERSONA_COLORS = [
  "#ff6b6b",
  "#4ecdc4",
  "#a78bfa",
  "#ffe66d",
  "#ff9ff3",
  "#48dbfb",
  "#ff6348",
  "#26de81",
];

function getPersonaColor(index: number): string {
  return PERSONA_COLORS[index % PERSONA_COLORS.length];
}

export function DesignReviewWrapper({
  imageUrl,
  personas,
  aiResponseText,
}: {
  imageUrl: string;
  personas: Persona[];
  aiResponseText?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [showPip, setShowPip] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { voices } = aiResponseText
    ? splitAiResponse(aiResponseText, personas)
    : { voices: [] as PersonaVoice[] };

  // IntersectionObserver for floating PiP
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowPip(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    wrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* Split Canvas Wrapper */}
      <div ref={wrapperRef} className="border-b-2 border-border">
        <div
          className="flex flex-col md:flex-row"
          style={{ height: "clamp(300px, 50vh, 500px)" }}
        >
          {/* Left: Design Canvas (clean, no pins) */}
          <div className="flex-1 min-w-0 border-r border-border flex flex-col bg-black/20">
            <div className="flex-1 relative flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
              {!imageLoaded && (
                <Skeleton className="absolute inset-4 rounded-lg" />
              )}
              <img
                src={imageUrl}
                alt="Design for review"
                className={cn(
                  "max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-opacity duration-300",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          </div>

          {/* Right: Persona Voices (Stimmen vom Tisch) */}
          <div className="flex-1 min-w-0 flex flex-col bg-background md:max-w-[50%]">
            <div className="px-3 py-2 border-b border-border">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                Stimmen vom Tisch
              </span>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-3 space-y-4">
                {voices.length > 0
                  ? voices.map((voice, i) => {
                      const persona = personas.find(
                        (p) => p.id === voice.personaId
                      );
                      const color = getPersonaColor(
                        personas.findIndex((p) => p.id === voice.personaId)
                      );
                      return (
                        <div key={voice.personaId} className="space-y-1.5">
                          {/* Persona header */}
                          <div className="flex items-center gap-2">
                            <div
                              className="w-7 h-7 rounded-full flex-shrink-0 overflow-hidden"
                              style={{
                                backgroundColor: color,
                              }}
                            >
                              {persona?.image_url ? (
                                <Image
                                  src={persona.image_url}
                                  alt={voice.name}
                                  width={28}
                                  height={28}
                                  className="rounded-full object-cover w-full h-full"
                                />
                              ) : (
                                <div className="flex items-center justify-center w-full h-full text-[11px] font-bold text-white">
                                  {voice.name[0]}
                                </div>
                              )}
                            </div>
                            <div>
                              <span
                                className="text-sm font-semibold"
                                style={{ color }}
                              >
                                {voice.name}
                              </span>
                              <span className="text-xs text-muted-foreground ml-1.5">
                                {voice.type}
                              </span>
                            </div>
                          </div>
                          {/* Persona voice content */}
                          <div
                            className="pl-9 text-sm leading-relaxed font-serif text-muted-foreground border-l-2"
                            style={{ borderColor: color }}
                          >
                            <MarkdownRenderer content={voice.markdown} />
                          </div>
                        </div>
                      );
                    })
                  : personas.map((persona, i) => {
                      const color = getPersonaColor(i);
                      return (
                        <div key={persona.id} className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-7 h-7 rounded-full flex-shrink-0 overflow-hidden"
                              style={{ backgroundColor: color }}
                            >
                              {persona.image_url ? (
                                <Image
                                  src={persona.image_url}
                                  alt={persona.name}
                                  width={28}
                                  height={28}
                                  className="rounded-full object-cover w-full h-full"
                                />
                              ) : (
                                <div className="flex items-center justify-center w-full h-full text-[11px] font-bold text-white">
                                  {persona.name[0]}
                                </div>
                              )}
                            </div>
                            <div>
                              <span
                                className="text-sm font-semibold"
                                style={{ color }}
                              >
                                {persona.name}
                              </span>
                              <span className="text-xs text-muted-foreground ml-1.5">
                                {persona.type}
                              </span>
                            </div>
                          </div>
                          <div className="pl-9">
                            <Skeleton className="h-3 w-full mt-1" />
                            <Skeleton className="h-3 w-3/4 mt-1.5" />
                          </div>
                        </div>
                      );
                    })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Floating PiP Card */}
      <button
        className={cn(
          "fixed bottom-6 right-6 z-50 cursor-pointer rounded-lg border border-border bg-background/95 backdrop-blur-sm shadow-xl transition-all duration-300 overflow-hidden group p-0",
          showPip
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
        onClick={scrollToTop}
        title="Zurück zum Design"
      >
        <img
          src={imageUrl}
          alt="Design preview"
          className="w-[120px] h-[80px] object-cover group-hover:brightness-110 transition-all"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-1.5">
          <span className="text-[9px] text-white/90 font-medium">
            ↑ Design anzeigen
          </span>
        </div>
      </button>
    </>
  );
}

export { getPersonaColor, PERSONA_COLORS };
