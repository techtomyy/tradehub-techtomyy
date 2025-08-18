export interface ClientToServerEvents {
  register: (userId: string) => void;
  "message-receive": (message: { senderId: string; receiverId: string; text: string }) => void;
}

export interface ServerToClientEvents {
  "message-send": (message: { senderId: string; text: string }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
}
