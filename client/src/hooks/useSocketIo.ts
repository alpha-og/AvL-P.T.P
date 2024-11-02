import { io, Socket } from "socket.io-client";
import { useEffect, useRef } from "react";

const URL = import.meta.env.PROD ? undefined : "http://localhost:3210";

export default function useSocketIo() {
  const socketRef = useRef<Socket | null>(null);

  // Initialize the socket only once
  if (!socketRef.current) {
    socketRef.current = io(URL, {
      reconnection: true,
    });
  }

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    // Manually connect the socket
    socket.connect();

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef.current;
}
