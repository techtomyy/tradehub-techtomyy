// user.ts
import { Socket } from "socket.io";
import { ServerToClientEvents, ClientToServerEvents } from "../types/Sockets";

type SocketType = Socket<ClientToServerEvents, ServerToClientEvents>;

// Map: userId -> socket
export const userConnections = new Map<string, SocketType>();

export function addUserConnection(userId: string, socket: SocketType) {
  userConnections.set(userId, socket);
}

export function removeUserConnection(userId: string) {
  userConnections.delete(userId);
}

export function getUserSocket(userId: string) {
  return userConnections.get(userId);
}
