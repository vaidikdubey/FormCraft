import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { Response } from "../models/response.model.js";
import { Form } from "../models/form.model.js";
import { UserRolesEnum } from "../utils/constants.js";

const submitResponse = asyncHandler(async (req, res) => {
  //get formId from req.params
  //find form based on id
  //check if form is live else throw error
  //get answer from req.body
  //check if form allows anonymous else get user.id or throw error
  //create new reponse model document
  //return response

  const { formId } = req.params;

  if (!formId) throw new ApiError(404, "Form ID is required");

  const form = await Form.findById(formId);

  if (!form) throw new ApiError(404, "Form not found");

  if (!form.isPublished)
    throw new ApiError(403, "This form is currently not accepting responses");

  const { answer } = req.body;

  if (!form.allowAnonymous && !req.user)
    throw new ApiError(
      400,
      "Anonymous responses are not allowed for this form. Kindly login to submit your response.",
    );

  const response = await Response.create({
    formId,
    answer,
    submittedAt: Date.now(),
    userId: req.user?.id || null,
  });

  res
    .status(201)
    .json(new ApiResponse(201, response, "Response submitted successfully"));
});

const getResponsePublicView = asyncHandler(async (req, res) => {
  //get response id from req.params
  //find response based on id
  //if no response throw error
  //return response

  const { id } = req.params;

  const response = await Response.findById(id).select(
    "answer submittedAt userId",
  );

  if (!response) throw new ApiError(404, "Response not found");

  res
    .status(200)
    .json(new ApiResponse(200, response, "Response found successfully"));
});

const getFormResponses = asyncHandler(async (req, res) => {
  //get formId from req.params
  //get userId from req.user.id
  //check if formId.ownerId === req.user.id -> throw error
  //find responses with formId
  //return response

  const { formId } = req.params;

  const userId = req.user.id;

  const form = await Form.findById(formId);

  if (!form.ownerId.equals(userId))
    throw new ApiError(
      403,
      "You do not have permission to perform this action",
    );

  const responses = await Response.find({
    formId,
  });

  res
    .status(200)
    .json(new ApiResponse(200, responses, "Responses found successfully"));
});

const getSingleResponse = asyncHandler(async (req, res) => {
  //get responseId from req.params
  //find response based on id and .populate("formId")
  //check if response.formId.ownerId === req.user.id else throw error
  //return response

  const { id } = req.params;

  const response = await Response.findById(id).populate("formId");

  if (!response.formId.ownerId.equals(req.user.id))
    throw new ApiError(
      403,
      "You do not have permission to perform this action",
    );

  res
    .status(200)
    .json(new ApiResponse(200, response, "Response found successfully"));
});

const updateResponse = asyncHandler(async (req, res) => {
  //get responseId from req.params
  //find response based on responseId and populate('form');
  //check if response.formId.ownerId === req.user.id else throw error
  //implement the hard stop allowEditing premium feature logic
  //update form
  //return response

  const { id } = req.params;
  const { answer } = req.body;

  //Deep populate to get only the form creator role
  const response = await Response.findById(id).populate({
    path: "formId",
    populate: {
      path: "ownerId",
      select: "role",
    },
  });

  if (!response) throw new ApiError(404, "Response not found");

  const form = response.formId;
  const owner = response.formId.ownerId;

  if (owner.role !== UserRolesEnum.PAID)
    throw new ApiError(
      403,
      "This feature requires a Pro subscription from the form owner.",
    );

  if (!form.allowEditing)
    throw new ApiError(403, "Editing has been disabled by the form creator.");

  response.answer = answer;

  await response.save();

  res
    .status(200)
    .json(new ApiResponse(200, response, "Response updated successfully"));
});

const deleteResponse = asyncHandler(async (req, res) => {
  //get responseId from req.params
  //find response based on id and check ownerId
  //delete the response
  //return response

  const { id } = req.params;

  const response = await Response.findById(id).populate("formId");

  if (!response.formId.ownerId.equals(req.user.id))
    throw new ApiError(
      403,
      "You do not have permission to perform this action",
    );

  const deletedResponse = await Response.findByIdAndDelete(id);

  res
    .status(200)
    .json(
      new ApiResponse(200, deletedResponse, "Response deleted successfully"),
    );
});

const deleteAllResponses = asyncHandler(async (req, res) => {
  //get formId from req.params
  //find the form and check ownerId === req.user.id
  //find and delete all responses where formId is present
  //return response

  const { formId } = req.params;

  const form = await Form.findById(formId);

  if (!form.ownerId.equals(req.user.id))
    throw new ApiError(
      403,
      "You do not have permission to perform this action",
    );

  const allDeletedResponses = await Response.deleteMany({formId});

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        allDeletedResponses,
        "All responses deleted successfully",
      ),
    );
});

//Experimental
const exportResponses = asyncHandler(async (req, res) => {});

export {
  submitResponse,
  getResponsePublicView,
  getFormResponses,
  getSingleResponse,
  updateResponse,
  deleteResponse,
  deleteAllResponses,
  exportResponses,
};
