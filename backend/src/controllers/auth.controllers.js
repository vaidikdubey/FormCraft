import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  emailReverificationMailgenContent,
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  profileDeletionMailgenContent,
  sendEmail,
  verifiedEmailMailgenContent,
} from "../utils/mail.js";
import { cookieOptions, cookieOptions } from "../utils/constants.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const temporaryToken = user.generateTemporaryToken();

  user.emailVerificationToken = temporaryToken.token;
  user.emailVerificationExpiry = temporaryToken.tokenExpiry;

  await user.save();

  const emailOptions = {
    email: user.email,
    subject: "Verify your email",
    mailgenContent: emailVerificationMailgenContent(
      user.name,
      `${process.env.BASE_URL}/api/v1/auth/verify/${temporaryToken.token}`,
    ),
  };

  await sendEmail(emailOptions);

  res.status(201).json(
    new ApiResponse(
      201,
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      "User created successfully",
    ),
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw new ApiError(404, "All fields are required");

  const user = await User.findOne({ email });

  if (!user) throw new ApiError(401, "Invalid credentials");

  const isPasswordMatched = await user.isPasswordCorrect(password);

  if (!isPasswordMatched) throw new ApiError(401, "Invalid credentials");

  const newAccessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

  user.refreshToken = newRefreshToken;

  await user.save();

  res.cookie("accessToken", newAccessToken, cookieOptions);

  const refreshTokenCookieOptions = {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, //7days
  };

  res.cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        id: user._id,
        name: user.name,
        email: user.email,
        accessToken: newAccessToken,
      },
      "User login successful",
    ),
  );
});

const verifyUser = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!token) throw new ApiError(404, "Token not found");

  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpiry: { $gt: Date.now() },
  });

  if (!user) throw new ApiError(404, "Invalid token");

  user.isEmailVerified = true;

  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;

  await user.save();

  const emailOptions = {
    email: user.email,
    subject: "Welcome to FormCraft!",
    mailgenContent: verifiedEmailMailgenContent(user.name),
  };

  await sendEmail(emailOptions);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      "Email verification successful",
    ),
  );
});

const logoutUser = asyncHandler(async (req, res) => {
  const clearCookieOptions = {
    ...cookieOptions,
    maxAge: new Date(0),
  };

  res.clearCookie("accessToken", clearCookieOptions);
  res.clearCookie("refreshToken", clearCookieOptions);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { message: "Tokens cleared" },
        "User logout successful",
      ),
    );
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select(
    "-password -forgotPasswordToken -forgotPasswordExpiry -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  if (!user) throw new ApiError(404, "User not found");

  res.status(200).json(
    new ApiResponse(
      200,
      {
        name: user.name,
        email: user.email,
        role: user.role,
        responseLimit: user.responseLimit,
        isEmailVerified: user.isEmailVerified,
      },
      "User profile found",
    ),
  );
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) throw new ApiError(404, "All fields are required");

  const user = await User.findOne({ email });

  if (!user) throw new ApiError(404, "Invalid email address");

  const temporaryToken = user.generateTemporaryToken();

  user.resetPasswordToken = temporaryToken.token;
  user.resetPasswordExpiry = temporaryToken.tokenExpiry;

  await user.save();

  const mailOptions = {
    email: user.email,
    subject: "Reset your password",
    mailgenContent: forgotPasswordMailgenContent(
      user.name,
      `${process.env.BASE_URL}/api/v1/auth/reset-password/${temporaryToken.token}`,
    ),
  };

  await sendEmail(mailOptions);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { message: "Email sent successfully" },
        "Forgot password successful",
      ),
    );
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const { password } = req.body;

  if (!token) throw new ApiError(404, "Token not found");

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) throw new ApiError(404, "User not found");

  user.password = password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;

  await user.save();

  res.status(200).json(
    new ApiResponse(
      200,
      {
        id: user._id,
        email: user.email,
      },
      "Password reset successful",
    ),
  );
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) throw new ApiError(404, "User not found");

  const temporaryToken = user.generateTemporaryToken();

  user.emailVerificationToken = temporaryToken.token;
  user.emailVerificationExpiry = temporaryToken.tokenExpiry;

  await user.save();

  const emailOptions = {
    email: user.email,
    subject: "Verify your email",
    mailgenContent: resendVerificationEmail(
      user.name,
      `${process.env.BASE_URL}/api/v1/auth/verify/${temporaryToken.token}`,
    ),
  };

  await sendEmail(emailOptions);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      "Verification email sent successfully",
    ),
  );
});

const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) throw new ApiError(404, "User not found");

  const { oldPassword, newPassword } = req.body;

  const isPasswordMatched = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordMatched)
    throw new ApiError(400, "Incorrect existing password");

  user.password = newPassword;

  const newAccessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

  user.refreshToken = newRefreshToken;

  await user.save();

  res.cookie("accessToken", newAccessToken, cookieOptions);

  const refreshTokenCookieOptions = {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, //7days
  };

  res.cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        id: user._id,
        name: user.name,
        email: user.email,
        accessToken: newAccessToken,
      },
      "Password change successful",
    ),
  );
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (!name && !email)
    throw new ApiError(400, "Please provide name or email to be updated");

  const updatedData = {};

  if (name) updatedData.name = name;

  if (email) {
    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser._id.toString() !== req.user.id)
      throw new ApiError(
        409,
        "Email is already registered with another account",
      );
    updatedData.email = email;
    updatedData.isEmailVerified = false;

    const emailOptions = {
      email: user.email,
      subject: "Verify your email",
      mailgenContent: emailReverificationMailgenContent(
        user.name,
        `${process.env.BASE_URL}/api/v1/auth/verify/${temporaryToken.token}`,
      ),
    };

    await sendEmail(emailOptions);
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $set: updatedData },
    { new: true, runValidators: true },
  ).select("-password -refreshToken");

  if (!user) throw new ApiError(404, "User not found");

  res.status(200).json(
    new ApiResponse(
      200,
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      "User profile updated",
    ),
  );
});

const deleteProfile = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.user.id);

  if (!user) throw new ApiError(404, "User not found");

  const emailOptions = {
    email: user.email,
    subject: "FormCraft account deletion",
    mailgenContent: profileDeletionMailgenContent(user.name),
  };

  await sendEmail(emailOptions);

  const clearCookieOptions = {
    ...cookieOptions,
    maxAge: new Date(0),
  };

  res
    .clearCookie("accessToken", clearCookieOptions)
    .clearCookie("refreshToken", clearCookieOptions)
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          name: user.name,
          email: user.email,
          deletedAt: new Date(),
        },
        "User account and session deleted successfully",
      ),
    );
});

export {
  registerUser,
  loginUser,
  verifyUser,
  logoutUser,
  getProfile,
  forgotPassword,
  resetPassword,
  resendVerificationEmail,
  refreshAccessToken,
  changePassword,
  updateProfile,
  deleteProfile,
};
