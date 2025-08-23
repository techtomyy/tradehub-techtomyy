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
exports.chatTables = void 0;
const client_1 = __importDefault(require("../config/client"));
const chatTables = () => __awaiter(void 0, void 0, void 0, function* () {
    // Messages table
    const messagesTable = `
CREATE TABLE IF NOT EXISTS public.messages (
  message_id SERIAL PRIMARY KEY DEFAULT gen_random_uuid() ,
  sender_id INT NOT NULL, -- assign from JSON token in backend
  receiver_id INT NOT NULL, -- assign from backend logic
  message_text TEXT,
  digital_asset_url VARCHAR(255),
  is_read BOOLEAN  DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);`;
    // Execute messages table query
    const { error: messagesError } = yield client_1.default.rpc('execute_sql', { sql: messagesTable });
    if (messagesError)
        return console.error("❌ Messages table error:", messagesError.message);
    console.log("✅ Chats and Messages tables created successfully!");
});
exports.chatTables = chatTables;
