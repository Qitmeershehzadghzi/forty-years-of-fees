import {request,downloadCSV} from "../services/api";
import React,{useState,useEffect} from "react";
import {useAuth} from "../context/AuthContext";
import {parseCSV} from "../utils/csv";
import {api} from "../services/adminApi";
import {pairs,money} from "../utils/format";
import {Select,Empty,Citation} from "../components/Controls";
import {ShieldCheck,Download,BookOpen,ArrowRight} from "lucide-react";
const empty = {fees:[], cpi:[], programmes:[], sources:[], notes:[]};
const definitions = {
  programmes: { key: "", name: "", degreeLevel:"", department:"", activeYears:"", archived:false, description: "" },
  sources: { key: "", title: "", url: "", citation: "", publisher:"", publicationYear:"", documentType:"prospectus", pages:"", verificationStatus:"draft", filePath:"", publicationRights:"restricted", notes: "" },
  fees: {
    key: "",
    year: 2026,
    period: "fiscal",
    programmeKey: "",
    campus: "",
    academicTerm:"annual-observation",
    verificationStatus:"draft",
    unit: "semester",
    component: "tuition",
    creditHours:"",
    amount: "",
    sourceKey: "",
    page: "",
    notes: "",
  },
  cpi: {
    key: "",
    year: 2026,
    index: "",
    series: "",
    baseYear:"",
    verificationStatus:"draft",
    period: "fiscal",
    sourceKey: "",
    page: "",
    notes: "",
  },
  notes: { key: "", title: "", body: "", category:"general", verificationStatus:"draft", sourceKeys: [] },
};
export default function Admin({ reload: reloadPublic }) {
  const {authenticated: logged,setAuthenticated: setLogged} = useAuth();
  const [data,setData] = useState(empty);
  const [overview,setOverview] = useState(null);
  async function reload(){
    const [d,o]=await Promise.all([api("/admin/data"),api("/admin/overview")]);setData(d);setOverview(o);await reloadPublic();
  }
  useEffect(()=>{if(logged)reload().catch(e=>setStatus(e.message));},[logged]);
  const 
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [collection, setCollection] = useState("fees"),
    [form, setForm] = useState({ ...definitions.fees }),
    [editing, setEditing] = useState(false),
    [status, setStatus] = useState(""),
    [busy, setBusy] = useState(false),
    [csv, setCsv] = useState(""),
    [preview, setPreview] = useState(false);
  useEffect(() => {
    api("/auth/me")
      .then(() => setLogged(true))
      .catch(() => {});
  }, []);
  async function run(fn) {
    setBusy(true);
    setPreview(false);
    setStatus("");
    try {
      await fn();
    } catch (e) {
      setStatus(e.message);
      if (e.message === "Sign in required") setLogged(false);
    } finally {
      setBusy(false);
    }
  }
  function change(c) {
    setCollection(c);
    setForm({ ...definitions[c] });
    setEditing(false);
    setPreview(false);
    setCsv("");
    setStatus("");
  }
  async function importRows(check) {
    let rows;
    try {
      rows = JSON.parse(csv);
    } catch {
      throw Error("Paste a JSON array or select a CSV file.");
    }
    const r = await api("/admin/" + collection + "/import", "POST", {
      rows,
      preview: check,
    });
    setPreview(check);
    setStatus(
      check
        ? r.count + " rows validated. Review and commit when ready."
        : r.count + " rows imported.",
    );
    if (!check) {
      setPreview(false);
      await reload();
    }
  }
  return (
    <section className="section content">
      <div className="eyebrow">RESEARCH DESK / ADMINISTRATION</div>
      <h1>Build the evidence.</h1>
      <p>
        Verified documents become traceable records. Save drafts, verify the evidence, then select published to release records to the public archive.
      </p>
      <article>
        <h2>Dashboard demo data</h2>
        <p>Create a clearly marked synthetic 40-year dataset for three example programmes. It is saved in MongoDB as draft/demo data and shown separately from verified historical evidence.</p>
        {logged&&<button className="primary" disabled={busy} onClick={()=>run(async()=>{const r=await api('/workspace/demo-data','POST',{});setStatus(`Demo data saved: ${r.programmes} programmes, ${r.fees} fee records and ${r.cpi} CPI records for ${r.years} years.`);await reload();})}>Add 40-year demo data</button>}
      </article>
      <article>
        <h2>Add historical records</h2>
        <p>Save sources first, then programmes, fees, CPI and research notes.
          Use the CSV files in the project?s templates folder for bulk entry:
          choose a file, validate it, then commit. Each batch supports up to 500 rows.</p>
        <p>Every fee needs a year, programme, campus, period, unit, component,
          PKR amount, source and exact page. CPI requires annual index levels
          for both the fee year and the purchasing-power reference year.
          Enter only documented observations.</p>
      </article>
      {status && (
        <div role="status" className="notice">
          {status}
        </div>
      )}
      {!logged ? (
        <form
          className="login"
          onSubmit={(e) => {
            e.preventDefault();
            run(async () => {
              await api("/auth/login", "POST", { email, password });
              setPassword("");
              setLogged(true);
            });
          }}
        >
          <h2>Researcher sign in</h2>
          <label>
            Email
            <input
              type="email"
              required
              value={email}
              autoComplete="username"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              required
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button className="primary" disabled={busy}>
            Sign in <ArrowRight size={16} />
          </button>
          <p className="muted">
            Create the first administrator with the documented setup command.
          </p>
        </form>
      ) : (
        <>
          <div className="section-head compact">
            <div className="tabs">
              {Object.keys(definitions).map((c) => (
                <button
                  key={c}
                  disabled={busy}
                  className={collection === c ? "active" : ""}
                  onClick={() => change(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <button
              onClick={() =>
                run(async () => {
                  await api("/auth/logout", "POST");
                  setLogged(false);
                })
              }
            >
              Sign out
            </button>
          </div>
          <div className="stats">{overview&&[[overview.records,"Published fees"],[overview.drafts,"Draft / review fees"],[overview.years.length,"Years documented"],[overview.cpiYears.length,"CPI years"]].map(([n,t])=><div key={t}><strong>{n}</strong><span>{t}</span></div>)}</div><article><h3>Coverage ? 1987?2026</h3><p>{overview?.completeness||0}% of years have published fee evidence.</p><p className="muted">Missing fee years: {overview?.missingYears.join(", ") || "None"}</p><details><summary>Recent data changes</summary>{overview?.recentChanges.map(c=><p key={c._id}>{new Date(c.at).toLocaleString()} ? {c.action} ? {c.dataset} ? {c.keys.join(", ")}</p>)}</details></article><div className="admin-grid">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                run(async () => {
                  await api(
                    "/admin/" + collection + "/" + form.key,
                    "PUT",
                    collection === "notes"
                      ? { ...form, sourceKeys: Array.isArray(form.sourceKeys)
                          ? form.sourceKeys
                          : form.sourceKeys.split(",").map(s => s.trim()).filter(Boolean) }
                      : form,
                  );
                  setStatus("Record saved.");
                  setEditing(false);
                  setForm({ ...definitions[collection] });
                  await reload();
                });
              }}
            >
              <h2>
                {editing ? "Edit" : "Add"} {collection} record
              </h2>
              {collection==="sources"&&<label>Upload supporting PDF (maximum 10 MB)<input type="file" accept="application/pdf,.pdf" onChange={e=>run(async()=>{const file=e.target.files[0];if(!file)return;if(file.size>10*1024*1024)throw Error("PDF exceeds 10 MB");const result=await request("/admin/documents",{method:"POST",headers:{"Content-Type":"application/pdf"},body:file});setForm(f=>({...f,filePath:result.filePath}));setStatus("PDF uploaded. Complete its citation and publication permission before saving.");})}/></label>}{Object.keys(definitions[collection]).map((k) => (
                <Field
                  key={k}
                  name={k}
                  value={form[k] ?? ""}
                  disabled={k === "key" && editing}
                  data={data}
                  change={(v) => setForm({ ...form, [k]: v })}
                />
              ))}
              <button className="primary" disabled={busy}>
                Save record
              </button>
              {editing && (
                <button
                  type="button"
                  className="outline"
                  onClick={() => {
                    setEditing(false);
                    setForm({ ...definitions[collection] });
                  }}
                >
                  Cancel edit
                </button>
              )}
            </form>
            <div>
              <article>
                <h2>Import a batch</h2><button type="button" className="outline" onClick={()=>downloadCSV([],collection+"-template.csv",Object.keys(definitions[collection]))}>Download CSV template</button>
                <p>
                  CSV headers must match the fields on the left. Imports update
                  matching keys and add new ones. Maximum 500 rows. Sources and
                  programmes must exist first.
                </p>
                <label>
                  Choose CSV
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={(e) =>
                      run(async () => {
                        const file = e.target.files[0];
                        if (!file) return;
                        if (file.size > 1500000)
                          throw Error("Choose a CSV smaller than 1.5 MB");
                        setCsv(
                          JSON.stringify(parseCSV(await file.text()), null, 2),
                        );
                        setPreview(false);
                      })
                    }
                  />
                </label>
                <label>
                  Or paste a JSON array
                  <textarea
                    rows={9}
                    value={csv}
                    onChange={(e) => {
                      setCsv(e.target.value);
                      setPreview(false);
                    }}
                    placeholder="[]"
                  />
                </label>
                <button
                  className="outline"
                  disabled={busy || !csv}
                  onClick={() => run(() => importRows(true))}
                >
                  Validate import
                </button>{" "}
                <button
                  className="primary"
                  disabled={busy || !preview}
                  onClick={() => run(() => importRows(false))}
                >
                  Commit import
                </button>
                <p className="muted">
                  Commit revalidates against the current database. Keep an
                  export before replacing existing keys.
                </p>
              </article>
              <article>
                <h3>Entry order</h3>
                <p>
                  1. Sources → 2. Programmes → 3. Fee records → 4. CPI → 5.
                  Research notes.
                </p>
                <p>
                  Use stable keys such as prospectus-1990. Page/table is
                  mandatory for fees and CPI. Never enter an inflation
                  percentage as an index.
                </p>
              </article>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Record</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data[collection].map((r) => (
                  <tr key={r.key}>
                    <td>{r.key}</td>
                    <td>
                      {r.name || r.title || r.year}{" "}
                      {r.amount != null
                        ? money(r.amount)
                        : r.index != null
                          ? "CPI " + r.index
                          : ""}
                    </td>
                    <td>
                      <button
                        disabled={busy}
                        onClick={() => {
                          setForm({ ...r });
                          setEditing(true);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        Edit
                      </button>{" "}
                      <button
                        className="danger"
                        disabled={busy}
                        onClick={() => {
                          if (
                            window.confirm("Permanently delete " + r.key + "?")
                          )
                            run(async () => {
                              await api(
                                "/admin/" + collection + "/" + r.key,
                                "DELETE",
                              );
                              setStatus("Record deleted.");
                              await reload();
                            });
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
function Field({ name, value, disabled, data, change }) {
  let options;
  if (name === "programmeKey")
    options = data.programmes.map((p) => [p.key, p.name]);
  if (name === "sourceKey") options = data.sources.map((p) => [p.key, p.title]);
  if (name === "unit")
    options = pairs(["semester", "year", "credit", "course", "programme"]);
  if (name === "component") options = pairs(["tuition", "admission", "total"]);
  if (name === "period") options = pairs(["fiscal", "calendar"]);
  if (name === "verificationStatus") options = pairs(["draft", "verified", "published"]);
  if (name === "publicationRights") options = pairs(["restricted", "public"]);
  if (name === "category") options = pairs(["general", "zakat", "waqf", "christian", "hindu"]);
  if(name === "archived") return <label><input type="checkbox" checked={!!value} onChange={e=>change(e.target.checked)}/> Archived programme</label>;
  return (
    <label>
      {name === "sourceKeys" ? "sourceKeys (comma separated)" : name}
      {options ? (
        <select required value={value} onChange={(e) => change(e.target.value)}>
          <option value="">Choose…</option>
          {options.map(([v, t]) => (
            <option key={v} value={v}>
              {t}
            </option>
          ))}
        </select>
      ) : ["notes", "description", "body", "citation"].includes(name) ? (
        <textarea
          required={["body", "citation"].includes(name)}
          rows={3}
          value={value}
          onChange={(e) => change(e.target.value)}
        />
      ) : (
        <input
          disabled={disabled}
          required={!["publicationYear","pages","filePath","department","activeYears","baseYear","publisher","creditHours"].includes(name)}
          type={
            ["year", "amount", "index"].includes(name)
              ? "number"
              : name === "url"
                ? "url"
                : "text"
          }
          step={name === "year" ? "1" : "any"}
          value={Array.isArray(value) ? value.join(", ") : value}
          onChange={(e) => change(e.target.value)}
        />
      )}
    </label>
  );
}

