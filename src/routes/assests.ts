import express from 'express'
import { AssetsSave } from '../controllers/Assests/AssestsSave';

let router = express.Router();

router.post("/user/assests-data", AssetsSave);





export default router; 