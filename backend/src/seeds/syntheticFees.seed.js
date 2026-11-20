/**
 * Synthetic Historical Fee Generator (1987–2027)
 * Forty Years of Fees — Greenwich University Journey 40
 * Produces illustrative (not archival) annual fee records for the configured programmes.
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

    for (let year = 1987; year <= 2027; year++) {
      const yearOffset = year - 1987;
      
      if (yearOffset > 0) {
        // Distinct programme-level growth plus shared economic cycles and deterministic noise.
        const variation = (pseudoRandom(pIndex * 100 + yearOffset) - 0.5) * 0.035;
        let annualRate = prog.baseGrowthRate + variation;
        if (year >= 1993 && year <= 1996) annualRate += 0.035;
        if (year >= 2008 && year <= 2010) annualRate += 0.025;
        if (year >= 2001 && year <= 2004) annualRate -= 0.025;
        if (year >= 2022 && year <= 2024) annualRate += 0.055;
        annualRate = Math.max(0.035, annualRate);
        currentTotal = currentTotal * (1 + annualRate);
      }

      // Programme-specific fee schedules do not share one tuition/component mix.
      const roundedTotal = Math.max(500, Math.round(currentTotal / 250) * 250);
      const mix = prog.feeMix || { tuition: 0.72, admission: 0.10, examination: 0.09, registration: 0.04 };

      // Illustrative component breakdown using this programme's own scenario mix.
      const tuitionFee = Math.round((roundedTotal * mix.tuition) / 50) * 50;
      const admissionFee = Math.round((roundedTotal * mix.admission) / 50) * 50;
      const examinationFee = Math.round((roundedTotal * mix.examination) / 50) * 50;
      const registrationFee = Math.round((roundedTotal * mix.registration) / 50) * 50;
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
          notes: `Synthetic estimate for ${prog.code}, generated from its programme-specific baseline and growth profile. Not an archival or published Greenwich University fee.`,
        });
      });
    }
  });

  return allFeeRecords;
};
