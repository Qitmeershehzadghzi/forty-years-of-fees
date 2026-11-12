import './env.js';
import fs from 'node:fs';
import mongoose from 'mongoose';
import {connectDatabase} from './database.js';
import {models,snapshot,Audit} from '../models/index.js';
import {schemas,assertReferences} from '../middleware/validation.js';
import {locked} from '../models/MutationLock.js';

// Curated observations only. Never interpolate years or overwrite edited records.
const input=JSON.parse(fs.readFileSync(new URL('./greenwich-research.json',import.meta.url),'utf8'));
try {
 await connectDatabase();
 await locked(async()=>{
  const state=await snapshot();
  const inserted={};
  for(const dataset of ['programmes','sources','cpi','fees','notes']) {
   inserted[dataset]=0;
   const seen=new Set();
   for(const raw of input[dataset]) {
    const row=schemas[dataset].parse(raw);
    if(seen.has(row.key))throw Error('Duplicate curated key: '+row.key);
    seen.add(row.key);
    if(state[dataset].some(r=>r.key===row.key))continue;
    assertReferences(dataset,[row],state);
    if(dataset==='cpi'&&state.cpi.some(r=>r.series===row.series&&r.period===row.period&&r.year===row.year))continue;
    const result=await models[dataset].updateOne({key:row.key},{$setOnInsert:{key:row.key,data:row}},{upsert:true});
    state[dataset].push(row);
    inserted[dataset]+=result.upsertedCount;
   }
  }
  await Audit.create({action:'import-curated-greenwich-research',dataset:'research',keys:input.fees.map(r=>r.key)});
  console.log('Imported new records:',JSON.stringify(inserted));
 });
} finally {await mongoose.disconnect();}
