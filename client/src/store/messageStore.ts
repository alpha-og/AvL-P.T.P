import { create } from "zustand";
import { convertTextToBytes } from "@utils/bytesStream";

export type MessageStore = {
  messages: string[];
  bytes: number[];
  addMessage: (message: string) => void;
  dequeueByte: () => number;
};

export const useMessageStore = create<MessageStore>((set, get) => ({
  messages: [],
  bytes: [],
  addMessage: (message: string) => {
    set((state) => ({
      messages: [...state.messages, message],
      bytes: [...state.bytes, ...convertTextToBytes(message)],
    }));
  },
  dequeueByte: () => {
    const currentBytes = get().bytes;
    const dequeuedBytes = currentBytes[0];
    set((state) => ({
      bytes: state.bytes.slice(1),
    }));
    return dequeuedBytes;
  },
}));
