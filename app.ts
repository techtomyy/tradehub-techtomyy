import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoute from "./routes/auth"
import { SignupTable } from "./models/SignupTable";
dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

SignupTable();
app.use("/auth", authRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
