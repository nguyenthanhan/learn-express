import mongoose from "mongoose";

const { Schema } = mongoose;

const citySchema = new Schema(
  {
    name: String,
    address: String,
  },
  { timestamps: true }
);

citySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
  },
});

const City = mongoose.model("City", citySchema);

export { citySchema };

export default City;
