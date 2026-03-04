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
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M22.3679 5.3335L28.6386 8.88906L22.3679 12.4446L16.0972 8.88906L22.3679 5.3335Z" fill="#F39100"/>
          <path d="M22.3679 12.4443L28.6386 15.9999L22.3679 19.5554L16.0972 15.9999L22.3679 12.4443Z" fill="#C00216"/>
          <path d="M22.3679 19.5557L28.6386 23.1112L22.3679 26.6668L16.0972 23.1112L22.3679 19.5557Z" fill="#FBB900"/>
          <path d="M9.82627 5.3335L16.097 8.88906L9.82627 12.4446L3.55556 8.88906L9.82627 5.3335Z" fill="#FBB900"/>
          <path d="M16.0971 1.77783L22.3678 5.33339L16.0971 8.88895L9.82639 5.33339L16.0971 1.77783Z" fill="#FFCF00"/>
          <path d="M9.82627 12.4443L16.097 15.9999L9.82627 19.5554L3.55556 15.9999L9.82627 12.4443Z" fill="#9B0332"/>
          <path d="M16.0971 15.9998L9.82639 12.4442L16.0971 8.88867V15.9998Z" fill="#CB060B"/>
          <path d="M28.6388 23.1111L22.3681 19.5556L28.6388 16V23.1111Z" fill="#FFCF00"/>
          <path d="M28.6388 15.9998L22.3681 12.4442L28.6388 8.88867V15.9998Z" fill="#E7410E"/>
          <path d="M28.6388 8.88895L22.3681 5.33339L28.6388 1.77783V8.88895Z" fill="#FBB900"/>
          <path d="M3.55556 23.1111L9.82627 19.5556L3.55556 16V23.1111Z" fill="#E7410E"/>
          <path d="M3.55556 15.9998L9.82627 12.4442L3.55556 8.88867V15.9998Z" fill="#E6262F"/>
          <path d="M3.55556 8.88895L9.82627 5.33339L3.55556 1.77783V8.88895Z" fill="#FFDE0C"/>
          <path d="M16.0972 15.9998L22.3679 12.4442L16.0972 8.88867V15.9998Z" fill="#A71321"/>
          <path d="M16.0971 23.1111L9.82639 19.5556L16.0971 16V23.1111Z" fill="#7E0C3E"/>
          <path d="M16.0972 23.1111L22.3679 19.5556L16.0972 16V23.1111Z" fill="#5F0021"/>
          <path d="M9.82627 19.5557L16.097 23.1112L9.82627 26.6668L3.55556 23.1112L9.82627 19.5557Z" fill="#F39100"/>
          <path d="M16.0971 23.1113L22.3678 26.6669L16.0971 30.2224L9.82639 26.6669L16.0971 23.1113Z" fill="#FFCF00"/>
        </svg>
        <h1 className="text-sm font-semibold">Schwäbisch Media</h1>
      </button>
    </div>
  );
}
