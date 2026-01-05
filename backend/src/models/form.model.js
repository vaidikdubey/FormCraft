import mongoose, { Schema } from "mongoose";
import { formFieldSchema } from "./formField.schema.js";
import { conditionalRuleSchema } from "./condition.schema.js";

const formSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fields: [formFieldSchema],

    conditions: [conditionalRuleSchema],

    allowAnonymous: {
      type: Boolean,
      default: false,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    publicURL: {
      type: String,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true },
);

formSchema.index({ ownerId: 1 });

export const Form = mongoose.model("Form", formSchema);
