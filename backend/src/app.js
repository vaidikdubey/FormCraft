import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";
import { asyncHandler } from "./utils/async-handler.js";

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

// Any error thrown in routes above will end up here
app.use(errorHandler);

export default app;
