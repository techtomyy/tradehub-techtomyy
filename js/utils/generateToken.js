"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorMessages_1 = require("../constants/errorMessages");
const { sign } = jsonwebtoken_1.default;
// ---------------- Generate Token JWT(json web Token) ----------------
const generateToken = (userData) => {
    let secretKey;
    switch (userData.role) {
        case "User":
            secretKey = process.env.SECRET_KEY;
            break;
        case "Admin":
            secretKey = process.env.ADMIN_SECRET_KEY;
            break;
        default:
            return errorMessages_1.ERROR_MESSAGES.JWT.INVALID_DATA_USER;
    }
    if (!secretKey) {
        return errorMessages_1.ERROR_MESSAGES.JWT.SECRET_KEY_NOT_DEFINE;
    }
    return sign(userData, secretKey, { expiresIn: "6h" });
};
exports.generateToken = generateToken;
