"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useCallback, useRef, useState } from "react";
import { useAppStore } from "@/hooks/use-app-store";
import { useChatSync } from "@/hooks/use-chat-sync";
import { usePersonas } from "@/hooks/use-personas";
import { supabase } from "@/lib/supabase/client";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { ChatHeader } from "./chat-header";

export function ChatInterface({ chatId }: { chatId: string | null }) {
  useChatSync(chatId);

  const { activeChatId, selectedPersonaIds, selectedModel, setActiveChatId, setSelectedPersonaIds, setRightSidebarOpen, setHasUnseenChat, bumpChatListVersion } =
    useAppStore();
  const { personas, loading: personasLoading } = usePersonas();

  // Use refs so transport body always has latest values
  const modelRef = useRef(selectedModel);
  const personaIdsRef = useRef(selectedPersonaIds);
  const chatIdRef = useRef(activeChatId);
  const pendingNewChatIdRef = useRef<string | null>(null);
  const [optimisticMessage, setOptimisticMessage] = useState<{
    text: string;
    filePreviews: string[];
  } | null>(null);
  modelRef.current = selectedModel;
  personaIdsRef.current = selectedPersonaIds;
  chatIdRef.current = activeChatId;

  const {
    messages,
    sendMessage,
    status,
    stop,
    setMessages,
    regenerate,
  } = useChat({
    id: activeChatId ?? "new",
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: () => ({
        model: modelRef.current,
        personaIds: personaIdsRef.current,
      }),
    }),
    onFinish: async ({ message }) => {
      // Persist the assistant message
      const currentChatId = chatIdRef.current;
      if (currentChatId && message.role === "assistant") {
        const textContent = message.parts
          .filter((p): p is { type: "text"; text: string } => p.type === "text")
          .map((p) => p.text)
          .join("");

        await supabase.from("messages").insert({
          chat_id: currentChatId,
          role: "assistant",
          content: textContent,
          parts: message.parts,
        });
      }

      // For new chats: now safe to commit the active chat ID (streaming is done)
      if (pendingNewChatIdRef.current) {
        setActiveChatId(pendingNewChatIdRef.current);
        pendingNewChatIdRef.current = null;
      }
    },
  });

  // Load messages and restore personas when activeChatId changes
  useEffect(() => {
    // Clear pending ref if user navigated away mid-stream
    pendingNewChatIdRef.current = null;

    if (!activeChatId) {
      setMessages([]);
      return;
    }

    const loadChat = async () => {
      // Load messages
      const { data: messagesData } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", activeChatId)
        .order("created_at", { ascending: true });

      if (messagesData && messagesData.length > 0) {
        const uiMessages = messagesData.map((m) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          content: m.content,
          parts: m.parts || [{ type: "text" as const, text: m.content }],
          createdAt: new Date(m.created_at),
        }));
        setMessages(uiMessages);
      } else {
        setMessages([]);
      }

      // Restore personas from chat record (needed for direct URL access)
      const { data: chatData } = await supabase
        .from("chats")
        .select("persona_ids")
        .eq("id", activeChatId)
        .single();

      if (chatData?.persona_ids?.length) {
        setSelectedPersonaIds(chatData.persona_ids);
        setRightSidebarOpen(true);
      }
    };

    loadChat();
  }, [activeChatId, setMessages, setSelectedPersonaIds, setRightSidebarOpen]);

  const handleSend = useCallback(
    async (msg: { text: string; files?: File[] }) => {
      // Show optimistic message immediately for image uploads
      let filePreviews: string[] = [];
      if (msg.files && msg.files.length > 0) {
        filePreviews = msg.files.map((f) => URL.createObjectURL(f));
        setOptimisticMessage({ text: msg.text, filePreviews });
      }

      // Create a chat if none is active
      let chatId = activeChatId;
      let isNewChat = false;
      if (!chatId) {
        const title =
          msg.text.slice(0, 50) + (msg.text.length > 50 ? "..." : "") || "Neuer Chat";
        const { data } = await supabase
          .from("chats")
          .insert({
            title,
            model: selectedModel,
            persona_ids: selectedPersonaIds,
          })
          .select()
          .single();

        if (data) {
          chatId = data.id;
          isNewChat = true;
          chatIdRef.current = chatId;
          setHasUnseenChat(true);
          bumpChatListVersion();
        }
      }

      // Upload files to Supabase Storage (for persistence) and convert to data URLs (for AI)
      let storageParts: Array<{ type: "file"; url: string; mediaType: string; filename?: string }> = [];
      let aiParts: Array<{ type: "file"; url: string; mediaType: string; filename?: string }> = [];

      if (msg.files && msg.files.length > 0) {
        const fileToDataUrl = (file: File): Promise<string> =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });

        const results = await Promise.all(
          msg.files.map(async (file) => {
            const [uploadResult, dataUrl] = await Promise.all([
              (async () => {
                const formData = new FormData();
                formData.append("file", file);
                const res = await fetch("/api/upload", { method: "POST", body: formData });
                if (!res.ok) return null;
                return res.json();
              })(),
              fileToDataUrl(file),
            ]);
            return { uploadResult, dataUrl, mediaType: file.type, filename: file.name };
          })
        );

        for (const r of results) {
          if (r.uploadResult) {
            storageParts.push({ type: "file", url: r.uploadResult.url, mediaType: r.mediaType, filename: r.filename });
          }
          aiParts.push({ type: "file", url: r.dataUrl, mediaType: r.mediaType, filename: r.filename });
        }
      }

      // Persist the user message with Supabase URLs
      const parts: Array<{ type: string; text?: string; url?: string; mediaType?: string; filename?: string }> = [
        { type: "text", text: msg.text },
        ...storageParts,
      ];

      if (chatId) {
        await supabase.from("messages").insert({
          chat_id: chatId,
          role: "user",
          content: msg.text,
          parts,
        });
      }

      // Clear optimistic message — sendMessage will add the real one
      setOptimisticMessage(null);
      filePreviews.forEach((url) => URL.revokeObjectURL(url));

      // Send to AI with data URLs (base64) so the model can process images
      if (aiParts.length > 0) {
        sendMessage({
          text: msg.text,
          files: aiParts,
        });
      } else {
        sendMessage({
          text: msg.text,
        });
      }

      // Update URL silently — don't change useChat id until streaming finishes
      if (isNewChat && chatId) {
        pendingNewChatIdRef.current = chatId;
        globalThis.history.replaceState(null, '', `/chat/${chatId}`);
      }
    },
    [activeChatId, selectedModel, selectedPersonaIds, sendMessage, setHasUnseenChat, bumpChatListVersion]
  );

  return (
    <div className="flex h-full flex-col">
      <ChatHeader />
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} status={status} personas={personas} loading={personasLoading} onRegenerate={regenerate} activeChatId={activeChatId} optimisticMessage={optimisticMessage} />
      </div>
      <ChatInput onSend={handleSend} status={status} onStop={stop} />
    </div>
  );
}
