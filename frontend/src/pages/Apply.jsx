import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Navbar } from '../components/layout/Navbar';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  ArrowRight,
  Briefcase,
  User,
  Mail,
  Phone,
  MessageSquare,
} from 'lucide-react';

const applicationSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(8, 'Please enter a valid phone number (min 8 digits)'),
  jobId: z.string().min(1, 'Please select a job position'),
  note: z.string().optional(),
});

export const Apply = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedJobId = searchParams.get('jobId') || '';

  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      jobId: preselectedJobId,
      name: '',
      email: '',
      phone: '',
      note: '',
    },
  });

  const selectedJobId = watch('jobId');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await jobService.getActiveJobs();
        setJobs(response.data || []);
        if (preselectedJobId) {
          setValue('jobId', preselectedJobId);
        }
      } catch (err) {
        console.error('Failed to load active jobs:', err);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, [preselectedJobId, setValue]);

  const validateFile = (selectedFile) => {
    if (!selectedFile) {
      setFileError('Resume file is required');
      return false;
    }

    const allowedExtensions = ['pdf', 'doc', 'docx'];
    const ext = selectedFile.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      setFileError('Invalid file type. Only PDF, DOC, and DOCX files are allowed.');
      return false;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > maxSize) {
      setFileError('File size exceeds the 5MB limit. Please upload a smaller file.');
      return false;
    }

    setFileError('');
    return true;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  };

  const onSubmit = async (data) => {
    if (!file) {
      setFileError('Please upload your resume (PDF, DOC, or DOCX up to 5MB).');
      return;
    }

    try {
      setSubmitting(true);
      setServerError('');

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('jobId', data.jobId);
      if (data.note) formData.append('note', data.note);
      formData.append('resume', file);

      const response = await applicationService.submitApplication(formData);

      const chosenJob = jobs.find((j) => j._id === data.jobId);

      // Navigate to success screen
      navigate('/apply/success', {
        state: {
          candidateName: data.name,
          candidateEmail: data.email,
          jobTitle: chosenJob ? chosenJob.title : 'Selected Role',
          applicationId: response.data?.applicationId,
        },
      });
    } catch (err) {
      console.error('Submission error:', err);
      if (err.response?.status === 409) {
        setServerError('You have already applied for this position with this email address.');
      } else {
        setServerError(
          err.response?.data?.message || 'An unexpected error occurred while submitting your application.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-12">
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast-Track Candidate Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Apply for a Position
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Fill in your details, select your target role, and upload your resume for automated screening.
          </p>
        </div>

        {serverError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/50 border border-rose-800/60 flex items-start gap-3 text-sm text-rose-300 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-200">Application Submission Alert</p>
              <p className="mt-0.5 text-xs text-rose-300/90">{serverError}</p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-2xl"
        >
          {/* Job Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Select Target Role <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <select
                {...register('jobId')}
                disabled={loadingJobs}
                className={`w-full px-4 py-3 rounded-xl bg-slate-900 border text-sm text-slate-100 focus:outline-none transition-colors ${
                  errors.jobId
                    ? 'border-rose-500/60 focus:border-rose-500'
                    : 'border-slate-700 focus:border-brand-500'
                }`}
              >
                <option value="">-- Choose an open role --</option>
                {jobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.title} ({job.location} • {job.employmentType})
                  </option>
                ))}
              </select>
            </div>
            {errors.jobId && (
              <p className="text-xs text-rose-400 mt-1.5">{errors.jobId.message}</p>
            )}
          </div>

          {/* Full Name & Phone in 2 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  {...register('name')}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors ${
                    errors.name
                      ? 'border-rose-500/60 focus:border-rose-500'
                      : 'border-slate-700 focus:border-brand-500'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-rose-400 mt-1.5">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Phone Number <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  {...register('phone')}
                  placeholder="e.g. +91 98765 43210"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors ${
                    errors.phone
                      ? 'border-rose-500/60 focus:border-rose-500'
                      : 'border-slate-700 focus:border-brand-500'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-rose-400 mt-1.5">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Email Address <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                {...register('email')}
                placeholder="e.g. rahul@example.com"
                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors ${
                  errors.email
                    ? 'border-rose-500/60 focus:border-rose-500'
                    : 'border-slate-700 focus:border-brand-500'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-400 mt-1.5">{errors.email.message}</p>
            )}
          </div>

          {/* Resume Upload Drag & Drop */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Resume / CV (PDF, DOC, DOCX up to 5MB) <span className="text-rose-400">*</span>
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
            />

            {!file ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-8 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all duration-200 ${
                  isDragOver
                    ? 'border-brand-500 bg-brand-500/10 scale-[1.01]'
                    : fileError
                    ? 'border-rose-500/60 bg-rose-500/5 hover:border-rose-500'
                    : 'border-slate-700 bg-slate-900/40 hover:border-brand-500/60 hover:bg-slate-900/80'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-white">
                  Click to upload or drag and drop your resume
                </p>
                <p className="text-xs text-slate-400 mt-1">PDF, DOC, or DOCX (Max size: 5MB)</p>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900 border border-brand-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-600/20 border border-brand-500/30 text-brand-400 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white truncate max-w-xs">{file.name}</p>
                    <p className="text-[11px] text-slate-400">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for AI screening
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {fileError && <p className="text-xs text-rose-400 mt-1.5">{fileError}</p>}
          </div>

          {/* Brief Note */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Brief Application Note (Optional)
            </label>
            <div className="relative">
              <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <textarea
                {...register('note')}
                rows={3}
                placeholder="Share a short note about your experience, notable projects, or why you're interested in this role..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 resize-y"
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 hover:from-brand-500 hover:to-violet-500 shadow-xl shadow-brand-600/30 transition-all duration-200 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Uploading Resume & Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Application</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
