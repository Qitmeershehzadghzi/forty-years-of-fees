import mongoose from 'mongoose';

const researchNoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Zakat',
      'Waqf',
      'Church Education Trusts',
      'Temple Education Trusts',
      'Institutional Policy',
      'Economic Impact'
    ],
    default: 'Institutional Policy',
  },
  sourceIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Source',
  }],
  status: {
    type: String,
    enum: ['DRAFT', 'REVIEW', 'PUBLISHED'],
    default: 'DRAFT',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  }
}, {
  timestamps: true,
});

export const ResearchNote = mongoose.model('ResearchNote', researchNoteSchema);
