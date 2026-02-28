import { Label } from "@/types/label";
import { create } from "zustand";

type LabelStore = {
  labels: Label[];
  setLabel: (labels: Label[]) => void;
};

export const useLabel = create<LabelStore>((set) => ({
  labels: [
    {
      id: 0,
      name: "None",
      user_id: 0,
      created_at: "",
      color: "",
    },
  ],
  setLabel: (labels) => set({ labels }),
}));
