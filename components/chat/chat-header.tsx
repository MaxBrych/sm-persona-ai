"use client";

import { useAppStore } from "@/hooks/use-app-store";

const FALLBACK_LOGO =
  "https://tepsrntcystsvvtraruc.supabase.co/storage/v1/object/public/images/vercel.png";

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
          src="/logo.svg"
          alt="Logo"
          width={32}
          height={32}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_LOGO;
          }}
        />
        <h1 className="text-sm font-semibold">Schwäbisch Media</h1>
      </button>
    </div>
  );
}
