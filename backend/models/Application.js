import mongoose from 'mongoose';

export const VALID_STAGES = [
  'Applied',
  'Reject',
  'R1',
  'R1 Reject',
  'R2',
  'R2 Reject',
  'R3',
  'R3 Reject',
  'Approved',
];

const stageHistorySchema = new mongoose.Schema(
  {
    from: {
      type: String,
      default: null,
    },
    to: {
      type: String,
      required: true,
      enum: VALID_STAGES,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    reason: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const interviewNoteSchema = new mongoose.Schema(
  {
    stage: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    notes: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const aiAnalysisSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    summary: {
      type: String,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    matchedSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    strengths: {
      type: [String],
      default: [],
    },
    gaps: {
      type: [String],
      default: [],
    },
    evaluatedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true,
      index: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    note: {
      type: String,
      default: '',
      trim: true,
    },
    stage: {
      type: String,
      enum: VALID_STAGES,
      default: 'Applied',
      index: true,
    },
    stageHistory: {
      type: [stageHistorySchema],
      default: () => [
        {
          from: null,
          to: 'Applied',
          changedAt: new Date(),
          reason: 'Initial application submitted',
        },
      ],
    },
    aiAnalysis: {
      type: aiAnalysisSchema,
      default: () => ({
        status: 'pending',
        matchScore: null,
        summary: '',
        skills: [],
        matchedSkills: [],
        missingSkills: [],
        strengths: [],
        gaps: [],
        evaluatedAt: null,
      }),
    },
    interviewNotes: {
      type: [interviewNoteSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate application from same candidate to the same job
applicationSchema.index({ candidateId: 1, jobId: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);
