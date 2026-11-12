import mongoose from "mongoose";
const Lock = mongoose.model(
  "MutationLock",
  new mongoose.Schema({ _id: String, createdAt: Date }),
);
export async function locked(work) {
  try {
    await Lock.create({ _id: "dataset", createdAt: new Date() });
  } catch {
    throw Object.assign(Error("Another edit is in progress. Retry shortly."), {
      status: 409,
    });
  }
  try {
    return await work();
  } finally {
    await Lock.deleteOne({ _id: "dataset" });
  }
}
