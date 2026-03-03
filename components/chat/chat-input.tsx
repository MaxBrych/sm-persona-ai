"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ImagePlus, Send, Square, ChevronDown } from "lucide-react";
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
  const { selectedModel, setSelectedModel } = useAppStore();

  const isLoading = status === "streaming" || status === "submitted";

  const handleSend = () => {
    if (!input.trim() && !files) return;
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
    <div className="border-t bg-background px-4 py-3">
      <div className="mx-auto max-w-3xl">
        {files && files.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {Array.from(files).map((file, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 rounded bg-muted px-2 py-1 text-xs"
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

        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Frage stellen... (⌘+Enter zum Senden)"
              className="min-h-[44px] max-h-[200px] resize-none pr-10 text-sm"
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
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <ImagePlus className="h-4 w-4" />
          </Button>

          {isLoading ? (
            <Button
              variant="destructive"
              size="icon"
              className="h-9 w-9 shrink-0"
              onClick={onStop}
            >
              <Square className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button
              size="icon"
              className="h-9 w-9 shrink-0"
              onClick={handleSend}
              disabled={!input.trim() && !files}
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Modell:</span>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="h-7 w-auto gap-1 text-xs border-0 bg-muted/50 px-2">
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
        </div>
      </div>
    </div>
  );
}
