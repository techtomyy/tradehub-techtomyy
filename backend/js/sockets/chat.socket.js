"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageToUser = sendMessageToUser;
const user_1 = require("./user");
function sendMessageToUser(userId, message) {
    const socket = (0, user_1.getUserSocket)(userId);
    if (socket) {
        socket.emit("message-send", message);
    }
}
