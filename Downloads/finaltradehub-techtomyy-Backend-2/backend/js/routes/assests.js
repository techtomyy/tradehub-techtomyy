"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const AssestsSave_1 = require("../controllers/Assests/AssestsSave");
const verifyToken_1 = require("../middleware/verifyToken");
const GetAssestsUsers_1 = require("../controllers/Assests/GetAssestsUsers");
const upload = (0, multer_1.default)();
let router = express_1.default.Router();
router.post("/user/assests-data", upload.single('image'), verifyToken_1.verifyToken, AssestsSave_1.AssetsSave);
router.get("/user/get-assets", verifyToken_1.verifyToken, GetAssestsUsers_1.getUserAssets);
exports.default = router;