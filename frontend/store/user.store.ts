import { UserRead } from "@/types/user";
import { create } from "zustand";

type UserStore = {
  user: UserRead | null;
  setUser: (data: UserRead) => void;
};

export const useUser = create<UserStore>((set) => ({
  user: null,
  setUser: (data) => set({ user: data }),
}));
