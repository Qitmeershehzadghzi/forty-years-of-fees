import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  AlertCircle
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
    lastOfferedYear: 2026,
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
      lastOfferedYear: 2026,
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
      lastOfferedYear: p.lastOfferedYear || 2026,
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
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#D6AD60] font-bold uppercase">Academic Catalog</span>
          <h2 className="text-2xl font-serif font-bold text-[#101C2C]">
            Programme Management
          </h2>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-lg bg-[#101C2C] text-[#F5F1E8] hover:bg-[#1A2B40] text-xs font-mono font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#D6AD60]" />
          <span>Add Academic Programme</span>
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white border border-[#E5E0D6] rounded-xl p-4 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#788391] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by code (e.g. BBA, BSCS) or full title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded-lg pl-9 pr-3 py-2 text-xs text-[#101C2C] focus:ring-2 focus:ring-[#D6AD60]"
          />
        </div>
        <span className="text-xs font-mono text-[#788391]">
          {filtered.length} Programmes Registered
        </span>
      </div>

      {/* PROGRAMMES TABLE */}
      <div className="bg-white border border-[#E5E0D6] rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs font-mono text-[#788391]">
            Loading programme catalogue...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#101C2C] text-[#F5F1E8] font-mono text-[11px] uppercase tracking-wider border-b border-[#1A2B40]">
                  <th className="py-3.5 px-4 font-semibold">Code</th>
                  <th className="py-3.5 px-4 font-semibold">Degree Title</th>
                  <th className="py-3.5 px-4 font-semibold">Level</th>
                  <th className="py-3.5 px-4 font-semibold">Coverage Period</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D6]">
                {filtered.map((p) => (
                  <tr key={p._id} className="hover:bg-[#F5F1E8]/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#D6AD60] text-sm">
                      {p.code}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#101C2C]">
                      <div>{p.name}</div>
                      {p.description && (
                        <div className="text-[11px] text-[#788391] mt-0.5 truncate max-w-sm">
                          {p.description}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[#788391]">
                      {p.degreeLevel || 'Undergraduate'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#101C2C]">
                      {p.firstOfferedYear} — {p.lastOfferedYear}
                    </td>
                    <td className="py-3.5 px-4">
                      {p.isActive ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#23865B] bg-[#23865B]/10 px-2 py-0.5 rounded-full font-semibold">
                          <CheckCircle className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#C75A5A] bg-[#C75A5A]/10 px-2 py-0.5 rounded-full font-semibold">
                          <XCircle className="w-3 h-3" /> Deactivated
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg text-[#101C2C] hover:bg-[#F5F1E8] transition-colors cursor-pointer"
                          title="Edit Programme"
                        >
                          <Edit2 className="w-4 h-4 text-[#426B70]" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="p-1.5 rounded-lg text-[#C75A5A] hover:bg-[#C75A5A]/10 transition-colors cursor-pointer"
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
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-[#E5E0D6] space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#101C2C]">
              {editingProg ? `Edit Programme: ${editingProg.code}` : 'Add Academic Programme'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#788391] uppercase mb-1">Code</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. BSCS"
                    className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C] uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[#788391] uppercase mb-1">Degree Level</label>
                  <select
                    value={formData.degreeLevel}
                    onChange={(e) => setFormData({ ...formData, degreeLevel: e.target.value })}
                    className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C]"
                  >
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#788391] uppercase mb-1">Programme Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Bachelor of Business Administration"
                  className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C] font-sans"
                />
              </div>

              <div>
                <label className="block text-[#788391] uppercase mb-1">Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Curriculum focus, laboratory setups..."
                  className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C] font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#788391] uppercase mb-1">First Offered Year</label>
                  <input
                    type="number"
                    value={formData.firstOfferedYear}
                    onChange={(e) => setFormData({ ...formData, firstOfferedYear: Number(e.target.value) })}
                    className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C]"
                  />
                </div>
                <div>
                  <label className="block text-[#788391] uppercase mb-1">Last Offered Year</label>
                  <input
                    type="number"
                    value={formData.lastOfferedYear}
                    onChange={(e) => setFormData({ ...formData, lastOfferedYear: Number(e.target.value) })}
                    className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-[#E5E0D6] text-[#D6AD60]"
                />
                <label htmlFor="isActive" className="text-[#101C2C] cursor-pointer">
                  Active Faculty Programme
                </label>
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
        message={`Are you sure you want to remove or deactivate "${deleteTarget?.name}"? If historical fee records exist, this programme will be safely deactivated to protect archival integrity.`}
        confirmText="Confirm Deactivate / Delete"
        isDanger={true}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />

    </div>
  );
};

export default Programmes;
