import React, { useEffect, useState } from 'react';
import { Check, Layers } from 'lucide-react';
import ProgrammeComparisonChart from '../components/charts/ProgrammeComparisonChart.jsx';
import Loading from '../components/common/Loading.jsx';
import ErrorState from '../components/common/ErrorState.jsx';

import { getProgrammeComparison } from '../services/analyticsService.js';
import { getProgrammes } from '../services/programmeService.js';
import { formatPKR } from '../utils/currencyFormatter.js';
import { getProgrammeColor } from '../utils/chartHelpers.js';

const START_YEAR = 1987;
const END_YEAR = 2027;
const MAX_SELECTED = 5;

const selectClass = 'rounded-lg border border-[#E2E7E2] bg-white px-3 py-2 text-sm text-[#12231F] focus:outline-none focus:border-[#0F5C4E]';

export const ProgrammeComparison = () => {
  const [allProgrammes, setAllProgrammes] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [mode, setMode] = useState('nominal');
  const [feeType, setFeeType] = useState('Total Annual Fee');
  const [baseYear, setBaseYear] = useState(END_YEAR);

  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        const progs = await getProgrammes();
        setAllProgrammes(progs);
        setSelectedIds(progs.slice(0, 3).map(p => p._id));
      } catch (err) {
        console.error('Failed to load programmes:', err);
      }
    }
    init();
  }, []);

  const fetchComparison = async () => {
    if (selectedIds.length === 0) return;
    try {
      setLoading(true);
      setError(null);
      const res = await getProgrammeComparison({
        programmeIds: selectedIds.join(','),
        feeType,
        baseYear,
        startYear: START_YEAR,
        endYear: END_YEAR,
      });
      setComparisonData(res);
    } catch (err) {
      setError(err.message || 'Could not compare these programmes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedIds.length > 0) fetchComparison();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds, feeType, baseYear]);

  const toggleProgramme = (id) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length <= 1) return;
      setSelectedIds(selectedIds.filter(item => item !== id));
      return;
    }
    if (selectedIds.length >= MAX_SELECTED) return;
    setSelectedIds([...selectedIds, id]);
  };

  const firstYear = comparisonData?.programmes?.[0]?.firstYear ?? START_YEAR;
  const lastYear = comparisonData?.programmes?.[0]?.lastYear ?? END_YEAR;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">

      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#0F5C4E]">
          Programme comparison
        </span>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-[#12231F]">
          How fees moved, programme by programme
        </h1>
        <p className="mt-3 max-w-2xl text-sm sm:text-base text-[#5C6B66] leading-relaxed">
          Pick up to five programmes and compare their fees across 1987–2027, in nominal rupees
          or in real, inflation-adjusted rupees.
        </p>
      </div>

      {/* Programme picker */}
      <div className="rounded-xl border border-[#E2E7E2] bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h2 className="text-sm font-semibold text-[#12231F] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#0F5C4E]" />
            Choose programmes
          </h2>
          <span className="text-xs text-[#5C6B66]">{selectedIds.length} of {MAX_SELECTED} selected</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {allProgrammes.map((p, idx) => {
            const selected = selectedIds.includes(p._id);
            return (
              <button
                key={p._id}
                type="button"
                onClick={() => toggleProgramme(p._id)}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  selected
                    ? 'border-[#0F5C4E] bg-[#EDF5F2] text-[#0F5C4E]'
                    : 'border-[#E2E7E2] bg-white text-[#5C6B66] hover:bg-[#F6F7F4]'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: selected ? getProgrammeColor(p.code, idx) : '#CBD5CE' }}
                />
                <span>{p.code}</span>
                {selected && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E2E7E2] bg-white p-4">
        <div className="inline-flex rounded-lg border border-[#E2E7E2] p-0.5 bg-[#F6F7F4]">
          <button
            onClick={() => setMode('nominal')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              mode === 'nominal' ? 'bg-white text-[#12231F] shadow-sm' : 'text-[#5C6B66]'
            }`}
          >
            Nominal rupees
          </button>
          <button
            onClick={() => setMode('real')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              mode === 'real' ? 'bg-white text-[#12231F] shadow-sm' : 'text-[#5C6B66]'
            }`}
          >
            Real rupees ({baseYear})
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-[#5C6B66]">
          <label className="flex items-center gap-2">
            Fee item
            <select value={feeType} onChange={e => setFeeType(e.target.value)} className={selectClass}>
              <option value="Total Annual Fee">Total annual fee</option>
              <option value="Tuition Fee">Tuition fee</option>
              <option value="Admission Fee">Admission fee</option>
              <option value="Examination Fee">Examination fee</option>
            </select>
          </label>
          <label className="flex items-center gap-2">
            Base year
            <select value={baseYear} onChange={e => setBaseYear(Number(e.target.value))} className={selectClass}>
              <option value={2027}>2027 (current)</option>
              <option value={2016}>2016 (PBS base)</option>
              <option value={2000}>2000</option>
              <option value={1987}>1987</option>
            </select>
          </label>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-[#E2E7E2] bg-white p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h2 className="text-lg font-semibold text-[#12231F]">
            {mode === 'real' ? `Real fees in ${baseYear} rupees` : 'Nominal fees'}
          </h2>
          <span className="text-xs text-[#5C6B66]">{firstYear} – {lastYear}</span>
        </div>

        {loading ? (
          <div className="py-20"><Loading text="Building comparison..." /></div>
        ) : error ? (
          <ErrorState message={error} onRetry={fetchComparison} />
        ) : comparisonData?.series ? (
          <ProgrammeComparisonChart
            data={comparisonData.series}
            programmes={comparisonData.programmes || []}
            mode={mode}
            baseYear={baseYear}
            height={420}
          />
        ) : null}
      </div>

      {/* Summary table */}
      {comparisonData?.programmes && (
        <div className="overflow-hidden rounded-xl border border-[#E2E7E2] bg-white">
          <div className="border-b border-[#E2E7E2] px-4 py-3.5 sm:px-5">
            <h2 className="text-sm font-semibold text-[#12231F]">Summary</h2>
            <p className="mt-0.5 text-xs text-[#5C6B66]">
              Growth from the first to the last recorded year. Real figures use a {baseYear} rupee base.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-xs">
              <thead className="bg-[#F6F7F4] uppercase tracking-wide text-[#5C6B66]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Programme</th>
                  <th className="px-4 py-3 font-semibold">{firstYear} fee</th>
                  <th className="px-4 py-3 font-semibold">{lastYear} fee</th>
                  <th className="px-4 py-3 font-semibold">Nominal growth</th>
                  <th className="px-4 py-3 font-semibold">Nominal CAGR</th>
                  <th className="px-4 py-3 font-semibold">Real CAGR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF1EE]">
                {comparisonData.programmes.map(p => (
                  <tr key={p.id} className="hover:bg-[#FAFBFA]">
                    <td className="px-4 py-3.5">
                      <span className="mr-2 inline-flex rounded bg-[#EDF5F2] px-1.5 py-0.5 text-[11px] font-semibold text-[#0F5C4E]">
                        {p.code}
                      </span>
                      <span className="font-medium text-[#12231F]">{p.name}</span>
                    </td>
                    <td className="px-4 py-3.5 tabular-nums text-[#5C6B66]">{formatPKR(p.firstFee)}</td>
                    <td className="px-4 py-3.5 font-semibold tabular-nums text-[#12231F]">{formatPKR(p.lastFee)}</td>
                    <td className="px-4 py-3.5 tabular-nums text-[#B42318]">+{p.nominalGrowth}%</td>
                    <td className="px-4 py-3.5 tabular-nums text-[#12231F]">{p.nominalCAGR}% / yr</td>
                    <td className="px-4 py-3.5 tabular-nums font-semibold text-[#0F5C4E]">{p.realCAGR}% / yr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-xs text-[#5C6B66] leading-relaxed">
        Real growth is what is left after inflation. A programme can rise sharply in rupees and
        still grow slowly once the CPI is taken into account.
      </p>

    </div>
  );
};

export default ProgrammeComparison;
