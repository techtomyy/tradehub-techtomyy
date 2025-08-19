import { getUserSocket } from "./user";
import { MessagePayload } from "../types/Sockets";

export function sendMessageToUser(userId: string, message: MessagePayload) {
  const socket = getUserSocket(userId);
  console.log("send the message");
  if (socket) {
    setTimeout(() => {
      socket.emit("message-send", message); 
    }, 10000);
  }
}
