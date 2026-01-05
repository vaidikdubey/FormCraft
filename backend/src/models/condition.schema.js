import { Schema } from "mongoose";
import {
  AvailableConditionalOperators,
  AvailableConditionalActions,
} from "../utils/constants.js";

export const conditionalRuleSchema = new Schema({
  sourceFieldId: {
    type: String,
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
    type: String,
    required: true,
  },
  actions: {
    type: String,
    enum: AvailableConditionalActions,
    required: true,
  },
});
