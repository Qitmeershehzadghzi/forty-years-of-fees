import mongoose from "mongoose";
export const Audit = mongoose.model(
  "AuditLog",
  new mongoose.Schema({
    adminId: mongoose.Schema.Types.ObjectId,
    action: String,
    dataset: String,
    keys: [String],
    at: { type: Date, default: Date.now },
  }),
);
