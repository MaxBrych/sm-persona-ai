"use client";

import Image from "next/image";
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
        <picture>
          <source srcSet="/logo.svg" type="image/svg+xml" />
          <Image src="/logo.png" alt="Logo" width={24} height={24} />
        </picture>
        <h1 className="text-sm font-semibold">Schwäbisch Media</h1>
      </button>
    </div>
  );
}
