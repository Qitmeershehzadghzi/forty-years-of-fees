import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  AlertCircle,
  X,
  Layers,
  Calendar
} from 'lucide-react';
import ConfirmModal from '../components/common/ConfirmModal.jsx';
import {
  getProgrammes,
  createProgramme,
  updateProgramme,
  deleteProgramme
} from '../services/programmeService.js';

export const Programmes = () => {
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProg, setEditingProg] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    degreeLevel: 'Undergraduate',
    description: '',
    firstOfferedYear: 1987,
    lastOfferedYear: 2027,
    isActive: true,
  });

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchProgrammes = async () => {
    try {
      setLoading(true);
      const data = await getProgrammes();
      setProgrammes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgrammes();
  }, []);

  const handleOpenAdd = () => {
    setEditingProg(null);
    setFormData({
      code: '',
      name: '',
      degreeLevel: 'Undergraduate',
      description: '',
      firstOfferedYear: 1987,
      lastOfferedYear: 2027,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProg(p);
    setFormData({
      code: p.code,
      name: p.name,
      degreeLevel: p.degreeLevel || 'Undergraduate',
      description: p.description || '',
      firstOfferedYear: p.firstOfferedYear || 1987,
      lastOfferedYear: p.lastOfferedYear || 2027,
      isActive: p.isActive !== false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProg) {
        await updateProgramme(editingProg._id, formData);
      } else {
        await createProgramme(formData);
      }
      setIsModalOpen(false);
      fetchProgrammes();
    } catch (err) {
      alert(`Save error: ${err.message}`);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProgramme(deleteTarget._id);
      setDeleteTarget(null);
      fetchProgrammes();
    } catch (err) {
      alert(`Delete error: ${err.message}`);
    }
  };

  const filtered = programmes.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E0D6]">
        <div>
          <span className="text-xs font-mono text-[#966B1A] font-bold uppercase tracking-wider block">
            Academic Catalog Administration
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#101C2C] mt-1">
            Academic Programme Management
          </h2>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-[#101C2C] text-[#F8FAFC] hover:bg-[#1A2B40] text-xs font-mono font-semibold flex items-center gap-2 shadow-sm cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4 text-[#D6AD60]" />
          <span>Add Academic Programme</span>
        </button>
      </div>

      {/* Search & Statistics Bar */}
      <div className="bg-white border border-[#E5E0D6] rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search faculties by code (e.g. BBA, BSCS) or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl pl-10 pr-9 py-2 text-xs text-[#101C2C] focus:ring-2 focus:ring-[#D6AD60] font-medium"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 text-[#64748B] hover:text-[#101C2C]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <span className="text-xs font-mono text-[#64748B]">
          {filtered.length} of {programmes.length} Faculties Listed
        </span>
      </div>

      {/* Programmes Table */}
      <div className="bg-white border border-[#E5E0D6] rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-xs font-mono text-[#64748B]">
            Querying academic catalogue...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-[#101C2C] text-[#F8FAFC] text-[11px] uppercase tracking-wider border-b border-[#1A2B40]">
                  <th className="py-4 px-4 font-semibold">Faculty Code</th>
                  <th className="py-4 px-4 font-semibold">Discipline Title</th>
                  <th className="py-4 px-4 font-semibold">Degree Level</th>
                  <th className="py-4 px-4 font-semibold">Historical Span</th>
                  <th className="py-4 px-4 font-semibold">Status</th>
                  <th className="py-4 px-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D6]">
                {filtered.map((p) => (
                  <tr key={p._id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#966B1A] text-sm">
                      <span className="px-2 py-0.5 rounded bg-[#D6AD60]/10 border border-[#D6AD60]/20">
                        {p.code}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#101C2C]">
                      <div className="font-sans font-bold text-sm text-[#101C2C]">{p.name}</div>
                      {p.description && (
                        <div className="text-[11px] text-[#64748B] mt-0.5 font-sans truncate max-w-sm">
                          {p.description}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[#64748B]">
                      <span className="px-2 py-0.5 rounded-full bg-[#F8FAFC] border border-[#CBD5E1] text-[11px]">
                        {p.degreeLevel || 'Undergraduate'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#101C2C]">
                      {p.firstOfferedYear} — {p.lastOfferedYear}
                    </td>
                    <td className="py-3.5 px-4">
                      {p.isActive ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#23865B] bg-[#23865B]/10 border border-[#23865B]/20 px-2.5 py-0.5 rounded-full font-semibold">
                          <CheckCircle className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#DC2626] bg-[#DC2626]/10 border border-[#DC2626]/20 px-2.5 py-0.5 rounded-full font-semibold">
                          <XCircle className="w-3 h-3" /> Deactivated
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg text-[#101C2C] hover:bg-[#E2E8F0] transition-colors cursor-pointer"
                          title="Edit Programme"
                        >
                          <Edit2 className="w-4 h-4 text-[#2563EB]" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="p-1.5 rounded-lg text-[#DC2626] hover:bg-[#FEE2E2] transition-colors cursor-pointer"
                          title="Delete / Deactivate Programme"
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

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#E5E0D6] space-y-5">
            <div className="flex items-center justify-between border-b border-[#E5E0D6] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#101C2C]">
                {editingProg ? `Edit Discipline: ${editingProg.code}` : 'Register New Academic Programme'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#64748B] hover:text-[#101C2C]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#64748B] uppercase mb-1 font-bold">Faculty Code</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. BSCS"
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#101C2C] uppercase focus:ring-2 focus:ring-[#D6AD60]"
                  />
                </div>
                <div>
                  <label className="block text-[#64748B] uppercase mb-1 font-bold">Degree Level</label>
                  <select
                    value={formData.degreeLevel}
                    onChange={(e) => setFormData({ ...formData, degreeLevel: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#101C2C] focus:ring-2 focus:ring-[#D6AD60]"
                  >
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#64748B] uppercase mb-1 font-bold">Full Degree Title</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Bachelor of Science in Software Engineering"
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#101C2C] font-sans focus:ring-2 focus:ring-[#D6AD60]"
                />
              </div>

              <div>
                <label className="block text-[#64748B] uppercase mb-1 font-bold">Curriculum / Laboratory Scope</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Curriculum focus, laboratory setups, accreditation body..."
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#101C2C] font-sans focus:ring-2 focus:ring-[#D6AD60]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#64748B] uppercase mb-1 font-bold">First Offered Year</label>
                  <input
                    type="number"
                    value={formData.firstOfferedYear}
                    onChange={(e) => setFormData({ ...formData, firstOfferedYear: Number(e.target.value) })}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#101C2C]"
                  />
                </div>
                <div>
                  <label className="block text-[#64748B] uppercase mb-1 font-bold">Last Offered Year</label>
                  <input
                    type="number"
                    value={formData.lastOfferedYear}
                    onChange={(e) => setFormData({ ...formData, lastOfferedYear: Number(e.target.value) })}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#101C2C]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-[#CBD5E1] text-[#D6AD60]"
                />
                <label htmlFor="isActive" className="text-[#101C2C] font-sans cursor-pointer font-medium">
                  Active Faculty Programme (Available in public dropdowns)
                </label>
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
                  {editingProg ? 'Save Changes' : 'Create Programme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Confirm Programme Deletion / Deactivation"
        message={`Are you sure you want to remove or deactivate "${deleteTarget?.name}"? If historical fee records exist, this programme will be safely deactivated to protect archival data integrity.`}
        confirmText="Confirm Deactivate / Delete"
        isDanger={true}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />

    </div>
  );
};

export default Programmes;
