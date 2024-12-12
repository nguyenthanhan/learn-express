import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: String,
    email: String,
    city: {
      type: Schema.Types.ObjectId,
      ref: "City",
    },
    role: { type: String, default: "user" },
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

export default User;
