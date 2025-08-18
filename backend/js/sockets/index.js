"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = initSocket;
exports.getIO = getIO;
const socket_io_1 = require("socket.io");
const auth_1 = require("./middleware/auth");
const user_1 = require("./user");
let io = null;
function initSocket(server) {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    io.use(auth_1.socketAuth);
    io.on("connection", (socket) => {
        const user = socket.user;
        console.log("🟢 Socket connected:", socket.id, user);
        if (user === null || user === void 0 ? void 0 : user.id) {
            (0, user_1.addUserConnection)(user.id, socket);
        }
        socket.on("disconnect", () => {
            console.log("🔴 Socket disconnected:", socket.id);
            if (user === null || user === void 0 ? void 0 : user.id) {
                (0, user_1.removeUserConnection)(user.id);
            }
        });
    });
}
function getIO() {
    if (!io)
        throw new Error("Socket.io not initialized!");
    return io;
}
