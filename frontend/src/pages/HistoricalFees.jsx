import React, { useEffect, useState } from 'react';
import {
  Download,
  Filter,
  Search,
  BookOpen,
  Calendar,
  Layers,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading.jsx';
import Button from '../components/common/Button.jsx';
import DataBadge from '../components/common/DataBadge.jsx';
import Loading from '../components/common/Loading.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';

import { getFees, exportFeesCSV } from '../services/feeService.js';
import { getProgrammes } from '../services/programmeService.js';
import { formatPKR } from '../utils/currencyFormatter.js';

export const HistoricalFees = () => {
  const [programmes, setProgrammes] = useState([]);
  const [selectedProgramme, setSelectedProgramme] = useState('');
  const [feeType, setFeeType] = useState('Total Annual Fee');
  const [dataType, setDataType] = useState('');
  const [startYear, setStartYear] = useState(1987);
  const [endYear, setEndYear] = useState(2026);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [feeRecords, setFeeRecords] = useState([]);
  const [paginationMeta, setPaginationMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load programmes on mount
  useEffect(() => {
    async function fetchProgrammes() {
      try {
        const progs = await getProgrammes();
        setProgrammes(progs);
      } catch (err) {
        console.error('Failed to load programmes:', err);
      }
    }
    fetchProgrammes();
  }, []);

  // Fetch fees when filters change
  const fetchFees = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        limit: 20,
        startYear,
        endYear,
      };
      if (selectedProgramme) params.programmeId = selectedProgramme;
      if (feeType) params.feeType = feeType;
      if (dataType) params.dataType = dataType;

      const res = await getFees(params);
      setFeeRecords(res.data || []);
      setPaginationMeta(res.meta || null);
    } catch (err) {
      setError(err.message || 'Error loading fee records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, [selectedProgramme, feeType, dataType, startYear, endYear, page]);

  const handleExportCSV = () => {
    exportFeesCSV({
      programmeId: selectedProgramme,
      feeType,
      dataType,
      startYear,
      endYear,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* HEADER & CITATION NOTICE */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E5E0D6]">
        <div>
          <SectionHeading
            badge="Historical Archive (1987–2026)"
            title="University Fee Schedule Archive"
            subtitle="Searchable year-by-year fee records across four decades for Greenwich University academic programmes."
            className="mb-0"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            icon={Download}
            onClick={handleExportCSV}
          >
            Export Historical CSV
          </Button>
        </div>
      </div>

      {/* DISCLOSURE BANNER */}
      <div className="bg-[#D6AD60]/10 border border-[#D6AD60]/30 rounded-xl p-4 flex items-start gap-3 text-xs text-[#966b1a]">
        <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-bold uppercase tracking-wider font-mono">
            Research Dataset Classification
          </strong>
          <p className="text-[#101C2C]/80 leading-relaxed">
            All records tagged <span className="font-mono font-semibold">SIMULATED</span> represent econometric model estimates
            benchmarked to starting 1987 tuition figures. Verified archival records are indicated with green badges.
          </p>
        </div>
      </div>

      {/* FILTER CONTROLS PANEL */}
      <div className="bg-white border border-[#E5E0D6] rounded-xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Programme Filter */}
          <div>
            <label className="block text-xs font-semibold text-[#788391] uppercase font-mono mb-1.5">
              Programme
            </label>
            <select
              value={selectedProgramme}
              onChange={(e) => { setSelectedProgramme(e.target.value); setPage(1); }}
              className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded-lg px-3 py-2 text-xs font-medium text-[#101C2C] focus:ring-2 focus:ring-[#D6AD60]"
            >
              <option value="">All 10 Programmes</option>
              {programmes.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.code} — {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Fee Type Filter */}
          <div>
            <label className="block text-xs font-semibold text-[#788391] uppercase font-mono mb-1.5">
              Fee Category
            </label>
            <select
              value={feeType}
              onChange={(e) => { setFeeType(e.target.value); setPage(1); }}
              className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded-lg px-3 py-2 text-xs font-medium text-[#101C2C] focus:ring-2 focus:ring-[#D6AD60]"
            >
              <option value="">All Categories</option>
              <option value="Total Annual Fee">Total Annual Fee</option>
              <option value="Tuition Fee">Tuition Fee</option>
              <option value="Admission Fee">Admission Fee</option>
              <option value="Examination Fee">Examination Fee</option>
              <option value="Registration Fee">Registration Fee</option>
              <option value="Other Charges">Other Charges</option>
            </select>
          </div>

          {/* Data Type Filter */}
          <div>
            <label className="block text-xs font-semibold text-[#788391] uppercase font-mono mb-1.5">
              Verification Status
            </label>
            <select
              value={dataType}
              onChange={(e) => { setDataType(e.target.value); setPage(1); }}
              className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded-lg px-3 py-2 text-xs font-medium text-[#101C2C] focus:ring-2 focus:ring-[#D6AD60]"
            >
              <option value="">All Records (Simulated & Verified)</option>
              <option value="SIMULATED">Simulated Only</option>
              <option value="VERIFIED">Verified Only</option>
            </select>
          </div>

          {/* Start Year */}
          <div>
            <label className="block text-xs font-semibold text-[#788391] uppercase font-mono mb-1.5">
              From Year
            </label>
            <input
              type="number"
              min="1987"
              max="2026"
              value={startYear}
              onChange={(e) => { setStartYear(Number(e.target.value)); setPage(1); }}
              className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded-lg px-3 py-2 text-xs font-mono font-medium text-[#101C2C]"
            />
          </div>

          {/* End Year */}
          <div>
            <label className="block text-xs font-semibold text-[#788391] uppercase font-mono mb-1.5">
              To Year
            </label>
            <input
              type="number"
              min="1987"
              max="2026"
              value={endYear}
              onChange={(e) => { setEndYear(Number(e.target.value)); setPage(1); }}
              className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded-lg px-3 py-2 text-xs font-mono font-medium text-[#101C2C]"
            />
          </div>

        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white border border-[#E5E0D6] rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20">
            <Loading text="Querying historical fee database..." />
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={fetchFees} />
        ) : feeRecords.length === 0 ? (
          <EmptyState
            title="No matching historical records"
            description="Try expanding the year range or selecting a different fee component filter."
            actionText="Reset Filters"
            onAction={() => {
              setSelectedProgramme('');
              setFeeType('Total Annual Fee');
              setDataType('');
              setStartYear(1987);
              setEndYear(2026);
              setPage(1);
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#101C2C] text-[#F5F1E8] font-mono uppercase tracking-wider text-[11px] border-b border-[#1A2B40]">
                  <th className="py-3.5 px-4 font-semibold">Academic Year</th>
                  <th className="py-3.5 px-4 font-semibold">Programme</th>
                  <th className="py-3.5 px-4 font-semibold">Degree</th>
                  <th className="py-3.5 px-4 font-semibold">Fee Category</th>
                  <th className="py-3.5 px-4 font-semibold">Amount (PKR)</th>
                  <th className="py-3.5 px-4 font-semibold">Classification</th>
                  <th className="py-3.5 px-4 font-semibold">Campus Site</th>
                  <th className="py-3.5 px-4 font-semibold">Methodology Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D6]">
                {feeRecords.map((record) => (
                  <tr key={record._id} className="hover:bg-[#F5F1E8]/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#101C2C]">
                      {record.year}
                    </td>
                    <td className="py-3 px-4 font-medium text-[#101C2C]">
                      <span className="font-bold text-[#D6AD60] font-mono mr-1.5">
                        {record.programmeId?.code}
                      </span>
                      {record.programmeId?.name}
                    </td>
                    <td className="py-3 px-4 text-[#788391]">
                      {record.programmeId?.degreeLevel || 'Undergraduate'}
                    </td>
                    <td className="py-3 px-4 text-[#101C2C]">
                      <span className="px-2 py-0.5 rounded bg-[#F5F1E8] border border-[#E5E0D6] font-mono text-[11px]">
                        {record.feeType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#101C2C] text-sm">
                      {formatPKR(record.amount)}
                    </td>
                    <td className="py-3 px-4">
                      <DataBadge status={record.dataType} size="xs" />
                    </td>
                    <td className="py-3 px-4 text-[#788391] text-[11px]">
                      {record.siteId?.name || 'Clifton Block 1'}
                    </td>
                    <td className="py-3 px-4 text-[#788391] text-[11px] max-w-xs truncate" title={record.notes}>
                      {record.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION FOOTER */}
        {paginationMeta && paginationMeta.totalPages > 1 && (
          <div className="p-4 bg-[#F5F1E8]/60 border-t border-[#E5E0D6] flex items-center justify-between text-xs font-mono">
            <span className="text-[#788391]">
              Showing {((paginationMeta.page - 1) * paginationMeta.limit) + 1} to{' '}
              {Math.min(paginationMeta.page * paginationMeta.limit, paginationMeta.total)} of{' '}
              <strong>{paginationMeta.total}</strong> records
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={ChevronLeft}
                disabled={!paginationMeta.hasPrev}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="px-3 py-1 font-bold text-[#101C2C]">
                Page {paginationMeta.page} of {paginationMeta.totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                icon={ChevronRight}
                disabled={!paginationMeta.hasNext}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default HistoricalFees;
