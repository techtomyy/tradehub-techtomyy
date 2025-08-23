import express from 'express'
import multer from "multer";
import { AssetsSave } from '../controllers/Assests/AssestsSave';
import { verifyToken } from '../middleware/verifyToken';
import { getUserAssets } from '../controllers/Assests/GetAssestsUsers';

const upload = multer();
let router = express.Router();

router.post("/user/assests-data", upload.single('image'), verifyToken, AssetsSave);
router.get("/user/get-assets", verifyToken, getUserAssets)




export default router; 