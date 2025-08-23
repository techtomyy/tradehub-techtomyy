import express from 'express';
import { SignupUser } from "../controllers/Auth/SignupUser";
import { LoginUser } from '../controllers/Auth/LoginUser';
import { LoginWithGoogle } from '../controllers/Auth/GoogleLogin';
import { getSettings } from "../controllers/settingController";
const router = express.Router()
router.post('/register/signup', SignupUser);
router.post('/user/login', LoginUser);
router.post("/api",LoginWithGoogle);
router.get("/settings", getSettings);
export default router
