import mongoose from 'mongoose';

const programmeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  degreeLevel: {
    type: String,
    enum: ['Undergraduate', 'Graduate', 'Postgraduate'],
    default: 'Undergraduate',
  },
  description: {
    type: String,
    trim: true,
  },
  firstOfferedYear: {
    type: Number,
    required: true,
    default: 1987,
  },
  lastOfferedYear: {
    type: Number,
    required: true,
    default: 2027,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true,
});

export const Programme = mongoose.model('Programme', programmeSchema);
