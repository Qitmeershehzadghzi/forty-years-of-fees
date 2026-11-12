import { AuditLog } from './audit.model.js';

export const logAudit = async ({ action, entity, entityId, previousValues = null, newValues = null, userId = null, ip = '127.0.0.1' }) => {
  try {
    await AuditLog.create({
      action,
      entity,
      entityId,
      previousValues,
      newValues,
      performedBy: userId,
      ipAddress: ip,
    });
  } catch (err) {
    console.error('[Audit Service Error] Failed to write audit log:', err.message);
  }
};
