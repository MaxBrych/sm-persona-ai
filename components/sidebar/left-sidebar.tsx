"use client";

import { Plus, MessageSquare, Trash2, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChats } from "@/hooks/use-chats";
import { useAppStore } from "@/hooks/use-app-store";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function LeftSidebar() {
  const { chats, loading, deleteChat } = useChats();
  const { activeChatId, setActiveChatId, leftSidebarOpen, toggleLeftSidebar, clearPersonas, setRightSidebarOpen } =
    useAppStore();

  const handleNewChat = () => {
    setActiveChatId(null);
    clearPersonas();
    setRightSidebarOpen(false);
  };

  const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    await deleteChat(chatId);
    if (activeChatId === chatId) {
      setActiveChatId(null);
    }
  };

  const handleChatClick = (chatId: string) => {
    setActiveChatId(chatId);
  };

  if (!leftSidebarOpen) {
    return (
      <div className="flex h-full flex-col items-center py-2 gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={toggleLeftSidebar}
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={handleNewChat}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <ScrollArea className="flex-1 w-full">
          <div className="flex flex-col items-center gap-0.5 pt-1">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleChatClick(chat.id)}
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded transition-colors hover:bg-sidebar-accent",
                  activeChatId === chat.id && "bg-sidebar-accent"
                )}
                title={chat.title}
              >
                <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col w-full min-w-0">
      <div className="flex h-12 shrink-0 items-center justify-between border-b px-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={toggleLeftSidebar}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold">Chats</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleNewChat}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-0.5">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded" />
            ))
          ) : chats.length === 0 ? (
            <div className="px-3 py-8 text-center text-xs text-muted-foreground">
              Noch keine Chats. Starte eine neue Konversation.
            </div>
          ) : (
            chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleChatClick(chat.id)}
                className={cn(
                  "group flex w-full min-w-0 items-center gap-2 rounded px-2.5 py-2 text-left text-sm transition-colors hover:bg-sidebar-accent",
                  activeChatId === chat.id &&
                    "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <MessageSquare className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="flex-1 truncate">{chat.title}</span>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(e) => handleDeleteChat(e, chat.id)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleDeleteChat(e as unknown as React.MouseEvent, chat.id); }}
                  className="hidden shrink-0 rounded p-0.5 text-muted-foreground hover:text-destructive group-hover:block cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" />
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="border-t p-3">
        <Button
          variant="outline"
          onClick={handleNewChat}
          className="w-full justify-start gap-2 text-xs"
          size="sm"
        >
          <Plus className="h-3.5 w-3.5" />
          Neuer Chat
        </Button>
      </div>
    </div>
  );
}
