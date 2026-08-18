import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      required: [true, 'Job location is required'],
      default: 'Remote',
      trim: true,
    },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
      default: 'Full-time',
    },
    status: {
      type: String,
      enum: ['Active', 'Closed'],
      default: 'Active',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Job', jobSchema);
