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
const SaveImageBucket_1 = require("./SaveImageBucket");
function AssetsSave(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { title, category_name, description, price, followers, engagement_rate, monthly_view, monthly_revenue, } = req.body;
            // User payload from request
            const user = req.user;
            if (!user) {
                return res.status(errorMessages_1.STATUS_CODES.UNAUTHORIZED).json({ error: errorMessages_1.ASSETS_ERROR_MESSAGES.BAD_REQUEST });
            }
            const { id: user_id, name, email } = user;
            const imageFile = req.file;
            // Validate required fields
            if (!title || !category_name || !price || !imageFile || !user_id) {
                return res.status(errorMessages_1.STATUS_CODES.BAD_REQUEST).json({ error: errorMessages_1.ASSETS_ERROR_MESSAGES.BAD_REQUEST });
            }
            // Validate image
            (0, SaveImageBucket_1.validateImage)(imageFile);
            // Insert into userdetails (if needed)
            const { error: userDetailsErr } = yield client_1.default
                .from("usersdetail")
                .insert([{ id: user_id, name: category_name, email }])
                .select()
                .single();
            if (userDetailsErr) {
                console.error("Userdetails insert error:", userDetailsErr);
                // You can decide to throw or handle gracefully
            }
            const { error: categoriesDetailsErr } = yield client_1.default
                .from("categories")
                .insert([{ id: user_id, category_name: category_name }])
                .select()
                .single();
            if (categoriesDetailsErr) {
                console.error("Userdetails insert error:", userDetailsErr);
                // You can decide to throw or handle gracefully
            }
            // Insert asset
            const { data: asset, error: assetErr } = yield client_1.default
                .from("assets")
                .insert([
                {
                    user_id,
                    asset_title: title,
                    category_name: category_name,
                    description,
                    price,
                    followers_subscribers: followers.toString(),
                    engagement_rate: engagement_rate.toString(),
                    monthly_view,
                    monthly_revenue,
                },
            ])
                .select()
                .single();
            if (assetErr)
                throw assetErr;
            // Upload image to bucket
            const { url, name: fileName } = yield (0, SaveImageBucket_1.uploadImageToBucket)(imageFile);
            // Insert into asset_images
            const { error: imgErr } = yield client_1.default
                .from("asset_images")
                .insert([
                {
                    asset_id: asset.id,
                    user_id,
                    file_name: fileName,
                    file_url: url,
                    mime_type: imageFile.mimetype,
                },
            ]);
            if (imgErr)
                throw imgErr;
            return res.status(errorMessages_1.STATUS_CODES.SUCCESS).json({
                message: errorMessages_1.ASSETS_ERROR_MESSAGES.MESSAGE,
                asset,
            });
        }
        catch (err) {
            console.error("❌ Exception:", err);
            return res.status(errorMessages_1.STATUS_CODES.SERVER_ERROR).json({
                error: err instanceof Error ? err.message : "Unknown error",
            });
        }
    });
}
