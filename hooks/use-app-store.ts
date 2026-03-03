import { create } from "zustand";
import { DEFAULT_MODEL } from "@/lib/ai-providers";

interface AppStore {
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;

  selectedPersonaIds: string[];
  setSelectedPersonaIds: (ids: string[]) => void;
  togglePersona: (id: string) => void;
  selectAllPersonas: (allIds: string[]) => void;
  clearPersonas: () => void;

  selectedModel: string;
  setSelectedModel: (model: string) => void;

  leftSidebarOpen: boolean;
  toggleLeftSidebar: () => void;

  rightSidebarOpen: boolean;
  setRightSidebarOpen: (open: boolean) => void;
  toggleRightSidebar: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  activeChatId: null,
  setActiveChatId: (id) => set({ activeChatId: id }),

  selectedPersonaIds: [],
  setSelectedPersonaIds: (ids) => set({ selectedPersonaIds: ids }),
  togglePersona: (id) =>
    set((state) => ({
      selectedPersonaIds: state.selectedPersonaIds.includes(id)
        ? state.selectedPersonaIds.filter((pid) => pid !== id)
        : [...state.selectedPersonaIds, id],
    })),
  selectAllPersonas: (allIds) => set({ selectedPersonaIds: allIds }),
  clearPersonas: () => set({ selectedPersonaIds: [] }),

  selectedModel: DEFAULT_MODEL,
  setSelectedModel: (model) => set({ selectedModel: model }),

  leftSidebarOpen: false,
  toggleLeftSidebar: () =>
    set((s) => ({ leftSidebarOpen: !s.leftSidebarOpen })),

  rightSidebarOpen: false,
  setRightSidebarOpen: (open) => set({ rightSidebarOpen: open }),
  toggleRightSidebar: () =>
    set((s) => ({ rightSidebarOpen: !s.rightSidebarOpen })),
}));
