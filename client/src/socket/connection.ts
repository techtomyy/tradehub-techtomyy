import { io } from "socket.io-client";


// const socket = io("http://localhost:4000", {
//   withCredentials: true,
// });

  const socket = io("https://tradehub-techtomyy-production.up.railway.app", {
  withCredentials: true, });

socket.on("connect", () => {
  console.log("Connected with id:", socket.id);
});

socket.on("message-send", (msg) => {
  console.log("Message received:", msg);
});

export default socket;