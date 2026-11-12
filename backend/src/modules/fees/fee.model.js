import mongoose from 'mongoose';

const feeRecordSchema = new mongoose.Schema({
  programmeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Programme',
    required: true,
    index: true,
  },
  siteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Site',
    required: true,
    index: true,
  },
  year: {
    type: Number,
    required: true,
    index: true,
  },
  feeType: {
    type: String,
    required: true,
    enum: [
      'Admission Fee',
      'Tuition Fee',
      'Examination Fee',
      'Registration Fee',
      'Other Charges',
      'Total Annual Fee'
    ],
    default: 'Total Annual Fee',
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'PKR',
    uppercase: true,
  },
  dataType: {
    type: String,
    enum: ['SIMULATED', 'VERIFIED'],
    default: 'SIMULATED',
    required: true,
  },
  verificationStatus: {
    type: String,
    enum: ['SIMULATED', 'UNVERIFIED', 'PENDING_REVIEW', 'VERIFIED', 'REJECTED'],
    default: 'SIMULATED',
  },
  sourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Source',
    default: null,
  },
  notes: {
    type: String,
    default: 'Illustrative simulated historical fee.',
  }
}, {
  timestamps: true,
});

// Prevent duplicate fee entries for the same programme, site, year, and fee type
feeRecordSchema.index(
  { programmeId: 1, siteId: 1, year: 1, feeType: 1 },
  { unique: true }
);

export const FeeRecord = mongoose.model('FeeRecord', feeRecordSchema);
