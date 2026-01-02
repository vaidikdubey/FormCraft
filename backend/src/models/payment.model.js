import mongoose, { Schema } from "mongoose";
import {
  AvailablePaymentStatus,
  PaymentStatusEnum,
} from "../utils/constants.js";

const paymentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    provider: {
      type: String,
      default: "razorpay",
    },
    status: {
      type: String,
      enum: AvailablePaymentStatus,
      default: PaymentStatusEnum.PENDING,
    },
  },
  { timestamps: true },
);

export const Payment = mongoose.model("Payment", paymentSchema);

/*
Pyment statuses details {enum -> status -> explanation}
pending	-> created -> The default state. The user has opened the checkout but hasn't paid yet.
authorized -> authorized -> Critical: The bank says the user has money, but you haven't "claimed" it yet. Use this to prevent double-charging.
completed -> captured -> Success: The money is officially yours. This is the trigger to grant the user access to your service.
failed -> failed -> Error: The transaction was rejected by the bank or cancelled by the user.
refunded -> refunded -> Post-Payment: You have sent the money back to the user.
reversed -> reversed / rejected -> Safety: Used if a payout fails or a captured payment is clawed back by the bank.
*/
