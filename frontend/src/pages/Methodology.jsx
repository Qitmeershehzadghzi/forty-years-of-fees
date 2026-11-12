import React,{useState} from "react";
import {money} from "../utils/format";
export default function Methodology() {
  const [values,setValues] = useState({amount:"",historical:"",reference:""});
  const calculated = Object.values(values).every(v=>Number(v)>0) ? Number(values.amount)*Number(values.reference)/Number(values.historical) : null;
  return (
    <article>
      <h2>Compare like with like.</h2><h3>Example calculator ? educational inputs only</h3><p>Enter hypothetical values to understand the formula. These inputs are never stored as research data.</p><div className="filters">{Object.keys(values).map(k=><label key={k}>{({amount:"Nominal fee (PKR)",historical:"Historical year CPI",reference:"Reference year CPI"})[k]}<input type="number" min="0.001" step="any" value={values[k]} onChange={e=>setValues({...values,[k]:e.target.value})}/></label>)}</div><p role="status">Adjusted amount: {money(calculated)}</p>
      <p>
        Real fee in reference-year PKR = published fee × CPI(reference year) ÷
        CPI(fee year). The reference year is a purchasing-power choice, separate
        from the index’s published base year.
      </p>
      <h3>One comparable series</h3>
      <p>
        Select the same programme, campus, fee unit and component. Keep tuition
        separate from admission charges and full totals. Per-credit fees cannot
        be compared with semester totals unless a documented course load
        supports a separately sourced conversion.
      </p>
      <h3>Years, coverage and rebasing</h3>
      <p>
        CPI is an index level, not an inflation percentage. Use annual averages
        on one consistent calendar or fiscal basis. Fiscal year 2020 means
        2019–20. The year attached to a fee must follow the selected research
        convention. The application cannot infer a university session’s timing.
      </p>
      <p>
        Assign a distinct series label to each incompatible CPI base or
        geography. Do not label disconnected PBS bases as one series. To span
        rebasing, obtain an officially linked series or document an overlap-link
        calculation in each source and CPI note. This application never links
        series automatically. Matching series and period are mandatory for
        adjustment.
      </p>
      <p>
        Missing CPI leaves adjusted values unavailable. Missing fee years are
        not filled. Every plotted point traces to its fee source; the table also
        exposes its CPI source. Reference-year CPI evidence appears below the
        chart and in the exported fact sheet.
      </p>
      <h3>Evidence and limitations</h3>
      <p>
        Record source title, publication details, stable URL, exact page or
        table, programme, campus and fee scope. Recheck transcriptions against
        the original. An adjusted fee measures purchasing power under the chosen
        CPI, not household affordability, education quality or scholarship
        access.
      </p>
      <a
        href="https://www.pbs.gov.pk/price-statistics/"
        target="_blank"
        rel="noreferrer"
      >
        Pakistan Bureau of Statistics · price statistics ↗
      </a>
      <p>
        The download is a JSON fact sheet containing records and source
        references. Use the browser’s Print command for a printable page.
      </p>
    </article>
  );
}
