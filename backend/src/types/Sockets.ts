export interface MessagePayload {
  chat_id: number;
  sender_id: number;
  receiver_id: number;
  message_text: string;
  time:string,
  is_read:boolean
}


// types/Sockets.ts
export interface ServerToClientEvents {
  "message-send": (message: MessagePayload) => void;
}

export interface ClientToServerEvents {
  register: (userId: string) => void;
  "message-receive": (message: { senderId: string; receiverId: string; text: string }) => void;

}


export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
}
