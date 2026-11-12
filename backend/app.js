import express from "express";
import helmet from "helmet";
import {rateLimit} from "express-rate-limit";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {allowedOrigins} from "./config/origin.js";
import router from "./routes/index.js";
import {errorHandler} from "./middleware/errorHandler.js";
const app = express(),
  production = process.env.NODE_ENV === "production",
  origin = process.env.APP_ORIGIN || "http://localhost:5173";
const origins = allowedOrigins(origin, production);
for(const value of allowedOrigins(process.env.ADMIN_ORIGIN || (production ? origin : "http://localhost:5174"),production))origins.add(value);
app.disable("x-powered-by");
app.use(helmet());
app.use(express.json({ limit: "2mb" }));
app.use("/api", rateLimit({ windowMs: 60000, limit: 300 }));
app.use("/api", (req, res, next) => {
  if (
    !["GET", "HEAD", "OPTIONS"].includes(req.method) &&
    !origins.has(req.headers.origin)
  )
    return res.status(403).json({ error: "Request origin rejected. Open the site at " + origin + " and retry." });
  next();
});

app.use(router);
const dist = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../frontend/dist",
);
if (production) {
  const adminDist=path.resolve(dist,"../../admin/dist");
  app.use("/admin",express.static(adminDist));
  app.get(["/admin","/admin/{*path}"],(req,res)=>res.sendFile(path.join(adminDist,"index.html")));
  app.use(express.static(dist));
  app.get("/{*path}", (req, res, next) =>
    req.path.startsWith("/api/")
      ? next()
      : res.sendFile(path.join(dist, "index.html")),
  );
}
app.use((req, res) => res.status(404).json({ error: "Not found" }));

app.use(errorHandler);
export default app;
