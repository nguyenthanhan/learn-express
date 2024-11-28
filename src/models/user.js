import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: String,
    email: String,
    city: String,
    role: { type: String, default: "user" },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.methods.softDelete = function () {
  this.deletedAt = new Date();
  return this.save();
};

const User = mongoose.model("User", userSchema);

export default User;
