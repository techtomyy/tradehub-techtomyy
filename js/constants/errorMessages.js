"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ASSETS_ERROR_MESSAGES = exports.ERROR_MESSAGES = exports.ERROR_CODES = void 0;
exports.ERROR_CODES = {
    UNAUTHORIZED: 401,
    BAD_REQUEST: 400,
    SERVER_ERROR: 500,
    NOT_FOUND: 404,
    SUCCESS: 200
};
exports.ERROR_MESSAGES = {
    GENERAL: {
        USER_ALREADY_EXISTS: "A user with this email already exists.",
        SIGNUP_FAILED: "Signup failed. Please try again later.",
    },
    AUTH: {
        SERVER_ERROR: "Something went wrong. Please try again.",
        INVALID_CREDENTIALS: "Invalid email or password.",
        INVALID_CREDENTIALS_EMAIL: "No user found with this email.",
        INVALID_CREDENTIALS_PASSWORD: "Password is incorrect.",
    },
    INPUT: {
        INVALID: "Invalid input. Please check your data.",
    },
    JWT: {
        SECRET_KEY_NOT_DEFINE: "Secret key not defined in environment variables",
        INVALID_DATA_USER: "Invalid user role",
        TOKEN_NOT_EXIST: "Token not exists! Please Login",
        TOKEN_INVALID: "Your Token Invaled"
    },
    GOOGLE: {
        TOKEN_MISSING: "No token provided",
        INVALID_TOKEN: "Invalid token",
        MESSAGE_SUCCESS: "User authenticated & stored"
    },
    DB: {
        USERS_TABLE_ERROR: "Users table error",
        USERS_INSERT_ERROR: "Insert user error",
        AUTH_TABLE_ERROR: "Auth table error",
        ROLES_TABLE_ERROR: "Roles table error",
        ROLES_FETCH_ERROR: "Role fetch failed"
    }
};
exports.ASSETS_ERROR_MESSAGES = {
    ONLY_ALLOWED: "Only JPG, PNG, WebP, and GIF are allowed.",
    BAD_REQUEST: "Missing required fields",
    UPLOAD_FAILED: "File Save in Storage Failed",
    MESSAGE: "✅ Asset saved successfully"
};
