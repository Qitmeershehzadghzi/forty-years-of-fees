import React, { useEffect, useState } from 'react';
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Building2,
  CheckCircle,
  XCircle,
  Navigation,
  Globe,
  ExternalLink,
  ShieldCheck,
  Search
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
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
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
      console.error('Failed to fetch campus sites:', err);
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
      alert(`Site Save Error: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSite(deleteTarget._id);
      setDeleteTarget(null);
      fetchSites();
    } catch (err) {
      alert(`Delete Error: ${err.message}`);
    }
  };

  const filteredSites = sites.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E0D6]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-[#426B70]/15 text-[#426B70] border border-[#426B70]/30">
              <Building2 className="w-3 h-3 text-[#426B70]" />
              Geospatial Campus Nodes
            </span>
            <span className="text-xs font-mono text-[#788391]">Institutional Infrastructure</span>
          </div>
          <h1 className="text-3xl font-serif font-black text-[#101C2C] tracking-tight">
            Campus Sites & Branch Locations
          </h1>
          <p className="text-xs text-[#788391] mt-1 font-sans max-w-xl">
            Maintain physical facilities, research annexes, and historical Karachi campuses associated with Greenwich University fee schedules (1987–2027).
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#101C2C] text-[#F5F1E8] hover:bg-[#1A2B40] text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md active:translate-y-0.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#D6AD60]" />
          <span>Add Campus Site</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-[#E5E0D6] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#788391] absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search campus name, Clifton, DHA, Mauritius..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F5F1E8]/70 border border-[#E5E0D6] rounded-xl pl-10 pr-4 py-2 text-xs text-[#101C2C] font-mono placeholder:text-[#788391] focus:outline-none focus:border-[#D6AD60]"
          />
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-[#788391]">
          <span>Registered Sites: <strong className="text-[#101C2C] font-mono">{filteredSites.length}</strong></span>
        </div>
      </div>

      {/* Sites Grid Cards */}
      {loading ? (
        <div className="p-16 bg-white border border-[#E5E0D6] rounded-2xl text-center text-xs font-mono text-[#788391]">
          Querying geospatial campus records...
        </div>
      ) : filteredSites.length === 0 ? (
        <div className="p-16 bg-white border border-[#E5E0D6] rounded-2xl text-center space-y-2">
          <Building2 className="w-8 h-8 text-[#788391] mx-auto opacity-50" />
          <p className="font-mono text-xs text-[#788391]">No campus sites match your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSites.map((site) => (
            <div
              key={site._id}
              className="bg-white border border-[#E5E0D6] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F1E8] border border-[#E5E0D6] flex items-center justify-center text-[#101C2C] group-hover:border-[#D6AD60] transition-colors">
                    <Building2 className="w-5 h-5 text-[#426B70]" />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold ${
                    site.isActive ? 'bg-[#23865B]/15 text-[#23865B] border border-[#23865B]/30' : 'bg-[#C75A5A]/15 text-[#C75A5A] border border-[#C75A5A]/30'
                  }`}>
                    {site.isActive ? 'Active Campus' : 'Historical Annex'}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-lg text-[#101C2C] leading-snug">
                    {site.name}
                  </h3>
                  <div className="flex items-start gap-1.5 text-xs text-[#788391] mt-2 font-sans">
                    <MapPin className="w-3.5 h-3.5 text-[#D6AD60] shrink-0 mt-0.5" />
                    <span>{site.address}</span>
                  </div>
                </div>

                {site.description && (
                  <p className="text-xs text-[#788391] font-sans leading-relaxed pt-2 border-t border-[#E5E0D6] line-clamp-3">
                    {site.description}
                  </p>
                )}
              </div>

              {/* Action Bar */}
              <div className="pt-4 border-t border-[#E5E0D6] flex items-center justify-between text-xs font-mono">
                <span className="text-[10px] text-[#788391] uppercase">ID: {site._id.slice(-6)}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(site)}
                    className="p-1.5 rounded-lg text-[#788391] hover:text-[#101C2C] hover:bg-[#F5F1E8] transition-colors cursor-pointer"
                    title="Edit Campus Details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(site)}
                    className="p-1.5 rounded-lg text-[#788391] hover:text-[#C75A5A] hover:bg-[#C75A5A]/10 transition-colors cursor-pointer"
                    title="Delete Campus Site"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Site Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-[#E5E0D6] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5E0D6] pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#D6AD60] font-bold uppercase tracking-wider">
                  Campus Registry
                </span>
                <h3 className="text-xl font-serif font-bold text-[#101C2C]">
                  {editingSite ? 'Modify Campus Location' : 'Register New Campus Site'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#788391] hover:text-[#101C2C] text-sm font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#788391] uppercase font-semibold mb-1.5">
                  Campus Title <span className="text-[#C75A5A]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Main Clifton Campus, Karachi"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#F5F1E8]/70 border border-[#E5E0D6] rounded-xl px-3.5 py-2.5 text-xs text-[#101C2C] font-mono focus:outline-none focus:border-[#D6AD60]"
                />
              </div>

              <div>
                <label className="block text-[#788391] uppercase font-semibold mb-1.5">
                  Physical Postal Address <span className="text-[#C75A5A]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DK-10, 38th Street, Darakshan, Phase VI, DHA, Karachi"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-[#F5F1E8]/70 border border-[#E5E0D6] rounded-xl px-3.5 py-2.5 text-xs text-[#101C2C] font-mono focus:outline-none focus:border-[#D6AD60]"
                />
              </div>

              <div>
                <label className="block text-[#788391] uppercase font-semibold mb-1.5">
                  Archival / Geographical Monograph
                </label>
                <textarea
                  rows="3"
                  placeholder="Historic notes on when this facility opened, chartered status, student capacity..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#F5F1E8]/70 border border-[#E5E0D6] rounded-xl px-3.5 py-2.5 text-xs text-[#101C2C] font-sans focus:outline-none focus:border-[#D6AD60]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveSite"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-[#E5E0D6] text-[#101C2C] focus:ring-[#D6AD60]"
                />
                <label htmlFor="isActiveSite" className="text-xs font-mono text-[#101C2C] select-none cursor-pointer">
                  Active Operational Campus (Uncheck if historical/closed campus)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E0D6]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E5E0D6] text-[#788391] hover:text-[#101C2C] hover:bg-[#F5F1E8] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#101C2C] text-[#F5F1E8] hover:bg-[#1A2B40] font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  {editingSite ? 'Save Changes' : 'Create Campus Site'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmModal
          isOpen={!!deleteTarget}
          title="Delete Campus Site"
          message={`Are you sure you want to permanently delete "${deleteTarget.name}"? Any linked fee records may lose their physical site reference.`}
          confirmText="Confirm Deletion"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isDanger={true}
        />
      )}
    </div>
  );
};

export default Sites;
