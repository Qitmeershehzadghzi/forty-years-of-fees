import { adjust } from "../middleware/validation.js";

export const researchYears = Array.from({length: 40}, (_, i) => 1987 + i);
export function coverage(data) {
  const years = [...new Set(data.fees.map(f => f.year))].sort();
  return {records: data.fees.length, programmes: data.programmes.length, sources: data.sources.length,
    years, missingYears: researchYears.filter(y => !years.includes(y)),
    cpiYears: [...new Set(data.cpi.map(c => c.year))].sort(),
    completeness: years.length / 40 * 100};
}
export function feeAnalysis(data, q = {}) {
  const cpi = data.cpi.filter(c => (!q.series || c.series === q.series) && (!q.period || c.period === q.period));
  const referenceYear = Number(q.referenceYear || Math.max(0, ...cpi.map(c => c.year)));
  const rows = data.fees.filter(f =>
    (!q.programme || f.programmeKey === q.programme) && (!q.unit || f.unit === q.unit) &&
    (!q.component || f.component === q.component) && (!q.period || f.period === q.period) &&
    (!q.campus || f.campus === q.campus) && f.year >= Number(q.from || 1987) && f.year <= Number(q.to || 2026)
  ).sort((a,b) => a.year - b.year).map(f => {
    // An explicit series is required: no arbitrary first series or cross-base comparisons.
    const historical = q.series ? cpi.find(c => c.year === f.year && c.period === f.period) : null;
    const reference = q.series ? cpi.find(c => c.year === referenceYear && c.period === f.period) : null;
    return {...f, real: f.yearBasis === "observed" ? null : adjust(f.amount, historical, reference), cpi: historical || null,
      calculation: {formula: "nominal * referenceCPI / historicalCPI", referenceYear,
        historicalCPIKey: historical?.key || null, referenceCPIKey: reference?.key || null,
        unavailableReason: historical && reference ? null : "Select one comparable CPI series with both annual observations"}};
  });
  for (const r of rows) {
    const peers = rows.filter(p => p.year === r.year - 1 && ["programmeKey","campus","unit","component","period","academicTerm"].every(k => p[k] === r[k]));
    const sameYear = rows.filter(p => p.year === r.year && ["programmeKey","campus","unit","component","period","academicTerm"].every(k => p[k] === r[k]));
    const prev = peers.length === 1 && sameYear.length === 1 ? peers[0] : null;
    r.nominalChange = prev?.amount > 0 ? (r.amount / prev.amount - 1) * 100 : null;
    r.realChange = prev?.real > 0 && r.real !== null ? (r.real / prev.real - 1) * 100 : null;
    const group = rows.filter(p => ["programmeKey","campus","unit","component","period","academicTerm"].every(k => p[k] === r[k]));
    const first = group[0];
    const uniqueBaseline = group.filter(p => p.year === first.year).length === 1;
    r.realGrowth = uniqueBaseline && first.real > 0 && r.real !== null ? (r.real / first.real - 1) * 100 : null;
  }
  return {referenceYear, rows, cpi};
}

// Pure overlap operation; never persists or overwrites the original observations.
// Applying this requires researcher-reviewed same-scope overlap evidence.
export function linkSeries(observations, oldOverlap, newOverlap, evidence) {
  if (!evidence?.sourceKey || !evidence?.page || !evidence?.methodology ||
      !oldOverlap || !newOverlap || oldOverlap.year !== newOverlap.year ||
      oldOverlap.period !== newOverlap.period || oldOverlap.index <= 0 || newOverlap.index <= 0)
    throw Error("A documented, compatible overlap and methodology are required");
  const factor = newOverlap.index / oldOverlap.index;
  if (observations.some(o => o.series !== oldOverlap.series || o.period !== oldOverlap.period)) throw Error("Incompatible source series");
  return observations.map(o => ({...o, originalIndex: o.index, linkedIndex: o.index * factor,
    factor, targetSeries: newOverlap.series, evidence, overlapKeys: [oldOverlap.key, newOverlap.key]}));
}
