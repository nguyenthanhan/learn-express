import mongoose from "mongoose";

const { Schema } = mongoose;

const citySchema = new Schema({
  name: String,
  address: String,
});

citySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const userSchema = new Schema(
  {
    name: String,
    email: String,
    city: citySchema,
    role: { type: String, default: "developer" },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: String, default: null },
  },
  { timestamps: true }
);

// Soft delete method
userSchema.methods.softDelete = function ({ deleteBy = null }) {
  this.deleted = true;
  this.deletedBy = deleteBy;
  this.deletedAt = new Date();
  return this.save();
};

userSchema.methods.restore = function () {
  this.deleted = false;
  this.deletedBy = null;
  this.deletedAt = null;
  return this.save();
};

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const User = mongoose.model("User", userSchema);

export { userSchema };

export default User;
