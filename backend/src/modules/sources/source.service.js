import { Source } from './source.model.js';
import { logAudit } from '../audit/audit.service.js';
import { getPagination, formatPaginationMeta } from '../../utils/pagination.js';

export const getSources = async (query = {}) => {
  const { page, limit, skip } = getPagination(query);
  const filter = {};

  if (query.verificationStatus) {
    filter.verificationStatus = query.verificationStatus;
  }
  if (query.documentType) {
    filter.documentType = query.documentType;
  }
  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: 'i' } },
      { institution: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } },
    ];
  }

  const [data, total] = await Promise.all([
    Source.find(filter).sort({ publicationYear: -1, createdAt: -1 }).skip(skip).limit(limit),
    Source.countDocuments(filter),
  ]);

  return {
    data,
    meta: formatPaginationMeta(total, page, limit),
  };
};

export const getSourceById = async (id) => {
  return Source.findById(id);
};

export const createSource = async (data, userId) => {
  const source = await Source.create(data);
  await logAudit({
    action: 'CREATE',
    entity: 'Source',
    entityId: source._id,
    newValues: source.toObject(),
    userId,
  });
  return source;
};

export const updateSource = async (id, data, userId) => {
  const existing = await Source.findById(id);
  if (!existing) throw new Error('Source not found');

  const updated = await Source.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  await logAudit({
    action: 'UPDATE',
    entity: 'Source',
    entityId: id,
    previousValues: existing.toObject(),
    newValues: updated.toObject(),
    userId,
  });
  return updated;
};

export const deleteSource = async (id, userId) => {
  const source = await Source.findById(id);
  if (!source) throw new Error('Source not found');

  await Source.findByIdAndDelete(id);
  await logAudit({
    action: 'DELETE',
    entity: 'Source',
    entityId: id,
    previousValues: source.toObject(),
    userId,
  });
  return source;
};
