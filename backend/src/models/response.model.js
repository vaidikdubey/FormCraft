import mongoose, { Schema } from "mongoose";

const responseSchema = new Schema(
  {
    formId: {
      type: Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },
    answer: {
      type: Map,
      of: Schema.Types.Mixed,
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

responseSchema.index({ formId: 1 });

export const Response = mongoose.model("Response", responseSchema);
