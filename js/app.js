"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const SignupTable_1 = require("./models/SignupTable");
dotenv_1.default.config(); // Load environment variables
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
(0, SignupTable_1.SignupTable)();
app.use("auth", auth_1.default);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
