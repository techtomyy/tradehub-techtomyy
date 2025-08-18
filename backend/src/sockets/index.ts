import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { ClientToServerEvents, ServerToClientEvents } from "../types/Sockets";
import { socketAuth } from "./middleware/auth";
import { addUserConnection, removeUserConnection } from "./user";
import { sendMessageToUser } from "./chat.socket";
import { MessagePayload } from "../types/Sockets";
let io: Server<ClientToServerEvents, ServerToClientEvents> | null = null;

export function initSocket(server: HttpServer) {
  io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(socketAuth);

  io.on("connection", (socket) => {
    const user = (socket as any).user;
    if (!user?.id) {
      console.log("User not authenticated, skipping...");
      return;
    }

    try {
      addUserConnection(user.id, socket);
    } catch (err) {
      console.error("User connection error:", err);
    }

    const message: MessagePayload = {
      chat_id: 123,
      sender_id: user.id,
      receiver_id: 234,
      message_text: "Hello client"
    };

    sendMessageToUser(user.id, message);
  

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
    if (user?.id) {
      removeUserConnection(user.id);
    }
  });
});
}

export function getIO() {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
}
