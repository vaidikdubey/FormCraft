import mongoose, { Schema } from "mongoose";
import { AvailableFormFields, FormFieldTypes } from "../utils/constants.js";

const formFieldSchema = new Schema(
  {
    type: {
      type: String,
      enum: AvailableFormFields,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      required: true,
    },
    options: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

export const Field = mongoose.model("Field", formFieldSchema);
