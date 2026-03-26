"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { parseQuickTakes } from "@/lib/parse-quick-takes";
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

// Pre-set pin positions for auto-distribution
const PIN_POSITIONS: Record<number, Array<{ top: string; left: string }>> = {
  1: [{ top: "50%", left: "50%" }],
  2: [
    { top: "25%", left: "20%" },
    { top: "75%", left: "80%" },
  ],
  3: [
    { top: "20%", left: "15%" },
    { top: "50%", left: "82%" },
    { top: "80%", left: "45%" },
  ],
  4: [
    { top: "20%", left: "15%" },
    { top: "20%", left: "82%" },
    { top: "78%", left: "15%" },
    { top: "78%", left: "82%" },
  ],
};

function getPinPositions(count: number) {
  if (count <= 4) return PIN_POSITIONS[count] || PIN_POSITIONS[1];
  // For 5+, distribute in a grid
  const positions: Array<{ top: string; left: string }> = [];
  const cols = Math.ceil(Math.sqrt(count));
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const rows = Math.ceil(count / cols);
    positions.push({
      top: `${20 + (row * 60) / Math.max(rows - 1, 1)}%`,
      left: `${15 + (col * 70) / Math.max(cols - 1, 1)}%`,
    });
  }
  return positions;
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

  const quickTakes = aiResponseText
    ? parseQuickTakes(aiResponseText, personas)
    : [];

  const pinPositions = getPinPositions(personas.length);

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
      <div
        ref={wrapperRef}
        className="border-b-2 border-border"
      >
        <div className="flex flex-col md:flex-row" style={{ height: "clamp(280px, 45vh, 420px)" }}>
          {/* Left: Design Canvas */}
          <div className="flex-1 min-w-0 border-r border-border flex flex-col bg-black/20">
            {/* Canvas area */}
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

              {/* Comment Pins */}
              {personas.map((persona, i) => {
                const pos = pinPositions[i];
                if (!pos) return null;
                const color = getPersonaColor(i);
                return (
                  <div
                    key={persona.id}
                    className="absolute w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white cursor-default transition-transform hover:scale-110 z-10"
                    style={{
                      top: pos.top,
                      left: pos.left,
                      backgroundColor: color,
                      boxShadow: `0 2px 12px ${color}66`,
                      transform: "translate(-50%, -50%)",
                    }}
                    title={persona.name}
                  >
                    {persona.name[0]}
                  </div>
                );
              })}
            </div>

            {/* Persona Legend */}
            <div className="px-3 py-2 border-t border-border flex flex-wrap gap-3 text-xs text-muted-foreground">
              {personas.map((persona, i) => (
                <span key={persona.id} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: getPersonaColor(i) }}
                  />
                  {persona.name}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Quick Takes */}
          <div className="flex-1 min-w-0 flex flex-col bg-background md:max-w-[50%]">
            <div className="px-3 py-2 border-b border-border">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                Quick Takes
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {personas.map((persona, i) => {
                const take = quickTakes.find((t) => t.personaId === persona.id);
                const color = getPersonaColor(i);
                return (
                  <div key={persona.id} className="flex gap-2.5 items-start">
                    <div
                      className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ backgroundColor: color }}
                    >
                      {persona.image_url ? (
                        <Image
                          src={persona.image_url}
                          alt={persona.name}
                          width={24}
                          height={24}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        persona.name[0]
                      )}
                    </div>
                    <div className="min-w-0">
                      <div
                        className="text-[11px] font-semibold"
                        style={{ color }}
                      >
                        {persona.name}
                      </div>
                      {take && take.text !== "..." ? (
                        <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          {take.text}
                        </div>
                      ) : aiResponseText ? (
                        <div className="text-xs text-muted-foreground/50 mt-0.5">
                          ...
                        </div>
                      ) : (
                        <Skeleton className="h-3 w-32 mt-1" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Floating PiP Card */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 cursor-pointer rounded-lg border border-border bg-background/95 backdrop-blur-sm shadow-xl transition-all duration-300 overflow-hidden group",
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
          <span className="text-[9px] text-white/90 font-medium">↑ Design anzeigen</span>
        </div>
      </div>
    </>
  );
}

export { getPersonaColor, PERSONA_COLORS };
