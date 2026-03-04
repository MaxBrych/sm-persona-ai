"use client";

import { useAppStore } from "@/hooks/use-app-store";

export function ChatHeader() {
  const { setActiveChatId, clearPersonas, setRightSidebarOpen } = useAppStore();

  const handleLogoClick = () => {
    setActiveChatId(null);
    clearPersonas();
    setRightSidebarOpen(false);
  };

  return (
    <div className="flex h-12 shrink-0 items-center border-b px-4">
      <button
        onClick={handleLogoClick}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
      >
        <img
          src="https://tepsrntcystsvvtraruc.supabase.co/storage/v1/object/public/images/vercel.png"
          alt="Logo"
          width={32}
          height={32}
        />
        <h1 className="text-sm font-semibold">Schwäbisch Media</h1>
      </button>
    </div>
  );
}
