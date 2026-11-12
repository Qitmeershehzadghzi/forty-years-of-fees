import React, { useEffect, useState } from 'react';
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  BookOpen
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge.jsx';
import ConfirmModal from '../components/common/ConfirmModal.jsx';
import {
  getResearchNotes,
  createResearchNote,
  updateResearchNote,
  deleteResearchNote
} from '../services/researchService.js';
import { getSources } from '../services/sourceService.js';

export const ResearchManagement = () => {
  const [notes, setNotes] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Zakat',
    summary: '',
    content: '',
    status: 'PUBLISHED',
    sourceIds: [],
  });

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const [resNotes, resSources] = await Promise.all([
        getResearchNotes(),
        getSources(),
      ]);
      setNotes(resNotes);
      setSources(resSources.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleOpenAdd = () => {
    setEditingNote(null);
    setFormData({
      title: '',
      category: 'Zakat',
      summary: '',
      content: '',
      status: 'PUBLISHED',
      sourceIds: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      category: note.category,
      summary: note.summary || '',
      content: note.content,
      status: note.status,
      sourceIds: note.sourceIds?.map(s => s._id || s) || [],
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNote) {
        await updateResearchNote(editingNote._id, formData);
      } else {
        await createResearchNote(formData);
      }
      setIsModalOpen(false);
      fetchNotes();
    } catch (err) {
      alert(`Save error: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteResearchNote(deleteTarget._id);
      setDeleteTarget(null);
      fetchNotes();
    } catch (err) {
      alert(`Delete error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#D6AD60] font-bold uppercase">Academic Publishing</span>
          <h2 className="text-2xl font-serif font-bold text-[#101C2C]">
            Educational Philanthropy & Research Notes
          </h2>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-lg bg-[#101C2C] text-[#F5F1E8] hover:bg-[#1A2B40] text-xs font-mono font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#D6AD60]" />
          <span>Write Research Monograph</span>
        </button>
      </div>

      {/* MONOGRAPHS LIST */}
      <div className="bg-white border border-[#E5E0D6] rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs font-mono text-[#788391]">
            Loading research articles...
          </div>
        ) : (
          <div className="divide-y divide-[#E5E0D6]">
            {notes.map((note) => (
              <div key={note._id} className="p-6 hover:bg-[#F5F1E8]/30 transition-colors flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#D6AD60] uppercase px-2 py-0.5 rounded bg-[#101C2C]">
                      {note.category}
                    </span>
                    <StatusBadge status={note.status} size="xs" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#101C2C]">
                    {note.title}
                  </h3>
                  {note.summary && (
                    <p className="text-xs text-[#426B70] font-medium leading-relaxed">
                      {note.summary}
                    </p>
                  )}
                  <p className="text-xs text-[#788391] leading-relaxed line-clamp-3 whitespace-pre-line">
                    {note.content}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                  <button
                    onClick={() => handleOpenEdit(note)}
                    className="p-2 rounded-lg bg-[#F5F1E8] text-[#426B70] hover:bg-[#ece6d9] text-xs font-mono flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteTarget(note)}
                    className="p-2 rounded-lg bg-[#C75A5A]/10 text-[#C75A5A] hover:bg-[#C75A5A]/20 text-xs font-mono flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-[#E5E0D6] space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif font-bold text-lg text-[#101C2C]">
              {editingNote ? 'Edit Research Monograph' : 'Create Research Monograph'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#788391] uppercase mb-1">Monograph Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C] font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#788391] uppercase mb-1">Philanthropic Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C]"
                  >
                    <option value="Zakat">Zakat</option>
                    <option value="Waqf">Waqf</option>
                    <option value="Church Education Trusts">Church Education Trusts</option>
                    <option value="Temple Education Trusts">Temple Education Trusts</option>
                    <option value="Institutional Policy">Institutional Policy</option>
                    <option value="Economic Impact">Economic Impact</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#788391] uppercase mb-1">Publication Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C]"
                  >
                    <option value="PUBLISHED">Published (Visible Publicly)</option>
                    <option value="REVIEW">Under Editorial Review</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#788391] uppercase mb-1">Executive Summary</label>
                <textarea
                  rows="2"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Key argument summary..."
                  className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C] font-sans"
                />
              </div>

              <div>
                <label className="block text-[#788391] uppercase mb-1">Monograph Content (Markdown / Plain Text)</label>
                <textarea
                  rows="7"
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Institutional mechanisms, eligibility criteria, audit references..."
                  className="w-full bg-[#F5F1E8] border border-[#E5E0D6] rounded px-3 py-2 text-[#101C2C] font-sans text-xs leading-relaxed"
                />
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
                  Save Research Monograph
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Research Monograph"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"?`}
        confirmText="Confirm Delete"
        isDanger={true}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

    </div>
  );
};

export default ResearchManagement;
