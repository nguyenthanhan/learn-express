import mongoose from "mongoose";
import Joi from "joi";

const { Schema } = mongoose;

const customerSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: false },
    email: { type: String, required: true },
    image: { type: String, required: false },
    description: { type: String, required: false },
  },
  { timestamps: true }
);

export const validateCustomerSchema = Joi.object({
  name: Joi.string().min(4).max(50).required().messages({
    "string.base": "Name should be a type of text",
    "string.empty": "Name cannot be an empty field",
    "string.min": "Name should have a minimum length of {#limit}",
    "string.max": "Name should have a maximum length of {#limit}",
    "any.required": "Name is a required field",
  }),

  address: Joi.string().max(100).optional().messages({
    "string.base": "Address should be a type of text",
    "string.max": "Address should have a maximum length of {#limit}",
  }),

  email: Joi.string().email().required().messages({
    "string.base": "Email should be a type of text",
    "string.email": "Email must be a valid email",
    "any.required": "Email is a required field",
  }),

  image: Joi.string().uri().optional().messages({
    "string.base": "Image should be a type of text",
    "string.uri": "Image must be a valid URI",
  }),
});

customerSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (document, returnedObject) => {
    delete returnedObject._id;
  },
});

const Customer = mongoose.model("Customer", customerSchema);

export { customerSchema };
export default Customer;
