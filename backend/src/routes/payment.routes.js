import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  createOrder,
  verifyPayment,
} from "../controllers/payment.controllers.js";

const router = Router();

router.route("/create").post(isLoggedIn, createOrder);

router.route("/verify").post(isLoggedIn, verifyPayment);

export default router;
