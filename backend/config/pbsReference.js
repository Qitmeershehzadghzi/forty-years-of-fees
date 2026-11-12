import {models} from '../models/index.js';
import {schemas} from '../middleware/validation.js';
export async function ensurePbsReference(){
 const sourceKey='pbs-national-monthly-reference';
 const source=schemas.sources.parse({key:sourceKey,title:'PBS Historical Indices · National CPI',url:'https://www.pbs.gov.pk/wp-content/uploads/2020/07/indices_and_growth_rates_historical-1.pdf',citation:'Pakistan Bureau of Statistics, Historical Indices, National column, pages 2 and 4. Retrieved 5 November 2026.',publisher:'Pakistan Bureau of Statistics',verificationStatus:'verified',notes:'Calendar means calculated from all twelve published monthly levels. No 2026 annual average inferred.'});
 await models.sources.updateOne({key:sourceKey},{$setOnInsert:{key:sourceKey,data:source}},{upsert:true});
 const months={2020:[133,131.6,131.7,130.6,131,132.1,135.4,136.2,138.3,140.7,141.8,140.9],2025:[266.2,264,266.3,264.1,263.6,264.2,271.9,270.2,275.6,280.7,281.8,280.5]};
 for(const [year,values] of Object.entries(months)){
  const row=schemas.cpi.parse({key:'pbs-national-calendar-'+year,year:Number(year),index:values.reduce((a,b)=>a+b,0)/12,series:'PBS National CPI 2015-16 calendar mean',baseYear:'2015-16',period:'calendar',sourceKey,page:'Historical Indices, National column, page '+(year==='2020'?2:4),verificationStatus:'published',notes:'Researcher-calculated January–December arithmetic mean. Monthly inputs in order: '+values.join(', ')});
  if(!await models.cpi.exists({'data.year':row.year,'data.series':row.series,'data.period':row.period}))await models.cpi.updateOne({key:row.key},{$setOnInsert:{key:row.key,data:row}},{upsert:true});
 }
}
