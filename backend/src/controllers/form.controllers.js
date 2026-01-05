import { Form } from "../models/form.model.js";
import { Response } from "../models/response.model.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import crypto from "crypto";

const getAllForms = asyncHandler(async (req, res) => {
  //get userId from req.user.id
  //if no user -> throw error
  //search Form db for ownerId: req.user.id
  //return response
  const userId = req.user.id;

  if (!userId) throw new ApiError(404, "User not found");

  const forms = await Form.find({ ownerId: userId });

  if (!forms) throw new ApiError(404, "No forms found");

  res.status(200).json(new ApiResponse(200, forms, "Forms found successfully"));
});

const getFormById = asyncHandler(async (req, res) => {
  //get form id from req.params()
  //if no id -> throw error
  //search Form db for id: form id
  //return response
  const { id } = req.params;

  if (!id) throw new ApiError(404, "Form ID missing");

  const form = await Form.findById(id);

  if (form.ownerId.equals(req.user.id))
    throw new ApiError(
      403,
      "You do not have permission to perform this action",
    );

  if (!form) throw new ApiError(404, "Form not found");

  res.status(200).json(new ApiResponse(200, form, "Form found successfully"));
});

const createForm = asyncHandler(async (req, res) => {
  //get userId from req.user.id
  //get title, description
  //if no title -> throw error
  //create new form using data
  //return response with new form id
  const userId = req.user.id;

  const { title, description } = req.body;

  if (!title) throw new ApiError(400, "Form title is required");

  const form = await Form.create({
    title,
    description,
    ownerId: userId,
  });

  res.status(201).json(new ApiResponse(201, form, "Form created successfully"));
});

const updateForm = asyncHandler(async (req, res) => {
  //NOTE: will work for create form as well when user adds fields and hit save
  //get formId from req.params()
  //if no form id -> throw error
  //get title, description, fields, conditions, allowAnonymous
  //check if req.user.id === form.ownerId else throw error
  //check fields contains fieldKey for each item else throw error
  //update the database using $set
  //set isPublished to false -> frontend requests user to publish again
  //return updated form
  const { id } = req.params;

  if (!id) throw new ApiError(404, "Form ID is required");

  const { title, description, fields, conditions, allowAnonymous } = req.body;

  const form = await Form.findById(id);

  if (!form) throw new ApiError(404, "Form not found");

  if (!form.ownerId.equals(req.user.id))
    throw new ApiError(
      403,
      "You do not have permission to perform this action",
    );

  if (fields) {
    if (!Array.isArray(fields))
      throw new ApiError(400, "Fields must be an array");

    const allFieldKeys = fields.every((f) => f.fieldKey);

    if (!allFieldKeys)
      throw new ApiError(400, "Every field must have a unique field key");
  }

  if (conditions && !Array.isArray(conditions))
    throw new ApiError(400, "Conditions must be an array");

  const updatedForm = await Form.findByIdAndUpdate(
    id,
    {
      $set: {
        title: title || form.title,
        description: description ?? form.description,
        fields: fields || form.fields,
        conditions: conditions || form.conditions,
        allowAnonymous: allowAnonymous ?? form.allowAnonymous,
        isPublished: false,
      },
    },
    { new: true, runValidators: true },
  );

  res
    .status(200)
    .json(new ApiResponse(200, updatedForm, "Form updated successfully"));
});

const deleteForm = asyncHandler(async (req, res) => {
  //get formId from req.params()
  //verify if the req.user.id === Form.ownerId
  //find form by id and delete
  //delete all responses related to this form ```await Response.deleteMany({formId: id});```
  //return response
  const { id } = req.params;

  const form = await Form.findById(id);

  if (form.ownerId.equals(req.user.id))
    throw new ApiError(
      403,
      "You do not have permission to perform this action",
    );

  const deletedForm = await Form.findByIdAndDelete(id);

  //delete all related responses
  await Response.deleteMany({ formId: id });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        deleteForm,
        "Form and all responses deleted successfully",
      ),
    );
});

const publishForm = asyncHandler(async (req, res) => {
  //get formId from req.params()
  //find form using id
  //generate new public URL
  //set publicURL to new public URL if it doesn't already have one url
  //change isPublished to true
  //save form
  //send response with new URL
  const { id } = req.params;

  const form = await Form.findById(id);

  if (!form) throw new ApiError(404, "Form not found");

  if (form.ownerId.equals(req.user.id))
    throw new ApiError(
      403,
      "You do not have permission to perform this action",
    );

  form.isPublished = true;

  if (!form.publicURL) {
    form.publicURL = crypto.randomBytes(5).toString("hex");
  }

  await form.save();

  res.status(200).json(
    new ApiResponse(
      200,
      {
        id: form._id,
        published: form.isPublished,
        publicURL: form.publicURL,
        anonymous: form.allowAnonymous,
      },
      "Form published successfully",
    ),
  );
});

const getFormStats = asyncHandler(async (req, res) => {
  //get formId from req.params()
  //verify formId and formId.owner === req.user.id
  //get total responses, last response, response this week from Responses model using aggregation pipeline
  //return response with data
  const { id } = req.params;

  const form = await Form.findById(id);

  if (!form) throw new ApiError(404, "Form not found");

  if (form.ownerId.equals(req.user.id))
    throw new ApiError(
      403,
      "You do not have permission to perform this action",
    );

  const [totalResponses, lastResponse, weeklyData] = await Promise.all([
    Response.countDocuments({ formId: id }),
    Response.findOne({ formId: id })
      .sort({ createdAt: -1 })
      .select("createdAt"),
    Response.countDocuments({
      formId: id,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, //Last week
    }),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalResponses,
        lastResponse,
        weeklyData,
      },
      "Form stats fetched successfully",
    ),
  );
});

const getFormPublicView = asyncHandler(async (req, res) => {
  //get public URL from req.params()
  //find form using public URL
  //check if isPublished === true else -> 404
  //return required data in response
  const { url } = req.params;

  if (!url) throw new ApiError(404, "Form URL missing");

  const form = await Form.findOne({ publicURL: url, isPublished: true }).select(
    "title description fields conditions allowAnonymous",
  );

  if (!form) throw new ApiError(404, "Form not found");

  res.status(200).json(new ApiResponse(200, form, "Form found successfully"));
});

const cloneForm = asyncHandler(async (req, res) => {
  //get formId from req.params()
  //verify form owner from req.user.id
  //find form based on id
  //convert form to plain object using .toObject()
  //delete _id, publicURL, createdAt, updatedAt fields from this object
  //set the title to formObject.title = `${formObject.title} (copy)`
  //set formObject.isPublished = false
  // Reset IDs for sub-documents (fields). This ensures the new form has its own unique database IDs for every field
  //create new document in MongoDB
  //return response
  const { id } = req.params;

  const form = await Form.findById(id);

  if (!form) throw new ApiError(404, "Form not found");

  if (!form.ownerId.equals(req.user.id))
    throw new ApiError(
      403,
      "You do not have permission to perform this action",
    );

  const formObject = form.toObject();

  delete formObject._id;
  delete formObject.publicURL;
  delete formObject.createdAt;
  delete formObject.updatedAt;

  formObject.title = `${formObject.title} (Copy)`;
  formObject.isPublished = false;

  if (formObject.fields) {
    formObject.fields = formObject.fields.map((field) => {
      const { _id, ...rest } = field;
      return rest;
    });
  }

  if (formObject.conditions) {
    formObject.conditions = formObject.fields.map((condition) => {
      const { _id, ...rest } = condition;
      return rest;
    });
  }

  const clonedForm = await Form.create(formObject);

  res
    .status(201)
    .json(new ApiResponse(201, clonedForm, "Form cloned successfully"));
});

export {
  getAllForms,
  getFormById,
  createForm,
  updateForm,
  deleteForm,
  publishForm,
  getFormStats,
  getFormPublicView,
  cloneForm,
};
