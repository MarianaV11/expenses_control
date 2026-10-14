import { create } from "zustand";

type ProfileStore = {
  profile: string;
  setProfile: (picture: string) => void;
};

export const useProfile = create<ProfileStore>((set) => ({
  profile: "",
  setProfile: (picture) => set({ profile: picture }),
}));
