// import { getIO } from "./index";
// import { saveMessageDB } from "../controllers/messages/saveMessage";
// import { MessagePayload } from "../types/Message";

// // Online users map
// const onlineUsers: Map<number, string> = new Map();

// export const socketHandler = () => {
//   const io = getIO();

//   io.on("connection", (socket) => {
//     console.log("🟢 User connected:", socket.id);

//     socket.on("register", (userId: string) => {
//       onlineUsers.set(userId, socket.id);
//       console.log(`✅ User ${userId} online with socket ${socket.id}`);
//     });

//     socket.on("message-receive", async (message: MessagePayload) => {
//       try {
//         const savedMessage = await saveMessageDB(message);

//         const receiverSocketId = onlineUsers.get(message.receiver_id);

//         if (receiverSocketId) {
//           io.to(receiverSocketId).emit("new-message", savedMessage);
//           console.log(`📩 Message sent to user ${message.receiver_id}`);
//         } else {
//           console.log(`⚠️ User ${message.receiver_id} offline`);
//         }
//       } catch (error: any) {
//         console.error("❌ Message error:", error.message);
//       }
//     });

//     socket.on("disconnect", () => {
//       console.log("🔴 User disconnected:", socket.id);

//       for (const [userId, id] of onlineUsers.entries()) {
//         if (id === socket.id) {
//           onlineUsers.delete(userId);
//           console.log(`❌ User ${userId} set offline`);
//           break;
//         }
//       }
//     });
//   });
// };
