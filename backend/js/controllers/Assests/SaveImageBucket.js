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
exports.validateImage = validateImage;
exports.uploadImageToBucket = uploadImageToBucket;
const client_1 = __importDefault(require("../../config/client"));
const crypto_1 = require("crypto");
const errorMessages_1 = require("../../constants/errorMessages");
const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
function validateImage(file) {
    if (!allowedTypes.includes(file.mimetype)) {
        throw new Error(errorMessages_1.ASSETS_ERROR_MESSAGES.ONLY_ALLOWED);
    }
}
function uploadImageToBucket(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileExt = file.originalname.split(".").pop();
        const fileName = `${(0, crypto_1.randomUUID)()}.${fileExt}`;
        const filePath = `assets/${fileName}`;
        const { error } = yield client_1.default.storage
            .from("assets")
            .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
        });
        if (error) {
            throw new Error(errorMessages_1.ASSETS_ERROR_MESSAGES.UPLOAD_FAILED);
        }
        const { data } = client_1.default.storage.from("assets-bucket").getPublicUrl(filePath);
        return { url: data.publicUrl, name: fileName };
    });
}
