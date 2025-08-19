"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageToUser = sendMessageToUser;
const user_1 = require("./user");
function sendMessageToUser(userId, message) {
    const socket = (0, user_1.getUserSocket)(userId);
    console.log("send the message");
    if (socket) {
        setTimeout(() => {
            socket.emit("message-send", message);
        }, 10000);
    }
}
