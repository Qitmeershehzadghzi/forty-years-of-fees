import mongoose from "mongoose";
export const Admin = mongoose.model(
  "User",
  new mongoose.Schema({ name: String, email: { type: String, unique: true, required: true }, hash: {type: String, required: true}, role: {type: String, enum: ["admin"], default: "admin"} }, {timestamps: true}),
);
