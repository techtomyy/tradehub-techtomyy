import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoute from "./routes/auth";
import {createAssestsTable} from "./models/ListingTable";
import assestRoute from "./routes/assests";
import {initSocket} from "./sockets/index";
import http from "http";

dotenv.config(); // Load environment variables

const app = express();
const server = http.createServer(app);

// Init socket
initSocket(server);

// Middleware
app.use(
  cors({
    origin: true,          
    credentials: true,   
  })
);

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
server.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
 