import { io } from "socket.io-client";
const URL = import.meta.env.PROD ? undefined : "http://localhost:3210";

export const useSocketIo = () => {
  const socket = io(URL, {
    autoConnect: false,
  });
  return socket;
};
