export const errorHandler = (err, req, res, next) => {
  if (err.type === "entity.too.large") return res.status(413).json({error:"Upload or request exceeds the size limit"});
  if (err.name === "ZodError")
    return res
      .status(400)
      .json({
        error: err.issues
          .map((i) => i.path.join(".") + ": " + i.message)
          .join("; "),
      });
  if (err.code === 11000)
    return res.status(409).json({ error: "Duplicate record" });
  console.error(err.message);
  res
    .status(err.status || 500)
    .json({
      error: err.status
        ? err.message
        : "Unable to complete request. Check fields, references, and database connectivity.",
    });
};
