import {Entry,Audit,snapshot,publicDataset} from "../models/index.js";
import {schemas,assertReferences} from "../middleware/validation.js";
import {coverage,linkSeries} from "./analytics.js";
import {locked} from "../models/MutationLock.js";
export const getAdminData = async (req,res) => res.json(await snapshot());
export const getOverview = async (req,res) => {
  const data = await snapshot();
  const publicData=publicDataset(data);
  res.json({...coverage({...publicData,fees:publicData.fees.filter(f=>!f.isDemo),cpi:publicData.cpi.filter(c=>!c.isDemo),programmes:publicData.programmes.filter(p=>!p.isDemo)}), demoRecords:data.fees.filter(f=>f.isDemo).length, drafts:data.fees.filter(f => f.verificationStatus !== "published").length,
    recentChanges: await Audit.find().sort({at:-1}).limit(15).lean()});
};
export const previewCpiLink = async (req,res) => {
  const data = await snapshot();
  const {oldKey,newKey,sourceKey,page,methodology} = req.body;
  if (!data.sources.some(s => s.key === sourceKey && ["verified","published"].includes(s.verificationStatus)))
    return res.status(400).json({error:"Verified methodology source required"});
  const old = data.cpi.find(c => c.key === oldKey), next = data.cpi.find(c => c.key === newKey);
  try { res.json({rows:linkSeries(data.cpi.filter(c => c.series === old?.series && c.period === old?.period), old, next, {sourceKey,page,methodology})}); }
  catch(e) {res.status(400).json({error:e.message});}
};
export const importRecords = async (req, res) => {
  const collection = req.params.collection,
    schema = Object.hasOwn(schemas, collection) ? schemas[collection] : null;
  if (!schema) return res.status(404).json({ error: "Unknown collection" });
  const input = req.body?.rows;
  if (req.body?.preview !== undefined && typeof req.body.preview !== "boolean")
    return res.status(400).json({ error: "preview must be a boolean" });
  if (!Array.isArray(input) || !input.length || input.length > 500)
    return res.status(400).json({ error: "Import 1–500 rows" });
  const rows = input.map((r) => schema.parse(r));
  if (new Set(rows.map((r) => r.key)).size !== rows.length)
    return res.status(400).json({ error: "Duplicate keys in import" });
  const result = await locked(async () => {
    const data = await snapshot();
    data[collection] = data[collection]
      .filter((r) => !rows.some((n) => n.key === r.key))
      .concat(rows);
    assertReferences(collection, rows, data);
    if (collection === "sources" && rows.some(s => !["verified","published"].includes(s.verificationStatus) && [...data.fees,...data.cpi,...data.notes].some(r => r.verificationStatus === "published" && (r.sourceKey === s.key || r.sourceKeys?.includes(s.key))))) throw Object.assign(Error("Unpublish dependants before changing source verification"), {status:409});
    if (req.body.preview) return { preview: true, count: rows.length };
    await Entry.bulkWrite(
      rows.map((r) => ({
        updateOne: {
          filter: { dataset: collection, key: r.key },
          update: { $set: { data: r } },
          upsert: true,
        },
      })),
      { ordered: true },
    );
    await Audit.create({
      adminId: req.adminId,
      action: "import",
      dataset: collection,
      keys: rows.map((r) => r.key),
    });
    return { count: rows.length };
  });
  res.json(result);
};
export const saveRecord = async (req, res) => {
  const collection = req.params.collection,
    schema = Object.hasOwn(schemas, collection) ? schemas[collection] : null;
  if (!schema) return res.status(404).json({ error: "Unknown collection" });
  const row = schema.parse(req.body);
  if (row.key !== req.params.key)
    return res.status(400).json({ error: "Key cannot be changed" });
  await locked(async () => {
    const data = await snapshot();
    data[collection] = data[collection].filter(r => r.key !== row.key).concat(row);
    assertReferences(collection, [row], data);
    if (collection === "sources" && !["verified", "published"].includes(row.verificationStatus) && [...data.fees, ...data.cpi, ...data.notes].some(r => r.verificationStatus === "published" && (r.sourceKey === row.key || r.sourceKeys?.includes(row.key)))) throw Object.assign(Error("Unpublish dependent records before un-verifying this source"), {status:409});
    await Entry.updateOne(
      { dataset: collection, key: row.key },
      { $set: { data: row } },
      { upsert: true },
    );
    await Audit.create({
      adminId: req.adminId,
      action: "save",
      dataset: collection,
      keys: [row.key],
    });
  });
  res.json({ ok: true });
};
export const deleteRecord = async (req, res) => {
  const { collection, key } = req.params;
  if (!Object.hasOwn(schemas, collection))
    return res.status(404).json({ error: "Unknown collection" });
  await locked(async () => {
    const data = await snapshot();
    if (
      (collection === "sources" &&
        [...data.fees, ...data.cpi, ...data.notes].some(
          (r) => r.sourceKey === key || r.sourceKeys?.includes(key),
        )) ||
      (collection === "programmes" &&
        data.fees.some((r) => r.programmeKey === key))
    )
      throw Object.assign(Error("Remove dependent records first"), {
        status: 409,
      });
    await Entry.deleteOne({ dataset: collection, key });
    await Audit.create({
      adminId: req.adminId,
      action: "delete",
      dataset: collection,
      keys: [key],
    });
  });
  res.json({ ok: true });
};
