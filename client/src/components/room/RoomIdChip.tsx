import { useState } from "react";
import { CopyIcon } from "lucide-react";

export default function RoomIDChip({ roomId }: { roomId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div
      onClick={handleCopy}
      className="absolute top-5 left-5 inline-flex items-center px-4 py-2 gap-2 bg-gray-800/25 text-gray-200 rounded-full cursor-pointer hover:bg-gray-300 hover:text-gray-700 transition duration-150 ease-in-out"
    >
      <span>{roomId}</span>
      {copied ? (
        <span className="ml-2 text-green-600 text-sm">Copied!</span>
      ) : (
        <CopyIcon size={16} />
      )}
    </div>
  );
}
