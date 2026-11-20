import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  UploadCloud,
  Scale,
  X,
  Calendar,
  Landmark
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge.jsx';
import ConfirmModal from '../components/common/ConfirmModal.jsx';
import {
  getInflationRecords,
  createInflationRecord,
  updateInflationRecord,
  deleteInflationRecord
} from '../services/inflationService.js';

export const InflationData = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seriesFilter, setSeriesFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    year: 2027,
    cpiValue: '',
    seriesId: 'PBS-CPI-2015-16',
    baseYear: 2016,
    dataType: 'SIMULATED',
    verificationStatus: 'SIMULATED',
  });

  const fetchCPI = async () => {
    try {
      setLoading(true);
      const data = await getInflationRecords({ seriesId: seriesFilter || undefined });
      setRecords(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCPI();
  }, [seriesFilter]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      year: 2027,
      cpiValue: '',
      seriesId: 'PBS-CPI-2015-16',
      baseYear: 2016,
      dataType: 'SIMULATED',
      verificationStatus: 'SIMULATED',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      year: item.year,
      cpiValue: item.cpiValue,
      seriesId: item.seriesId,
      baseYear: item.baseYear,
      dataType: item.dataType,
      verificationStatus: item.verificationStatus,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateInflationRecord(editingItem._id, {
          ...formData,
          year: Number(formData.year),
          cpiValue: Number(formData.cpiValue),
          baseYear: Number(formData.baseYear),
        });
      } else {
        await createInflationRecord({
          ...formData,
          year: Number(formData.year),
          cpiValue: Number(formData.cpiValue),
          baseYear: Number(formData.baseYear),
        });
      }
      setIsModalOpen(false);
      fetchCPI();
    } catch (err) {
      alert(`Save error: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteInflationRecord(deleteTarget._id);
      setDeleteTarget(null);
      fetchCPI();
    } catch (err) {
      alert(`Delete error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E0D6]">
        <div>
          <span className="text-xs font-mono text-[#966B1A] font-bold uppercase tracking-wider block">
            Macroeconomic Deflators Administration
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#101C2C] mt-1">
            Pakistan Bureau of Statistics (PBS) CPI Series
          </h2>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-[#101C2C] text-[#F8FAFC] hover:bg-[#1A2B40] text-xs font-mono font-semibold flex items-center gap-2 shadow-sm cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4 text-[#D6AD60]" />
            <span>Add Annual CPI Point</span>
          </button>
        </div>
      </div>

      {/* CPI Table */}
      <div className="bg-white border border-[#E5E0D6] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 bg-[#F8FAFC] border-b border-[#E5E0D6] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
          <span className="text-[#101C2C] font-bold">
            {records.length} Annual CPI Readings Registered (1987–2027)
          </span>
          <span className="text-[#64748B]">
            Official Series Benchmark: 2015-16 = 100.0
          </span>
        </div>

        {loading ? (
          <div className="p-20 text-center text-xs font-mono text-[#64748B]">
            Querying inflation indices...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-[#101C2C] text-[#F8FAFC] text-[11px] uppercase tracking-wider border-b border-[#1A2B40]">
                  <th className="py-4 px-4 font-semibold">Calendar Cycle</th>
                  <th className="py-4 px-4 font-semibold">CPI Index Value</th>
                  <th className="py-4 px-4 font-semibold">Base Year</th>
                  <th className="py-4 px-4 font-semibold">Series Identifier</th>
                  <th className="py-4 px-4 font-semibold">Classification</th>
                  <th className="py-4 px-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D6]">
                {records.map((r) => (
                  <tr key={r._id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#101C2C] text-sm">
                      <span className="px-2 py-0.5 rounded bg-[#E2E8F0] text-[#101C2C]">
                        {r.year}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#966B1A] text-sm">
                      {r.cpiValue?.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-[#64748B]">
                      {r.baseYear}
                    </td>
                    <td className="py-3.5 px-4 text-[#101C2C]">
                      {r.seriesId}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={r.dataType} size="xs" />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(r)}
                          className="p-1.5 rounded-lg text-[#2563EB] hover:bg-[#E2E8F0] transition-colors cursor-pointer"
                          title="Edit CPI Point"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(r)}
                          className="p-1.5 rounded-lg text-[#DC2626] hover:bg-[#FEE2E2] transition-colors cursor-pointer"
                          title="Delete CPI Point"
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
      </div>

      {/* CREATE / EDIT CPI MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#E5E0D6] space-y-5">
            <div className="flex items-center justify-between border-b border-[#E5E0D6] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#101C2C]">
                {editingItem ? `Edit CPI for Year ${editingItem.year}` : 'Add Annual CPI Record'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#64748B] hover:text-[#101C2C]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#64748B] uppercase mb-1 font-bold">Cycle Year (1987–2027)</label>
                <input
                  type="number"
                  min="1987"
                  max="2027"
                  required
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#101C2C] focus:ring-2 focus:ring-[#D6AD60]"
                />
              </div>

              <div>
                <label className="block text-[#64748B] uppercase mb-1 font-bold">CPI Index Value</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="e.g. 100.0 or 370.64"
                  value={formData.cpiValue}
                  onChange={(e) => setFormData({ ...formData, cpiValue: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#101C2C] focus:ring-2 focus:ring-[#D6AD60]"
                />
              </div>

              <div>
                <label className="block text-[#64748B] uppercase mb-1 font-bold">Series Identifier</label>
                <input
                  type="text"
                  required
                  value={formData.seriesId}
                  onChange={(e) => setFormData({ ...formData, seriesId: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#101C2C] focus:ring-2 focus:ring-[#D6AD60]"
                />
              </div>

              <div>
                <label className="block text-[#64748B] uppercase mb-1 font-bold">Standard Base Year</label>
                <input
                  type="number"
                  required
                  value={formData.baseYear}
                  onChange={(e) => setFormData({ ...formData, baseYear: Number(e.target.value) })}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#101C2C] focus:ring-2 focus:ring-[#D6AD60]"
                />
              </div>

              <div>
                <label className="block text-[#64748B] uppercase mb-1 font-bold">Classification</label>
                <select
                  value={formData.dataType}
                  onChange={(e) => setFormData({ ...formData, dataType: e.target.value, verificationStatus: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#101C2C] focus:ring-2 focus:ring-[#D6AD60]"
                >
                  <option value="SIMULATED">Simulated Model</option>
                  <option value="VERIFIED">Gazette Verified</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E0D6]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#101C2C] text-white font-bold hover:bg-[#1A2B40] shadow-sm cursor-pointer"
                >
                  {editingItem ? 'Save Changes' : 'Record CPI Index'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Confirm CPI Reading Deletion"
        message={`Are you sure you want to delete the CPI record for ${deleteTarget?.year} (Index: ${deleteTarget?.cpiValue})? This will alter inflation deflators for that calendar year.`}
        confirmText="Confirm Delete"
        isDanger={true}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

    </div>
  );
};

export default InflationData;
