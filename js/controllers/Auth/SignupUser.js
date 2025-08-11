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
exports.SignupUser = SignupUser;
const errorMessages_1 = require("../../constants/errorMessages");
const client_1 = __importDefault(require("../../config/client"));
const generateToken_1 = require("../../utils/generateToken");
const bcrypt_1 = __importDefault(require("bcrypt"));
function SignupUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { firstName, lastName, email, password, conditionagree } = req.body;
            console.log(req.body);
            // 1. Check if user already exists
            const { data: existingUser, error: checkError } = yield client_1.default
                .from("users")
                .select("id")
                .eq("email", email)
                .maybeSingle();
            if (checkError) {
                console.error("❌ Error checking existing user:", checkError.message);
                return res
                    .status(errorMessages_1.ERROR_CODES.SERVER_ERROR)
                    .json({ error: errorMessages_1.ERROR_MESSAGES.DB.USERS_TABLE_ERROR });
            }
            if (existingUser) {
                return res
                    .status(errorMessages_1.ERROR_CODES.BAD_REQUEST)
                    .json({ error: errorMessages_1.ERROR_MESSAGES.GENERAL.USER_ALREADY_EXISTS });
            }
            // 2. Hash password
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            // 3. Insert into `users` table
            const { data: userInsert, error: userError } = yield client_1.default
                .from("users")
                .insert([
                {
                    firstname: firstName,
                    lastname: lastName,
                    email: email,
                    conditionagree: conditionagree,
                },
            ])
                .select()
                .single();
            if (userError || !userInsert) {
                console.error("❌ Error inserting user:", userError === null || userError === void 0 ? void 0 : userError.message);
                return res
                    .status(errorMessages_1.ERROR_CODES.SERVER_ERROR)
                    .json({ error: errorMessages_1.ERROR_MESSAGES.DB.USERS_INSERT_ERROR });
            }
            const userId = userInsert.id;
            // 4. Insert into `auth` table
            const { error: authError } = yield client_1.default.from("auth").insert([
                {
                    user_id: userId,
                    password: hashedPassword,
                    ispasswordset: true,
                    googleid: null,
                },
            ]);
            if (authError) {
                console.error("❌ Error inserting auth:", authError.message);
                return res
                    .status(errorMessages_1.ERROR_CODES.SERVER_ERROR)
                    .json({ error: errorMessages_1.ERROR_MESSAGES.DB.AUTH_TABLE_ERROR });
            }
            // 5. Insert into `roles` table
            const { data: roleAdd, error: roleError } = yield client_1.default
                .from("roles")
                .insert([
                {
                    user_id: userId,
                    role: "User",
                },
            ])
                .select()
                .single();
            if (roleError || !roleAdd) {
                console.error("❌ Error inserting role:", roleError === null || roleError === void 0 ? void 0 : roleError.message);
                return res
                    .status(errorMessages_1.ERROR_CODES.SERVER_ERROR)
                    .json({ error: errorMessages_1.ERROR_MESSAGES.DB.ROLES_TABLE_ERROR });
            }
            // 6. Generate Token
            const user = {
                id: roleAdd.user_id,
                email: email,
                role: roleAdd.role,
            };
            const token = (0, generateToken_1.generateToken)(user);
            // 7. Set Cookie
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000,
            });
            return res.status(201).json({
                message: "✅ User signed up successfully!",
            });
        }
        catch (error) {
            console.error("❌ Unexpected error:", error);
            return res
                .status(errorMessages_1.ERROR_CODES.SERVER_ERROR)
                .json({ error: errorMessages_1.ERROR_MESSAGES.AUTH.SERVER_ERROR });
        }
    });
}
