import { ApiError } from "./api-error.js";

export function asyncHandler(fn) {
  return async function (req, res, next) {
    try {
      const result = await fn(req, res, next);

      return result;
    } catch (error) {
      const formattedError =
        error instanceof ApiError
          ? error
          : new ApiError(
              500,
              error.message || "Internal server error",
              [error],
              error.stack,
            );

      next(formattedError);
    }
  };
}
