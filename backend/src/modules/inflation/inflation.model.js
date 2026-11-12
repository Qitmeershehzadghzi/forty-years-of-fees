import mongoose from 'mongoose';

const inflationIndexSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
    index: true,
  },
  cpiValue: {
    type: Number,
    required: true,
    min: 0.01,
  },
  seriesId: {
    type: String,
    required: true,
    default: 'PBS-CPI-2015-16',
    trim: true,
  },
  baseYear: {
    type: Number,
    required: true,
    default: 2016,
  },
  dataType: {
    type: String,
    enum: ['SIMULATED', 'VERIFIED'],
    default: 'SIMULATED',
  },
  sourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Source',
    default: null,
  },
  verificationStatus: {
    type: String,
    enum: ['SIMULATED', 'UNVERIFIED', 'PENDING_REVIEW', 'VERIFIED', 'REJECTED'],
    default: 'SIMULATED',
  }
}, {
  timestamps: true,
});

inflationIndexSchema.index({ year: 1, seriesId: 1 }, { unique: true });

export const InflationIndex = mongoose.model('InflationIndex', inflationIndexSchema);
