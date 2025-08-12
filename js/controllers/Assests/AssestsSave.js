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
exports.AssetsSave = AssetsSave;
const errorMessages_1 = require("../../constants/errorMessages");
const client_1 = __importDefault(require("../../config/client"));
const crypto_1 = require("crypto");
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
            .from("assets-bucket")
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
function AssetsSave(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { title, category_id, description, price, followers, engagement_rate, monthly_view, monthly_revenue, } = req.body;
            const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const imageFile = req.file;
            if (!title || !category_id || !price || !imageFile || !user_id) {
                return res.status(errorMessages_1.ERROR_CODES.BAD_REQUEST).json({ error: errorMessages_1.ASSETS_ERROR_MESSAGES.BAD_REQUEST });
            }
            validateImage(imageFile);
            // Step 1: Insert asset
            const { data: asset, error: assetErr } = yield client_1.default
                .from("assets")
                .insert([{
                    user_id: user_id,
                    asset_title: title,
                    category_id: Number(category_id),
                    description,
                    price,
                    followers_subscribers: followers.toString(),
                    engagement_rate: engagement_rate.toString(),
                    monthly_view,
                    monthly_revenue
                }])
                .select()
                .single();
            if (assetErr)
                throw assetErr;
            // Step 2: Upload image to bucket
            const { url, name } = yield uploadImageToBucket(imageFile);
            // Step 3: Insert into asset_images
            const { error: imgErr } = yield client_1.default
                .from("asset_images")
                .insert([{
                    asset_id: asset.id,
                    user_id,
                    file_name: name,
                    file_url: url,
                    mime_type: imageFile.mimetype
                }]);
            if (imgErr)
                throw imgErr;
            return res.status(errorMessages_1.ERROR_CODES.SUCCESS).json({
                message: errorMessages_1.ASSETS_ERROR_MESSAGES.MESSAGE,
                asset
            });
        }
        catch (err) {
            console.error("❌ Exception:", err);
            return res.status(errorMessages_1.ERROR_CODES.SERVER_ERROR).json({
                error: err instanceof Error ? err.message : "Unknown error",
            });
        }
    });
}
