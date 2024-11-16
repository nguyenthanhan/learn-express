import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  email: String,
  city: String,
  date: { type: Date, default: Date.now },
  role: { type: String, default: "user" },
});

const User = mongoose.model("User", userSchema);

export default User;
