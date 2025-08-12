import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoute from "./routes/auth";
import {createAssestsTable} from "./models/ListingTable";
import assestRoute from "./routes/assests"
dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoute);
app.use("/assests", assestRoute);

app.get("/", (req, res) => {
  res.send("Server is live 🚀");
});
createAssestsTable()


const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
 