import {createHash} from "node:crypto";
import {Admin,Session} from "../models/index.js";
export const digest = (t) => createHash("sha256").update(t).digest("hex");
export async function auth(req, res, next) {
  try {
    const token = (req.headers.cookie || "")
      .split(";")
      .map((x) => x.trim())
      .find((x) => x.startsWith("fees_session="))
      ?.slice(13);
    const session =
      token &&
      (await Session.findOne({
        digest: digest(token),
        expiresAt: { $gt: new Date() },
      }));
    if (!session || !(await Admin.exists({ _id: session.adminId, ...(process.env.ADMIN_EMAIL ? {email:process.env.ADMIN_EMAIL} : {}) })))
      return res.status(401).json({ error: "Sign in required" });
    req.adminId = session.adminId;
    req.session = session;
    next();
  } catch (e) {
    next(e);
  }
}
