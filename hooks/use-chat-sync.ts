"use client";

import { useEffect } from "react";
import { useAppStore } from "@/hooks/use-app-store";

export function useChatSync(chatId: string | null) {
  const { activeChatId, setActiveChatId } = useAppStore();

  useEffect(() => {
    if (chatId !== null && chatId !== activeChatId) {
      setActiveChatId(chatId);
    }
    if (chatId === null && activeChatId !== null && globalThis.location.pathname === "/") {
      setActiveChatId(null);
    }
  }, [chatId, activeChatId, setActiveChatId]);
}
