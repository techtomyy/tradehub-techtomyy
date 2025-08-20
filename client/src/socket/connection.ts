import { io } from "socket.io-client";


const socket = io("http://localhost:4000", {
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("Connected with id:", socket.id);
});

socket.on("message-send", (msg) => {
  console.log("Message received:", msg);
});

export default socket;