"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useCallback, useRef } from "react";
import { useAppStore } from "@/hooks/use-app-store";
import { usePersonas } from "@/hooks/use-personas";
import { supabase } from "@/lib/supabase/client";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { ChatHeader } from "./chat-header";

export function ChatInterface() {
  const { activeChatId, selectedPersonaIds, selectedModel, setActiveChatId } =
    useAppStore();
  const { personas } = usePersonas();

  // Use refs so transport body always has latest values
  const modelRef = useRef(selectedModel);
  const personaIdsRef = useRef(selectedPersonaIds);
  const chatIdRef = useRef(activeChatId);
  modelRef.current = selectedModel;
  personaIdsRef.current = selectedPersonaIds;
  chatIdRef.current = activeChatId;

  const {
    messages,
    sendMessage,
    status,
    stop,
    setMessages,
  } = useChat({
    id: activeChatId ?? "new",
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        model: selectedModel,
        personaIds: selectedPersonaIds,
      },
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
    },
  });

  // Load messages when activeChatId changes
  useEffect(() => {
    if (!activeChatId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", activeChatId)
        .order("created_at", { ascending: true });

      if (data && data.length > 0) {
        const uiMessages = data.map((m) => ({
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
    };

    loadMessages();
  }, [activeChatId, setMessages]);

  const handleSend = useCallback(
    async (msg: { text: string; files?: FileList }) => {
      // Create a chat if none is active
      let chatId = activeChatId;
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
          setActiveChatId(data.id);
        }
      }

      // Persist the user message
      if (chatId) {
        await supabase.from("messages").insert({
          chat_id: chatId,
          role: "user",
          content: msg.text,
          parts: [{ type: "text", text: msg.text }],
        });
      }

      // Send to AI
      if (msg.files && msg.files.length > 0) {
        sendMessage({
          text: msg.text,
          files: msg.files,
        });
      } else {
        sendMessage({
          text: msg.text,
        });
      }
    },
    [activeChatId, selectedModel, selectedPersonaIds, sendMessage, setActiveChatId]
  );

  return (
    <div className="flex h-full flex-col">
      <ChatHeader />
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} status={status} personas={personas} />
      </div>
      <ChatInput onSend={handleSend} status={status} onStop={stop} />
    </div>
  );
}
