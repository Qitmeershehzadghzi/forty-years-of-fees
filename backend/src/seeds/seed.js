import { connectDB, disconnectDB } from '../config/db.js';
import { config } from '../config/env.js';
import { Site } from '../modules/sites/site.model.js';
import { User } from '../modules/users/user.model.js';
import { Programme } from '../modules/programmes/programme.model.js';
import { InflationIndex } from '../modules/inflation/inflation.model.js';
import { FeeRecord } from '../modules/fees/fee.model.js';
import { Source } from '../modules/sources/source.model.js';
import { ResearchNote } from '../modules/research/research.model.js';

import { INITIAL_PROGRAMMES } from './programme.seed.js';
import { generateSyntheticCPI } from './syntheticInflation.seed.js';
import { generateSyntheticFees } from './syntheticFees.seed.js';
import { INITIAL_SOURCES, INITIAL_RESEARCH_NOTES } from './sources.seed.js';

import bcrypt from 'bcryptjs';

export async function runSeed() {
  if (!config.admin.email || !config.admin.password) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env before seeding the administrator.');
  }

  console.log('----------------------------------------------------');
  console.log(' Starting Forty Years of Fees Fast Idempotent Seed');
  console.log(' Greenwich University Karachi (Journey 40: 1987–2027)');
  console.log('----------------------------------------------------');

  await connectDB();

  // 1. Primary Site
  let site = await Site.findOne({ name: 'Clifton Block 1' });
  if (!site) {
    site = await Site.create({
      name: 'Clifton Block 1',
      address: 'DK-10, 38th Street, Darakshan, Phase VI, DHA / Clifton Block 1, Karachi',
      description: 'Greenwich University Main Campus — Karachi Coastal Educational Hub',
      isActive: true,
    });
    console.log('[Seed] Created default site: Clifton Block 1');
  } else {
    console.log('[Seed] Site Clifton Block 1 exists');
  }

  // 2. Super Admin User
  const adminEmail = config.admin.email.toLowerCase();
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(config.admin.password, salt);
    admin = await User.create({
      name: config.admin.name || 'Super Administrator',
      email: adminEmail,
      passwordHash,
      role: 'SUPER_ADMIN',
      isActive: true,
    });
    console.log(`[Seed] Created Super Admin account: ${adminEmail}`);
  } else {
    console.log(`[Seed] Super Admin account exists: ${adminEmail}`);
  }

  // 3. Programmes
  console.log('[Seed] Upserting 10 academic programmes...');
  const activeProgrammes = [];
  for (const progData of INITIAL_PROGRAMMES) {
    const existing = await Programme.findOneAndUpdate(
      { code: progData.code },
      {
        name: progData.name,
        code: progData.code,
        degreeLevel: progData.degreeLevel,
        description: progData.description,
        firstOfferedYear: progData.firstOfferedYear,
        lastOfferedYear: progData.lastOfferedYear,
        isActive: progData.isActive,
      },
      { upsert: true, new: true }
    );
    activeProgrammes.push({ ...progData, _id: existing._id });
  }
  console.log(`[Seed] Configured ${activeProgrammes.length} programmes successfully.`);

  // 4. Sources
  console.log('[Seed] Upserting reference sources...');
  const createdSources = [];
  for (const src of INITIAL_SOURCES) {
    let source = await Source.findOne({ title: src.title });
    if (!source) {
      source = await Source.create(src);
    }
    createdSources.push(source);
  }
  const defaultSourceId = createdSources[0]?._id;

  // 5. CPI Inflation Data (1987-2027) via bulkWrite
  console.log('[Seed] Bulk upserting 41-year CPI series (1987–2027)...');
  const cpiRecords = generateSyntheticCPI();
  const cpiOps = cpiRecords.map(cpi => ({
    updateOne: {
      filter: { year: cpi.year, seriesId: cpi.seriesId },
      update: { $setOnInsert: { ...cpi, sourceId: defaultSourceId } },
      upsert: true,
    }
  }));
  await InflationIndex.bulkWrite(cpiOps);
  console.log('[Seed] 41-year CPI series verified.');

  // 6. 41 Years of Fee Records for each programme via bulkWrite
  console.log('[Seed] Generating synthetic 41-year fee records for all programmes...');
  const feeBatch = generateSyntheticFees(activeProgrammes, site._id);
  // Refresh only generated records for the configured programmes; verified archive rows are preserved.
  await FeeRecord.deleteMany({
    dataType: 'SIMULATED',
    programmeId: { $in: activeProgrammes.map(programme => programme._id) },
  });
  const feeOps = feeBatch.map(item => ({
    updateOne: {
      filter: {
        programmeId: item.programmeId,
        siteId: item.siteId,
        year: item.year,
        feeType: item.feeType,
      },
      update: {
        $setOnInsert: {
          ...item,
          sourceId: createdSources[1]?._id || defaultSourceId,
        }
      },
      upsert: true,
    }
  }));

  console.log(`[Seed] Executing bulkWrite for ${feeOps.length} fee records...`);
  // Split into batches of 500 for fast network transfer
  const batchSize = 500;
  for (let i = 0; i < feeOps.length; i += batchSize) {
    const chunk = feeOps.slice(i, i + batchSize);
    await FeeRecord.bulkWrite(chunk);
  }
  console.log('[Seed] Fee records bulk upsert complete.');

  // 7. Research Notes (Zakat, Waqf, Church Trusts, Temple Trusts)
  console.log('[Seed] Upserting educational funding research monographs...');
  for (const note of INITIAL_RESEARCH_NOTES) {
    const exists = await ResearchNote.findOne({ title: note.title });
    if (!exists) {
      await ResearchNote.create({
        ...note,
        sourceIds: createdSources.map(s => s._id),
        createdBy: admin._id,
      });
    }
  }

  // Count summaries
  const totalFees = await FeeRecord.countDocuments();
  const totalAnnualTuitions = await FeeRecord.countDocuments({ feeType: 'Total Annual Fee' });
  const totalCPI = await InflationIndex.countDocuments();

  console.log('----------------------------------------------------');
  console.log(' Database Seeding Completed Successfully!');
  console.log(` Total Annual Tuition Records: ${totalAnnualTuitions} (41 years × 10 programmes = 410)`);
  console.log(` Total Component Fee Records: ${totalFees}`);
  console.log(` Total CPI Inflation Records: ${totalCPI} (1987–2027)`);
  console.log(` Initial Admin: ${adminEmail}`);
  console.log('----------------------------------------------------');
}

// Auto-run if executed directly
if (process.argv[1]?.endsWith('seed.js')) {
  runSeed()
    .then(async () => {
      await disconnectDB();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('[Seed Error]', err);
      await disconnectDB();
      process.exit(1);
    });
}
