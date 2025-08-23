"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_1 = __importDefault(require("cookie"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables
const socketAuth = (socket, next) => {
    const cookies = socket.handshake.headers.cookie;
    console.log(cookies);
    if (!cookies)
        return next(new Error("❌ No cookies found"));
    const parsedCookies = cookie_1.default.parse(cookies);
    const token = parsedCookies.token;
    if (!token)
        return next(new Error("❌ No token in cookies"));
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        if (decoded.role === "User") {
            console.log("✅ user authenticated:", decoded.email);
            // save decoded user inside socket
            socket.user = decoded;
            next();
        }
        else {
            next(new Error("❌ Invalid role"));
        }
    }
    catch (err) {
        console.error("JWT Error:", err.message);
        next(new Error("❌ Invalid token"));
    }
};
exports.socketAuth = socketAuth;
