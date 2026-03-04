"use client";

import Image from "next/image";

export function ChatHeader() {
  return (
    <div className="flex h-12 shrink-0 items-center border-b px-4">
      <div className="flex items-center gap-2">
        <Image src="/logo.svg" alt="Logo" width={24} height={24} />
        <h1 className="text-sm font-semibold">Schwäbisch Media</h1>
      </div>
    </div>
  );
}
