
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { models, Audit } from "../models/index.js";
export const uploadDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../uploads");

export const uploadDocument = async (req,res) => {
    if (!Buffer.isBuffer(req.body) || req.body.subarray(0,5).toString() !== "%PDF-")
      return res.status(400).json({error:"Upload a PDF document (maximum 10 MB)"});
    // PDFs are stored outside the web root, given random names, and served as attachments only.
    // Refuse common active-content features; institutional malware scanning is still recommended.
    if (/\/(JavaScript|JS|Launch|EmbeddedFile|OpenAction|AA)\b/i.test(req.body.toString("latin1")))
      return res.status(400).json({error:"Active or embedded PDF content is not accepted. Upload a flattened scan."});
    await mkdir(uploadDirectory, {recursive:true});
    const filePath = randomUUID() + ".pdf";
    await writeFile(path.join(uploadDirectory,filePath),req.body,{flag:"wx"});
    await Audit.create({adminId:req.adminId, action:"upload", dataset:"sources", keys:[filePath]});
    res.status(201).json({filePath});
  };
export const downloadDocument = async (req,res) => {
    const entry = await models.sources.findOne({key:req.params.key}).lean();
    const s = entry?.data;
    if (!s?.filePath || s.publicationRights !== "public" || !["verified","published"].includes(s.verificationStatus))
      return res.status(404).json({error:"Document is restricted or unavailable"});
    res.set("Content-Security-Policy", "sandbox");
    res.download(path.join(uploadDirectory, s.filePath), `${s.key}.pdf`);
  };
