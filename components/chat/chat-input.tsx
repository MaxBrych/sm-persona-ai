"use client";

import { useRef, useState, useEffect, type KeyboardEvent, type DragEvent } from "react";
import { ArrowUp, Square, ImagePlus, Info, X } from "lucide-react";
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
  onSend: (msg: { text: string; files?: File[] }) => void;
  status: string;
  onStop: () => void;
}) {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { selectedModel, setSelectedModel, selectedPersonaIds } = useAppStore();

  const isLoading = status === "streaming" || status === "submitted";
  const hasPersonas = selectedPersonaIds.length > 0;
  const canSend = hasPersonas && !!(input.trim() || files.length > 0);

  // Generate and clean up object URL previews
  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  const addFiles = (newFiles: File[]) => {
    const imageFiles = newFiles.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length > 0) {
      setFiles((prev) => [...prev, ...imageFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    if (!canSend) return;
    onSend({ text: input, files: files.length > 0 ? files : undefined });
    setInput("");
    setFiles([]);
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
      addFiles(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedFiles = Array.from(e.clipboardData.items)
      .filter((item) => item.type.startsWith("image/"))
      .map((item) => item.getAsFile())
      .filter((f): f is File => f !== null);
    if (pastedFiles.length > 0) {
      addFiles(pastedFiles);
    }
  };

  return (
    <div className="bg-background px-4 pb-4 pt-2">
      <div className="mx-auto max-w-3xl">
        <div
          className={cn(
            "rounded-2xl border bg-muted px-4 pt-3 pb-2 transition-colors",
            !hasPersonas && "opacity-60",
            isDragging && "border-primary border-dashed bg-primary/5"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {!hasPersonas && (
            <div className="flex items-center gap-2 pb-2 text-sm text-foreground/70">
              <Info className="h-3.5 w-3.5 shrink-0" />
              <span>Wähle mindestens eine Persona aus, um den Chat zu starten.</span>
            </div>
          )}

          {isDragging && (
            <div className="flex items-center justify-center py-4 text-sm text-primary font-medium">
              <ImagePlus className="h-4 w-4 mr-2" />
              Bild hier ablegen
            </div>
          )}

          {files.length > 0 && !isDragging && (
            <div className="mb-2 flex flex-wrap gap-2">
              {files.map((file, i) => (
                <div key={i} className="relative group">
                  <img
                    src={previews[i]}
                    alt={file.name}
                    className="h-16 w-16 rounded-lg object-cover border"
                  />
                  <button
                    onClick={() => removeFile(i)}
                    className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <X className="h-3 w-3" />
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
            onPaste={handlePaste}
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
