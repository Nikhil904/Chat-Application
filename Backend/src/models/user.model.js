import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: "string",
      required: true,
      unique: true,
    },
    full_name: {
      type: "string",
      required: true,
    },
    password: {
      type: "string",
      required: true,
      minLength: 6,
    },
    profilePic: {
      type: "string",
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const user = mongoose.model("User", userSchema);

export default user;
