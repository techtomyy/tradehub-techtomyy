"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
const errorMessages_1 = require("../constants/errorMessages");
const jsonwebtoken_1 = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key_here";
function verifyToken(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(errorMessages_1.STATUS_CODES.UNAUTHORIZED).json({
                message: errorMessages_1.ERROR_MESSAGES.JWT.TOKEN_NOT_EXIST,
            });
        }
        (0, jsonwebtoken_1.verify)(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(errorMessages_1.STATUS_CODES.UNAUTHORIZED).json({
                    message: errorMessages_1.ERROR_MESSAGES.JWT.TOKEN_INVALID,
                });
            }
            if (!decoded || typeof decoded === "string") {
                return res.status(errorMessages_1.STATUS_CODES.UNAUTHORIZED).json({
                    message: errorMessages_1.ERROR_MESSAGES.JWT.TOKEN_INVALID,
                });
            }
            const payload = decoded;
            req.user = payload;
            next();
        });
    }
    catch (error) {
        console.error("❌ Error verifying token:", error);
        return res.status(errorMessages_1.STATUS_CODES.SERVER_ERROR).json({
            message: errorMessages_1.ERROR_MESSAGES.AUTH.SERVER_ERROR,
        });
    }
}
