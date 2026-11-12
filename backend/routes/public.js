import {getAnalytics,getRecords} from "../controllers/catalogController.js";
import { Router } from "express";
export const publicRouter = Router();
publicRouter.get("/analytics/:kind", getAnalytics);
for (const [url, dataset] of Object.entries({fees:"fees", cpi:"cpi", programmes:"programmes", sources:"sources", research:"notes"})) {
  publicRouter.get(`/${url}{/:id}`, getRecords(dataset,url));
}
