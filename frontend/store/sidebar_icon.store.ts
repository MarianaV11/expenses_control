import { create } from "zustand";

type SidebarIconStore = {
  activeIcon: string | null;
  setCurrentActive: (current: string) => void;
};

export const useSidebarIcon = create<SidebarIconStore>((set) => ({
  activeIcon: null,
  setCurrentActive: (current) => set({ activeIcon: current }),
}));
