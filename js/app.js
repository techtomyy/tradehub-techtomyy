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
const ListingTable_1 = require("./models/ListingTable");
const assests_1 = __importDefault(require("./routes/assests"));
dotenv_1.default.config(); // Load environment variables
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/auth", auth_1.default);
app.use("/assests", assests_1.default);
app.get("/", (req, res) => {
    res.send("Server is live 🚀");
});
(0, ListingTable_1.createAssestsTable)();
const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
