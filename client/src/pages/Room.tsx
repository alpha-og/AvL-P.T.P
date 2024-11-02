import { useEffect, useState } from "react";
import useSocketIo from "@hooks/useSocketIo";
import RoomIDChip from "@components/room/RoomIdChip";
import SenderContainer from "@/components/room/SenderView";
import ViewerContainer from "@/components/room/ReceiverView";
import { SendIcon } from "lucide-react";
import { useRoomStore } from "@store/roomStore";
import { usePigeonStore } from "@store/pigeonStore";
import { useMessageStore } from "@store/messageStore";
import ProgressBar from "@components/room/ProgressBar";

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
  const { pigeons, setPigeons } = usePigeonStore();
  const [showProgress, setShowProgress] = useState(false);
  const { addMessage } = useMessageStore();
  const [message, setMessage] = useState<string>("");
  const [joinedRoom, setJoinedRoom] = useState(false);
  const socket = useSocketIo();
  const handleJoin = () => {
    setJoinedRoom(true);
    if (!room || !socket.connected) return;
    console.log("joining room", room);
    socket.emit("join_room", room);
    setIsSender(false);
  };
  const handleCreate = () => {
    setJoinedRoom(true);
    setIsSender(true);
    if (!socket.connected) return;
    const roomId = generateRoomID();
    console.log("creating room");
    socket.emit("join_room", roomId);
    setRoom(roomId);
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
    <div className="h-screen w-full p-4 flex flex-col items-center justify-center ">
      {showProgress && (
        <div className="absolute top-0 left-0 w-full h-full bg-base-100 opacity-50 z-10">
          <ProgressBar items={pigeons} />
        </div>
      )}
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
                  setShowProgress(true);
                  addMessage(message);
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
