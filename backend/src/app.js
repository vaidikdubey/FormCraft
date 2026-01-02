import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.BASE_URL || process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "OPTIONS", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Custom routes import

export default app;
