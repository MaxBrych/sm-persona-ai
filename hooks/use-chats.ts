"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAppStore } from "@/hooks/use-app-store";
import type { Chat } from "@/lib/types";

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const chatListVersion = useAppStore((s) => s.chatListVersion);

  const fetchChats = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .order("updated_at", { ascending: false });

    if (!error && data) setChats(data as Chat[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats, chatListVersion]);

  const createChat = async (chat: {
    title?: string;
    model: string;
    persona_ids: string[];
  }) => {
    const { data, error } = await supabase
      .from("chats")
      .insert({
        title: chat.title || "Neuer Chat",
        model: chat.model,
        persona_ids: chat.persona_ids,
      })
      .select()
      .single();
    if (error) throw error;
    const newChat = data as Chat;
    setChats((prev) => [newChat, ...prev]);
    return newChat;
  };

  const updateChat = async (id: string, updates: Partial<Chat>) => {
    const { data, error } = await supabase
      .from("chats")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    setChats((prev) => prev.map((c) => (c.id === id ? (data as Chat) : c)));
    return data as Chat;
  };

  const deleteChat = async (id: string) => {
    const { error } = await supabase.from("chats").delete().eq("id", id);
    if (error) throw error;
    setChats((prev) => prev.filter((c) => c.id !== id));
  };

  return { chats, loading, fetchChats, createChat, updateChat, deleteChat };
}
