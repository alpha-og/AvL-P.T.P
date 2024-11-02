import express, { Express } from "express";
import http from "http";
import cors from "cors";
import { Server as SocketIOServer } from "socket.io";

type T_Pigeon = {
  id: string;
  name: string;
  age: number;
  gender: string;
};

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

  socket.on("update_pigeon", (data: { room: string; pigeons: T_Pigeon[] }) => {
    socket.to(data.room).emit("update_pigeon_progress", data.pigeons);
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
