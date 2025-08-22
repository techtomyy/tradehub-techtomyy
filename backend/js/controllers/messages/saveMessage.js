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
exports.saveMessageDB = void 0;
const client_js_1 = __importDefault(require("../../config/client.js"));
const saveMessageDB = (message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // 👇 insert only specific columns jo tumhare table me hain
        const { data, error } = yield client_js_1.default
            .from("messages")
            .insert([
            {
                chat_id: message.chat_id,
                sender_id: message.sender_id,
                receiver_id: message.receiver_id,
                message_text: message.message_text,
                is_read: (_a = message.is_read) !== null && _a !== void 0 ? _a : false,
            },
        ])
            .select();
        if (error)
            throw error;
        return data[0]; // ✅ return inserted row
    }
    catch (error) {
        console.error("❌ Error saving message:", error.message);
        throw error;
    }
});
exports.saveMessageDB = saveMessageDB;
