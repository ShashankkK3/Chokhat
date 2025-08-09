import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["admin", "vendor", "user"],
    default: "user",
    required:true
  },
  status: {
    type: String,
    enum: ["active", "blocked", "pending"],
    default: "active"
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;