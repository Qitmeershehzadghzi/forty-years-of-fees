import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  UploadCloud,
  Scale
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
    year: 2026,
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
      year: 2026,
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
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#D6AD60] font-bold uppercase">Macroeconomic Deflators</span>
          <h2 className="text-2xl font-serif font-bold text-[#101C2C]">
            Pakistan Bureau of Statistics (PBS) CPI Series
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-lg bg-[#101C2C] text-[#F5F1E8] hover:bg-[#1A2B40] text-xs font-mono font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#D6AD60]" />
            <span>Add CPI Point</span>
          </button>
        </div>
      </div>

      {/* CPI RECORDS TABLE */}
      <div className="bg-white border border-[#E5E0D6] rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 bg-[#F5F1E8] border-b border-[#E5E0D6] flex items-center justify-between text-xs font-mono">
          <span className="text-[#101C2C] font-semibold">
            {records.length} Annual CPI Readings Registered (1987–2026)
          </span>
          <span className="text-[#788391]">
            Official Baseline: 2015-16 = 100.0
          </span>
        </div>

        {loading ? (
          <div className="p-16 text-center text-xs font-mono text-[#788391]">
            Loading inflation indices...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-[#101C2C] text-[#F5F1E8] text-[11px] uppercase tracking-wider border-b border-[#1A2B40]">
                  <th className="py-3 px-4">Year</th>
                  <th className="py-3 px-4">CPI Value</th>
                  <th className="py-3 px-4">Base Year</th>
                  <th className="py-3 px-4">Series Identifier</th>
                  <th className="py-3 px-4">Classification</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D6]">
                {records.map((r) => (
                  <tr key={r._id} className="hover:bg-[#F5F1E8]/50">
                    <td className="py-3 px-4 font-bold text-[#101C2C] text-sm">
                      {r.year}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#D6AD60] text-sm">
                      {r.cpiValue?.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-[#788391]">
                      {r.baseYear}
                    </td>
                    <td className="py-3 px-4 text-[#101C2C]">
                      {r.seriesId}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={r.dataType} size="xs" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(r)}
                          className="p-1.5 rounded text-[#426B70] hover:bg-[#F5F1E8]"
                          title="Edit CPI Point"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(r)}
                          className="p-1.5 rounded text-[#C75A5A] hover:bg-[#C75A5A]/10"
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
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-[#E5E0D6] space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#101C2C]">
              {editingItem ? `Edit CPI for Year ${editingItem.year}` : 'Add CPI Inflation Record'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#788391] uppercase mb-1">Year (1987–2026)</label>
                <input
                  type="number"
                  min="1987"
                  max="2026"
                  required
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                  className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C]"
                />
              </div>

              <div>
                <label className="block text-[#788391] uppercase mb-1">CPI Index Value</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="e.g. 100.0"
                  value={formData.cpiValue}
                  onChange={(e) => setFormData({ ...formData, cpiValue: e.target.value })}
                  className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C] font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#788391] uppercase mb-1">Base Year</label>
                  <input
                    type="number"
                    value={formData.baseYear}
                    onChange={(e) => setFormData({ ...formData, baseYear: Number(e.target.value) })}
                    className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C]"
                  />
                </div>
                <div>
                  <label className="block text-[#788391] uppercase mb-1">Series ID</label>
                  <input
                    type="text"
                    value={formData.seriesId}
                    onChange={(e) => setFormData({ ...formData, seriesId: e.target.value })}
                    className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#788391] uppercase mb-1">Data Classification</label>
                <select
                  value={formData.dataType}
                  onChange={(e) => setFormData({
                    ...formData,
                    dataType: e.target.value,
                    verificationStatus: e.target.value === 'VERIFIED' ? 'VERIFIED' : 'SIMULATED',
                  })}
                  className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C]"
                >
                  <option value="SIMULATED">SIMULATED (Illustrative Model)</option>
                  <option value="VERIFIED">VERIFIED (Official PBS Gazette)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E0D6]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded text-[#788391] hover:bg-[#F5F1E8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#101C2C] text-white font-bold hover:bg-[#1A2B40]"
                >
                  Save CPI Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete CPI Inflation Point"
        message={`Are you sure you want to delete the CPI record for Year ${deleteTarget?.year}? Real fee deflators depending on this year will revert to adjacent approximations.`}
        confirmText="Confirm Delete"
        isDanger={true}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

    </div>
  );
};

export default InflationData;
