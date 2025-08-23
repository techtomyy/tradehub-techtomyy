"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userConnections = void 0;
exports.addUserConnection = addUserConnection;
exports.removeUserConnection = removeUserConnection;
exports.getUserSocket = getUserSocket;
// Map: userId -> socket
exports.userConnections = new Map();
function addUserConnection(userId, socket) {
    exports.userConnections.set(userId, socket);
}
function removeUserConnection(userId) {
    exports.userConnections.delete(userId);
}
function getUserSocket(userId) {
    return exports.userConnections.get(userId);
}
