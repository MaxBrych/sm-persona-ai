"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ArrowUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Zoom/pan state
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });
  const translateStart = useRef({ x: 0, y: 0 });

  const { voices } = aiResponseText
    ? splitAiResponse(aiResponseText, personas)
    : { voices: [] as PersonaVoice[] };

  // IntersectionObserver for sticky header
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyHeader(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    wrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Zoom with mouse wheel
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prev) => Math.min(Math.max(prev * delta, 0.5), 5));
  }, []);

  // Pan with mouse drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (scale <= 1) return;
    e.preventDefault();
    setIsPanning(true);
    panStart.current = { x: e.clientX, y: e.clientY };
    translateStart.current = { ...translate };
  }, [scale, translate]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    setTranslate({
      x: translateStart.current.x + (e.clientX - panStart.current.x),
      y: translateStart.current.y + (e.clientY - panStart.current.y),
    });
  }, [isPanning]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Double-click to reset zoom
  const handleDoubleClick = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  // Strip blockquote markers from voice markdown for plain text rendering
  const cleanVoiceText = (markdown: string) => {
    return markdown
      .replace(/^>\s*/gm, "") // Remove blockquote markers
      .trim();
  };

  return (
    <>
      {/* Sticky Header Bar (48px) */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-12 border-b border-border bg-background/95 backdrop-blur-sm transition-all duration-300 flex items-center px-4 gap-3",
          showStickyHeader
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        )}
      >
        {/* Thumbnail */}
        <div className="h-8 w-12 rounded overflow-hidden flex-shrink-0 border border-border">
          <img
            src={imageUrl}
            alt="Design"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Stacked persona avatars */}
        <div className="flex -space-x-2">
          {personas.map((persona) => (
            <div
              key={persona.id}
              className="relative h-7 w-7 rounded-full ring-2 ring-background overflow-hidden flex-shrink-0"
            >
              {persona.image_url ? (
                <Image
                  src={persona.image_url}
                  alt={persona.name}
                  fill
                  className="object-cover"
                  sizes="28px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted text-xs font-semibold">
                  {persona.name[0]}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Persona names */}
        <span className="text-xs text-muted-foreground truncate">
          {personas.map((p) => p.name).join(", ")}
        </span>

        {/* Scroll to top button */}
        <button
          onClick={scrollToTop}
          className="ml-auto h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors cursor-pointer flex-shrink-0"
          title="Zurück zum Design"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>

      {/* Split Canvas Wrapper */}
      <div ref={wrapperRef} className="border-b-2 border-border">
        <div
          className="flex flex-col md:flex-row"
          style={{ height: "clamp(300px, 50vh, 500px)" }}
        >
          {/* Left: Zoomable Design Canvas */}
          <div className="flex-1 min-w-0 border-r border-border flex flex-col">
            <div
              ref={canvasRef}
              className={cn(
                "flex-1 relative overflow-hidden",
                scale > 1 ? "cursor-grab" : "cursor-zoom-in",
                isPanning && "cursor-grabbing"
              )}
              style={{
                backgroundColor: "#f5f5f5",
                backgroundImage: "radial-gradient(circle, #d0d0d0 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onDoubleClick={handleDoubleClick}
            >
              <div
                className="w-full h-full flex items-center justify-center transition-transform"
                style={{
                  transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                  transitionDuration: isPanning ? "0ms" : "150ms",
                }}
              >
                {!imageLoaded && (
                  <Skeleton className="absolute inset-4 rounded-lg" />
                )}
                <img
                  src={imageUrl}
                  alt="Design for review"
                  className={cn(
                    "max-w-[95%] max-h-[95%] object-contain rounded-lg shadow-2xl transition-opacity duration-300 select-none",
                    imageLoaded ? "opacity-100" : "opacity-0"
                  )}
                  onLoad={() => setImageLoaded(true)}
                  draggable={false}
                />
              </div>

              {/* Zoom indicator */}
              {scale !== 1 && (
                <div className="absolute bottom-2 left-2 text-[10px] text-muted-foreground bg-background/80 px-2 py-0.5 rounded backdrop-blur-sm">
                  {Math.round(scale * 100)}% · doppelklick zum zurücksetzen
                </div>
              )}
            </div>
          </div>

          {/* Right: Persona Voices as chat comments */}
          <div className="flex-1 min-w-0 min-h-0 flex flex-col bg-background md:max-w-[50%] overflow-hidden">
            <div className="px-3 py-2 border-b border-border">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                Stimmen vom Tisch
              </span>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-3 space-y-3">
                {voices.length > 0
                  ? voices.map((voice) => {
                      const persona = personas.find(
                        (p) => p.id === voice.personaId
                      );
                      const color = getPersonaColor(
                        personas.findIndex((p) => p.id === voice.personaId)
                      );
                      return (
                        <div key={voice.personaId} className="flex gap-2.5 items-start">
                          {/* Avatar */}
                          <div
                            className="w-7 h-7 rounded-full flex-shrink-0 overflow-hidden mt-0.5"
                            style={{ backgroundColor: color }}
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
                          {/* Comment body */}
                          <div className="min-w-0 flex-1">
                            <div className="inline">
                              <span
                                className="text-[13px] font-semibold mr-1.5"
                                style={{ color }}
                              >
                                {voice.name}
                              </span>
                              <span className="text-[13px] text-foreground leading-relaxed">
                                {cleanVoiceText(voice.markdown)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : personas.map((persona, i) => {
                      const color = getPersonaColor(i);
                      return (
                        <div key={persona.id} className="flex gap-2.5 items-start">
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
                          <div className="min-w-0 flex-1">
                            <span
                              className="text-[13px] font-semibold mr-1.5"
                              style={{ color }}
                            >
                              {persona.name}
                            </span>
                            <Skeleton className="h-3 w-full mt-1 inline-block" />
                          </div>
                        </div>
                      );
                    })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </>
  );
}

export { getPersonaColor, PERSONA_COLORS };
