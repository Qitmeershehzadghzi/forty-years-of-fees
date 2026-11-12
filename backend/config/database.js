import {ensurePbsReference} from "./pbsReference.js";
import mongoose from "mongoose";
import {Entry,Session,Admin} from "../models/index.js";
export async function connectDatabase(){
if(!process.env.MONGODB_URI) throw Error("Set MONGODB_URI in backend/.env");
await mongoose.connect(process.env.MONGODB_URI,{serverSelectionTimeoutMS:10000});
await Promise.all([Entry.init(),Session.init(),Admin.init()]);
if(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD_HASH){await Admin.updateOne({email:process.env.ADMIN_EMAIL},{$set:{hash:process.env.ADMIN_PASSWORD_HASH,role:"admin"}},{upsert:true});}
if(process.env.SEED_PBS_REFERENCE!=="false") await ensurePbsReference();
}
