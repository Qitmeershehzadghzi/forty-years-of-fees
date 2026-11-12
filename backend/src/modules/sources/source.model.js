import mongoose from 'mongoose';

const sourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  institution: {
    type: String,
    required: true,
    trim: true,
  },
  publicationYear: {
    type: Number,
    required: true,
  },
  documentType: {
    type: String,
    enum: ['Prospectus', 'Official Gazette', 'PBS Statistical Bulletin', 'Financial Report', 'Academic Council Minute', 'Charitable Trust Record', 'Simulated Benchmark Model'],
    default: 'Prospectus',
  },
  documentUrl: {
    type: String,
    trim: true,
  },
  pageNumber: {
    type: Number,
  },
  description: {
    type: String,
    trim: true,
  },
  verificationStatus: {
    type: String,
    enum: ['SIMULATED', 'UNVERIFIED', 'PENDING_REVIEW', 'VERIFIED', 'REJECTED'],
    default: 'SIMULATED',
  }
}, {
  timestamps: true,
});

export const Source = mongoose.model('Source', sourceSchema);
