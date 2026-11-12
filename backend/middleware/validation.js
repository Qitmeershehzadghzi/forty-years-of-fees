import { z } from "zod";
const text = z.string().trim().min(1).max(2000),
  key = z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9_-]{1,80}$/),
  year = z.coerce.number().int().min(1987).max(2026);
const status = z.enum(["draft", "verified", "published"]).default("draft");
const positive = z
  .union([z.number(), z.string().trim().min(1)])
  .pipe(z.coerce.number().positive().max(1e10));
export const schemas = {
  programmes: z.object({
    key,
    name: text,
    degreeLevel: z.string().max(100).default("Unspecified"),
    department: z.string().max(200).default(""),
    activeYears: z.string().max(500).default(""),
    archived: z.boolean().default(false),
    isDemo: z.boolean().default(false),
    description: z.string().max(4000).default(""),
  }),
  sources: z.object({
    key,
    title: text,
    url: z.url().refine((v) => /^https?:/.test(v), "Use an HTTP(S) URL"),
    citation: text,
    publisher: z.string().max(300).default(""),
    publicationYear: z.union([z.literal(""), year]).default(""),
    documentType: z.string().max(100).default("document"),
    pages: z.string().max(300).default(""),
    verificationStatus: status,
    filePath: z.string().regex(/^$|^[a-f0-9-]+\.pdf$/).default(""),
    publicationRights: z.enum(["restricted", "public"]).default("restricted"),
    notes: z.string().max(4000).default(""),
    isDemo: z.boolean().default(false),
  }),
  cpi: z.object({
    key,
    year,
    index: positive,
    series: text,
    baseYear: z.string().max(100).default("Unspecified"),
    verificationStatus: status,
    period: z.enum(["calendar", "fiscal"]),
    sourceKey: key,
    page: text,
    notes: z.string().max(4000).default(""),
    isDemo: z.boolean().default(false),
  }),
  fees: z.object({
    key,
    yearBasis: z.enum(["effective", "observed"]).default("effective"),
    scope: z.enum(["programme", "level"]).default("programme"),
    year,
    period: z.enum(["calendar", "fiscal"]),
    programmeKey: key,
    campus: text,
    unit: z.enum(["semester", "year", "credit", "course", "programme"]),
    component: z.enum(["tuition", "admission", "total"]),
    academicTerm: z.string().max(100).default("annual-observation"),
    creditHours: z.union([z.literal(""), positive]).default(""),
    verificationStatus: status,
    amount: z
      .union([z.number(), z.string().trim().min(1)])
      .pipe(z.coerce.number().nonnegative().max(1e10)),
    sourceKey: key,
    page: text,
    notes: z.string().max(4000).default(""),
    isDemo: z.boolean().default(false),
  }),
  notes: z.object({
    key,
    title: text,
    body: z.string().trim().min(1).max(20000),
    category: z.enum(["zakat", "waqf", "christian", "hindu", "general"]).default("general"),
    verificationStatus: status,
    sourceKeys: z.array(key).min(1),
  }),
};
export function adjust(amount, current, base) {
  if (
    !current ||
    !base ||
    current.series !== base.series ||
    current.period !== base.period ||
    current.baseYear !== base.baseYear ||
    !Number.isFinite(current.index) || current.index <= 0 ||
    !Number.isFinite(base.index) || base.index <= 0
  )
    return null;
  return (amount * base.index) / current.index;
}
export function assertReferences(collection, rows, data) {
  for (const r of rows) {
    const refs = [r.sourceKey, ...(r.sourceKeys || [])].filter(Boolean);
    if (r.verificationStatus === "published" && refs.some(k => !data.sources.some(s => s.key === k && ["verified", "published"].includes(s.verificationStatus))))
      throw Object.assign(Error("Verify all cited sources before publication"), {status: 400});
    if (collection === "fees" && (data.fees || []).some(f => f.key !== r.key && ["year", "period", "programmeKey", "campus", "unit", "component", "sourceKey"].every(k => f[k] === r[k]) && (f.academicTerm || "annual-observation") === (r.academicTerm || "annual-observation")))
      throw Object.assign(Error("Duplicate fee observation: use academicTerm to distinguish documented terms"), {status: 400});
    if (r.sourceKey && !data.sources.some((s) => s.key === r.sourceKey))
      throw Object.assign(Error("Unknown source: " + r.sourceKey), {
        status: 400,
      });
    if (
      r.programmeKey &&
      !data.programmes.some((p) => p.key === r.programmeKey)
    )
      throw Object.assign(Error("Unknown programme: " + r.programmeKey), {
        status: 400,
      });
    for (const k of r.sourceKeys || [])
      if (!data.sources.some((s) => s.key === k))
        throw Object.assign(Error("Unknown source: " + k), { status: 400 });
    if (
      collection === "cpi" &&
      data.cpi.some(
        (c) =>
          c.key !== r.key &&
          c.year === r.year &&
          c.series === r.series &&
          c.period === r.period,
      )
    )
      throw Object.assign(Error("Duplicate CPI year / series / period"), {
        status: 400,
      });
  }
}
