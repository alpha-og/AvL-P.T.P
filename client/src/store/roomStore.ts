import { create } from "zustand";

type T_RoomStore = {
  room: string;
  isSender: boolean;
  setRoom: (room: string) => void;
  setIsSender: (isSender: boolean) => void;
};

export const useRoomStore = create<T_RoomStore>((set) => ({
  room: "",
  isSender: false,
  setRoom: (room: string) => set({ room }),
  setIsSender: (isSender: boolean) => set({ isSender }),
}));
