import "./env.js";
import mongoose from "mongoose";
import {schemas} from "../middleware/validation.js";
import {models,Admin} from "../models/index.js";
// Explicit migration only. Never removes or modifies legacy collections.
try {
  await mongoose.connect(process.env.MONGODB_URI, {serverSelectionTimeoutMS:10000});
  const commit=process.argv.includes("--commit");
  const entries=await mongoose.connection.collection("entries").find({}).toArray();
  let records=0,users=0;
  for(const e of entries){
    if(!Object.hasOwn(schemas,e.dataset))continue;
    const data=schemas[e.dataset].parse({...e.data,verificationStatus:"draft"});
    if(commit)await models[e.dataset].updateOne({key:data.key},{$setOnInsert:{key:data.key,data}},{upsert:true});
    records++;
  }
  for(const u of await mongoose.connection.collection("admins").find({}).toArray()){
    if(!u.email||!u.hash)continue;
    if(commit)await Admin.updateOne({email:u.email},{$setOnInsert:{email:u.email,hash:u.hash,role:"admin"}},{upsert:true});
    users++;
  }
  console.log(`${commit?"Migrated":"Dry run:"} ${records} legacy records and ${users} administrator accounts. Existing destination keys are preserved. Legacy content becomes draft and requires review.`);
}catch(e){console.error(e.message);process.exitCode=1;}finally{await mongoose.disconnect();}
