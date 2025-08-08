import jwt from 'jsonwebtoken';
import { ERROR_MESSAGES } from '../constants/errorMessages';
const { sign } = jwt;

// Define the user data type
interface UserData {
    id: string;
    email: string;
    role: 'User' | 'Admin';
}

// ---------------- Generate Token JWT(json web Token) ----------------
export const generateToken = (userData: UserData): string => {
    let secretKey: string | undefined;

    switch (userData.role) {
        case "User":
            secretKey = process.env.SECRET_KEY;
            break;
        case "Admin":
            secretKey = process.env.ADMIN_SECRET_KEY;
            break;
        default:
            return ERROR_MESSAGES.JWT.INVALID_DATA_USER;
    }

    if (!secretKey) {
        return ERROR_MESSAGES.JWT.SECRET_KEY_NOT_DEFINE;
    }

    return sign(userData, secretKey, { expiresIn: "6h" });
};
