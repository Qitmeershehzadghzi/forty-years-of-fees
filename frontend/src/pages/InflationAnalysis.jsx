import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Percent,
  Calendar,
  BookOpen,
  Scale,
  ShieldCheck,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading.jsx';
import StatCard from '../components/common/StatCard.jsx';
import RealFeeChart from '../components/charts/RealFeeChart.jsx';
import InflationChart from '../components/charts/InflationChart.jsx';
import Loading from '../components/common/Loading.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import SourceCitation from '../components/common/SourceCitation.jsx';

import { getRealFees, getInflationTrends } from '../services/analyticsService.js';
import { getProgrammes } from '../services/programmeService.js';
import { formatPKR, formatPercent } from '../utils/currencyFormatter.js';

export const InflationAnalysis = () => {
  const [programmes, setProgrammes] = useState([]);
  const [selectedProgrammeId, setSelectedProgrammeId] = useState('');
  const [baseYear, setBaseYear] = useState(2026);
  const [feeType, setFeeType] = useState('Total Annual Fee');
  const [startYear, setStartYear] = useState(1987);
  const [endYear, setEndYear] = useState(2026);

  const [realFeesData, setRealFeesData] = useState(null);
  const [inflationTrends, setInflationTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load programmes
  useEffect(() => {
    async function loadProgs() {
      try {
        const progs = await getProgrammes();
        setProgrammes(progs);
        if (progs.length > 0) setSelectedProgrammeId(progs[0]._id);
      } catch (err) {
        console.error(err);
      }
    }
    loadProgs();
  }, []);

  // Fetch inflation calculations
  const fetchData = async () => {
    if (!selectedProgrammeId) return;
    try {
      setLoading(true);
      setError(null);
      const [rf, inf] = await Promise.all([
        getRealFees({
          programmeId: selectedProgrammeId,
          baseYear,
          feeType,
          startYear,
          endYear,
        }),
        getInflationTrends({
          startYear,
          endYear,
        }),
      ]);
      setRealFeesData(rf);
      setInflationTrends(inf?.trends || []);
    } catch (err) {
      setError(err.message || 'Error computing inflation adjustment');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedProgrammeId, baseYear, feeType, startYear, endYear]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* HEADER */}
      <div>
        <SectionHeading
          badge="Econometric Research"
          title="Inflation & Purchasing Power Deflator Engine"
          subtitle="Decomposing 40 years of nominal fee escalation against Pakistan Bureau of Statistics (PBS) Consumer Price Index (CPI) benchmarks."
        />
      </div>

      {/* FILTER PANEL */}
      <div className="bg-white border border-[#E5E0D6] rounded-xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Programme */}
          <div>
            <label className="block text-xs font-semibold text-[#788391] uppercase font-mono mb-1.5">
              Subject Faculty
            </label>
            <select
              value={selectedProgrammeId}
              onChange={(e) => setSelectedProgrammeId(e.target.value)}
              className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded-lg px-3 py-2 text-xs font-medium text-[#101C2C]"
            >
              {programmes.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.code} — {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Base Year */}
          <div>
            <label className="block text-xs font-semibold text-[#788391] uppercase font-mono mb-1.5">
              Constant Currency Base Year
            </label>
            <select
              value={baseYear}
              onChange={(e) => setBaseYear(Number(e.target.value))}
              className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded-lg px-3 py-2 text-xs font-mono font-bold text-[#101C2C]"
            >
              <option value={2026}>2026 (Current Journey 40 Milestone)</option>
              <option value={2016}>2016 (Official PBS Base Year: 100.0)</option>
              <option value={2000}>2000 (Turn of Millennium)</option>
              <option value={1987}>1987 (Institutional Foundation Year)</option>
            </select>
          </div>

          {/* Fee Type */}
          <div>
            <label className="block text-xs font-semibold text-[#788391] uppercase font-mono mb-1.5">
              Fee Component
            </label>
            <select
              value={feeType}
              onChange={(e) => setFeeType(e.target.value)}
              className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded-lg px-3 py-2 text-xs font-medium text-[#101C2C]"
            >
              <option value="Total Annual Fee">Total Annual Fee</option>
              <option value="Tuition Fee">Tuition Fee</option>
              <option value="Admission Fee">Admission Fee</option>
              <option value="Examination Fee">Examination Fee</option>
            </select>
          </div>

          {/* Start Year */}
          <div>
            <label className="block text-xs font-semibold text-[#788391] uppercase font-mono mb-1.5">
              Start Year
            </label>
            <input
              type="number"
              min="1987"
              max="2026"
              value={startYear}
              onChange={(e) => setStartYear(Number(e.target.value))}
              className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded-lg px-3 py-2 text-xs font-mono text-[#101C2C]"
            />
          </div>

          {/* End Year */}
          <div>
            <label className="block text-xs font-semibold text-[#788391] uppercase font-mono mb-1.5">
              End Year
            </label>
            <input
              type="number"
              min="1987"
              max="2026"
              value={endYear}
              onChange={(e) => setEndYear(Number(e.target.value))}
              className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded-lg px-3 py-2 text-xs font-mono text-[#101C2C]"
            />
          </div>

        </div>
      </div>

      {/* METRICS SUMMARY CARDS */}
      {realFeesData?.metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Nominal Growth"
            value={`+${realFeesData.metrics.nominalGrowth}%`}
            subtext="Raw PKR Percentage Increase"
            icon={TrendingUp}
          />
          <StatCard
            title="Nominal CAGR"
            value={`${realFeesData.metrics.nominalCAGR}% / yr`}
            subtext="Annual Compounded Rate"
            icon={Percent}
          />
          <StatCard
            title="Real Purchasing Growth"
            value={`+${realFeesData.metrics.realGrowth}%`}
            subtext={`Adjusted to ${baseYear} Constant Currency`}
            icon={Scale}
            badge="Real Growth"
            badgeType="verified"
          />
          <StatCard
            title="Real CAGR"
            value={`${realFeesData.metrics.realCAGR}% / yr`}
            subtext="True Economic Expansion Rate"
            icon={Percent}
            badge="Real CAGR"
            badgeType="verified"
          />
        </div>
      )}

      {/* CHART 1: REAL VS NOMINAL FEE */}
      <div className="bg-white border border-[#E5E0D6] rounded-xl p-6 shadow-sm">
        {loading ? (
          <div className="py-20">
            <Loading text="Computing purchasing power deflators across 40 years..." />
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={fetchData} />
        ) : realFeesData?.series ? (
          <div>
            <RealFeeChart
              data={realFeesData.series}
              programmeName={realFeesData.programme?.name}
              baseYear={baseYear}
              height={440}
            />
            <SourceCitation
              sourceTitle="Pakistan Bureau of Statistics (PBS) 2015-16 CPI Series Deflator"
              year={baseYear}
              isSimulated={true}
            />
          </div>
        ) : null}
      </div>

      {/* CHART 2: CPI & INFLATION TREND */}
      <div className="bg-white border border-[#E5E0D6] rounded-xl p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="font-serif font-bold text-lg text-[#101C2C]">
            National Inflation Index (1987–2026)
          </h3>
          <p className="text-xs text-[#788391]">
            Annual consumer price index value alongside annual percentage inflation volatility in Pakistan.
          </p>
        </div>
        {inflationTrends ? (
          <InflationChart data={inflationTrends} height={380} />
        ) : (
          <Loading text="Loading CPI inflation trajectory..." />
        )}
      </div>

      {/* METHODOLOGY CALLOUT */}
      <div className="bg-[#101C2C] text-[#F5F1E8] rounded-xl p-6 border border-[#1A2B40] text-xs leading-relaxed space-y-2">
        <div className="flex items-center gap-2 text-[#D6AD60] font-mono font-bold text-sm">
          <HelpCircle className="w-4 h-4" />
          <span>Understanding Nominal vs Real (Constant Currency) Fees</span>
        </div>
        <p>
          <strong>Nominal Fee:</strong> The exact rupee amount stated on the university fee receipt in that given calendar year.
          Because Pakistan experienced high inflation between 1987 and 2026, comparing Rs. 5,000 in 1987 directly to Rs. 250,000 in 2026
          distorts the true economic sacrifice made by families.
        </p>
        <p>
          <strong>Real Fee:</strong> The purchasing-power equivalent converted into base year ({baseYear}) currency using the formula:
          <span className="font-mono text-[#D6AD60] block my-1">
            Real Fee = Historical Fee × (Base Year CPI / Historical Year CPI)
          </span>
          This demonstrates what the 1987 tuition fee represented in today's money.
        </p>
      </div>

    </div>
  );
};

export default InflationAnalysis;
