import { Router } from "express";
import {
  cloneForm,
  createForm,
  deleteForm,
  getAllForms,
  getFormById,
  getFormPublicView,
  getFormStats,
  publishForm,
  updateForm,
} from "../controllers/form.controllers.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/getAll").get(isLoggedIn, getAllForms);

router.route("/getForm/:id").get(isLoggedIn, getFormById);

router.route("/create").post(isLoggedIn, createForm);

router.route("/update/:id").patch(isLoggedIn, updateForm);

router.route("/delete/:id").delete(isLoggedIn, deleteForm);

router.route("/publish/:id").patch(isLoggedIn, publishForm);

router.route("/stats/:id").get(isLoggedIn, getFormStats);

router.route("/public/:url").get(getFormPublicView);

router.route("/clone/:id").post(isLoggedIn, cloneForm);

export default router;
