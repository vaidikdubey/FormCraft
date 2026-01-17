import Razorpay from "razorpay";
import crypty from "crypto";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { UserRolesEnum } from "../utils/constants.js";
import "dotenv/config";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = asyncHandler(async (req, res) => {
  const amount = 499; //INR 49900 paise

  const options = {
    amount: amount * 100, //convert amount to paise
    currency: "INR",
    receipt: `rcpt_${req.user.id.toString().slice(-6)}_${Math.floor(Math.random() * 10000)}`,
    payment_capture: 1,
  };

  const order = await razorpay.orders.create(options);

  res.status(200).json(
    new ApiResponse(200, {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    }),
  );
});

const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
    throw new ApiError(400, "Payment details missing");

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypty
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature)
    throw new ApiError(400, "Invalid payment signature");

  const user = await User.findById(req.user.id);

  if (!user) throw new ApiError(404, "User not found");

  user.role = UserRolesEnum.PAID;
  user.responseLimit = 250;

  await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, user, "Payment verified. PRO plan activated!"));
});

export { createOrder, verifyPayment };
