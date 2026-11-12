export const rewriteWriteRoute = (req,res,next) => {
  const match = req.url.match(/^\/(fees|cpi|programmes|sources|research)(?:\/([^?]+))?(\?.*)?$/);
  if (!match || !["POST","PUT","DELETE"].includes(req.method)) return next();
  const collection = match[1] === "research" ? "notes" : match[1];
  if (req.method === "POST" && match[2] !== "import") {
    if (!req.body?.key) return res.status(400).json({error:"Record key required"});
    req.method = "PUT";
    req.url = "/admin/" + collection + "/" + encodeURIComponent(req.body.key);
  } else req.url = "/admin/" + collection + "/" + (match[2] || "");
  next();
};
