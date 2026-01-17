import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? process.env.BASE_URL,
    credentials: true,
    methods: ["GET", "POST", "OPTIONS", "DELETE", "PATCH", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization", "Content-Disposition"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Custom routes import
import authRouter from "./routes/auth.routes.js";
import formRouter from "./routes/form.routes.js";
import responseRouter from "./routes/response.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import healthCheckRouter from "./routes/healthcheck.routes.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/form", formRouter);
app.use("/api/v1/response", responseRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/healthcheck", healthCheckRouter);

// Any error thrown in routes above will end up here
app.use(errorHandler);

export default app;
