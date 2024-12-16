import mongoose from "mongoose";
import { userSchema } from "./User.js";
import { customerSchema } from "./Customer.js";

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
