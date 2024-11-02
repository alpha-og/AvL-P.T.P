import express, { Express } from "express";
import http from "http";
import cors from "cors";
import { Server as SocketIOServer } from "socket.io";

const app: Express = express();
// Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

// Serve a simple HTML file (optional)
app.get("/", (_req, res) => {
  res.send("Hello World!");
});

// Handle client connection
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a room
  socket.on("join_room", (room: string) => {
    socket.join(room);
    socket
      .to(room)
      .emit("notification", `User ${socket.id} has joined room ${room}`);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  // Handle messages sent to a specific room
  socket.on("send_message", (data: { room: string; message: string }) => {
    io.to(data.room).emit("receive_message", data.message);
    console.log(`Message sent to room ${data.room}: ${data.message}`);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});
// Start the server
const PORT = process.env.PORT || 3210;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
