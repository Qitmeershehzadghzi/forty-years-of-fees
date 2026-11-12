/**
 * Financial and Inflation Calculation Engine
 * Forty Years of Fees — Greenwich University Journey 40
 */

/**
 * Calculates the purchasing-power equivalent (real fee) of a historical fee in terms of base-year currency.
 * Formula: Real Fee = Historical Fee * (Base Year CPI / Historical CPI)
 */
export const calculateRealFee = (historicalFee, historicalCPI, baseYearCPI) => {
  if (
    typeof historicalFee !== 'number' ||
    typeof historicalCPI !== 'number' ||
    typeof baseYearCPI !== 'number' ||
    isNaN(historicalFee) ||
    isNaN(historicalCPI) ||
    isNaN(baseYearCPI)
  ) {
    throw new Error('Invalid inflation calculation inputs: all inputs must be numbers');
  }

  if (historicalFee < 0 || historicalCPI <= 0 || baseYearCPI <= 0) {
    throw new Error('Invalid inflation calculation inputs: fee cannot be negative, CPI must be strictly positive');
  }

  const realFee = historicalFee * (baseYearCPI / historicalCPI);
  return Math.round(realFee);
};

/**
 * Calculates percentage nominal growth between two points.
 * Formula: ((Final Fee - Initial Fee) / Initial Fee) * 100
 */
export const calculateNominalGrowth = (initialFee, finalFee) => {
  if (typeof initialFee !== 'number' || typeof finalFee !== 'number' || initialFee <= 0) {
    return 0;
  }
  const growth = ((finalFee - initialFee) / initialFee) * 100;
  return Number(growth.toFixed(2));
};

/**
 * Calculates Compound Annual Growth Rate (CAGR).
 * Formula: ((Final Fee / Initial Fee) ^ (1 / Number of Years) - 1) * 100
 */
export const calculateCAGR = (initialFee, finalFee, years) => {
  if (
    typeof initialFee !== 'number' ||
    typeof finalFee !== 'number' ||
    typeof years !== 'number' ||
    initialFee <= 0 ||
    finalFee <= 0 ||
    years <= 0
  ) {
    return 0;
  }
  const cagr = (Math.pow(finalFee / initialFee, 1 / years) - 1) * 100;
  return Number(cagr.toFixed(2));
};

/**
 * Calculates annual inflation rate from two consecutive CPI readings.
 * Formula: ((Current CPI - Previous CPI) / Previous CPI) * 100
 */
export const calculateInflationRate = (currentCPI, previousCPI) => {
  if (typeof currentCPI !== 'number' || typeof previousCPI !== 'number' || previousCPI <= 0) {
    return 0;
  }
  const rate = ((currentCPI - previousCPI) / previousCPI) * 100;
  return Number(rate.toFixed(2));
};

/**
 * Calculates growth in real (inflation-adjusted) purchasing-power terms.
 */
export const calculateRealFeeGrowth = (initialRealFee, finalRealFee) => {
  if (typeof initialRealFee !== 'number' || typeof finalRealFee !== 'number' || initialRealFee <= 0) {
    return 0;
  }
  const growth = ((finalRealFee - initialRealFee) / initialRealFee) * 100;
  return Number(growth.toFixed(2));
};
