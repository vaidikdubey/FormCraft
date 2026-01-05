import { Schema } from "mongoose";
import { AvailableFormFields } from "../utils/constants.js";

export const formFieldSchema = new Schema({
  fieldKey: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: AvailableFormFields,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
  },
  required: {
    type: Boolean,
    required: false,
  },
  options: {
    type: [String],
    default: [],
  },
});
