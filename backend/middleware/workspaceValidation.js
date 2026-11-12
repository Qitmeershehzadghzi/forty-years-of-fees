import {z} from 'zod';
const year=z.coerce.number().int().min(1987).max(2026);
const nonempty=z.string().trim().min(1).max(500);
const number=z.union([z.number(),z.string().trim().min(1)]).pipe(z.coerce.number().finite().nonnegative().max(1e10));
export const evidenceSchema=z.object({title:nonempty,url:z.url().refine(v=>/^https?:/.test(v),'Use an https:// source link'),page:nonempty,verified:z.boolean().default(false)});
export const quickFeeSchema=z.object({key:z.string().uuid(),year,programmeKey:nonempty,amount:number,unit:z.enum(['semester','year','credit','course','programme']),component:z.enum(['tuition','admission','total']),period:z.enum(['calendar','fiscal']),campus:nonempty,academicTerm:nonempty,notes:z.string().max(4000).default(''),evidence:evidenceSchema});
export const quickCpiSchema=z.object({year,index:number.refine(v=>v>0,'CPI must be positive'),series:nonempty,baseYear:nonempty,period:z.enum(['calendar','fiscal']),evidence:evidenceSchema});
export const selectionSchema=z.object({programme:z.string().max(80).default(''),unit:z.enum(['semester','year','credit','course','programme']).default('course'),component:z.enum(['tuition','admission','total']).default('tuition'),period:z.enum(['calendar','fiscal']).default('calendar'),campus:z.string().max(500).default('Karachi'),academicTerm:z.string().max(100).default('annual-observation'),series:z.string().max(500).default(''),referenceYear:year.default(2025),from:year.default(1987),to:year.default(2026)}).refine(q=>q.from<=q.to,'Start year must precede end year');
