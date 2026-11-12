import { Site } from './site.model.js';
import { logAudit } from '../audit/audit.service.js';

export const getAllSites = async () => {
  return Site.find().sort({ name: 1 });
};

export const getSiteById = async (id) => {
  return Site.findById(id);
};

export const createSite = async (data, userId) => {
  const site = await Site.create(data);
  await logAudit({
    action: 'CREATE',
    entity: 'Site',
    entityId: site._id,
    newValues: site.toObject(),
    userId,
  });
  return site;
};

export const updateSite = async (id, data, userId) => {
  const existing = await Site.findById(id);
  if (!existing) throw new Error('Site not found');

  const updated = await Site.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  await logAudit({
    action: 'UPDATE',
    entity: 'Site',
    entityId: id,
    previousValues: existing.toObject(),
    newValues: updated.toObject(),
    userId,
  });
  return updated;
};

export const deleteSite = async (id, userId) => {
  const site = await Site.findById(id);
  if (!site) throw new Error('Site not found');

  await Site.findByIdAndDelete(id);
  await logAudit({
    action: 'DELETE',
    entity: 'Site',
    entityId: id,
    previousValues: site.toObject(),
    userId,
  });
  return site;
};
