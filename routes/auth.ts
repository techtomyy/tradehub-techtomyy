import express from 'express'
import { SignupUser } from "../controllers/Auth/SignupUser";
import { LoginUser } from '../controllers/Auth/LoginUser';
const router = express.Router()


router.post('/register/signup', SignupUser);
router.get('/user/login', LoginUser);


export default router
