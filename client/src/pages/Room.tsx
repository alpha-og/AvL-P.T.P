import { useEffect, useState } from "react";
import useSocketIo from "@hooks/useSocketIo";
import RoomIDChip from "@components/room/RoomIdChip";
import SenderContainer from "@/components/room/SenderScene";
import ViewerContainer from "@/components/room/ViewerScene";
import { SendIcon } from "lucide-react";
import { useRoomStore } from "@store/roomStore";
import { usePigeonStore } from "@store/pigeonStore";

type T_Pigeon = {
  id: string;
  x: number;
  y: number;
  payload: number;
};

function generateRoomID(length = 8) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let roomId = "";

  for (let i = 0; i < length; i++) {
    roomId += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return roomId;
}
export default function Room() {
  const { isSender, room, setRoom, setIsSender } = useRoomStore();
  const { setPigeons } = usePigeonStore();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [joinedRoom, setJoinedRoom] = useState(false);
  const socket = useSocketIo();
  const handleJoin = () => {
    if (!room || !socket.connected) return;
    console.log("joining room", room);
    socket.emit("join_room", room);
    setIsSender(false);
    setJoinedRoom(true);
  };
  const handleCreate = () => {
    if (!socket.connected) return;
    const roomId = generateRoomID();
    console.log("creating room");
    socket.emit("join_room", roomId);
    setRoom(roomId);
    setIsSender(true);
    setJoinedRoom(true);
  };
  useEffect(() => {
    socket.on("notification", (message: string) => {
      console.log("notification", message);
    });
  }, [socket]);
  useEffect(() => {
    if (isSender) return;
    socket.on("update_pigeon_progress", (pigeons: T_Pigeon[]) => {
      setPigeons(pigeons);
    });
  }, [isSender, socket, setPigeons]);

  return (
    <div className="h-full w-full p-4 flex flex-col items-center justify-center">
      {joinedRoom ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
          <div className="relative w-full h-full flex flex-col items-center justify-center border border-zinc-50/10 rounded-xl">
            <RoomIDChip roomId={room} />
            {isSender ? <SenderContainer /> : <ViewerContainer />}
          </div>
          {isSender && (
            <div className="w-full flex justify-between items-center gap-1 ">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message"
                className="input input-bordered w-full"
              />
              <button
                className="btn btn-primary bg-base-300 rounded-box "
                onClick={() => {
                  socket.emit("send_message", room, message);
                  setMessages([...messages, message]);
                  setMessage("");
                }}
              >
                <SendIcon size={24} className="text-primary" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <input
            type="text"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Room id"
            className="input input-bordered w-full max-w-xs"
          />
          <div className="flex w-full flex-col border-opacity-50">
            <button
              className="btn btn-primary bg-base-300 rounded-box w-full"
              onClick={handleJoin}
            >
              <span className="text-primary">Join</span>
            </button>
            <div className="divider">OR</div>
            <button
              className="btn btn-secondary bg-base-300 rounded-box w-full"
              onClick={handleCreate}
            >
              <span className="text-secondary">Create</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
