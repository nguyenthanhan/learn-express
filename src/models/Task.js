import mongoose from "mongoose";
import { projectSchema } from "./Project.js";
import { userSchema } from "./User.js";

const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, default: "active" },
    project: projectSchema,
    user: userSchema,
    startDate: Date,
    endDate: Date,
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

const Task = mongoose.model("Task", taskSchema);

export default Task;
