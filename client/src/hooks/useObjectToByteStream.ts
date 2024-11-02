import { useState } from "react";

// Custom hook to convert text to a byte array
const useTextToBytes = () => {
  const [bytes, setBytes] = useState<number[]>([]);

  const convertTextToBytes = (text: string) => {
    // Convert text to byte stream
    const byteStream = new TextEncoder().encode(text);
    // Convert byte stream to array of bytes
    const byteArray = Array.from(byteStream);
    setBytes(byteArray);
  };

  return { bytes, convertTextToBytes };
};

export default useTextToBytes;
