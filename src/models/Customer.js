import mongoose from "mongoose";
const { Schema } = mongoose;

const customerSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    image: string,
    description: { type: String, required: true },
  },
  { timestamps: true }
);

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
