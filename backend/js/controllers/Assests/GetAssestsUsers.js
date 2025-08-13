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
exports.getUserAssets = getUserAssets;
const client_1 = __importDefault(require("../../config/client"));
const errorMessages_1 = require("../../constants/errorMessages");
const bucketName = "assets";
function getUserAssets(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.user;
        if (!user) {
            return res.status(errorMessages_1.STATUS_CODES.BAD_REQUEST).json({
                message: errorMessages_1.ASSETS_ERROR_MESSAGES.NOT_USER_INFO
            });
        }
        const { id: user_id } = user;
        try {
            // Step 1: Fetch assets of the user
            const { data: assets, error: assetsError } = yield client_1.default
                .from("assets")
                .select("*")
                .eq("user_id", user_id);
            if (assetsError)
                throw assetsError;
            // Step 2: Fetch images for each asset from asset_images table
            const assetsWithImages = yield Promise.all(assets.map((asset) => __awaiter(this, void 0, void 0, function* () {
                const { data: images, error: imagesError } = yield client_1.default
                    .from("asset_images")
                    .select("*")
                    .eq("asset_id", asset.id);
                if (imagesError)
                    throw imagesError;
                const imagesWithUrls = images.map((img) => {
                    const { data } = client_1.default
                        .storage
                        .from(bucketName)
                        .getPublicUrl(img.file_name);
                    return Object.assign(Object.assign({}, img), { publicUrl: data.publicUrl });
                });
                return Object.assign(Object.assign({}, asset), { images: imagesWithUrls });
            })));
            return res.status(errorMessages_1.STATUS_CODES.SUCCESS).json({
                message: errorMessages_1.ASSETS_ERROR_MESSAGES.ASSETS_FETCH,
                assets: assetsWithImages
            });
        }
        catch (err) {
            console.error("❌ Exception:", err);
            return res.status(errorMessages_1.STATUS_CODES.SERVER_ERROR).json({
                error: err instanceof Error ? err.message : "Unknown error"
            });
        }
    });
}
