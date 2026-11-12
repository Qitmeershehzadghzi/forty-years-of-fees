import { FeeRecord } from './fee.model.js';
import { Programme } from '../programmes/programme.model.js';
import { Site } from '../sites/site.model.js';
import { logAudit } from '../audit/audit.service.js';
import { getPagination, formatPaginationMeta } from '../../utils/pagination.js';
import { parseCSV, exportToCSV } from '../../utils/csvParser.js';

export const getFees = async (query = {}) => {
  const { page, limit, skip } = getPagination(query);
  const filter = {};

  if (query.programmeId) filter.programmeId = query.programmeId;
  if (query.siteId) filter.siteId = query.siteId;
  if (query.feeType) filter.feeType = query.feeType;
  if (query.dataType) filter.dataType = query.dataType;
  if (query.verificationStatus) filter.verificationStatus = query.verificationStatus;

  if (query.year) {
    filter.year = Number(query.year);
  } else if (query.startYear && query.endYear) {
    filter.year = { $gte: Number(query.startYear), $lte: Number(query.endYear) };
  } else if (query.startYear) {
    filter.year = { $gte: Number(query.startYear) };
  } else if (query.endYear) {
    filter.year = { $lte: Number(query.endYear) };
  }

  const [data, total] = await Promise.all([
    FeeRecord.find(filter)
      .populate('programmeId', 'name code degreeLevel')
      .populate('siteId', 'name address')
      .populate('sourceId', 'title institution')
      .sort({ year: -1, feeType: 1 })
      .skip(skip)
      .limit(limit),
    FeeRecord.countDocuments(filter),
  ]);

  return {
    data,
    meta: formatPaginationMeta(total, page, limit),
  };
};

export const getFeeById = async (id) => {
  return FeeRecord.findById(id)
    .populate('programmeId')
    .populate('siteId')
    .populate('sourceId');
};

export const createFee = async (data, userId) => {
  const fee = await FeeRecord.create(data);
  await logAudit({
    action: 'CREATE',
    entity: 'FeeRecord',
    entityId: fee._id,
    newValues: fee.toObject(),
    userId,
  });
  return fee;
};

export const updateFee = async (id, data, userId) => {
  const existing = await FeeRecord.findById(id);
  if (!existing) throw new Error('Fee record not found');

  const updated = await FeeRecord.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  await logAudit({
    action: 'UPDATE',
    entity: 'FeeRecord',
    entityId: id,
    previousValues: existing.toObject(),
    newValues: updated.toObject(),
    userId,
  });
  return updated;
};

export const deleteFee = async (id, userId) => {
  const existing = await FeeRecord.findById(id);
  if (!existing) throw new Error('Fee record not found');

  await FeeRecord.findByIdAndDelete(id);
  await logAudit({
    action: 'DELETE',
    entity: 'FeeRecord',
    entityId: id,
    previousValues: existing.toObject(),
    userId,
  });
  return existing;
};

export const getProgrammeHistory = async (programmeId, query = {}) => {
  const filter = { programmeId };
  if (query.siteId) filter.siteId = query.siteId;
  if (query.feeType) {
    filter.feeType = query.feeType;
  } else {
    filter.feeType = 'Total Annual Fee';
  }
  if (query.startYear && query.endYear) {
    filter.year = { $gte: Number(query.startYear), $lte: Number(query.endYear) };
  }

  return FeeRecord.find(filter)
    .populate('programmeId', 'name code degreeLevel')
    .populate('siteId', 'name')
    .sort({ year: 1 });
};

export const importFeesCSV = async (csvContent, userId) => {
  const rows = parseCSV(csvContent);
  const results = {
    imported: 0,
    updated: 0,
    errors: [],
  };

  // Cache programme and site lookups
  const programmes = await Programme.find();
  const sites = await Site.find();

  const progMap = new Map();
  programmes.forEach(p => {
    progMap.set(p.code.toUpperCase(), p._id);
    progMap.set(p.name.toLowerCase(), p._id);
  });

  const siteMap = new Map();
  sites.forEach(s => {
    siteMap.set(s.name.toLowerCase(), s._id);
  });
  const defaultSiteId = sites[0]?._id;

  for (let idx = 0; idx < rows.length; idx++) {
    const row = rows[idx];
    const rowNum = idx + 2;

    const progIdentifier = (row.programmeCode || row.ProgrammeCode || row.programme || row.Programme || '').trim();
    const programmeId = progMap.get(progIdentifier.toUpperCase()) || progMap.get(progIdentifier.toLowerCase());

    if (!programmeId) {
      results.errors.push({ row: rowNum, error: `Unrecognized programme: "${progIdentifier}"` });
      continue;
    }

    const siteName = (row.site || row.Site || '').trim().toLowerCase();
    const siteId = siteMap.get(siteName) || defaultSiteId;

    if (!siteId) {
      results.errors.push({ row: rowNum, error: 'No valid site available' });
      continue;
    }

    const year = Number(row.year || row.Year);
    const amount = Number(row.amount || row.Amount);
    const feeType = (row.feeType || row.FeeType || 'Total Annual Fee').trim();
    const dataType = (row.dataType || row.DataType || 'SIMULATED').toUpperCase();
    const verificationStatus = row.verificationStatus || (dataType === 'VERIFIED' ? 'VERIFIED' : 'SIMULATED');
    const notes = row.notes || row.Notes || 'Imported via CSV';

    if (!year || isNaN(year) || year < 1900 || year > 2100) {
      results.errors.push({ row: rowNum, error: `Invalid year: ${row.year}` });
      continue;
    }

    if (isNaN(amount) || amount < 0) {
      results.errors.push({ row: rowNum, error: `Invalid amount: ${row.amount}` });
      continue;
    }

    try {
      const existing = await FeeRecord.findOne({ programmeId, siteId, year, feeType });
      if (existing) {
        // Never silently overwrite verified records with simulated data
        if (existing.dataType === 'VERIFIED' && dataType === 'SIMULATED') {
          results.errors.push({
            row: rowNum,
            error: `Skipped ${progIdentifier} (${year}): Cannot overwrite verified record with simulated data`,
          });
          continue;
        }

        const prev = existing.toObject();
        existing.amount = amount;
        existing.dataType = dataType;
        existing.verificationStatus = verificationStatus;
        existing.notes = notes;
        await existing.save();

        await logAudit({
          action: 'UPDATE',
          entity: 'FeeRecord',
          entityId: existing._id,
          previousValues: prev,
          newValues: existing.toObject(),
          userId,
        });
        results.updated++;
      } else {
        const created = await FeeRecord.create({
          programmeId,
          siteId,
          year,
          feeType,
          amount,
          currency: 'PKR',
          dataType,
          verificationStatus,
          notes,
        });

        await logAudit({
          action: 'IMPORT',
          entity: 'FeeRecord',
          entityId: created._id,
          newValues: created.toObject(),
          userId,
        });
        results.imported++;
      }
    } catch (err) {
      results.errors.push({ row: rowNum, error: err.message });
    }
  }

  return results;
};

export const exportFees = async (query = {}) => {
  const filter = {};
  if (query.programmeId) filter.programmeId = query.programmeId;
  if (query.siteId) filter.siteId = query.siteId;
  if (query.feeType) filter.feeType = query.feeType;
  if (query.dataType) filter.dataType = query.dataType;
  if (query.startYear && query.endYear) {
    filter.year = { $gte: Number(query.startYear), $lte: Number(query.endYear) };
  }

  const records = await FeeRecord.find(filter)
    .populate('programmeId', 'name code')
    .populate('siteId', 'name')
    .sort({ year: 1, 'programmeId.code': 1 });

  const headers = ['ProgrammeCode', 'ProgrammeName', 'Site', 'Year', 'FeeType', 'Amount', 'Currency', 'DataType', 'VerificationStatus', 'Notes'];
  const formatted = records.map(r => ({
    ProgrammeCode: r.programmeId?.code || '',
    ProgrammeName: r.programmeId?.name || '',
    Site: r.siteId?.name || '',
    Year: r.year,
    FeeType: r.feeType,
    Amount: r.amount,
    Currency: r.currency,
    DataType: r.dataType,
    VerificationStatus: r.verificationStatus,
    Notes: r.notes || '',
  }));

  return exportToCSV(headers, formatted, headers);
};
