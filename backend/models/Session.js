import mongoose from "mongoose";
export const Session = mongoose.model(
  "Session",
  new mongoose.Schema({
    digest: { type: String, unique: true },
    adminId: mongoose.Schema.Types.ObjectId,
    expiresAt: { type: Date, index: { expires: 0 } },
  }),
);
