/**
 * Synthetic Historical Fee Generator (1987–2026)
 * Forty Years of Fees — Greenwich University Journey 40
 * Produces 40 annual fee records for each of the 10 configured programmes (400 records total),
 * along with realistic component breakdowns.
 */

// Simple deterministic pseudo-random generator based on seed
function pseudoRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const generateSyntheticFees = (programmes, siteId) => {
  const allFeeRecords = [];

  programmes.forEach((prog, pIndex) => {
    let currentTotal = prog.startingFee;

    for (let year = 1987; year <= 2026; year++) {
      const yearOffset = year - 1987;
      
      if (yearOffset > 0) {
        // Deterministic annual adjustment: baseline growth + seeded variation
        const variation = (pseudoRandom(pIndex * 100 + yearOffset) - 0.5) * 0.04; // +/- 2%
        // Higher inflation periods in 1993-1996 and 2022-2024
        let macroMultiplier = 1.0;
        if (year >= 1993 && year <= 1996) macroMultiplier = 1.15;
        if (year >= 2008 && year <= 2010) macroMultiplier = 1.12;
        if (year >= 2022 && year <= 2024) macroMultiplier = 1.22;
        if (year >= 2001 && year <= 2004) macroMultiplier = 0.92; // Slower growth era

        const annualRate = (prog.baseGrowthRate + variation) * macroMultiplier;
        currentTotal = currentTotal * (1 + annualRate);
      }

      // Round to nearest 500 PKR for neat institutional fee figures
      const roundedTotal = Math.round(currentTotal / 500) * 500;

      // Realistic component breakdown
      const tuitionFee = Math.round((roundedTotal * 0.70) / 100) * 100;
      const admissionFee = Math.round((roundedTotal * 0.12) / 100) * 100;
      const examinationFee = Math.round((roundedTotal * 0.08) / 100) * 100;
      const registrationFee = Math.round((roundedTotal * 0.05) / 100) * 100;
      const otherCharges = roundedTotal - (tuitionFee + admissionFee + examinationFee + registrationFee);

      const feeItems = [
        { feeType: 'Total Annual Fee', amount: roundedTotal },
        { feeType: 'Tuition Fee', amount: tuitionFee },
        { feeType: 'Admission Fee', amount: admissionFee },
        { feeType: 'Examination Fee', amount: examinationFee },
        { feeType: 'Registration Fee', amount: registrationFee },
        { feeType: 'Other Charges', amount: Math.max(0, otherCharges) },
      ];

      feeItems.forEach(item => {
        allFeeRecords.push({
          programmeId: prog._id,
          siteId,
          year,
          feeType: item.feeType,
          amount: item.amount,
          currency: 'PKR',
          dataType: 'SIMULATED',
          verificationStatus: 'SIMULATED',
          notes: 'Illustrative simulated historical fee for Greenwich University Journey 40 research initiative.',
        });
      });
    }
  });

  return allFeeRecords;
};
