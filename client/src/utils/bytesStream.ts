export const convertTextToBytes = (text: string) => {
  // Convert text to byte stream
  const byteStream = new TextEncoder().encode(text);
  // Convert byte stream to array of bytes
  const byteArray = Array.from(byteStream);
  return byteArray;
};
