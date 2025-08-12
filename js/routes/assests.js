"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AssestsSave_1 = require("../controllers/Assests/AssestsSave");
let router = express_1.default.Router();
router.post("/user/assests-data", AssestsSave_1.AssetsSave);
exports.default = router;
