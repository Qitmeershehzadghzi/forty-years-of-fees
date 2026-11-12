import { InflationIndex } from './inflation.model.js';
import { logAudit } from '../audit/audit.service.js';
import { parseCSV } from '../../utils/csvParser.js';

export const getInflationIndices = async (query = {}) => {
  const filter = {};
  if (query.seriesId) filter.seriesId = query.seriesId;
  if (query.dataType) filter.dataType = query.dataType;
  if (query.startYear && query.endYear) {
    filter.year = { $gte: Number(query.startYear), $lte: Number(query.endYear) };
  } else if (query.startYear) {
    filter.year = { $gte: Number(query.startYear) };
  } else if (query.endYear) {
    filter.year = { $lte: Number(query.endYear) };
  }

  return InflationIndex.find(filter)
    .populate('sourceId', 'title institution publicationYear')
    .sort({ year: 1 });
};

export const getInflationById = async (id) => {
  return InflationIndex.findById(id).populate('sourceId');
};

export const createInflationIndex = async (data, userId) => {
  const index = await InflationIndex.create(data);
  await logAudit({
    action: 'CREATE',
    entity: 'InflationIndex',
    entityId: index._id,
    newValues: index.toObject(),
    userId,
  });
  return index;
};

export const updateInflationIndex = async (id, data, userId) => {
  const existing = await InflationIndex.findById(id);
  if (!existing) throw new Error('Inflation record not found');

  const updated = await InflationIndex.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  await logAudit({
    action: 'UPDATE',
    entity: 'InflationIndex',
    entityId: id,
    previousValues: existing.toObject(),
    newValues: updated.toObject(),
    userId,
  });
  return updated;
};

export const deleteInflationIndex = async (id, userId) => {
  const existing = await InflationIndex.findById(id);
  if (!existing) throw new Error('Inflation record not found');

  await InflationIndex.findByIdAndDelete(id);
  await logAudit({
    action: 'DELETE',
    entity: 'InflationIndex',
    entityId: id,
    previousValues: existing.toObject(),
    userId,
  });
  return existing;
};

export const importInflationCSV = async (csvContent, userId) => {
  const rows = parseCSV(csvContent);
  const results = {
    imported: 0,
    updated: 0,
    errors: [],
  };

  for (let idx = 0; idx < rows.length; idx++) {
    const row = rows[idx];
    const rowNum = idx + 2;

    const year = Number(row.year || row.Year);
    const cpiValue = Number(row.cpiValue || row.CPI || row.cpi);
    const seriesId = row.seriesId || row.Series || 'PBS-CPI-2015-16';
    const baseYear = Number(row.baseYear || row.BaseYear || 2016);
    const dataType = (row.dataType || 'SIMULATED').toUpperCase();
    const verificationStatus = row.verificationStatus || (dataType === 'VERIFIED' ? 'VERIFIED' : 'SIMULATED');

    if (!year || isNaN(year) || year < 1900 || year > 2100) {
      results.errors.push({ row: rowNum, error: `Invalid year: ${row.year}` });
      continue;
    }

    if (!cpiValue || isNaN(cpiValue) || cpiValue <= 0) {
      results.errors.push({ row: rowNum, error: `Invalid CPI value: ${row.cpiValue}` });
      continue;
    }

    try {
      const existing = await InflationIndex.findOne({ year, seriesId });
      if (existing) {
        // Never silently overwrite verified records with simulated data
        if (existing.dataType === 'VERIFIED' && dataType === 'SIMULATED') {
          results.errors.push({
            row: rowNum,
            error: `Skipped year ${year}: Cannot overwrite verified record with simulated data`,
          });
          continue;
        }

        const prev = existing.toObject();
        existing.cpiValue = cpiValue;
        existing.baseYear = baseYear;
        existing.dataType = dataType;
        existing.verificationStatus = verificationStatus;
        await existing.save();

        await logAudit({
          action: 'UPDATE',
          entity: 'InflationIndex',
          entityId: existing._id,
          previousValues: prev,
          newValues: existing.toObject(),
          userId,
        });
        results.updated++;
      } else {
        const created = await InflationIndex.create({
          year,
          cpiValue,
          seriesId,
          baseYear,
          dataType,
          verificationStatus,
        });

        await logAudit({
          action: 'IMPORT',
          entity: 'InflationIndex',
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
