import bcrypt from "bcryptjs";
import {randomBytes} from "node:crypto";
import {Admin,Session} from "../models/index.js";
import {digest} from "../middleware/auth.js";
const production=process.env.NODE_ENV==="production";
const dummyHash=await bcrypt.hash(randomBytes(32).toString("hex"),12);
export const login = async (req, res) => {
  const { email, password } = req.body || {};
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    password.length > 256
  )
    return res.status(400).json({ error: "Invalid credentials" });
  const user = await Admin.findOne({ email: email.toLowerCase().trim() });
  const valid = await bcrypt.compare(password, user?.hash || dummyHash);
  if (!user || !valid || (process.env.ADMIN_EMAIL && user.email !== process.env.ADMIN_EMAIL))
    return res.status(401).json({ error: "Invalid credentials" });
  const token = randomBytes(32).toString("hex");
  await Session.create({
    digest: digest(token),
    adminId: user._id,
    expiresAt: new Date(Date.now() + 8 * 3600000),
  });
  res.cookie("fees_session", token, {
    httpOnly: true,
    secure: production,
    sameSite: "strict",
    maxAge: 8 * 3600000,
    path: "/api",
  });
  res.json({ ok: true });
};
export const getSession = (req, res) => res.json({ ok: true });
export const logout = async (req, res) => {
  await req.session.deleteOne();
  res.clearCookie("fees_session", {
    path: "/api",
    httpOnly: true,
    secure: production,
    sameSite: "strict",
  });
  res.json({ ok: true });
};