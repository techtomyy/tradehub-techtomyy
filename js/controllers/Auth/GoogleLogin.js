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
exports.LoginWithGoogle = LoginWithGoogle;
const client_1 = __importDefault(require("../../config/client"));
const errorMessages_1 = require("../../constants/errorMessages");
const generateToken_1 = require("../../utils/generateToken");
function LoginWithGoogle(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const tokenHeader = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
            if (!tokenHeader) {
                return res.status(errorMessages_1.ERROR_CODES.UNAUTHORIZED).json({ error: errorMessages_1.ERROR_MESSAGES.GOOGLE.TOKEN_MISSING });
            }
            // 1. Get user from Supabase
            const { data, error } = yield client_1.default.auth.getUser(tokenHeader);
            if (error || !(data === null || data === void 0 ? void 0 : data.user)) {
                return res.status(errorMessages_1.ERROR_CODES.UNAUTHORIZED).json({ error: errorMessages_1.ERROR_MESSAGES.GOOGLE.INVALID_TOKEN });
            }
            const { id, email, user_metadata } = data.user;
            const fullName = (user_metadata === null || user_metadata === void 0 ? void 0 : user_metadata.full_name) || "Unknown User";
            const firstName = fullName.split(" ")[0] || "";
            const lastName = fullName.split(" ").slice(1).join(" ") || "";
            // 2. Check if user exists
            let { data: existingUser, error: userError } = yield client_1.default
                .from("users")
                .select("id")
                .eq("email", email)
                .maybeSingle();
            if (userError) {
                return res.status(errorMessages_1.ERROR_CODES.SERVER_ERROR).json({ error: `${errorMessages_1.ERROR_MESSAGES.DB.USERS_TABLE_ERROR}: ${userError.message}` });
            }
            let userId;
            if (!existingUser) {
                const { data: newUser, error: insertError } = yield client_1.default
                    .from("users")
                    .insert([{ email, firstName, lastName, conditionagree: true }])
                    .select("id")
                    .single();
                if (insertError) {
                    return res.status(errorMessages_1.ERROR_CODES.SERVER_ERROR).json({ error: `${errorMessages_1.ERROR_MESSAGES.DB.USERS_INSERT_ERROR}: ${insertError.message}` });
                }
                userId = newUser.id;
            }
            else {
                userId = existingUser.id;
            }
            // 3. Auth table update
            const { error: authError } = yield client_1.default
                .from("auth")
                .upsert([{ user_id: userId, googleid: id, isPasswordset: false }], { onConflict: "user_id" });
            if (authError) {
                return res.status(errorMessages_1.ERROR_CODES.SERVER_ERROR).json({ error: `${errorMessages_1.ERROR_MESSAGES.DB.AUTH_TABLE_ERROR}: ${authError.message}` });
            }
            // 4. Roles table update
            const { data: roleExists } = yield client_1.default
                .from("roles")
                .select("user_id")
                .eq("user_id", userId)
                .maybeSingle();
            if (!roleExists) {
                const { error: roleError } = yield client_1.default
                    .from("roles")
                    .insert([{ user_id: userId, role: "User" }]);
                if (roleError) {
                    return res.status(errorMessages_1.ERROR_CODES.SERVER_ERROR).json({ error: `${errorMessages_1.ERROR_MESSAGES.DB.ROLES_TABLE_ERROR}: ${roleError.message}` });
                }
            }
            // 5. Fetch role
            const { data: roleData, error: fetchRoleError } = yield client_1.default
                .from("roles")
                .select("role")
                .eq("user_id", userId)
                .maybeSingle();
            if (fetchRoleError || !roleData) {
                return res.status(errorMessages_1.ERROR_CODES.SERVER_ERROR).json({ error: errorMessages_1.ERROR_MESSAGES.DB.ROLES_FETCH_ERROR });
            }
            // 6. Generate JWT
            const jwtToken = (0, generateToken_1.generateToken)({
                id,
                email: email || "",
                role: roleData.role
            });
            // 7. Set cookie
            res.cookie("token", jwtToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict", maxAge: 24 * 60 * 60 * 1000, // 24 hours
            });
            return res.json({
                message: errorMessages_1.ERROR_MESSAGES.GOOGLE.MESSAGE_SUCCESS,
                user: { id, email, firstName, lastName, role: roleData.role }
            });
        }
        catch (err) {
            console.error("Google login error:", err);
            return res.status(errorMessages_1.ERROR_CODES.SERVER_ERROR).json({ error: errorMessages_1.ERROR_MESSAGES.AUTH.SERVER_ERROR });
        }
    });
}
