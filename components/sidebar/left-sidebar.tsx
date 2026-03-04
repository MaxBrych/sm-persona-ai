"use client";

import { useState } from "react";
import { Plus, MessageSquare, Trash2, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useChats } from "@/hooks/use-chats";
import { useAppStore } from "@/hooks/use-app-store";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function LeftSidebar({ isOpen: isOpenProp }: { isOpen?: boolean }) {
  const { chats, loading, deleteChat } = useChats();
  const { activeChatId, setActiveChatId, leftSidebarOpen, toggleLeftSidebar, clearPersonas, setRightSidebarOpen, hasUnseenChat, setHasUnseenChat } =
    useAppStore();
  const isOpen = isOpenProp ?? leftSidebarOpen;
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);

  const handleNewChat = () => {
    setActiveChatId(null);
    clearPersonas();
    setRightSidebarOpen(false);
  };

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    setDeletingChatId(chatId);
  };

  const confirmDelete = async () => {
    if (!deletingChatId) return;
    await deleteChat(deletingChatId);
    if (activeChatId === deletingChatId) {
      setActiveChatId(null);
    }
    setDeletingChatId(null);
  };

  const handleChatClick = (chatId: string) => {
    setActiveChatId(chatId);
  };

  if (!isOpen) {
    return (
      <div className="flex h-full flex-col items-center py-2 gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 shrink-0"
          onClick={() => { toggleLeftSidebar(); setHasUnseenChat(false); }}
        >
          <PanelLeft className="h-4 w-4" />
          {hasUnseenChat && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
          )}
        </Button>
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
            onClick={() => { toggleLeftSidebar(); setHasUnseenChat(false); }}
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
                  onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); setDeletingChatId(chat.id); } }}
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

      <Dialog open={!!deletingChatId} onOpenChange={(open) => !open && setDeletingChatId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chat löschen?</DialogTitle>
            <DialogDescription>
              Dieser Chat und alle Nachrichten werden unwiderruflich gelöscht.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="sm">Abbrechen</Button>
            </DialogClose>
            <Button variant="destructive" size="sm" onClick={confirmDelete}>
              Löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
