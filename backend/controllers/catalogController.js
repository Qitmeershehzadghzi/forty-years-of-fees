import {snapshot,publicDataset} from "../models/index.js";
import {coverage,feeAnalysis} from "./analytics.js";
export const getAnalytics = async (req,res) => {
  const data = publicDataset(await snapshot());
  if (["overview", "coverage"].includes(req.params.kind)) return res.json(coverage(data));
  if (["fees", "inflation", "programme-comparison"].includes(req.params.kind)) return res.json(feeAnalysis(data, req.query));
  res.status(404).json({error:"Unknown analytics endpoint"});
};
export const getRecords = (dataset,url) => async (req,res) => {
    const data = publicDataset(await snapshot());
    let rows = data[dataset];
    if (req.params.id) {
      const row = rows.find(r => r.key === req.params.id);
      return row ? res.json(row) : res.status(404).json({error:"Record not found"});
    }
    const {q, year, from, to, programme, degreeLevel, unit, component, verified, sort, order} = req.query;
    rows = rows.filter(r => (!q || JSON.stringify(r).toLowerCase().includes(String(q).toLowerCase())) &&
      (!year || r.year === Number(year)) && (!from || r.year >= Number(from)) && (!to || r.year <= Number(to)) &&
      (!programme || r.programmeKey === programme) && (!unit || r.unit === unit) && (!component || r.component === component) &&
      (!degreeLevel || data.programmes.find(p => p.key === r.programmeKey)?.degreeLevel === degreeLevel) &&
      (!verified || ["published", "verified"].includes(r.verificationStatus)));
    const field = ["year", "amount", "title", "name"].includes(sort) ? sort : "year";
    rows.sort((a,b) => (typeof a[field] === "number" ? a[field]-b[field] : String(a[field] || "").localeCompare(String(b[field] || ""))) * (order === "desc" ? -1 : 1));
    if (req.query.format === "csv") {
      const fields = [...new Set(rows.flatMap(r => Object.keys(r)))];
      const cell = v => '"' + String(v ?? "").replace(/^[=+@\-\t\r]/, "'$&").replaceAll('"','""') + '"';
      res.attachment(`${url}.csv`).type("text/csv");
      return res.send([fields.map(cell).join(","), ...rows.map(r => fields.map(k => cell(r[k])).join(","))].join("\r\n"));
    }
    const page = Math.max(1, Number(req.query.page) || 1), limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    res.json({rows:rows.slice((page-1)*limit,page*limit), total: rows.length, page, limit});
  };
