import React, { useEffect, useState } from 'react';
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Building2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import ConfirmModal from '../components/common/ConfirmModal.jsx';
import {
  getSites,
  createSite,
  updateSite,
  deleteSite
} from '../services/siteService.js';

export const Sites = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    isActive: true,
  });

  const fetchSites = async () => {
    try {
      setLoading(true);
      const data = await getSites();
      setSites(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const handleOpenAdd = () => {
    setEditingSite(null);
    setFormData({
      name: '',
      address: '',
      description: '',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s) => {
    setEditingSite(s);
    setFormData({
      name: s.name,
      address: s.address,
      description: s.description || '',
      isActive: s.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSite) {
        await updateSite(editingSite._id, formData);
      } else {
        await createSite(formData);
      }
      setIsModalOpen(false);
      fetchSites();
    } catch (err) {
      alert(`Save error: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSite(deleteTarget._id);
      setDeleteTarget(null);
      fetchSites();
    } catch (err) {
      alert(`Delete error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#D6AD60] font-bold uppercase">Campus Infrastructure</span>
          <h2 className="text-2xl font-serif font-bold text-[#101C2C]">
            Campus Site Management
          </h2>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-lg bg-[#101C2C] text-[#F5F1E8] hover:bg-[#1A2B40] text-xs font-mono font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#D6AD60]" />
          <span>Add Campus Site</span>
        </button>
      </div>

      {/* SITES GRID */}
      {loading ? (
        <div className="p-16 text-center text-xs font-mono text-[#788391]">
          Loading campus sites...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sites.map((s) => (
            <div key={s._id} className="bg-white border border-[#E5E0D6] rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#D6AD60] uppercase flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Campus Location</span>
                  </span>
                  {s.isActive ? (
                    <span className="text-[#23865B] text-xs font-mono flex items-center gap-1 font-bold">
                      <CheckCircle className="w-3.5 h-3.5" /> Active
                    </span>
                  ) : (
                    <span className="text-[#C75A5A] text-xs font-mono flex items-center gap-1 font-bold">
                      <XCircle className="w-3.5 h-3.5" /> Inactive
                    </span>
                  )}
                </div>
                <h3 className="font-serif font-bold text-lg text-[#101C2C]">
                  {s.name}
                </h3>
                <p className="text-xs text-[#788391] font-mono">
                  {s.address}
                </p>
                {s.description && (
                  <p className="text-xs text-[#101C2C]/80 font-sans leading-relaxed pt-1">
                    {s.description}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#E5E0D6] flex items-center justify-end gap-2 text-xs font-mono">
                <button
                  onClick={() => handleOpenEdit(s)}
                  className="p-1.5 rounded text-[#426B70] hover:bg-[#F5F1E8]"
                  title="Edit Site"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(s)}
                  className="p-1.5 rounded text-[#C75A5A] hover:bg-[#C75A5A]/10"
                  title="Delete Site"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT SITE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-[#E5E0D6] space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#101C2C]">
              {editingSite ? `Edit Site: ${editingSite.name}` : 'Add Campus Site'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#788391] uppercase mb-1">Campus Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Clifton Block 1"
                  className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C]"
                />
              </div>

              <div>
                <label className="block text-[#788391] uppercase mb-1">Postal Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="DK-10, 38th Street, Darakshan..."
                  className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C]"
                />
              </div>

              <div>
                <label className="block text-[#788391] uppercase mb-1">Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Campus facilities, library hubs..."
                  className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C] font-sans"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="siteActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <label htmlFor="siteActive" className="text-[#101C2C] cursor-pointer">
                  Active Operational Campus
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
                  Save Campus Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Campus Site"
        message={`Are you sure you want to remove site "${deleteTarget?.name}"?`}
        confirmText="Confirm Delete"
        isDanger={true}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

    </div>
  );
};

export default Sites;
