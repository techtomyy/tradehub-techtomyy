"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUser = LoginUser;
const errorMessages_1 = require("../../constants/errorMessages");
const client_1 = __importDefault(require("../../config/client"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateToken_1 = require("../../utils/generateToken");
function LoginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            // 1. Get user by email from 'users' table
            const { data: user, error: userError } = yield client_1.default
                .from("users")
                .select("id, email")
                .eq("email", email)
                .maybeSingle();
            if (userError) {
                console.error("❌ Error fetching user:", userError.message);
                return res.status(500).json({ error: errorMessages_1.ERROR_MESSAGES.AUTH.SERVER_ERROR });
            }
            if (!user) {
                return res
                    .status(401)
                    .json({ error: errorMessages_1.ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS_EMAIL });
            }
            // 2. Get hashed password from auth table
            const { data: authData, error: authError } = yield client_1.default
                .from("auth")
                .select("password")
                .eq("user_id", user.id)
                .maybeSingle();
            if (authError || !authData) {
                console.error("❌ Error fetching password:", authError === null || authError === void 0 ? void 0 : authError.message);
                return res.status(401).json({ error: errorMessages_1.ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS });
            }
            // 3. Compare password
            const isMatch = yield bcrypt_1.default.compare(password, authData.password);
            if (!isMatch) {
                return res
                    .status(401)
                    .json({ error: errorMessages_1.ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS_PASSWORD });
            }
            // 4. Get role
            const { data: roleData, error: roleError } = yield client_1.default
                .from("roles")
                .select("role")
                .eq("user_id", user.id)
                .maybeSingle();
            if (roleError || !roleData) {
                console.error("❌ Error fetching role:", roleError === null || roleError === void 0 ? void 0 : roleError.message);
                return res.status(500).json({ error: errorMessages_1.ERROR_MESSAGES.AUTH.SERVER_ERROR });
            }
            // 5. Generate Token
            const tokenPayload = {
                id: user.id,
                email: user.email,
                role: roleData.role,
            };
            const token = (0, generateToken_1.generateToken)(tokenPayload);
            // 6. Set token in cookie
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
            });
            // 7. Return success
            return res.status(200).json({ message: "✅ Login successful!" });
        }
        catch (error) {
            console.error("❌ Login Error:", error);
            return res.status(500).json({ error: errorMessages_1.ERROR_MESSAGES.AUTH.SERVER_ERROR });
        }
    });
}
