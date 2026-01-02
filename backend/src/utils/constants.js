export const UserRolesEnum = {
  FREE: "free",
  PAID: "paid",
};

export const AvailableUserRoles = Object.values(UserRolesEnum);

export const ConditionalRulesActions = {
  SHOW: "show",
  HIDE: "hide",
};

export const AvailableConditionalActions = Object.values(
  ConditionalRulesActions,
);

export const FormFieldTypes = {
  TEXT: "text",
  EMAIL: "email",
  DROPDOWN: "dropdown",
  DATE: "date",
  CHECKBOX: "checkbox",
};

export const AvailableFormFields = Object.values(FormFieldTypes);

export const ConditionalRulesOperators = {
  EQUALS: "equals",
};

export const AvailableConditionalOperators = Object.values(
  ConditionalRulesOperators,
);

export const PaymentStatusEnum = {
  PENDING: "pending",
  AUTHORIZED: "authorized",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
  REVERSED: "reversed",
};

export const AvailablePaymentStatus = Object.values(PaymentStatusEnum);
