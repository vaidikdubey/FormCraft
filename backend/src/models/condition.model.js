import mongoose, { mongo, Schema } from "mongoose";
import {
  AvailableConditionalOperators,
  AvailableConditionalActions,
} from "../utils/constants.js";

const conditionalRuleSchema = new Schema(
  {
    sourceFieldId: {
      type: Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },
    operator: {
      type: String,
      enum: AvailableConditionalOperators,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    targetFieldId: {
      type: Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },
    actions: {
      type: String,
      enum: AvailableConditionalActions,
      required: true,
    },
  },
  { timestamps: true },
);

export const Condition = mongoose.model("Condition", conditionalRuleSchema);
