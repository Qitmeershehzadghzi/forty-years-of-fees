import "./env.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import readline from "node:readline/promises";
import { Admin } from "../models/index.js";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
try {
  await mongoose.connect(process.env.MONGODB_URI);
  const email = (await rl.question("Admin email: ")).trim().toLowerCase();
  console.log("Use a private terminal; password input is visible.");
  const password = await rl.question("New password (at least 14 characters): ");
  if (!email.includes("@") || password.length < 14 || password.length > 256)
    throw Error("Valid email and 14–256 character password required");
  await Admin.create({ email, hash: await bcrypt.hash(password, 12) });
  console.log("Admin created.");
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
} finally {
  rl.close();
  await mongoose.disconnect();
}
