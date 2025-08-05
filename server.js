import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Middlewares
app.use(json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors());

app.get("/", (req, res) => {
    res.send(`
    <html>
      <head><title>Welcome</title></head>
      <body>
        <h1>Welcome to Express Server!</h1>
      </body>
    </html>
  `);
});
