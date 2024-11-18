import mongoose from "mongoose";
const { Schema } = mongoose;

const customerSchema = new Schema(
  {
    name: { type: String, required: true },
    address: String,
    phone: String,
    email: { type: String, required: true },
    image: Buffer,
    description: String,
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
