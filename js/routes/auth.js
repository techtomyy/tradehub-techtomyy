"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SignupUser_1 = require("../controllers/Auth/SignupUser");
const LoginUser_1 = require("../controllers/Auth/LoginUser");
const GoogleLogin_1 = require("../controllers/Auth/GoogleLogin");
const router = express_1.default.Router();
router.post('/register/signup', SignupUser_1.SignupUser);
router.post('/user/login', LoginUser_1.LoginUser);
router.post("/api", GoogleLogin_1.LoginWithGoogle);
exports.default = router;
