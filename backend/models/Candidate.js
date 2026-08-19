import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Candidate name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Candidate email is required'],
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: [true, 'Candidate phone is required'],
      trim: true,
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    resumePublicId: {
      type: String,
      default: '',
    },
    resumeRawText: {
      type: String,
      default: '',
    },
    // Direct MongoDB Atlas cloud storage for PDF/DOCX
    resumeData: {
      type: String, // Stored as Base64 data string
      default: '',
    },
    resumeContentType: {
      type: String,
      default: 'application/pdf',
    },
    resumeFileName: {
      type: String,
      default: 'resume.pdf',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Candidate', candidateSchema);
