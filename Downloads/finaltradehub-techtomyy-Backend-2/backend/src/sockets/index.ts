import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { ClientToServerEvents, ServerToClientEvents } from "../types/Sockets";
import { socketAuth } from "./middleware/auth";
import { addUserConnection, removeUserConnection } from "./user";
import { saveMessageDB } from "../controllers/messages/saveMessage";
import { MessagePayload } from "../types/Sockets";
let io: Server<ClientToServerEvents, ServerToClientEvents> | null = null;

export function initSocket(server: HttpServer) {
  io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: {
      origin: "http://localhost:5174",
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
    socket.on("register", (userId) => {
      userId
    });

    try {
      addUserConnection(user.id, socket);
    } catch (err) {
      console.error("User connection error:", err);
    }



    socket.on("message-receive", (messages) => {
     saveMessageDB(messages);
    });


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
