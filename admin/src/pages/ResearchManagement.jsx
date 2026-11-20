import React, { useEffect, useState } from 'react';
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  BookOpen,
  X,
  Bookmark
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
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E0D6]">
        <div>
          <span className="text-xs font-mono text-[#966B1A] font-bold uppercase tracking-wider block">
            Academic Research Publications
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#101C2C] mt-1">
            Educational Philanthropy & Research Notes
          </h2>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-[#101C2C] text-[#F8FAFC] hover:bg-[#1A2B40] text-xs font-mono font-semibold flex items-center gap-2 shadow-sm cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4 text-[#D6AD60]" />
          <span>Write Research Monograph</span>
        </button>
      </div>

      {/* Monographs List */}
      <div className="bg-white border border-[#E5E0D6] rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-xs font-mono text-[#64748B]">
            Querying research monographs...
          </div>
        ) : (
          <div className="divide-y divide-[#E5E0D6]">
            {notes.map((note) => (
              <div
                key={note._id}
                className="p-6 sm:p-7 hover:bg-[#F8FAFC] transition-colors flex flex-col md:flex-row items-start justify-between gap-5"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#966B1A] uppercase px-2.5 py-0.5 rounded-full bg-[#D6AD60]/15 border border-[#D6AD60]/30">
                      {note.category}
                    </span>
                    <StatusBadge status={note.status} size="xs" />
                  </div>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[#101C2C]">
                    {note.title}
                  </h3>
                  {note.summary && (
                    <p className="text-xs text-[#2563EB] font-medium leading-relaxed font-sans">
                      {note.summary}
                    </p>
                  )}
                  <p className="text-xs text-[#64748B] leading-relaxed line-clamp-3 whitespace-pre-line font-sans">
                    {note.content}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 font-mono text-xs">
                  <button
                    onClick={() => handleOpenEdit(note)}
                    className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#2563EB] hover:bg-[#E2E8F0] flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteTarget(note)}
                    className="px-3 py-1.5 rounded-lg bg-[#DC2626]/10 border border-[#DC2626]/20 text-[#DC2626] hover:bg-[#DC2626]/20 flex items-center gap-1.5 cursor-pointer transition-colors"
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
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-[#E5E0D6] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E5E0D6] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#101C2C]">
                {editingNote ? 'Edit Research Monograph' : 'Publish Research Monograph'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#64748B] hover:text-[#101C2C]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#64748B] uppercase mb-1 font-bold">Monograph Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#101C2C] font-sans focus:ring-2 focus:ring-[#D6AD60]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#64748B] uppercase mb-1 font-bold">Philanthropic Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#101C2C] focus:ring-2 focus:ring-[#D6AD60]"
                  >
                    <option value="Zakat">Zakat Committee</option>
                    <option value="Waqf">Islamic Waqf Instrument</option>
                    <option value="Christian Trusts">Christian Diocesan Board</option>
                    <option value="Hindu Trusts">Hindu Temple Trust</option>
                    <option value="General Philanthropy">General Philanthropy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#64748B] uppercase mb-1 font-bold">Publication Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#101C2C] focus:ring-2 focus:ring-[#D6AD60]"
                  >
                    <option value="PUBLISHED">Published (Visible Publicly)</option>
                    <option value="DRAFT">Draft</option>
                    <option value="PENDING_REVIEW">Pending Review</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#64748B] uppercase mb-1 font-bold">Executive Summary</label>
                <textarea
                  rows="2"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="One or two sentences summarizing the historical mechanism..."
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#101C2C] font-sans focus:ring-2 focus:ring-[#D6AD60]"
                />
              </div>

              <div>
                <label className="block text-[#64748B] uppercase mb-1 font-bold">Monograph Content & Scholarly Text</label>
                <textarea
                  rows="6"
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Full analysis text, historical context in Karachi, financial assistance models..."
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl p-3 text-[#101C2C] font-sans focus:ring-2 focus:ring-[#D6AD60] leading-relaxed"
                />
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
                  {editingNote ? 'Save Changes' : 'Publish Monograph'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Confirm Monograph Deletion"
        message={`Are you sure you want to permanently delete the monograph "${deleteTarget?.title}"?`}
        confirmText="Confirm Delete"
        isDanger={true}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

    </div>
  );
};

export default ResearchManagement;
