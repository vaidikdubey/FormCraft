import { Router } from "express";
import {
  changePassword,
  deleteProfile,
  forgotPassword,
  getProfile,
  loginUser,
  logoutUser,
  registerUser,
  resendVerificationEmail,
  resetPassword,
  updateProfile,
  verifyUser,
} from "../controllers/auth.controllers.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/verify/:token").get(verifyUser);

router.route("/me").get(getProfile);

router.route("/logout").get(logoutUser);

router.route("/forgot-password").post(forgotPassword);

router.route("/reset-password/:token").post(resetPassword);

router.route("resend-verification").get(resendVerificationEmail);

router.route("change-password").post(changePassword);

router.route("update-profile").patch(updateProfile);

router.route("/delete-user").delete(deleteProfile);

export default router;
