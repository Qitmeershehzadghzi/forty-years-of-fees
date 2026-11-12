

import {api} from "./services/adminApi";
import {money,pairs} from "./utils/format";
import {Select,Empty,Citation} from "./components/Controls";
import Methodology from "./pages/Methodology";

import Charity from "./pages/Charity";
import Sources from "./pages/Sources";
import {AuthProvider, useAuth} from "./context/AuthContext";
import {useRoute} from "./hooks/useRoute";
import {downloadCSV, request} from "./services/api";
import Records from "./pages/Records";
import Analysis from "./pages/Analysis";
import { parseCSV } from "./utils/csv.js";
import React, { useState, useEffect, lazy, Suspense } from "react";


import {
  ArrowUpRight,
  BookOpen,
  ArrowRight,
  Download,
  ShieldCheck,
  Search,
  Landmark,
} from "lucide-react";
import "./styles/app.css";
const FeeChart = lazy(() => import("./components/charts/FeeChart.jsx"));
const empty = { fees: [], cpi: [], programmes: [], sources: [], notes: [] };
export default function App() {
  const [page,setPage] = useRoute();
  const [data, setData] = useState(empty),
    [analysisRows,setAnalysisRows] = useState([]),
    
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [programme, setProgramme] = useState(""),
    [campus, setCampus] = useState(""),
    [unit, setUnit] = useState("course"),
    [component, setComponent] = useState("tuition"),
    [series, setSeries] = useState(""),
    [period, setPeriod] = useState("calendar"),
    [base, setBase] = useState(""),
    [query, setQuery] = useState("");
  async function reload() {
    try {
      setData(await api("/data"));
      setError("");
    } catch (e) {
      setError(
        "Cannot reach the database. Start the backend and MongoDB, then retry.",
      );
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    reload();
  }, []);
  useEffect(()=>{reload();},[page]);
  useEffect(()=>{const refresh=()=>reload();window.addEventListener("focus",refresh);const timer=setInterval(refresh,30000);return()=>{window.removeEventListener("focus",refresh);clearInterval(timer);};},[]);
  const prog = (data.programmes.some((p) => p.key === programme) ? programme : data.programmes[0]?.key) || "",
    site =
      (data.fees.some((f) => f.programmeKey === prog && f.campus === campus)
        ? campus : data.fees.find((f) => f.programmeKey === prog)?.campus) || "",
    s = (data.cpi.some((c) => c.series === series) ? series : data.cpi[0]?.series) || "",
    indices = data.cpi.filter((c) => c.series === s && c.period === period),
    by = indices.some((c) => String(c.year) === base)
      ? base : indices.length ? String(Math.max(...indices.map((c) => c.year))) : "",
    bc = indices.find((c) => String(c.year) === by);
  useEffect(()=>{
    let live=true;
    const params=new URLSearchParams({programme:prog,campus:site,unit,component,period,series:s,referenceYear:by});
    api("/analytics/fees?"+params).then(d=>{if(live)setAnalysisRows(d.rows);}).catch(()=>{if(live)setAnalysisRows([]);});
    return ()=>{live=false;};
  },[prog,site,unit,component,period,s,by,data]);
  const rows = analysisRows,
    visible = rows.filter((f) =>
      (f.year + " " + f.key + " " + f.notes)
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  function exportData() {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            exportedAt: new Date().toISOString(),
            method: "real = nominal * CPI(base) / CPI(record year)",
            selection: {
              programme: prog,
              campus: site,
              unit,
              component,
              series: s,
              period,
              baseYear: by,
            },
            adjustedRecords: rows,
            ...data,
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = "journey40-fact-sheet.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  if(page === "Workspace" || page === "Admin"){location.replace(import.meta.env.DEV?"http://localhost:5174/admin/":"/admin/");return null;}
  return (
    <>
      <header>
        <a className="brand" href="#" onClick={() => setPage("Explore")}>
          <span className="brandmark">
            40<span>JOURNEY</span>
          </span>
          <span>
            Greenwich University<small>A RESEARCH ARCHIVE · SINCE 1987</small>
          </span>
        </a>
        <nav>
          {[
            "Workspace",
            "Explore",
            "Records",
            "Analysis",
            "Programmes",
            "Sources",
            "Research note",
            "Methodology",
          ].map((p) => (
            <button
              className={page === p ? "active" : ""}
              onClick={() => setPage(p)}
              key={p}
            >
              {p}
            </button>
          ))}
        </nav>
        <button className="adminlink" onClick={() => setPage("Admin")}>
          <ShieldCheck size={16} /> Research desk
        </button>
      </header>
      <main>
        {error && (
          <div className="error">
            <strong>Research archive is temporarily unavailable.</strong><p>Records will appear when the research server reconnects.</p><details><summary>Connection details</summary>{error}</details><button onClick={reload}>Try again</button>
          </div>
        )}
        {page === "Explore" ? (
          <>
            {data.fees.some(f=>f.isDemo)&&<div className="notice" role="status"><strong>Demo data is on.</strong> Charts include synthetic example fees and CPI for demonstration. These values are not Greenwich historical records or official inflation figures.</div>}
            <section className="hero">
              <div>
                <div className="eyebrow">
                  <span /> GREENWICH UNIVERSITY · JOURNEY 40
                </div>
                <h1 aria-label="Forty Years of Fees">
                  Forty years.
                  <br />
                  What did education
                  <br />
                  <em>really cost?</em>
                </h1>
                <p>
                  A student research project comparing Greenwich fees with inflation. Explore documented fee schedules with their original sources and clearly stated gaps.
                </p>
                <a href="#explorer" className="primary">
                  Explore sourced records <ArrowRight size={18} />
                </a> <button className="outline" onClick={()=>setPage("Methodology")}>Understand inflation</button>
              </div>
              <div
                className="archive-art"
                aria-label="Decorative archive illustration, no fee data"
              >
                <div className="art-label">
                  THE FEES ARCHIVE <ArrowUpRight size={20} />
                </div>
                <div className="big40">40</div>
                <div className="art-bottom">
                  <span>
                    YEARS OF
                    <br />
                    PERSPECTIVE
                  </span>
                  <span>
                    1987
                    <br />↓<br />
                    JOURNEY 40
                  </span>
                </div>
                <div className="art-lines" />
              </div>
            </section>

            <section className="stats">
              <div>
                <strong>{String(data.fees.length).padStart(2, "0")}</strong>
                <span>Sourced fee records</span>
              </div>
              <div>
                <strong>
                  {String(data.programmes.length).padStart(2, "0")}
                </strong>
                <span>Programmes in the archive</span>
              </div>
              <div>
                <strong>{String(data.sources.length).padStart(2, "0")}</strong>
                <span>Primary & research sources</span>
              </div>
              <div className="stat-note">
                <ShieldCheck />
                <span>
                  Every figure needs a source.
                  <br />
                  <b>No estimates fill the gaps.</b>
                </span>
              </div>
            </section>
            <section id="explorer" className="section">
              <div className="section-head">
                <div>
                  <div className="eyebrow">01 / THE LONG VIEW</div>
                  <h2>Fees, in perspective.</h2>
                  <p>
                    Compare published amounts with their purchasing power in a
                    selected year.
                  </p>
                </div>
                <button className="outline" onClick={exportData}>
                  <Download size={16} /> Export fact sheet
                </button>
              </div>
              <div className="filters">
                <Select
                  label="Programme"
                  value={prog}
                  onChange={(v) => {
                    setProgramme(v);
                    setCampus("");
                  }}
                  options={data.programmes.map((p) => [p.key, p.name])}
                />
                <Select
                  label="Campus"
                  value={site}
                  onChange={setCampus}
                  options={[
                    ...new Set(
                      data.fees
                        .filter((f) => f.programmeKey === prog)
                        .map((f) => f.campus),
                    ),
                  ].map((c) => [c, c])}
                />
                <Select
                  label="Fee unit"
                  value={unit}
                  onChange={setUnit}
                  options={pairs(["semester", "year", "credit", "course", "programme"])}
                />
                <Select
                  label="Component"
                  value={component}
                  onChange={setComponent}
                  options={pairs(["tuition", "admission", "total"])}
                />
                <Select
                  label="CPI series"
                  value={s}
                  onChange={(v) => {
                    setSeries(v);
                    setBase("");
                  }}
                  options={pairs([...new Set(data.cpi.map((c) => c.series))])}
                />
                <Select
                  label="Year basis"
                  value={period}
                  onChange={(v) => {
                    setPeriod(v);
                    setBase("");
                  }}
                  options={pairs(["fiscal", "calendar"])}
                />
                <Select
                  label="Purchasing-power year"
                  value={by}
                  onChange={setBase}
                  options={indices.map((c) => [String(c.year), String(c.year)])}
                />
              </div>
              <article className="chart-card"><h3>What this evidence can tell us</h3><p>Published fees use their documented unit and term. Degree-level schedules are labelled as categories. Programme catalogue entries without direct fee evidence show unavailable fees. Observed-year quotations are labelled and do not establish their effective academic year. The 2017 archive is per credit hour and must not be mixed with per-course fees.</p><p>Real fee = original fee × reference-year CPI ÷ fee-year CPI. PBS calendar indices cover 2018–2025 here. Missing fees and missing CPI remain unavailable; a complete 2026 annual CPI is not yet available. These figures measure purchasing power, not household affordability or the cause of a fee increase.</p><p>2020 indexed fee sheets remain drafts in the admin panel while original-document retrieval is pending.</p></article><div className="chart-card">
                <div className="chart-title">
                  <span>
                    <b>{rows.some(r=>r.isDemo)?"Demo fee & inflation-adjusted demo fee":"Published fee & inflation-adjusted fee"}</b>
                    <small>
                      PKR · {unit} · {component} · {period} CPI · reference year{" "}
                      {bc ? by : "unavailable"}
                    </small>
                  </span>
                  <span className="tag">{rows.some(r=>r.isDemo)?"SYNTHETIC DEMO INCLUDED":"SOURCED INPUTS ONLY"}</span>
                </div>
                {loading ? (
                  <Empty title="Connecting to the archive…" />
                ) : rows.length ? (
                  <>
                    <Suspense fallback={<Empty title="Loading chart?" />}>
                      <FeeChart rows={rows} money={money} />
                    </Suspense>
                    <p className="muted">
                      {rows.filter((r) => r.real === null).length} record(s)
                      lack matching CPI. Lines connect recorded observations;
                      intervening years are not estimates. Duplicate year
                      records remain separate.
                    </p>
                    {bc && (
                      <p className="muted">
                        Reference-year CPI: {bc.index} ·{" "}
                        <Citation data={data} id={bc.sourceKey} /> · {bc.page}
                      </p>
                    )}
                  </>
                ) : (
                  <Empty
                    title="The story starts with evidence."
                    text="No sourced fees match this selection yet. Add a programme, a cited fee schedule, and its fee records at the Research desk."
                  />
                )}
              </div>
              <div className="section-head compact">
                <h3>The underlying records</h3>
                <label className="search">
                  <Search size={16} />
                  <input
                    aria-label="Search records"
                    placeholder="Search year or record…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      {[
                        "Year¹",
                        "Published fee",
                        "Adjusted fee",
                        "Fee evidence",
                        "CPI evidence",
                        "Research notes",
                      ].map((x) => (
                        <th key={x}>{x}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((r) => (
                      <tr key={r.key}>
                        <td>{r.year}<small>{r.yearBasis === "observed" ? "Observed · effective year unstated" : "Effective year"}</small></td>
                        <td>{money(r.amount)}</td>
                        <td>{money(r.real)}</td>
                        <td>
                          <Citation data={data} id={r.sourceKey} /> · {r.page}
                        </td>
                        <td>
                          {r.cpi ? (
                            <>
                              <Citation data={data} id={r.cpi.sourceKey} /> ·{" "}
                              {r.cpi.page}
                            </>
                          ) : (
                            "Missing"
                          )}
                        </td>
                        <td>{r.notes || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!visible.length && (
                  <p className="muted p-6">No records to display.</p>
                )}
              </div>
              <p className="muted">
                ¹ Fiscal year 2020 means 2019–20. Map university sessions
                consistently to the selected CPI basis before entry.
              </p>
            </section>
            <section className="section"><div className="eyebrow">THE RESEARCH PROCESS</div><h2>Four decades. One consistent method.</h2><div className="cards">{[["01","Collect","Locate official prospectuses and fee schedules for 1987?2026."],["02","Verify","Match programme history, fee scope and exact document pages."],["03","Compare","Apply comparable PBS CPI observations and disclose missing years."],["04","Publish","Release verified observations with citations and reproducible exports."]].map(([n,t,d])=><article key={n}><span className="tag">{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div><p className="muted">Research coverage: {new Set(data.fees.map(f=>f.year)).size} of 40 years currently have published fee evidence. Coverage indicates records found, rather than proof of every fee charged.</p></section>
            <section className="callout">
              <BookOpen size={36} />
              <div>
                <div className="eyebrow">BEYOND THE NUMBERS</div>
                <h2>Who makes education possible?</h2>
                <p>
                  A research space for Karachi’s traditions of educational
                  giving: zakat, waqf, church and temple trusts.
                </p>
              </div>
              <button
                className="outline"
                onClick={() => setPage("Research note")}
              >
                Read the research note <ArrowUpRight size={18} />
              </button>
            </section>
          </>
        ) : page === "Records" ? (<Records data={data}/>) : page === "Analysis" ? (<Analysis data={data}/>) : page === "Admin" ? (
          null
        ) : (
          <section className="section content">
            <div className="eyebrow">JOURNEY 40 / THE ARCHIVE</div>
            <h1>{page}</h1>
            {page === "Programmes" ? (
              <div className="cards">
                {data.programmes.map((p) => (
                  <article key={p.key}>
                    <Landmark />
                    <h2>{p.name}</h2>
                    <p>{p.description}</p><p>{p.degreeLevel} ? {p.department}</p><p className="muted">Documented fee years: {[...new Set(data.fees.filter(f=>f.programmeKey===p.key).map(f=>f.year))].sort().join(", ") || "No published fee evidence yet"}</p>
                    <p className="muted">
                      {data.fees.filter((f) => f.programmeKey === p.key).length}{" "}
                      fee records
                    </p>
                    <button
                      className="outline"
                      onClick={() => {
                        setProgramme(p.key);
                        setCampus("");
                        setPage("Explore");
                      }}
                    >
                      Explore programme <ArrowRight size={16} />
                    </button>
                  </article>
                ))}
                {!data.programmes.length && (
                  <Empty
                    title="Programmes await verification."
                    text="Researchers can add programmes through the Research desk."
                  />
                )}
              </div>
            ) : page === "Sources" ? (<Sources data={data}/>) : page === "Research note" ? (<Charity data={data}/>) : (
              <Methodology />
            )}
          </section>
        )}
      </main>
      <footer>
        <span>
          <b>JOURNEY 40</b> / Forty Years of Fees
        </span>
        <span>
          Student research archive · Greenwich University
          <br />
          Independent project interface; not an official fee quotation.
        </span>
        <button onClick={() => setPage("Methodology")}>
          Evidence & methodology ↗
        </button>
      </footer>
    </>
  );
}

