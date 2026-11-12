import React, {useState,useEffect} from "react";
import {request} from "../services/api";
export default function Records({data}) {
  const [filters,setFilters]=useState({q:"", from:1987,to:2026,programme:"",degreeLevel:"",unit:"",component:"",order:"asc",sort:"year"});
  const [page,setPage]=useState(1), [result,setResult]=useState(null),[error,setError]=useState("");
  const query = new URLSearchParams({...filters,page,limit:15}).toString();
  useEffect(()=>{let live=true;setResult(null);request("/fees?"+query).then(d=>{if(live){setResult(d);setError("");}}).catch(e=>live&&setError(e.message));return()=>{live=false;};},[query]);
  const field=(key,label,options)=> <label>{label}{options?<select value={filters[key]} onChange={e=>{setFilters({...filters,[key]:e.target.value});setPage(1);}}><option value="">All</option>{options.map(([v,t])=><option key={v} value={v}>{t}</option>)}</select>:<input type={["from","to"].includes(key)?"number":"search"} min="1987" max="2026" value={filters[key]} onChange={e=>{setFilters({...filters,[key]:e.target.value});setPage(1);}}/>}</label>;
  return <section className="section content"><div className="eyebrow">THE SOURCE REGISTER / 1987–2026</div><h1>Historical fee records</h1><p>Published observations with verified sources. Missing inflation inputs remain unavailable.</p><div className="filters">
    {field("q","Search")}{field("from","From year")}{field("to","To year")}{field("programme","Programme",data.programmes.map(p=>[p.key,p.name]))}
    {field("degreeLevel","Degree level",[...new Set(data.programmes.map(p=>p.degreeLevel))].filter(Boolean).map(p=>[p,p]))}
    {field("unit","Fee basis",["semester","year","credit","course","programme"].map(p=>[p,p]))}
    {field("component","Category",["tuition","admission","total"].map(p=>[p,p]))}
    {field("sort","Sort by",[["year","Year"],["amount","Fee amount"]])}{field("order","Order",[["asc","Ascending"],["desc","Descending"]])}
  </div><a className="outline" href={"/api/fees?"+query+"&format=csv"}>Export filtered CSV</a>
  {error?<p role="alert" className="error">{error}</p>:!result?<p role="status" className="empty">Loading records…</p>:<><div className="table-wrap"><table><thead><tr>{["Academic year","Programme / degree","Tuition / category","Basis","Source / page","Status"].map(x=><th key={x}>{x}</th>)}</tr></thead><tbody>{result.rows.map(r=><tr key={r.key}><td>{r.year} · {r.period}<small>{r.academicTerm}</small></td><td>{data.programmes.find(p=>p.key===r.programmeKey)?.name}<small>{data.programmes.find(p=>p.key===r.programmeKey)?.degreeLevel}</small></td><td>PKR {r.amount.toLocaleString()}<small>{r.component}</small></td><td>Per {r.unit}</td><td><a href={data.sources.find(s=>s.key===r.sourceKey)?.url} target="_blank" rel="noreferrer">{r.sourceKey}</a><small>{r.page}</small></td><td><span className="tag">Published · source verified</span></td></tr>)}</tbody></table>{!result.total&&<div className="empty"><h3>No published records match.</h3><p>Add evidence through the Research desk, or broaden the filters.</p></div>}</div><div className="section-head compact"><span>{result.total} records · page {page}</span><div><button disabled={page===1} onClick={()=>setPage(page-1)}>← Previous</button><button disabled={page*15>=result.total} onClick={()=>setPage(page+1)}>Next →</button></div></div></>}
  <p className="muted">Open Analysis to select a comparable CPI series and purchasing-power reference year for adjusted amounts.</p></section>;
}
