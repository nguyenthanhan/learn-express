import mongoose from "mongoose";
import { userSchema } from "./User.js";
import { customerSchema } from "./Customer.js";
import Joi from "joi";

const { Schema } = mongoose;

const projectSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    startDate: Date,
    endDate: Date,
    status: { type: String, default: "active" },
    customer: customerSchema,
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    leader: userSchema,
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  },
  { timestamps: true }
);

export const validateProjectSchema = Joi.object({
  type: Joi.string().optional().messages({
    "string.base": "Type should be a type of text",
  }),

  name: Joi.string().min(4).max(50).required().messages({
    "string.base": "Name should be a type of text",
    "string.empty": "Name cannot be an empty field",
    "string.min": "Name should have a minimum length of {#limit}",
    "string.max": "Name should have a maximum length of {#limit}",
    "any.required": "Name is a required field",
  }),

  description: Joi.string().optional().messages({
    "string.base": "Description should be a type of text",
  }),

  startDate: Joi.date().required().messages({
    "date.base": "Start date should be a valid date",
    "any.required": "Start date is a required field",
  }),

  endDate: Joi.date().required().messages({
    "date.base": "End date should be a valid date",
    "any.required": "End date is a required field",
  }),

  status: Joi.string().valid("active", "inactive").messages({
    "string.base": "Status should be a type of text",
    "any.only": "Status must be one of [active, inactive]",
  }),

  customer: Joi.object({
    name: Joi.string().min(4).max(50).required().messages({
      "string.base": "Customer name should be a type of text",
      "string.empty": "Customer name cannot be an empty field",
      "string.min": "Customer name should have a minimum length of {#limit}",
      "string.max": "Customer name should have a maximum length of {#limit}",
      "any.required": "Customer name is a required field",
    }),

    email: Joi.string().email().required().messages({
      "string.base": "Customer email should be a type of text",
      "string.email": "Customer email must be a valid email",
      "any.required": "Customer email is a required field",
    }),
  })
    .required()
    .messages({
      "object.base": "Customer should be a valid object",
      "any.required": "Customer is a required field",
    }),

  leader: Joi.object({
    name: Joi.string().min(4).max(50).required().messages({
      "string.base": "Leader name should be a type of text",
      "string.empty": "Leader name cannot be an empty field",
      "string.min": "Leader name should have a minimum length of {#limit}",
      "string.max": "Leader name should have a maximum length of {#limit}",
      "any.required": "Leader name is a required field",
    }),

    email: Joi.string().email().required().messages({
      "string.base": "Leader email should be a type of text",
      "string.email": "Leader email must be a valid email",
      "any.required": "Leader email is a required field",
    }),
  })
    .required()
    .messages({
      "object.base": "Leader should be a valid object",
      "any.required": "Leader is a required field",
    }),
});

projectSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (document, returnedObject) => {
    delete returnedObject._id;
  },
});

const Project = mongoose.model("Project", projectSchema);

export { projectSchema };
export default Project;
