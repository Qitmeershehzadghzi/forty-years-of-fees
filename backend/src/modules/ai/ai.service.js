import { getGeminiClient, GEMINI_MODEL } from '../../config/gemini.js';
import { Programme } from '../programmes/programme.model.js';
import { FeeRecord } from '../fees/fee.model.js';
import { InflationIndex } from '../inflation/inflation.model.js';
import {
  calculateRealFee,
  calculateNominalGrowth,
  calculateCAGR,
  calculateInflationRate,
  calculateRealFeeGrowth
} from '../../utils/inflationCalculator.js';

const SYSTEM_INSTRUCTION = `You are an academic financial research analyst specializing in historical education fees, inflation, purchasing power, and statistical data interpretation for Greenwich University, Karachi, Journey 40 initiative (1987–2026).

You must use only the supplied structured dataset and calculated metrics.
Never invent historical fee values, CPI figures, programme details, sources, or statistical findings.

Always distinguish between:
- Simulated data
- Verified historical data
- Mixed datasets

If data is simulated, explicitly state that conclusions are based on illustrative simulated records and cannot be treated as historical facts about Greenwich University.

Explain statistical patterns in clear academic language.
Never confuse nominal fee growth with real inflation-adjusted fee growth.
When citing figures, use Pakistani Rupees (Rs. or PKR) and state the corresponding year.
Keep responses insightful, professional, and well-structured.`;

/**
 * Helper to call Gemini with a prompt and system instruction.
 */
async function callGemini(promptText) {
  const client = getGeminiClient();
  if (!client) {
    throw new Error('Gemini AI client is not configured. Please ensure GEMINI_API_KEY is set in backend environment.');
  }

  try {
    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: promptText,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2, // Low temperature for high factual consistency
      }
    });

    return response.text;
  } catch (error) {
    console.error('[Gemini Service Error]', error.message);
    throw new Error(`Gemini AI service error: ${error.message}`);
  }
}

/**
 * Natural language chat about the historical fees dataset.
 */
export const answerChatQuestion = async (question) => {
  if (!question || typeof question !== 'string') {
    throw new Error('A question string is required');
  }

  // Fetch contextual summary from database
  const programmes = await Programme.find({ isActive: true }).select('name code');
  const [bbaFees, csFees, cpi1987, cpi2026] = await Promise.all([
    FeeRecord.find({ year: { $in: [1987, 2000, 2010, 2026] }, feeType: 'Total Annual Fee' })
      .populate('programmeId', 'code name'),
    FeeRecord.countDocuments({ dataType: 'SIMULATED' }),
    InflationIndex.findOne({ year: 1987 }),
    InflationIndex.findOne({ year: 2026 }),
  ]);

  const sampleData = bbaFees.map(f => ({
    programme: f.programmeId?.code || 'UNKNOWN',
    year: f.year,
    amount: `PKR ${f.amount.toLocaleString()}`,
    dataType: f.dataType,
  }));

  const prompt = `User question: "${question}"

Current Dataset Context:
- Research Period: 1987 to 2026 (40 years)
- University: Greenwich University, Karachi (Journey 40 initiative)
- Configured Programmes: ${programmes.map(p => `${p.name} (${p.code})`).join(', ')}
- Total simulated fee records in database: 400+ records
- 1987 Simulated CPI: ${cpi1987?.cpiValue || 10.5} (Base year 2016)
- 2026 Simulated CPI: ${cpi2026?.cpiValue || 520.0} (Base year 2016)
- Milestone Sample Records: ${JSON.stringify(sampleData)}

Please answer the user question based strictly on this research context. Ensure you explicitly disclose that simulated data is being referenced where appropriate.`;

  const reply = await callGemini(prompt);
  return {
    question,
    answer: reply,
    dataStatus: 'SIMULATED',
    timestamp: new Date(),
  };
};

/**
 * Structured analysis of a single academic programme over 40 years.
 */
export const analyzeProgramme = async (programmeId, baseYear = 2026) => {
  const programme = await Programme.findById(programmeId);
  if (!programme) throw new Error('Programme not found');

  const [fees, cpiList] = await Promise.all([
    FeeRecord.find({ programmeId, feeType: 'Total Annual Fee' }).sort({ year: 1 }),
    InflationIndex.find().sort({ year: 1 }),
  ]);

  if (fees.length === 0) {
    throw new Error('No fee records found for this programme to analyze');
  }

  const cpiMap = new Map();
  cpiList.forEach(c => cpiMap.set(c.year, c.cpiValue));
  const baseCPI = cpiMap.get(baseYear) || 100;

  const first = fees[0];
  const last = fees[fees.length - 1];
  const yearsSpan = last.year - first.year;

  const firstCPI = cpiMap.get(first.year) || 1;
  const lastCPI = cpiMap.get(last.year) || baseCPI;

  const initialReal = calculateRealFee(first.amount, firstCPI, baseCPI);
  const finalReal = calculateRealFee(last.amount, lastCPI, baseCPI);

  const nominalGrowth = calculateNominalGrowth(first.amount, last.amount);
  const nominalCAGR = calculateCAGR(first.amount, last.amount, yearsSpan);
  const realGrowth = calculateRealFeeGrowth(initialReal, finalReal);
  const realCAGR = calculateCAGR(initialReal, finalReal, yearsSpan);

  const verifiedCount = fees.filter(f => f.verificationStatus === 'VERIFIED').length;
  const dataStatus = verifiedCount === fees.length ? 'VERIFIED' : verifiedCount > 0 ? 'MIXED' : 'SIMULATED';

  // Find steepest single-year nominal jumps
  let maxJumpYear = null;
  let maxJumpPercent = 0;
  for (let i = 1; i < fees.length; i++) {
    const jump = calculateNominalGrowth(fees[i - 1].amount, fees[i].amount);
    if (jump > maxJumpPercent) {
      maxJumpPercent = jump;
      maxJumpYear = fees[i].year;
    }
  }

  const calculatedContext = {
    programme: programme.name,
    code: programme.code,
    degreeLevel: programme.degreeLevel,
    startYear: first.year,
    endYear: last.year,
    initialNominalFee: `Rs. ${first.amount.toLocaleString()}`,
    finalNominalFee: `Rs. ${last.amount.toLocaleString()}`,
    nominalGrowth: `${nominalGrowth}%`,
    nominalCAGR: `${nominalCAGR}%`,
    baseYearForRealFee: baseYear,
    initialRealFeePurchasingPower: `Rs. ${initialReal.toLocaleString()}`,
    finalRealFeePurchasingPower: `Rs. ${finalReal.toLocaleString()}`,
    realGrowth: `${realGrowth}%`,
    realCAGR: `${realCAGR}%`,
    steepestSingleYearGrowth: `${maxJumpPercent}% in year ${maxJumpYear}`,
    dataStatus,
  };

  const prompt = `Generate a structured academic financial analysis for the following programme:
${JSON.stringify(calculatedContext, null, 2)}

Respond with VALID JSON ONLY matching this exact schema:
{
  "title": "${programme.name} (${programme.code}) 40-Year Fee & Inflation Analysis",
  "dataStatus": "${dataStatus}",
  "summary": "Concise 3-4 sentence academic executive summary",
  "keyFindings": [
    {
      "title": "Nominal vs Real Fee Divergence",
      "description": "Explanation of how nominal fees grew compared to purchasing-power real fees",
      "value": "Nominal growth: ${nominalGrowth}%, Real growth: ${realGrowth}%"
    },
    {
      "title": "Annual Growth Rate (CAGR)",
      "description": "Compound annual rate analysis",
      "value": "Nominal CAGR: ${nominalCAGR}%, Real CAGR: ${realCAGR}%"
    },
    {
      "title": "Largest Fee Adjustment",
      "description": "Details regarding the steepest single year jump",
      "value": "${maxJumpPercent}% in year ${maxJumpYear}"
    }
  ],
  "trends": [
    "Observation 1 regarding multi-decade purchasing power",
    "Observation 2 regarding currency depreciation and CPI adjustments",
    "Observation 3 regarding educational investment trajectory"
  ],
  "limitations": [
    "Data status: ${dataStatus}. All synthetic figures must not be represented as actual official Greenwich University historical accounts.",
    "Calculations rely upon base year ${baseYear} CPI benchmark series."
  ],
  "conclusion": "Final rigorous synthesis connecting historical fee patterns to higher education affordability in Karachi."
}`;

  const aiRaw = await callGemini(prompt);
  try {
    const cleaned = aiRaw.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
    const parsed = JSON.parse(cleaned);
    return parsed;
  } catch {
    return {
      title: `${programme.name} Fee Analysis`,
      dataStatus,
      summary: aiRaw,
      keyFindings: [
        { title: 'Nominal Growth', description: 'Total nominal fee increase', value: `${nominalGrowth}%` },
        { title: 'Real Growth', description: 'Inflation-adjusted purchasing-power growth', value: `${realGrowth}%` },
      ],
      trends: ['Analysis produced by Gemini AI'],
      limitations: ['Synthetic dataset used for demonstration'],
      conclusion: 'Review metrics in conjunction with official PBS CPI figures.',
    };
  }
};

/**
 * Structured comparison between multiple programmes.
 */
export const compareProgrammesAI = async (programmeIds, baseYear = 2026) => {
  const programmes = await Programme.find({ _id: { $in: programmeIds } });
  if (programmes.length < 2) throw new Error('At least two programmes are required for comparison');

  const [fees, cpiList] = await Promise.all([
    FeeRecord.find({
      programmeId: { $in: programmeIds },
      feeType: 'Total Annual Fee',
    }).sort({ year: 1 }),
    InflationIndex.find().sort({ year: 1 }),
  ]);

  const cpiMap = new Map();
  cpiList.forEach(c => cpiMap.set(c.year, c.cpiValue));
  const baseCPI = cpiMap.get(baseYear) || 100;

  const comparisonMetrics = programmes.map(p => {
    const pFees = fees.filter(f => f.programmeId.toString() === p._id.toString());
    const first = pFees[0] || { amount: 0, year: 1987 };
    const last = pFees[pFees.length - 1] || { amount: 0, year: 2026 };
    const span = last.year - first.year;

    const firstCPI = cpiMap.get(first.year) || 1;
    const lastCPI = cpiMap.get(last.year) || baseCPI;

    const firstReal = calculateRealFee(first.amount, firstCPI, baseCPI);
    const lastReal = calculateRealFee(last.amount, lastCPI, baseCPI);

    return {
      programme: p.name,
      code: p.code,
      startFee: `Rs. ${first.amount.toLocaleString()} (${first.year})`,
      endFee: `Rs. ${last.amount.toLocaleString()} (${last.year})`,
      nominalCAGR: `${calculateCAGR(first.amount, last.amount, span)}%`,
      realCAGR: `${calculateCAGR(firstReal, lastReal, span)}%`,
      totalNominalGrowth: `${calculateNominalGrowth(first.amount, last.amount)}%`,
      totalRealGrowth: `${calculateRealFeeGrowth(firstReal, lastReal)}%`,
    };
  });

  const prompt = `Compare the following academic programmes over their 40-year fee trajectories:
${JSON.stringify(comparisonMetrics, null, 2)}

Provide a structured JSON comparison report with:
{
  "title": "Cross-Programme 40-Year Comparative Analysis",
  "dataStatus": "SIMULATED",
  "summary": "Executive comparative synthesis",
  "divergenceAnalysis": "Detailed explanation of why certain disciplines experienced faster growth",
  "ranking": [
    { "programme": "code", "nominalGrowth": "X%", "commentary": "brief explanation" }
  ],
  "policyImplications": "Implications for Karachi higher education planning and affordability",
  "limitations": [
    "Underlying data is simulated for research demonstration."
  ]
}`;

  const raw = await callGemini(prompt);
  try {
    const cleaned = raw.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      title: 'Cross-Programme Comparative Analysis',
      dataStatus: 'SIMULATED',
      summary: raw,
      metrics: comparisonMetrics,
    };
  }
};

/**
 * Generates an executive research report for the 40-year initiative.
 */
export const generateExecutiveReport = async () => {
  const [progCount, feeCount, cpiCount] = await Promise.all([
    Programme.countDocuments({ isActive: true }),
    FeeRecord.countDocuments(),
    InflationIndex.countDocuments(),
  ]);

  const prompt = `Prepare an institutional executive research report for Greenwich University Karachi's "Forty Years of Fees: Journey 40 (1987–2026)" research initiative.
Context:
- University: Greenwich University, Karachi
- Initiative: Journey 40
- Historical timeline: 1987 to 2026 (40 calendar years)
- Database: ${progCount} programmes, ${feeCount} fee records, ${cpiCount} CPI index records
- Data Status: Simulated historical demonstration model pending ongoing archival verification

Format the report with:
- Title
- Executive Summary
- Key Decadal Findings (1987-1996, 1997-2006, 2007-2016, 2017-2026)
- Inflation & Purchasing-Power Dynamics
- Educational Philanthropy Context in Karachi (Zakat, Waqf, Christian & Hindu Education Trusts)
- Archival Data Quality Roadmap
- Disclaimer and Research Boundaries`;

  const reportText = await callGemini(prompt);
  return {
    title: 'Journey 40: Forty Years of University Fees — Executive Research Monograph',
    generatedAt: new Date(),
    dataStatus: 'SIMULATED',
    institution: 'Greenwich University, Karachi',
    reportContent: reportText,
  };
};
