import React, { useEffect, useState } from 'react';
import {
  Layers,
  ArrowRight,
  TrendingUp,
  Percent,
  CheckSquare,
  Square,
  Sparkles
} from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading.jsx';
import Button from '../components/common/Button.jsx';
import ProgrammeComparisonChart from '../components/charts/ProgrammeComparisonChart.jsx';
import Loading from '../components/common/Loading.jsx';
import ErrorState from '../components/common/ErrorState.jsx';

import { getProgrammeComparison } from '../services/analyticsService.js';
import { getProgrammes } from '../services/programmeService.js';
import { formatPKR, formatPercent } from '../utils/currencyFormatter.js';
import { getProgrammeColor } from '../utils/chartHelpers.js';

export const ProgrammeComparison = () => {
  const [allProgrammes, setAllProgrammes] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [chartMode, setChartMode] = useState('nominal'); // 'nominal' or 'real'
  const [feeType, setFeeType] = useState('Total Annual Fee');
  const [baseYear, setBaseYear] = useState(2026);
  const [startYear, setStartYear] = useState(1987);
  const [endYear, setEndYear] = useState(2026);

  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load available programmes
  useEffect(() => {
    async function init() {
      try {
        const progs = await getProgrammes();
        setAllProgrammes(progs);
        // Default select first 3 programmes: BBA, BSCS, BSSE
        const defaultSelected = progs.slice(0, 3).map(p => p._id);
        setSelectedIds(defaultSelected);
      } catch (err) {
        console.error('Failed to load programmes:', err);
      }
    }
    init();
  }, []);

  // Fetch comparison data when selections change
  const fetchComparison = async () => {
    if (selectedIds.length === 0) return;
    try {
      setLoading(true);
      setError(null);
      const res = await getProgrammeComparison({
        programmeIds: selectedIds.join(','),
        feeType,
        baseYear,
        startYear,
        endYear,
      });
      setComparisonData(res);
    } catch (err) {
      setError(err.message || 'Failed to compare programmes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedIds.length > 0) {
      fetchComparison();
    }
  }, [selectedIds, chartMode, feeType, baseYear, startYear, endYear]);

  const toggleProgramme = (id) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length <= 1) return; // Keep at least one selected
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      if (selectedIds.length >= 5) {
        alert('You can compare a maximum of 5 programmes simultaneously.');
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* HEADER */}
      <div>
        <SectionHeading
          badge="Multivariate Analysis"
          title="Cross-Programme Fee Comparison"
          subtitle="Compare multi-decade fee growth, purchasing-power divergence, and CAGR trajectories between 2 and 5 academic faculties."
        />
      </div>

      {/* PROGRAMME SELECTOR CHECKBOXES */}
      <div className="bg-white border border-[#E5E0D6] rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#788391] uppercase font-mono">
            Select Programmes to Compare ({selectedIds.length} of 5 Selected)
          </span>
          <span className="text-xs text-[#D6AD60] font-mono">
            Click to toggle series
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {allProgrammes.map((p, idx) => {
            const isSelected = selectedIds.includes(p._id);
            const color = getProgrammeColor(p.code, idx);
            return (
              <button
                key={p._id}
                onClick={() => toggleProgramme(p._id)}
                className={`px-3 py-2 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-2 border cursor-pointer ${
                  isSelected
                    ? 'bg-[#101C2C] text-white border-[#101C2C] shadow-sm'
                    : 'bg-[#F5F1E8] text-[#788391] border-[#E5E0D6] hover:bg-white'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: isSelected ? color : '#788391' }}
                ></span>
                <span>{p.code} — {p.name}</span>
                {isSelected ? (
                  <CheckSquare className="w-3.5 h-3.5 text-[#D6AD60]" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-[#788391]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* DISPLAY CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-[#E5E0D6] rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-semibold text-[#788391] uppercase">Chart Valuation Mode:</span>
          <div className="inline-flex rounded-lg border border-[#E5E0D6] p-1 bg-[#F5F1E8]">
            <button
              onClick={() => setChartMode('nominal')}
              className={`px-3 py-1 rounded text-xs font-mono font-semibold transition-colors cursor-pointer ${
                chartMode === 'nominal' ? 'bg-[#101C2C] text-white shadow-sm' : 'text-[#788391] hover:text-[#101C2C]'
              }`}
            >
              Nominal PKR (Actual Paid)
            </button>
            <button
              onClick={() => setChartMode('real')}
              className={`px-3 py-1 rounded text-xs font-mono font-semibold transition-colors cursor-pointer ${
                chartMode === 'real' ? 'bg-[#D6AD60] text-[#101C2C] shadow-sm font-bold' : 'text-[#788391] hover:text-[#101C2C]'
              }`}
            >
              Real Purchasing Power ({baseYear} PKR)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[#788391]">Base Year:</span>
            <select
              value={baseYear}
              onChange={(e) => setBaseYear(Number(e.target.value))}
              className="bg-[#F5F1E8] border border-[#E5E0D6] rounded px-2 py-1 font-bold text-[#101C2C]"
            >
              <option value={2026}>2026 (Current)</option>
              <option value={2016}>2016 (PBS Base)</option>
              <option value={2000}>2000</option>
              <option value={1987}>1987 (Inception)</option>
            </select>
          </div>
        </div>
      </div>

      {/* COMPARISON CHART */}
      <div className="bg-white border border-[#E5E0D6] rounded-xl p-6 shadow-sm">
        {loading ? (
          <div className="py-24">
            <Loading text="Computing multi-programme growth series..." />
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={fetchComparison} />
        ) : comparisonData?.series ? (
          <div>
            <div className="mb-4 flex items-center justify-between border-b border-[#E5E0D6] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#101C2C]">
                40-Year Fee Trajectory ({chartMode === 'real' ? `Inflation-Adjusted Real ${baseYear} PKR` : 'Historical Nominal PKR'})
              </h3>
              <span className="text-xs font-mono text-[#D6AD60]">
                1987 — 2026 Continuous Coverage
              </span>
            </div>
            <ProgrammeComparisonChart
              data={comparisonData.series}
              programmes={comparisonData.programmes || []}
              mode={chartMode}
              height={440}
            />
          </div>
        ) : null}
      </div>

      {/* SUMMARY COMPARISON TABLE */}
      {comparisonData?.programmes && (
        <div className="bg-white border border-[#E5E0D6] rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 bg-[#101C2C] text-[#F5F1E8] flex items-center justify-between">
            <h4 className="font-serif font-bold text-sm">
              Comparative Economic Performance Summary
            </h4>
            <span className="text-xs font-mono text-[#D6AD60]">
              Base Year: {baseYear}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F5F1E8] font-mono text-[11px] text-[#788391] uppercase border-b border-[#E5E0D6]">
                  <th className="py-3 px-4">Programme</th>
                  <th className="py-3 px-4">1987 Nominal</th>
                  <th className="py-3 px-4">2026 Nominal</th>
                  <th className="py-3 px-4">Nominal Growth (%)</th>
                  <th className="py-3 px-4">Nominal CAGR</th>
                  <th className="py-3 px-4">1987 Real ({baseYear})</th>
                  <th className="py-3 px-4">2026 Real ({baseYear})</th>
                  <th className="py-3 px-4">Real CAGR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D6] font-mono">
                {comparisonData.programmes.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F5F1E8]/50">
                    <td className="py-3.5 px-4 font-bold text-[#101C2C]">
                      <span className="text-[#D6AD60] mr-1.5">{p.code}</span>
                      <span className="font-sans font-medium text-[#101C2C]">{p.name}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#101C2C]">
                      {formatPKR(p.firstFee)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#101C2C]">
                      {formatPKR(p.lastFee)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#C75A5A]">
                      +{p.nominalGrowth}%
                    </td>
                    <td className="py-3.5 px-4 text-[#101C2C] font-semibold">
                      {p.nominalCAGR}% / yr
                    </td>
                    <td className="py-3.5 px-4 text-[#788391]">
                      {formatPKR(p.firstReal)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#D6AD60]">
                      {formatPKR(p.lastReal)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#23865B]">
                      {p.realCAGR}% / yr
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProgrammeComparison;
