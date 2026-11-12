import { FeeRecord } from '../fees/fee.model.js';
import { Programme } from '../programmes/programme.model.js';
import { InflationIndex } from '../inflation/inflation.model.js';
import { Source } from '../sources/source.model.js';
import {
  calculateRealFee,
  calculateNominalGrowth,
  calculateCAGR,
  calculateInflationRate,
  calculateRealFeeGrowth
} from '../../utils/inflationCalculator.js';

export const getOverviewStats = async () => {
  const [
    totalProgrammes,
    totalRecords,
    simulatedRecords,
    verifiedRecords,
    pendingRecords,
    totalSources,
    cpiCount
  ] = await Promise.all([
    Programme.countDocuments({ isActive: true }),
    FeeRecord.countDocuments(),
    FeeRecord.countDocuments({ dataType: 'SIMULATED' }),
    FeeRecord.countDocuments({ verificationStatus: 'VERIFIED' }),
    FeeRecord.countDocuments({ verificationStatus: 'PENDING_REVIEW' }),
    Source.countDocuments(),
    InflationIndex.countDocuments(),
  ]);

  return {
    researchPeriod: '1987–2026 (40 Years)',
    totalProgrammes,
    totalRecords,
    simulatedRecords,
    verifiedRecords,
    pendingRecords,
    unverifiedRecords: totalRecords - verifiedRecords,
    totalSources,
    cpiRecords: cpiCount,
    simulationNotice: 'Data contains illustrative simulated records for demonstration and research methodology testing.',
  };
};

export const getNominalFeesData = async (query = {}) => {
  const feeType = query.feeType || 'Total Annual Fee';
  const startYear = Number(query.startYear) || 1987;
  const endYear = Number(query.endYear) || 2026;

  let progFilter = { isActive: true };
  if (query.programmeIds) {
    const ids = query.programmeIds.split(',').filter(Boolean);
    if (ids.length > 0) progFilter = { _id: { $in: ids } };
  }

  const programmes = await Programme.find(progFilter).sort({ name: 1 });
  const progIds = programmes.map(p => p._id);

  const records = await FeeRecord.find({
    programmeId: { $in: progIds },
    feeType,
    year: { $gte: startYear, $lte: endYear },
  }).sort({ year: 1 });

  // Group by year
  const yearMap = new Map();
  for (let y = startYear; y <= endYear; y++) {
    yearMap.set(y, { year: y });
  }

  records.forEach(r => {
    const row = yearMap.get(r.year);
    if (row) {
      const prog = programmes.find(p => p._id.toString() === r.programmeId.toString());
      if (prog) {
        row[prog.code] = r.amount;
        row[`${prog.code}_type`] = r.dataType;
      }
    }
  });

  return {
    programmes: programmes.map(p => ({ id: p._id, name: p.name, code: p.code })),
    series: Array.from(yearMap.values()),
    feeType,
  };
};

export const getRealFeesData = async (query = {}) => {
  let programme;
  if (query.programmeId) {
    programme = await Programme.findById(query.programmeId);
  } else {
    programme = await Programme.findOne({ isActive: true });
  }

  if (!programme) throw new Error('Programme not found');

  const baseYear = Number(query.baseYear) || 2026;
  const feeType = query.feeType || 'Total Annual Fee';
  const startYear = Number(query.startYear) || 1987;
  const endYear = Number(query.endYear) || 2026;

  // Fetch CPI records
  const cpiRecords = await InflationIndex.find({
    year: { $gte: Math.min(startYear, baseYear), $lte: Math.max(endYear, baseYear) },
  }).sort({ year: 1 });

  const cpiMap = new Map();
  cpiRecords.forEach(c => cpiMap.set(c.year, c));

  const baseCPIObj = cpiMap.get(baseYear);
  const baseCPI = baseCPIObj ? baseCPIObj.cpiValue : (cpiRecords[cpiRecords.length - 1]?.cpiValue || 100);

  // Fetch fee records
  const feeRecords = await FeeRecord.find({
    programmeId: programme._id,
    feeType,
    year: { $gte: startYear, $lte: endYear },
  }).sort({ year: 1 });

  const series = feeRecords.map(r => {
    const histCPIObj = cpiMap.get(r.year);
    const histCPI = histCPIObj ? histCPIObj.cpiValue : 1;
    let realAmount = r.amount;
    try {
      realAmount = calculateRealFee(r.amount, histCPI, baseCPI);
    } catch {
      realAmount = r.amount;
    }

    return {
      year: r.year,
      nominalAmount: r.amount,
      realAmount,
      cpi: histCPI,
      baseCPI,
      dataType: r.dataType,
      cpiDataType: histCPIObj?.dataType || 'SIMULATED',
      isVerified: r.verificationStatus === 'VERIFIED',
    };
  });

  // Calculate CAGR and Growth
  const first = series[0];
  const last = series[series.length - 1];
  const yearsSpan = (last?.year || endYear) - (first?.year || startYear);

  const nominalGrowth = first && last ? calculateNominalGrowth(first.nominalAmount, last.nominalAmount) : 0;
  const nominalCAGR = first && last && yearsSpan > 0 ? calculateCAGR(first.nominalAmount, last.nominalAmount, yearsSpan) : 0;
  const realGrowth = first && last ? calculateRealFeeGrowth(first.realAmount, last.realAmount) : 0;
  const realCAGR = first && last && yearsSpan > 0 ? calculateCAGR(first.realAmount, last.realAmount, yearsSpan) : 0;

  return {
    programme: { id: programme._id, name: programme.name, code: programme.code },
    baseYear,
    baseCPI,
    feeType,
    series,
    metrics: {
      nominalGrowth,
      nominalCAGR,
      realGrowth,
      realCAGR,
      yearsSpan,
    }
  };
};

export const getProgrammeComparisonData = async (query = {}) => {
  let ids = [];
  if (query.programmeIds) {
    ids = query.programmeIds.split(',').filter(Boolean);
  }

  let programmes;
  if (ids.length > 0) {
    programmes = await Programme.find({ _id: { $in: ids } });
  } else {
    // Default to first 4 programmes
    programmes = await Programme.find({ isActive: true }).limit(4);
  }

  const baseYear = Number(query.baseYear) || 2026;
  const feeType = query.feeType || 'Total Annual Fee';
  const startYear = Number(query.startYear) || 1987;
  const endYear = Number(query.endYear) || 2026;

  const progIds = programmes.map(p => p._id);
  const [feeRecords, cpiRecords] = await Promise.all([
    FeeRecord.find({
      programmeId: { $in: progIds },
      feeType,
      year: { $gte: startYear, $lte: endYear },
    }).sort({ year: 1 }),
    InflationIndex.find({
      year: { $gte: Math.min(startYear, baseYear), $lte: Math.max(endYear, baseYear) }
    })
  ]);

  const cpiMap = new Map();
  cpiRecords.forEach(c => cpiMap.set(c.year, c.cpiValue));
  const baseCPI = cpiMap.get(baseYear) || 100;

  // Build comparison summary for each programme
  const comparisons = programmes.map(prog => {
    const pFees = feeRecords.filter(f => f.programmeId.toString() === prog._id.toString());
    const firstFee = pFees[0]?.amount || 0;
    const lastFee = pFees[pFees.length - 1]?.amount || 0;
    const yearsSpan = (pFees[pFees.length - 1]?.year || endYear) - (pFees[0]?.year || startYear);

    const firstCPI = cpiMap.get(pFees[0]?.year || startYear) || 1;
    const lastCPI = cpiMap.get(pFees[pFees.length - 1]?.year || endYear) || baseCPI;

    let firstReal = firstFee;
    let lastReal = lastFee;
    try {
      firstReal = calculateRealFee(firstFee, firstCPI, baseCPI);
      lastReal = calculateRealFee(lastFee, lastCPI, baseCPI);
    } catch {}

    return {
      id: prog._id,
      name: prog.name,
      code: prog.code,
      firstYear: pFees[0]?.year || startYear,
      lastYear: pFees[pFees.length - 1]?.year || endYear,
      firstFee,
      lastFee,
      firstReal,
      lastReal,
      nominalGrowth: calculateNominalGrowth(firstFee, lastFee),
      nominalCAGR: yearsSpan > 0 ? calculateCAGR(firstFee, lastFee, yearsSpan) : 0,
      realGrowth: calculateRealFeeGrowth(firstReal, lastReal),
      realCAGR: yearsSpan > 0 ? calculateCAGR(firstReal, lastReal, yearsSpan) : 0,
    };
  });

  // Yearly timeline data for charts
  const yearMap = new Map();
  for (let y = startYear; y <= endYear; y++) {
    yearMap.set(y, { year: y });
  }

  feeRecords.forEach(r => {
    const row = yearMap.get(r.year);
    if (row) {
      const prog = programmes.find(p => p._id.toString() === r.programmeId.toString());
      if (prog) {
        row[prog.code] = r.amount;
        const histCPI = cpiMap.get(r.year) || 1;
        try {
          row[`${prog.code}_real`] = calculateRealFee(r.amount, histCPI, baseCPI);
        } catch {
          row[`${prog.code}_real`] = r.amount;
        }
      }
    }
  });

  return {
    programmes: comparisons,
    series: Array.from(yearMap.values()),
    baseYear,
    feeType,
  };
};

export const getInflationTrendsData = async (query = {}) => {
  const startYear = Number(query.startYear) || 1987;
  const endYear = Number(query.endYear) || 2026;

  const records = await InflationIndex.find({
    year: { $gte: startYear - 1, $lte: endYear },
  }).sort({ year: 1 });

  const trends = [];
  for (let i = 1; i < records.length; i++) {
    const prev = records[i - 1];
    const curr = records[i];
    if (curr.year >= startYear && curr.year <= endYear) {
      const inflationRate = calculateInflationRate(curr.cpiValue, prev.cpiValue);
      trends.push({
        year: curr.year,
        cpi: curr.cpiValue,
        inflationRate,
        seriesId: curr.seriesId,
        baseYear: curr.baseYear,
        dataType: curr.dataType,
        isVerified: curr.verificationStatus === 'VERIFIED',
      });
    }
  }

  return {
    startYear,
    endYear,
    trends,
  };
};

export const getFeeGrowthData = async (query = {}) => {
  const baseYear = Number(query.baseYear) || 2026;
  const feeType = query.feeType || 'Total Annual Fee';

  const programmes = await Programme.find({ isActive: true });
  const [feeRecords, cpiRecords] = await Promise.all([
    FeeRecord.find({ feeType }).sort({ year: 1 }),
    InflationIndex.find().sort({ year: 1 }),
  ]);

  const cpiMap = new Map();
  cpiRecords.forEach(c => cpiMap.set(c.year, c.cpiValue));
  const baseCPI = cpiMap.get(baseYear) || 100;

  const growthRankings = programmes.map(prog => {
    const pFees = feeRecords.filter(f => f.programmeId.toString() === prog._id.toString());
    if (pFees.length < 2) return null;

    const first = pFees[0];
    const last = pFees[pFees.length - 1];
    const yearsSpan = last.year - first.year;

    const firstCPI = cpiMap.get(first.year) || 1;
    const lastCPI = cpiMap.get(last.year) || baseCPI;

    let firstReal = first.amount;
    let lastReal = last.amount;
    try {
      firstReal = calculateRealFee(first.amount, firstCPI, baseCPI);
      lastReal = calculateRealFee(last.amount, lastCPI, baseCPI);
    } catch {}

    return {
      programmeId: prog._id,
      name: prog.name,
      code: prog.code,
      firstYear: first.year,
      lastYear: last.year,
      initialNominal: first.amount,
      finalNominal: last.amount,
      nominalGrowth: calculateNominalGrowth(first.amount, last.amount),
      nominalCAGR: yearsSpan > 0 ? calculateCAGR(first.amount, last.amount, yearsSpan) : 0,
      initialReal: firstReal,
      finalReal: lastReal,
      realGrowth: calculateRealFeeGrowth(firstReal, lastReal),
      realCAGR: yearsSpan > 0 ? calculateCAGR(firstReal, lastReal, yearsSpan) : 0,
    };
  }).filter(Boolean);

  // Sort by nominal growth descending
  growthRankings.sort((a, b) => b.nominalGrowth - a.nominalGrowth);

  return {
    baseYear,
    feeType,
    rankings: growthRankings,
  };
};

export const getDataQualityReport = async () => {
  const programmes = await Programme.find();
  const allYears = [];
  for (let y = 1987; y <= 2026; y++) allYears.push(y);

  const [fees, cpiList, sources] = await Promise.all([
    FeeRecord.find(),
    InflationIndex.find(),
    Source.find(),
  ]);

  const cpiYearsSet = new Set(cpiList.map(c => c.year));
  const missingCpiYears = allYears.filter(y => !cpiYearsSet.has(y));

  const programmeCoverage = programmes.map(prog => {
    const pFees = fees.filter(f => f.programmeId.toString() === prog._id.toString() && f.feeType === 'Total Annual Fee');
    const existingYears = new Set(pFees.map(f => f.year));
    const missingYears = allYears.filter(y => !existingYears.has(y));
    const verifiedCount = pFees.filter(f => f.verificationStatus === 'VERIFIED').length;
    const simulatedCount = pFees.filter(f => f.dataType === 'SIMULATED').length;

    return {
      programme: prog.name,
      code: prog.code,
      totalExpectedYears: allYears.length,
      availableYears: existingYears.size,
      missingYears,
      verifiedCount,
      simulatedCount,
      coveragePercent: Number(((existingYears.size / allYears.length) * 100).toFixed(1)),
    };
  });

  const totalFeeCount = fees.length;
  const verifiedFeeCount = fees.filter(f => f.verificationStatus === 'VERIFIED').length;
  const simulatedFeeCount = fees.filter(f => f.dataType === 'SIMULATED').length;

  return {
    auditDate: new Date(),
    missingCpiYears,
    totalCpiRecords: cpiList.length,
    totalSources: sources.length,
    feeSummary: {
      totalFeeRecords: totalFeeCount,
      verifiedFeeRecords: verifiedFeeCount,
      simulatedFeeRecords: simulatedFeeCount,
      simulatedPercentage: totalFeeCount > 0 ? Number(((simulatedFeeCount / totalFeeCount) * 100).toFixed(1)) : 0,
    },
    programmeCoverage,
  };
};
