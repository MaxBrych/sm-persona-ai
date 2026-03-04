"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useCallback, useRef } from "react";
import { useAppStore } from "@/hooks/use-app-store";
import { useChatSync } from "@/hooks/use-chat-sync";
import { usePersonas } from "@/hooks/use-personas";
import { supabase } from "@/lib/supabase/client";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { ChatHeader } from "./chat-header";

export function ChatInterface({ chatId }: { chatId: string | null }) {
  useChatSync(chatId);

  const { activeChatId, selectedPersonaIds, selectedModel, setActiveChatId, setSelectedPersonaIds, setRightSidebarOpen, setHasUnseenChat } =
    useAppStore();
  const { personas, loading: personasLoading } = usePersonas();

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
    regenerate,
  } = useChat({
    id: "chat",
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
    },
  });

  // Load messages and restore personas when activeChatId changes
  useEffect(() => {
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
    async (msg: { text: string; files?: FileList }) => {
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
          // Set ref directly so onFinish can use it — no re-render yet
          chatIdRef.current = chatId;
          setHasUnseenChat(true);
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

      // Send to AI BEFORE updating state to avoid useChat reinitialization
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

      // Navigate to the new chat URL
      if (isNewChat && chatId) {
        setActiveChatId(chatId);
        globalThis.history.replaceState(null, '', `/chat/${chatId}`);
      }
    },
    [activeChatId, selectedModel, selectedPersonaIds, sendMessage, setActiveChatId]
  );

  return (
    <div className="flex h-full flex-col">
      <ChatHeader />
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} status={status} personas={personas} loading={personasLoading} onRegenerate={regenerate} activeChatId={activeChatId} />
      </div>
      <ChatInput onSend={handleSend} status={status} onStop={stop} />
    </div>
  );
}
