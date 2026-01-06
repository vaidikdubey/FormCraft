import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  deleteAllResponses,
  deleteResponse,
  exportResponses,
  getFormResponses,
  getResponsePublicView,
  getSingleResponse,
  submitResponse,
  updateResponse,
} from "../controllers/response.controllers.js";

const router = Router();

router.route("/submit/:formId").post(submitResponse);

router.route("/get-public-view/:id").get(getResponsePublicView);

router.route("/getAllResponses/:formId").get(isLoggedIn, getFormResponses);

router.route("/getResponse/:id").get(isLoggedIn, getSingleResponse);

router.route("/update/:id").patch(isLoggedIn, updateResponse);

router.route("/delete/:id").delete(isLoggedIn, deleteResponse);

router.route("/deleteAll/:formId").delete(isLoggedIn, deleteAllResponses);

//Experimental
router.route("/export/:formId").get(exportResponses);

export default router;
