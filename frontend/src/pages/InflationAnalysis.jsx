import React, { useEffect, useState } from 'react';
import { TrendingUp, Percent, Scale, Calendar } from 'lucide-react';
import StatCard from '../components/common/StatCard.jsx';
import RealFeeChart from '../components/charts/RealFeeChart.jsx';
import InflationChart from '../components/charts/InflationChart.jsx';
import Loading from '../components/common/Loading.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import SourceCitation from '../components/common/SourceCitation.jsx';

import { getRealFees, getInflationTrends } from '../services/analyticsService.js';
import { getProgrammes } from '../services/programmeService.js';

const START_YEAR = 1987;
const END_YEAR = 2027;

const selectClass = 'w-full rounded-lg border border-[#E2E7E2] bg-white px-3 py-2.5 text-sm text-[#12231F] focus:outline-none focus:border-[#0F5C4E] focus:ring-2 focus:ring-[#0F5C4E]/20';

const BASE_YEARS = [
  { year: 2027, label: '2027', note: 'Current rupees' },
  { year: 2016, label: '2016', note: 'PBS base (100)' },
  { year: 2000, label: '2000', note: 'Millennium year' },
  { year: 1987, label: '1987', note: 'Start of series' },
];

export const InflationAnalysis = () => {
  const [programmes, setProgrammes] = useState([]);
  const [selectedProgrammeId, setSelectedProgrammeId] = useState('');
  const [baseYear, setBaseYear] = useState(END_YEAR);
  const [feeType, setFeeType] = useState('Total Annual Fee');
  const [startYear, setStartYear] = useState(START_YEAR);
  const [endYear, setEndYear] = useState(END_YEAR);

  const [realFeesData, setRealFeesData] = useState(null);
  const [inflationTrends, setInflationTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const fetchData = async () => {
    if (!selectedProgrammeId) return;
    try {
      setLoading(true);
      setError(null);
      const [rf, inf] = await Promise.all([
        getRealFees({ programmeId: selectedProgrammeId, baseYear, feeType, startYear, endYear }),
        getInflationTrends({ startYear, endYear }),
      ]);
      setRealFeesData(rf);
      setInflationTrends(inf?.trends || []);
    } catch (err) {
      setError(err.message || 'Could not calculate the inflation adjustment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProgrammeId, baseYear, feeType, startYear, endYear]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">

      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#0F5C4E]">
          Inflation deflator
        </span>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-[#12231F]">
          What did the fee really cost?
        </h1>
        <p className="mt-3 max-w-2xl text-sm sm:text-base text-[#5C6B66] leading-relaxed">
          A fee of Rs. 5,000 in 1987 and Rs. 300,000 in 2027 are not directly comparable.
          This page converts every year into one base year so the comparison is fair.
        </p>
      </div>

      {/* Controls */}
      <div className="rounded-xl border border-[#E2E7E2] bg-white p-4 sm:p-5 space-y-4">

        <div>
          <span className="block text-xs font-medium text-[#5C6B66] mb-2">Compare everything in</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {BASE_YEARS.map(tab => (
              <button
                key={tab.year}
                type="button"
                onClick={() => setBaseYear(tab.year)}
                className={`rounded-lg border px-3 py-2.5 text-left transition-colors ${
                  baseYear === tab.year
                    ? 'border-[#0F5C4E] bg-[#EDF5F2]'
                    : 'border-[#E2E7E2] bg-white hover:bg-[#F6F7F4]'
                }`}
              >
                <span className={`block text-sm font-semibold ${baseYear === tab.year ? 'text-[#0F5C4E]' : 'text-[#12231F]'}`}>
                  {tab.label}
                </span>
                <span className="block text-[11px] text-[#5C6B66] mt-0.5">{tab.note}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-[#E2E7E2]">
          <label className="block">
            <span className="block text-xs font-medium text-[#5C6B66] mb-1">Programme</span>
            <select
              value={selectedProgrammeId}
              onChange={e => setSelectedProgrammeId(e.target.value)}
              className={selectClass}
            >
              {programmes.map(p => (
                <option key={p._id} value={p._id}>{p.code} — {p.name}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-xs font-medium text-[#5C6B66] mb-1">Fee item</span>
            <select value={feeType} onChange={e => setFeeType(e.target.value)} className={selectClass}>
              <option value="Total Annual Fee">Total annual fee</option>
              <option value="Tuition Fee">Tuition fee</option>
              <option value="Admission Fee">Admission fee</option>
              <option value="Examination Fee">Examination fee</option>
            </select>
          </label>

          <label className="block">
            <span className="block text-xs font-medium text-[#5C6B66] mb-1">Start year</span>
            <input
              type="number"
              min={START_YEAR}
              max={END_YEAR}
              value={startYear}
              onChange={e => setStartYear(Number(e.target.value))}
              className={selectClass}
            />
          </label>

          <label className="block">
            <span className="block text-xs font-medium text-[#5C6B66] mb-1">End year</span>
            <input
              type="number"
              min={START_YEAR}
              max={END_YEAR}
              value={endYear}
              onChange={e => setEndYear(Number(e.target.value))}
              className={selectClass}
            />
          </label>
        </div>
      </div>

      {/* Metrics */}
      {realFeesData?.metrics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Nominal growth"
            value={`+${realFeesData.metrics.nominalGrowth}%`}
            subtext="Raw rupee increase"
            icon={TrendingUp}
          />
          <StatCard
            title="Nominal CAGR"
            value={`${realFeesData.metrics.nominalCAGR}%`}
            subtext="Per year"
            icon={Percent}
          />
          <StatCard
            title="Real growth"
            value={`+${realFeesData.metrics.realGrowth}%`}
            subtext={`In ${baseYear} rupees`}
            icon={Scale}
          />
          <StatCard
            title="Real CAGR"
            value={`${realFeesData.metrics.realCAGR}%`}
            subtext="After inflation"
            icon={Calendar}
          />
        </div>
      )}

      {/* Chart 1 */}
      <div className="rounded-xl border border-[#E2E7E2] bg-white p-4 sm:p-6">
        {loading ? (
          <div className="py-20"><Loading text="Adjusting fees for inflation..." /></div>
        ) : error ? (
          <ErrorState message={error} onRetry={fetchData} />
        ) : realFeesData?.series ? (
          <>
            <RealFeeChart
              data={realFeesData.series}
              programmeName={realFeesData.programme?.name}
              baseYear={baseYear}
              height={400}
            />
            <SourceCitation
              sourceTitle="Pakistan Bureau of Statistics CPI series (illustrative)"
              year={baseYear}
              isSimulated
            />
          </>
        ) : null}
      </div>

      {/* Chart 2 */}
      <div className="rounded-xl border border-[#E2E7E2] bg-white p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-[#12231F]">The inflation behind the adjustment</h2>
        <p className="text-sm text-[#5C6B66] mt-0.5 mb-2">
          The green line is the price index. The bars are the yearly change.
        </p>
        <InflationChart data={inflationTrends} height={340} title={null} />
      </div>

      {/* Plain explanation */}
      <div className="rounded-xl border border-[#E2E7E2] bg-white p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-[#12231F] mb-3">Three terms, in plain words</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <dt className="font-semibold text-[#12231F]">Nominal fee</dt>
            <dd className="mt-1 text-[#5C6B66] leading-relaxed">The number printed on the fee slip in that year.</dd>
          </div>
          <div>
            <dt className="font-semibold text-[#12231F]">CPI</dt>
            <dd className="mt-1 text-[#5C6B66] leading-relaxed">The price index used to measure how much a rupee buys.</dd>
          </div>
          <div>
            <dt className="font-semibold text-[#12231F]">Real fee</dt>
            <dd className="mt-1 text-[#5C6B66] leading-relaxed">The fee converted into one base year's rupees, so years can be compared fairly.</dd>
          </div>
        </dl>
      </div>

    </div>
  );
};

export default InflationAnalysis;
