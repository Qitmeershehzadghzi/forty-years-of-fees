import { Programme } from './programme.model.js';
import { FeeRecord } from '../fees/fee.model.js';
import { logAudit } from '../audit/audit.service.js';

export const getAllProgrammes = async (filter = {}) => {
  return Programme.find(filter).sort({ name: 1 });
};

export const getProgrammeById = async (id) => {
  return Programme.findById(id);
};

export const createProgramme = async (data, userId) => {
  const programme = await Programme.create(data);
  await logAudit({
    action: 'CREATE',
    entity: 'Programme',
    entityId: programme._id,
    newValues: programme.toObject(),
    userId,
  });
  return programme;
};

export const updateProgramme = async (id, data, userId) => {
  const existing = await Programme.findById(id);
  if (!existing) throw new Error('Programme not found');

  const updated = await Programme.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  await logAudit({
    action: 'UPDATE',
    entity: 'Programme',
    entityId: id,
    previousValues: existing.toObject(),
    newValues: updated.toObject(),
    userId,
  });
  return updated;
};

export const deleteProgramme = async (id, userId) => {
  const programme = await Programme.findById(id);
  if (!programme) throw new Error('Programme not found');

  // Check if fee records exist
  const count = await FeeRecord.countDocuments({ programmeId: id });
  if (count > 0) {
    // Soft deactivate instead of hard delete to protect historical data integrity
    programme.isActive = false;
    await programme.save();
    await logAudit({
      action: 'UPDATE',
      entity: 'Programme',
      entityId: id,
      previousValues: { isActive: true },
      newValues: { isActive: false, notes: 'Deactivated due to existing fee records' },
      userId,
    });
    return { ...programme.toObject(), deactivated: true };
  }

  await Programme.findByIdAndDelete(id);
  await logAudit({
    action: 'DELETE',
    entity: 'Programme',
    entityId: id,
    previousValues: programme.toObject(),
    userId,
  });
  return programme;
};
