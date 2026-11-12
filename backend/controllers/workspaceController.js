import {createHash} from 'node:crypto';
import bcrypt from 'bcryptjs';
import {z} from 'zod';
import {Admin,Entry,Audit,models,snapshot} from '../models/index.js';
import {locked} from '../models/MutationLock.js';
import {schemas} from '../middleware/validation.js';
import {quickFeeSchema,quickCpiSchema,selectionSchema} from '../middleware/workspaceValidation.js';
import {buildReport} from './reportCalculation.js';
import {AIReport} from '../models/AIReport.js';
const id=value=>createHash('sha256').update(value).digest('hex').slice(0,32);
export async function workspaceStatus(req,res){
 const hasKey = !!(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY);
 const model = process.env.GEMINI_API_KEY ? (process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite') : (process.env.OPENAI_MODEL || 'gpt-4.1-mini');
 res.json({setupRequired:!(await Admin.exists({})),aiConfigured:hasKey,model});
}
export async function setupWorkspace(req,res){
 if(process.env.ADMIN_EMAIL)return res.status(403).json({error:"Account registration is disabled. Sign in with the designated administrator account."});
 if(process.env.NODE_ENV==='production'||!['127.0.0.1','::1','::ffff:127.0.0.1'].includes(req.socket.remoteAddress))return res.status(403).json({error:'Initial setup is available only on this local computer.'});
 const input=z.object({email:z.email(),password:z.string().min(14).max(256)}).parse(req.body);
 await locked(async()=>{if(await Admin.exists({}))throw Object.assign(Error('An account already exists. Sign in instead.'),{status:409});await Admin.create({email:input.email.toLowerCase(),hash:await bcrypt.hash(input.password,12)});});res.status(201).json({ok:true});
}
export async function createProgramme(req,res){
 const input=z.object({name:z.string().trim().min(2).max(150),degreeLevel:z.string().max(100).default('Unspecified')}).parse(req.body);
 const key='programme-'+id(input.name.toLowerCase());
 const row=schemas.programmes.parse({key,...input});
 await locked(async()=>{if(await models.programmes.exists({key}))throw Object.assign(Error('This programme already exists. Select it from the list.'),{status:409});await Entry.updateOne({dataset:'programmes',key},{$set:{data:row}},{upsert:true});await Audit.create({adminId:req.adminId,action:'create-programme',dataset:'programmes',keys:[key]});});res.status(201).json(row);
}
function evidenceRow(e,key,year){return schemas.sources.parse({key,title:e.title,url:e.url,citation:`${e.title}; year ${year}; ${e.page}`,pages:e.page,verificationStatus:e.verified?'verified':'draft',publicationYear:year});}
export async function saveQuickFee(req,res){
 const input=quickFeeSchema.parse(req.body),key='fee-'+input.key,sourceKey='source-'+input.key;
 const source=evidenceRow(input.evidence,sourceKey,input.year);
 const fee=schemas.fees.parse({...input,key,sourceKey,page:input.evidence.page,verificationStatus:input.evidence.verified?'published':'draft'});
 await locked(async()=>{
  if(!(await models.programmes.exists({key:fee.programmeKey})))throw Object.assign(Error('Select an existing programme first.'),{status:400});
  const duplicate=await models.fees.findOne({key:{$ne:key},'data.programmeKey':fee.programmeKey,'data.year':fee.year,'data.campus':fee.campus,'data.unit':fee.unit,'data.component':fee.component,'data.period':fee.period,'data.academicTerm':fee.academicTerm}).lean();
  if(duplicate)throw Object.assign(Error('A record already exists for this year and comparison. Use Edit on that record.'),{status:409});
  const existing=await models.fees.findOne({key}).lean();
  if(existing&&existing.data.sourceKey!==sourceKey)throw Object.assign(Error('Use the research desk to edit imported records.'),{status:409});
  // Validate everything first; a retry with the same key safely completes a partial write.
  await Entry.updateOne({dataset:'sources',key:sourceKey},{$set:{data:source}},{upsert:true});
  await Entry.updateOne({dataset:'fees',key},{$set:{data:fee}},{upsert:true});
  await Audit.create({adminId:req.adminId,action:'quick-save',dataset:'fees',keys:[key,sourceKey]});
 });res.json({ok:true,fee});
}
export async function saveQuickCpi(req,res){
 const input=quickCpiSchema.parse(req.body),key='cpi-'+id(`${input.series}|${input.period}|${input.year}`),sourceKey='source-'+key;
 if(input.period==='calendar'&&input.year>=new Date().getUTCFullYear())throw Object.assign(Error('A complete calendar-year average is not available until that year ends. Do not enter a partial-year index here.'),{status:400});
 const source=evidenceRow(input.evidence,sourceKey,input.year);
 const row=schemas.cpi.parse({...input,key,sourceKey,page:input.evidence.page,verificationStatus:input.evidence.verified?'published':'draft'});
 await locked(async()=>{
  if(await models.cpi.exists({'data.series':input.series,'data.period':input.period,'data.year':input.year}))throw Object.assign(Error('This CPI year already exists. Use Research desk to review or edit it.'),{status:409});
  if(await models.cpi.exists({'data.series':input.series,'data.baseYear':{$ne:input.baseYear}}))throw Object.assign(Error('This series uses another base year. Use a separate series name.'),{status:400});
  await Entry.updateOne({dataset:'sources',key:sourceKey},{$set:{data:source}},{upsert:true});await Entry.updateOne({dataset:'cpi',key},{$set:{data:row}},{upsert:true});await Audit.create({adminId:req.adminId,action:'quick-save',dataset:'cpi',keys:[key]});
 });res.json({ok:true});
}
export async function workspaceData(req,res){res.json(await snapshot());}
export async function workspaceReport(req,res){const selection=selectionSchema.parse(req.query),report=buildReport(await snapshot(),selection);const ai=await AIReport.findOne({fingerprint:report.fingerprint}).lean();res.json({...report,ai:ai?{text:ai.text,model:ai.model,createdAt:ai.createdAt}:null});}

export async function seedDemoData(req,res){
 const years=Array.from({length:40},(_,i)=>1987+i),series='DEMO · Synthetic CPI (not historical data)',baseYear='Synthetic demo base (1987 = 100)';
 const programmes=[
  {key:'demo-bba',name:'Demo · Business Administration (BBA)',degreeLevel:'Undergraduate',description:'Synthetic example programme for dashboard demonstrations.',isDemo:true},
  {key:'demo-computing',name:'Demo · Computer Science',degreeLevel:'Undergraduate',description:'Synthetic example programme for dashboard demonstrations.',isDemo:true},
  {key:'demo-english',name:'Demo · English Literature',degreeLevel:'Undergraduate',description:'Synthetic example programme for dashboard demonstrations.',isDemo:true},
 ].map(p=>schemas.programmes.parse(p));
 const source=schemas.sources.parse({key:'demo-synthetic-source',title:'Synthetic demonstration dataset · not historical evidence',url:'https://example.com/synthetic-demonstration-data',citation:'Illustrative values generated for the Journey 40 dashboard demonstration; not sourced university records.',publisher:'Project demonstration',documentType:'synthetic dataset',pages:'All rows',verificationStatus:'draft',notes:'These values are mock data. They do not represent actual historical fees or official CPI.',isDemo:true});
 let index=100;
 const cpi=years.map((year,i)=>{if(i)index*=1+[.045,.072,.093,.118,.064,.081,.105,.057][i%8];return schemas.cpi.parse({key:`demo-cpi-${year}`,year,index:Number(index.toFixed(4)),series,baseYear,verificationStatus:'draft',period:'calendar',sourceKey:source.key,page:'Synthetic demo row',notes:'Illustrative annual index generated for dashboard testing; not actual PBS data.',isDemo:true});});
 const startFees=[1800,2200,1400],growth=[.106,.112,.098];
 const fees=programmes.flatMap((p,pi)=>years.map((year,i)=>schemas.fees.parse({key:`demo-fee-${p.key}-${year}`,year,period:'calendar',programmeKey:p.key,campus:'Karachi',unit:'course',component:'tuition',academicTerm:'annual-observation',verificationStatus:'draft',amount:Number((startFees[pi]*Math.pow(1+growth[pi],i)*(1+((i*7+pi*11)%9-4)*.012)).toFixed(0)),sourceKey:source.key,page:'Synthetic demo row',notes:'Mock fee for chart and dashboard demonstration only.',isDemo:true})));
 await locked(async()=>{
  for(const row of programmes)await Entry.updateOne({dataset:'programmes',key:row.key},{$set:{data:row}},{upsert:true});
  await Entry.updateOne({dataset:'sources',key:source.key},{$set:{data:source}},{upsert:true});
  for(const row of cpi)await Entry.updateOne({dataset:'cpi',key:row.key},{$set:{data:row}},{upsert:true});
  for(const row of fees)await Entry.updateOne({dataset:'fees',key:row.key},{$set:{data:row}},{upsert:true});
  await Audit.create({adminId:req.adminId,action:'seed-demo-data',dataset:'demo',keys:[source.key,...programmes.map(p=>p.key)]});
 });
 res.json({ok:true,programmes:programmes.length,fees:fees.length,cpi:cpi.length,years:years.length});
}
