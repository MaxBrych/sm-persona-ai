"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowUp, Square, ImagePlus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/hooks/use-app-store";
import { AVAILABLE_MODELS } from "@/lib/ai-providers";
import { cn } from "@/lib/utils";

export function ChatInput({
  onSend,
  status,
  onStop,
}: {
  onSend: (msg: { text: string; files?: FileList }) => void;
  status: string;
  onStop: () => void;
}) {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<FileList | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { selectedModel, setSelectedModel, selectedPersonaIds } = useAppStore();

  const isLoading = status === "streaming" || status === "submitted";
  const hasPersonas = selectedPersonaIds.length > 0;
  const canSend = hasPersonas && !!(input.trim() || files);

  const handleSend = () => {
    if (!canSend) return;
    onSend({ text: input, files });
    setInput("");
    setFiles(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === "Escape" && isLoading) {
      onStop();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);
    }
  };

  return (
    <div className="bg-background px-4 pb-4 pt-2">
      <div className="mx-auto max-w-3xl">
        <div className={cn("rounded-2xl border bg-muted px-4 pt-3 pb-2", !hasPersonas && "opacity-60")}>
          {!hasPersonas && (
            <div className="flex items-center gap-2 pb-2 text-sm text-foreground/70">
              <Info className="h-3.5 w-3.5 shrink-0" />
              <span>Wähle mindestens eine Persona aus, um den Chat zu starten.</span>
            </div>
          )}
          {files && files.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {Array.from(files).map((file, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 rounded-lg bg-background px-2 py-1 text-xs"
                >
                  <ImagePlus className="h-3 w-3" />
                  <span className="max-w-[120px] truncate">{file.name}</span>
                  <button
                    onClick={() => {
                      setFiles(undefined);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}

          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={hasPersonas ? "Frage stellen... (⌘+Enter zum Senden)" : "Personas auswählen..."}
            disabled={!hasPersonas}
            className="min-h-[44px] max-h-[200px] resize-none border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0 disabled:cursor-not-allowed"
            rows={1}
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            multiple
          />

          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg bg-background"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <ImagePlus className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="h-8 w-auto gap-1 text-xs border-0 bg-transparent px-2 shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_MODELS.map((model) => (
                    <SelectItem key={model.id} value={model.id} className="text-xs">
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {isLoading ? (
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  onClick={onStop}
                >
                  <Square className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <button
                  onClick={handleSend}
                  disabled={!canSend}
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                    canSend
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                      : "bg-primary/30 text-primary-foreground/50 cursor-default"
                  )}
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          KI kann Fehler machen. Überprüfe wichtige Informationen.
        </p>
      </div>
    </div>
  );
}
