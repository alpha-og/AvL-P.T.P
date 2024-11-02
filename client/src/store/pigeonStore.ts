import { create } from "zustand";

type T_Pigeon = {
  id: string;
  x: number;
  y: number;
  payload: number;
};

type T_PigeonStore = {
  pigeons: T_Pigeon[];
  setPigeons: (pigeons: T_Pigeon[]) => void;
};

export const usePigeonStore = create<T_PigeonStore>((set) => ({
  pigeons: [],
  setPigeons: (pigeons: T_Pigeon[]) => set({ pigeons }),
}));
