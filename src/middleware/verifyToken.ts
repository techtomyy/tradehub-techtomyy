import { Request, Response, NextFunction } from "express";
import { ERROR_MESSAGES, STATUS_CODES } from "../constants/errorMessages";
import { verify, JwtPayload, VerifyErrors } from "jsonwebtoken";



interface UserPayload {
    id: string;
    email: string;
    role: string;
}

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key_here";

export function verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                message: ERROR_MESSAGES.JWT.TOKEN_NOT_EXIST,
            });
        }

        verify(token, SECRET_KEY, (err: VerifyErrors | null, decoded: string | UserPayload | JwtPayload | undefined) => {
            if (err) {
                return res.status(STATUS_CODES.UNAUTHORIZED).json({
                    message: ERROR_MESSAGES.JWT.TOKEN_INVALID,
                });
            }

            if (!decoded || typeof decoded === "string") {
                return res.status(STATUS_CODES.UNAUTHORIZED).json({
                    message: ERROR_MESSAGES.JWT.TOKEN_INVALID,
                });
            }

            const payload = decoded as UserPayload;

            (req as any).user = payload;
            next();
        });
    } catch (error) {
        console.error("❌ Error verifying token:", error);
        return res.status(STATUS_CODES.SERVER_ERROR).json({
            message: ERROR_MESSAGES.AUTH.SERVER_ERROR,
        });
    }
}
