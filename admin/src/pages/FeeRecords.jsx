import React, { useEffect, useState } from 'react';
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
  Search
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge.jsx';
import ConfirmModal from '../components/common/ConfirmModal.jsx';
import { getFees, updateFee, deleteFee } from '../services/feeService.js';
import { getProgrammes } from '../services/programmeService.js';

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
  const [page, setPage] = useState(1);

  // Modals
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [verifyTarget, setVerifyTarget] = useState(null);

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
        notes: newStatus === 'VERIFIED' ? 'Verified against physical archival evidence' : 'Simulated benchmark fee',
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

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#D6AD60] font-bold uppercase">Archival Database</span>
          <h2 className="text-2xl font-serif font-bold text-[#101C2C]">
            Fee Records Management
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-lg bg-white border border-[#E5E0D6] text-[#101C2C] hover:bg-[#F5F1E8] text-xs font-mono font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <Link
            to="/import"
            className="px-3.5 py-2 rounded-lg bg-[#D6AD60] text-[#101C2C] hover:bg-[#c49b4c] text-xs font-mono font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </Link>
          <Link
            to="/fees/new"
            className="px-3.5 py-2 rounded-lg bg-[#101C2C] text-[#F5F1E8] hover:bg-[#1A2B40] text-xs font-mono font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#D6AD60]" />
            <span>Add Single Record</span>
          </Link>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="bg-white border border-[#E5E0D6] rounded-xl p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          
          <div>
            <label className="block text-[#788391] uppercase mb-1">Programme</label>
            <select
              value={selectedProgramme}
              onChange={(e) => { setSelectedProgramme(e.target.value); setPage(1); }}
              className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C]"
            >
              <option value="">All Programmes</option>
              {programmes.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.code} — {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[#788391] uppercase mb-1">Fee Type</label>
            <select
              value={feeType}
              onChange={(e) => { setFeeType(e.target.value); setPage(1); }}
              className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C]"
            >
              <option value="">All Fee Types</option>
              <option value="Total Annual Fee">Total Annual Fee</option>
              <option value="Tuition Fee">Tuition Fee</option>
              <option value="Admission Fee">Admission Fee</option>
              <option value="Examination Fee">Examination Fee</option>
              <option value="Registration Fee">Registration Fee</option>
              <option value="Other Charges">Other Charges</option>
            </select>
          </div>

          <div>
            <label className="block text-[#788391] uppercase mb-1">Classification</label>
            <select
              value={dataType}
              onChange={(e) => { setDataType(e.target.value); setPage(1); }}
              className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C]"
            >
              <option value="">All Classifications</option>
              <option value="SIMULATED">Simulated Only</option>
              <option value="VERIFIED">Verified Only</option>
            </select>
          </div>

          <div>
            <label className="block text-[#788391] uppercase mb-1">Specific Year</label>
            <input
              type="number"
              min="1987"
              max="2026"
              placeholder="e.g. 1995"
              value={year}
              onChange={(e) => { setYear(e.target.value); setPage(1); }}
              className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C]"
            />
          </div>

        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-[#E5E0D6] rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs font-mono text-[#788391]">
            Loading historical records...
          </div>
        ) : fees.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-[#788391]">
            No fee records match this filter combination.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-[#101C2C] text-[#F5F1E8] text-[11px] uppercase tracking-wider border-b border-[#1A2B40]">
                  <th className="py-3 px-4">Year</th>
                  <th className="py-3 px-4">Programme</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Amount (PKR)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Campus</th>
                  <th className="py-3 px-4">Evidence Notes</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D6]">
                {fees.map((r) => (
                  <tr key={r._id} className="hover:bg-[#F5F1E8]/50">
                    <td className="py-3 px-4 font-bold text-[#101C2C] text-sm">
                      {r.year}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#D6AD60]">
                      {r.programmeId?.code}
                    </td>
                    <td className="py-3 px-4 text-[#101C2C]">
                      {r.feeType}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#101C2C]">
                      Rs. {r.amount?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={r.dataType} size="xs" />
                    </td>
                    <td className="py-3 px-4 text-[#788391] text-[11px]">
                      {r.siteId?.name || 'Clifton Block 1'}
                    </td>
                    <td className="py-3 px-4 text-[#788391] text-[11px] max-w-xs truncate" title={r.notes}>
                      {r.notes}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleVerification(r)}
                          className={`p-1.5 rounded transition-colors cursor-pointer ${
                            r.verificationStatus === 'VERIFIED'
                              ? 'text-[#23865B] bg-[#23865B]/10 hover:bg-[#23865B]/20'
                              : 'text-[#966b1a] bg-[#D6AD60]/10 hover:bg-[#D6AD60]/20'
                          }`}
                          title={r.verificationStatus === 'VERIFIED' ? 'Mark as Simulated' : 'Mark as Verified'}
                        >
                          <ShieldCheck className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(r)}
                          className="p-1.5 rounded text-[#C75A5A] hover:bg-[#C75A5A]/10 transition-colors cursor-pointer"
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

        {/* PAGINATION */}
        {meta && meta.totalPages > 1 && (
          <div className="p-3.5 bg-[#F5F1E8]/60 border-t border-[#E5E0D6] flex items-center justify-between text-xs font-mono">
            <span className="text-[#788391]">
              Showing {((meta.page - 1) * meta.limit) + 1} to {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} records
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={!meta.hasPrev}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-2.5 py-1 rounded border border-[#E5E0D6] bg-white text-[#101C2C] disabled:opacity-40 cursor-pointer"
              >
                Prev
              </button>
              <span className="font-bold text-[#101C2C]">
                Page {meta.page} of {meta.totalPages}
              </span>
              <button
                disabled={!meta.hasNext}
                onClick={() => setPage(p => p + 1)}
                className="px-2.5 py-1 rounded border border-[#E5E0D6] bg-white text-[#101C2C] disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Historical Fee Entry"
        message={`Are you sure you want to delete this ${deleteTarget?.year} ${deleteTarget?.feeType} record of Rs. ${deleteTarget?.amount?.toLocaleString()}? This action will be recorded in the security audit log.`}
        confirmText="Confirm Delete"
        isDanger={true}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

    </div>
  );
};

export default FeeRecords;
