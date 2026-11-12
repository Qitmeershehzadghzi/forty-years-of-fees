export {Admin} from "./Admin.js";
export {Session} from "./Session.js";
export {Audit} from "./Audit.js";
import mongoose from "mongoose";
import { schemas } from "../middleware/validation.js";
const modelNames = { programmes: "Programme", sources: "Source", fees: "FeeRecord", cpi: "CPIRecord", notes: "ResearchArticle" };
export const models = Object.fromEntries(Object.entries(modelNames).map(([dataset, name]) => {
  const fields = Object.fromEntries(Object.keys(schemas[dataset].shape).map(key => [key, { type: ["year", "amount", "index"].includes(key) ? Number : key === "sourceKeys" ? [String] : ["archived", "isDemo"].includes(key) ? Boolean : ["creditHours", "publicationYear"].includes(key) ? mongoose.Schema.Types.Mixed : String }]));
  fields.key = {type: String, required: true};
  const schema = new mongoose.Schema({data: fields, key: {type: String, unique: true, required: true}}, {timestamps: true});
  schema.index({"data.year": 1, "data.programmeKey": 1});
  if (dataset === "cpi") schema.index({"data.year": 1, "data.series": 1, "data.period": 1}, {unique: true});
  schema.index({"data.verificationStatus": 1});
  return [dataset, mongoose.model(name, schema)];
}));
export const Entry = {
  init: () => Promise.all(Object.values(models).map(m => m.init())),
  find: () => ({lean: async () => (await Promise.all(Object.entries(models).map(async ([dataset, model]) => (await model.find().lean()).map(e => ({...e, dataset}))))).flat()}),
  updateOne: (filter, update, options) => models[filter.dataset].updateOne({key: filter.key}, update, options),
  deleteOne: filter => models[filter.dataset].deleteOne({key: filter.key}),
  countDocuments: async () => (await Promise.all(Object.values(models).map(m => m.countDocuments()))).reduce((a,b) => a+b, 0),
  bulkWrite: async ops => { for (const {updateOne: o} of ops) await Entry.updateOne(o.filter, o.update, {upsert: o.upsert}); }
};



export async function snapshot() {
  const entries = await Entry.find().lean();
  return Object.fromEntries(
    ["programmes", "sources", "fees", "cpi", "notes"].map((k) => [
      k,
      entries.filter((e) => e.dataset === k).map((e) => e.data),
    ]),
  );
}

export function publicDataset(data) {
  const sources = data.sources.filter(s => s.isDemo || ["verified", "published"].includes(s.verificationStatus));
  const allowed = new Set(sources.map(s => s.key));
  return {...data, sources: sources.map(({filePath, ...s}) => ({...s, hasDocument: !!filePath && s.publicationRights === "public"})),
    programmes: data.programmes.filter(p => !p.archived),
    fees: data.fees.filter(f => (f.isDemo || f.verificationStatus === "published") && allowed.has(f.sourceKey)),
    cpi: data.cpi.filter(c => (c.isDemo || c.verificationStatus === "published") && allowed.has(c.sourceKey)),
    notes: data.notes.filter(n => n.verificationStatus === "published" && n.sourceKeys.every(k => allowed.has(k)))};
}
