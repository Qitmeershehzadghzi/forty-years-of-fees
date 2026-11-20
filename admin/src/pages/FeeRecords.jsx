import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Receipt,
  Plus,
  Download,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Search,
  X,
  Filter
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge.jsx';
import ConfirmModal from '../components/common/ConfirmModal.jsx';
import { getFees, updateFee, deleteFee } from '../services/feeService.js';
import { getProgrammes } from '../services/programmeService.js';
import { formatPKR } from '../utils/currencyFormatter.js';

export const FeeRecords = () => {
  const [fees, setFees] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedProgramme, setSelectedProgramme] = useState('');
  const [feeType, setFeeType] = useState('');
  const [dataType, setDataType] = useState('');
  const [year, setYear] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  // Modals
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    async function loadProgs() {
      try {
        const progs = await getProgrammes();
        setProgrammes(progs);
      } catch (err) {
        console.error(err);
      }
    }
    loadProgs();
  }, []);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 25 };
      if (selectedProgramme) params.programmeId = selectedProgramme;
      if (feeType) params.feeType = feeType;
      if (dataType) params.dataType = dataType;
      if (year) params.year = Number(year);

      const res = await getFees(params);
      setFees(res.data || []);
      setMeta(res.meta || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, [selectedProgramme, feeType, dataType, year, page]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteFee(deleteTarget._id);
      setDeleteTarget(null);
      fetchFees();
    } catch (err) {
      alert(`Delete error: ${err.message}`);
    }
  };

  const handleToggleVerification = async (record) => {
    const newStatus = record.verificationStatus === 'VERIFIED' ? 'SIMULATED' : 'VERIFIED';
    const newDataType = newStatus === 'VERIFIED' ? 'VERIFIED' : 'SIMULATED';
    try {
      await updateFee(record._id, {
        verificationStatus: newStatus,
        dataType: newDataType,
        notes: newStatus === 'VERIFIED' ? 'Verified against physical archival evidence' : 'Simulated benchmark fee model',
      });
      fetchFees();
    } catch (err) {
      alert(`Status update error: ${err.message}`);
    }
  };

  const handleExportCSV = () => {
    const params = new URLSearchParams();
    if (selectedProgramme) params.append('programmeId', selectedProgramme);
    if (feeType) params.append('feeType', feeType);
    if (dataType) params.append('dataType', dataType);
    window.open(`${import.meta.env.VITE_API_URL || '/api'}/fees/export?${params.toString()}`, '_blank');
  };

  // Client search filtering
  const displayedFees = useMemo(() => {
    if (!searchQuery.trim()) return fees;
    const q = searchQuery.toLowerCase();
    return fees.filter(f =>
      f.programmeId?.code?.toLowerCase().includes(q) ||
      f.programmeId?.name?.toLowerCase().includes(q) ||
      f.feeType?.toLowerCase().includes(q) ||
      f.notes?.toLowerCase().includes(q) ||
      String(f.year).includes(q)
    );
  }, [fees, searchQuery]);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E0D6]">
        <div>
          <span className="text-xs font-mono text-[#966B1A] font-bold uppercase tracking-wider block">
            Archival Database Management
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#101C2C] mt-1">
            Historical Fee Records
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#CBD5E1] text-[#101C2C] hover:bg-[#F8FAFC] text-xs font-mono font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <Link
            to="/import"
            className="px-3.5 py-2 rounded-xl bg-[#D6AD60] text-[#101C2C] hover:bg-[#C49B4C] text-xs font-mono font-semibold flex items-center gap-1.5 shadow-xs transition-all"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </Link>
          <Link
            to="/fees/new"
            className="px-3.5 py-2 rounded-xl bg-[#101C2C] text-[#F8FAFC] hover:bg-[#1A2B40] text-xs font-mono font-semibold flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Plus className="w-4 h-4 text-[#D6AD60]" />
            <span>Add Single Record</span>
          </Link>
        </div>
      </div>

      {/* Filter and Query Console */}
      <div className="bg-white border border-[#E5E0D6] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search records by code, name, category, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl pl-10 pr-9 py-2.5 text-xs text-[#101C2C] focus:outline-none focus:ring-2 focus:ring-[#D6AD60] font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-[#64748B] hover:text-[#101C2C]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Detailed Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 border-t border-[#E5E0D6]">
          
          <div>
            <label className="block text-[11px] font-mono font-bold text-[#64748B] uppercase mb-1.5">
              Faculty / Programme
            </label>
            <select
              value={selectedProgramme}
              onChange={(e) => { setSelectedProgramme(e.target.value); setPage(1); }}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-medium text-[#101C2C] focus:ring-2 focus:ring-[#D6AD60]"
            >
              <option value="">All 10 Faculties</option>
              {programmes.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.code} — {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold text-[#64748B] uppercase mb-1.5">
              Fee Category
            </label>
            <select
              value={feeType}
              onChange={(e) => { setFeeType(e.target.value); setPage(1); }}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-medium text-[#101C2C] focus:ring-2 focus:ring-[#D6AD60]"
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

          <div>
            <label className="block text-[11px] font-mono font-bold text-[#64748B] uppercase mb-1.5">
              Verification Status
            </label>
            <select
              value={dataType}
              onChange={(e) => { setDataType(e.target.value); setPage(1); }}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-medium text-[#101C2C] focus:ring-2 focus:ring-[#D6AD60]"
            >
              <option value="">All Classifications</option>
              <option value="SIMULATED">Simulated Models</option>
              <option value="VERIFIED">Gazette Verified Only</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold text-[#64748B] uppercase mb-1.5">
              Specific Cycle Year
            </label>
            <input
              type="number"
              min="1987"
              max="2027"
              placeholder="e.g. 1995"
              value={year}
              onChange={(e) => { setYear(e.target.value); setPage(1); }}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-mono font-medium text-[#101C2C]"
            />
          </div>

        </div>

      </div>

      {/* Main Fee Records Table */}
      <div className="bg-white border border-[#E5E0D6] rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-xs font-mono text-[#64748B]">
            Querying MongoDB fee repository...
          </div>
        ) : displayedFees.length === 0 ? (
          <div className="p-16 text-center text-xs font-mono text-[#64748B]">
            No fee records match this filter combination.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-[#101C2C] text-[#F8FAFC] text-[11px] uppercase tracking-wider border-b border-[#1A2B40]">
                  <th className="py-4 px-4 font-semibold">Cycle</th>
                  <th className="py-4 px-4 font-semibold">Faculty</th>
                  <th className="py-4 px-4 font-semibold">Category</th>
                  <th className="py-4 px-4 font-semibold text-right">Amount (PKR)</th>
                  <th className="py-4 px-4 font-semibold">Classification</th>
                  <th className="py-4 px-4 font-semibold">Campus</th>
                  <th className="py-4 px-4 font-semibold">Archival Notes</th>
                  <th className="py-4 px-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D6]">
                {displayedFees.map((r) => (
                  <tr key={r._id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#101C2C] text-sm">
                      <span className="px-2 py-0.5 rounded bg-[#E2E8F0] text-[#101C2C]">
                        {r.year}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#966B1A]">
                      {r.programmeId?.code}
                    </td>
                    <td className="py-3.5 px-4 text-[#101C2C]">
                      <span className="px-2 py-0.5 rounded-full bg-[#F8FAFC] border border-[#CBD5E1] text-[11px]">
                        {r.feeType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#101C2C] text-sm text-right">
                      {formatPKR(r.amount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={r.dataType} size="xs" />
                    </td>
                    <td className="py-3.5 px-4 text-[#64748B] text-[11px]">
                      {r.siteId?.name || 'Clifton Block 1'}
                    </td>
                    <td className="py-3.5 px-4 text-[#64748B] text-[11px] max-w-xs truncate" title={r.notes}>
                      {r.notes || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleToggleVerification(r)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            r.verificationStatus === 'VERIFIED'
                              ? 'text-[#23865B] bg-[#23865B]/10 hover:bg-[#23865B]/20'
                              : 'text-[#966B1A] bg-[#D6AD60]/15 hover:bg-[#D6AD60]/25'
                          }`}
                          title={r.verificationStatus === 'VERIFIED' ? 'Mark as Simulated Model' : 'Authenticate Gazette Verification'}
                        >
                          <ShieldCheck className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(r)}
                          className="p-1.5 rounded-lg text-[#DC2626] hover:bg-[#FEE2E2] transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {meta && meta.totalPages > 1 && (
          <div className="p-4 bg-[#F8FAFC] border-t border-[#E5E0D6] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            <span className="text-[#64748B]">
              Showing {((meta.page - 1) * meta.limit) + 1} to {Math.min(meta.page * meta.limit, meta.total)} of{' '}
              <strong className="text-[#101C2C]">{meta.total}</strong> records
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={!meta.hasPrev}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-[#101C2C] disabled:opacity-40 cursor-pointer hover:bg-[#E2E8F0] transition-colors"
              >
                Previous
              </button>
              <span className="px-3 py-1 font-bold text-[#101C2C] bg-white border border-[#CBD5E1] rounded-lg">
                Page {meta.page} of {meta.totalPages}
              </span>
              <button
                disabled={!meta.hasNext}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-[#101C2C] disabled:opacity-40 cursor-pointer hover:bg-[#E2E8F0] transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Historical Fee Entry"
        message={`Are you sure you want to permanently delete this ${deleteTarget?.year} ${deleteTarget?.feeType} record of ${formatPKR(deleteTarget?.amount)}? This action will be chronicled in the immutable security audit log.`}
        confirmText="Confirm Delete"
        isDanger={true}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

    </div>
  );
};

export default FeeRecords;
