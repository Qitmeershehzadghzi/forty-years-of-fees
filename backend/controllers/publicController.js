import mongoose from "mongoose";
import {snapshot,publicDataset} from "../models/index.js";
export const health = (req, res) =>
  res.json({ ok: mongoose.connection.readyState === 1 });
export const getPublicData = async (req, res) => res.json(publicDataset(await snapshot()));