import express from "express";
import cors from "cors";
import http from "http";
import { Server, Socket } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());

// Handle WebSocket connections
io.on("connection", (socket: Socket) => {
  console.log(`User connected: ${socket.id}`);

  // Broadcast a message to all connected clients
  socket.on("message", (data) => {
    io.emit("message", { id: socket.id, message: data });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = 5003;
server.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
});
