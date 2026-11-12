import {createHash} from 'node:crypto';
import {adjust} from '../middleware/validation.js';
export function buildReport(data, selection) {
 const matching=data.fees.filter(f=>f.programmeKey===selection.programme&&f.unit===selection.unit&&f.component===selection.component&&f.period===selection.period&&f.campus===selection.campus&&f.academicTerm===selection.academicTerm&&f.year>=selection.from&&f.year<=selection.to).sort((a,b)=>a.year-b.year||a.key.localeCompare(b.key));
 const indices=data.cpi.filter(c=>c.series===selection.series&&c.period===selection.period&&['verified','published'].includes(c.verificationStatus)&&data.sources.some(s=>s.key===c.sourceKey&&['verified','published'].includes(s.verificationStatus)));
 const reference=indices.find(c=>c.year===selection.referenceYear);
 const rows=matching.map(f=>{const cpi=indices.find(c=>c.year===f.year);const source=data.sources.find(s=>s.key===f.sourceKey);const verified=f.verificationStatus==='published'&&['verified','published'].includes(source?.verificationStatus);return {...f,source,cpi:cpi||null,real:verified&&f.yearBasis!=='observed'?adjust(f.amount,cpi,reference):null,verified,issue:f.yearBasis==='observed'?'Effective year is not stated; observation date cannot be used for inflation adjustment':!verified?'Fee source requires verification':!cpi?'Missing verified CPI for this year':!reference?'Missing verified reference-year CPI':cpi.baseYear!==reference.baseYear?'CPI bases do not match':null};});
 const years=Array.from({length:selection.to-selection.from+1},(_,i)=>selection.from+i);
 const chart=years.map(year=>{const found=rows.filter(r=>r.year===year);return {year,amount:found.length===1?found[0].amount:null,real:found.length===1?found[0].real:null,ambiguous:found.length>1};});
 const valid=chart.filter(r=>r.real!==null),first=valid[0],last=valid.at(-1);
 const comparison=valid.length>=2&&first.amount>0&&first.real>0?{from:first.year,to:last.year,nominalChange:(last.amount/first.amount-1)*100,realChange:(last.real/first.real-1)*100,priceChange:(indices.find(c=>c.year===last.year).index / indices.find(c=>c.year===first.year).index-1)*100}:null;
 const missingYears=years.filter(y=>!rows.some(r=>r.year===y));
 const summary=!rows.length?'Is selection ka record abhi nahi hai. Pehli fee save karein.':comparison?`${comparison.from} se ${comparison.to}: original fee ${comparison.nominalChange.toFixed(1)}% aur inflation-adjusted fee ${comparison.realChange.toFixed(1)}% badli. Yeh available comparable observations ka comparison hai, complete annual history nahi.`:`${rows.length} saved record(s), ${valid.length} comparable adjusted point(s). Trend ke liye kam az kam do different years ki verified fees aur matching CPI chahiye.`;
 const result={selection,programme:data.programmes.find(p=>p.key===selection.programme)||null,rows,chart,reference:reference||null,comparison,missingYears,summary,formula:'Real fee = nominal fee × reference-year CPI / fee-year CPI',counts:{records:rows.length,verified:rows.filter(r=>r.verified).length,adjusted:valid.length,missing:missingYears.length}};
 result.fingerprint=createHash('sha256').update(JSON.stringify(result)).digest('hex');return result;
}
