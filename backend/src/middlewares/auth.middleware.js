import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";
import { cookieOptions } from "../utils/constants.js";

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  //get access token & refresh token from req.cookie()
  //if no access token && refresh token -> return res
  //if found -> verify access token
  //if valid -> next
  //if invalid -> match refresh token
  //if valid -> generate and store new access and refresh tokens -> next()
  //attach req.user() before any next()
  //if invalid -> return unauthorised response

  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken && !refreshToken) throw new ApiError(401, "Unauthorized");

  if (accessToken) {
    try {
      const decodedToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
      );

      req.user = decodedToken;

      return next();
    } catch (error) {
      console.log("Access token expired/invalid, checking refresh token...");
    }
  }

  if (refreshToken) {
    try {
      const decodedToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );

      const user = await User.findById(decodedToken.id);

      if (!user || refreshToken != user.refreshToken)
        throw new ApiError(401, "Unauthorized");

      const newAccessToken = user.generateAccessToken();
      const newRefreshToken = user.generateRefreshToken();

      user.refreshToken = newRefreshToken;

      await user.save({ validateBeforeSave: false });

      res.cookie("accessToken", newAccessToken, cookieOptions);

      const refreshTokenCookieOptions = {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, //7days
      };

      res.cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions);

      req.user = { id: decodedToken.id };

      return next();
    } catch (error) {
      throw new ApiError(401, "Unauthorized");
    }
  }
});
