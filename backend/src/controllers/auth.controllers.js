import { Apiresponse } from "../utils/apiresponse.js";
import { ApiError } from "../utils/api-error.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/async-handler.js";

const registerUser = asyncHandler(async (req, res) => {});

const loginUser = asyncHandler(async (req, res) => {});

const verifyUser = asyncHandler(async (req, res) => {});

const logoutUser = asyncHandler(async (req, res) => {});

const getProfile = asyncHandler(async (req, res) => {});

const forgotPassword = asyncHandler(async (req, res) => {});

const resetPassword = asyncHandler(async (req, res) => {});

const resendVerificationEmail = asyncHandler(async (req, res) => {});

const refreshAccessToken = asyncHandler(async (req, res) => {});

const changePassword = asyncHandler(async (req, res) => {});

const updateProfile = asyncHandler(async (req, res) => {});

const deleteProfile = asyncHandler(async (req, res) => {});

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
