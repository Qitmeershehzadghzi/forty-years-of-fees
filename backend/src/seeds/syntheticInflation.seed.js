/**
 * Synthetic CPI Inflation Series (1987–2027)
 * Forty Years of Fees — Greenwich University Journey 40
 * Reference series: 2015-16 Base Year (2016 = 100.0)
 * Note: Clearly identified as simulated benchmark data for research testing.
 */

export const generateSyntheticCPI = () => {
  // Realistic historical CPI baseline anchored to PBS 2015-16 base year
  const cpiTable = {
    1987: 10.45,
    1988: 11.38,
    1989: 12.33,
    1990: 13.45,
    1991: 15.15,
    1992: 16.60,
    1993: 18.23,
    1994: 20.48,
    1995: 23.14,
    1996: 25.64,
    1997: 28.56,
    1998: 30.34,
    1999: 32.07,
    2000: 33.48,
    2001: 34.52,
    2002: 35.65,
    2003: 36.75,
    2004: 39.46,
    2005: 43.12,
    2006: 46.53,
    2007: 50.11,
    2008: 60.28, // Global financial crisis & commodity spike
    2009: 68.48,
    2010: 75.40,
    2011: 84.38,
    2012: 92.58,
    2013: 99.43,
    2014: 106.58,
    2015: 109.28,
    2016: 100.00, // Rebased to 2015-16 = 100
    2017: 104.15,
    2018: 108.21,
    2019: 115.54,
    2020: 127.95,
    2021: 139.34,
    2022: 170.21, // Inflation surge post-2021
    2023: 220.42,
    2024: 275.53,
    2025: 325.12,
    2026: 370.64,
    2027: 412.50,
  };

  const records = [];
  for (let year = 1987; year <= 2027; year++) {
    records.push({
      year,
      cpiValue: cpiTable[year] || Number((100 * Math.pow(1.08, year - 2016)).toFixed(2)),
      seriesId: 'PBS-CPI-2015-16',
      baseYear: 2016,
      dataType: 'SIMULATED',
      verificationStatus: 'SIMULATED',
      notes: 'Illustrative simulated CPI series based on PBS historical index benchmarks.',
    });
  }

  return records;
};
