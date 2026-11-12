import { ResearchNote } from './research.model.js';
import { logAudit } from '../audit/audit.service.js';

export const getResearchNotes = async (query = {}) => {
  const filter = {};
  if (query.category) filter.category = query.category;
  if (query.status) {
    filter.status = query.status;
  } else if (!query.includeDrafts) {
    // Default public: only PUBLISHED
    filter.status = 'PUBLISHED';
  }

  return ResearchNote.find(filter)
    .populate('sourceIds', 'title institution publicationYear documentUrl')
    .populate('createdBy', 'name email role')
    .sort({ createdAt: -1 });
};

export const getResearchNoteById = async (id) => {
  return ResearchNote.findById(id)
    .populate('sourceIds')
    .populate('createdBy', 'name email role');
};

export const createResearchNote = async (data, userId) => {
  const note = await ResearchNote.create({
    ...data,
    createdBy: userId,
  });
  await logAudit({
    action: 'CREATE',
    entity: 'ResearchNote',
    entityId: note._id,
    newValues: note.toObject(),
    userId,
  });
  return note;
};

export const updateResearchNote = async (id, data, userId) => {
  const existing = await ResearchNote.findById(id);
  if (!existing) throw new Error('Research note not found');

  const updated = await ResearchNote.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  await logAudit({
    action: 'UPDATE',
    entity: 'ResearchNote',
    entityId: id,
    previousValues: existing.toObject(),
    newValues: updated.toObject(),
    userId,
  });
  return updated;
};

export const deleteResearchNote = async (id, userId) => {
  const note = await ResearchNote.findById(id);
  if (!note) throw new Error('Research note not found');

  await ResearchNote.findByIdAndDelete(id);
  await logAudit({
    action: 'DELETE',
    entity: 'ResearchNote',
    entityId: id,
    previousValues: note.toObject(),
    userId,
  });
  return note;
};
