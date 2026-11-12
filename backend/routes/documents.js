import {Router,raw} from "express";
import {uploadDocument,downloadDocument} from "../controllers/documentController.js";
export function documentRouter(auth){const router=Router();router.post("/admin/documents",auth,raw({type:"application/pdf",limit:"10mb"}),uploadDocument);router.get("/documents/:key",downloadDocument);return router;}
