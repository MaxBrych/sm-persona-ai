"use client";

import { useEffect } from "react";
import { useAppStore } from "@/hooks/use-app-store";

export function useChatSync(chatId: string | null) {
  const { activeChatId, setActiveChatId } = useAppStore();

  useEffect(() => {
    if (chatId !== activeChatId) {
      setActiveChatId(chatId);
    }
  }, [chatId, activeChatId, setActiveChatId]);
}
