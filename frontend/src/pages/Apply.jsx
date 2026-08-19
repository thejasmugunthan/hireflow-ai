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
  AlertCircle,
  X,
  Sparkles,
  ArrowRight,
  Briefcase,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
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

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await jobService.getActiveJobs();
        setJobs(response.data || []);
        if (preselectedJobId) setValue('jobId', preselectedJobId);
      } catch (err) {
        console.error('Failed to load active jobs:', err);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, [preselectedJobId, setValue]);

  const validateFile = (f) => {
    if (!f) { setFileError('Resume file is required'); return false; }
    const ext = f.name.split('.').pop().toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext)) {
      setFileError('Invalid file type. Only PDF, DOC, and DOCX are allowed.');
      return false;
    }
    if (f.size > 5 * 1024 * 1024) {
      setFileError('File size exceeds 5MB. Please upload a smaller file.');
      return false;
    }
    setFileError('');
    return true;
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f && validateFile(f)) setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && validateFile(f)) setFile(f);
  };

  const onSubmit = async (data) => {
    if (!file) { setFileError('Please upload your resume (PDF, DOC, or DOCX up to 5MB).'); return; }
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
        setServerError(err.response?.data?.message || 'An error occurred while submitting your application.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-linkedin-bg">
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 sm:py-12">
        {/* Page Header */}
        <div className="text-center mb-8 space-y-2 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold" style={{ background: '#EAF4FF', color: '#0A66C2' }}>
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Fast-Track Application
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-linkedin-text tracking-tight">
            Apply for a Position
          </h1>
          <p className="text-sm text-linkedin-muted max-w-md mx-auto">
            Fill in your details, pick your role, and upload your resume for instant AI screening.
          </p>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-sm text-rose-600 animate-fade-in-up">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Submission Error</p>
              <p className="mt-0.5 text-xs">{serverError}</p>
            </div>
          </div>
        )}

        {/* Form Card */}
        <form onSubmit={handleSubmit(onSubmit)} className="hf-card p-6 sm:p-8 space-y-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>

          {/* Job Selection */}
          <div>
            <label className="block text-sm font-semibold text-linkedin-text mb-1.5">
              Select Position <span className="text-rose-500">*</span>
            </label>
            <select
              {...register('jobId')}
              disabled={loadingJobs}
              className={`hf-select text-sm ${errors.jobId ? 'error' : ''}`}
            >
              <option value="">— Choose an open role —</option>
              {jobs.map((job) => (
                <option key={job._id} value={job._id}>
                  {job.title} ({job.location} · {job.employmentType})
                </option>
              ))}
            </select>
            {errors.jobId && <p className="text-xs text-rose-500 mt-1.5">{errors.jobId.message}</p>}
          </div>

          {/* Name + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-linkedin-text mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-linkedin-muted" />
                <input
                  type="text"
                  {...register('name')}
                  placeholder="e.g. Rahul Sharma"
                  className={`hf-input ${errors.name ? 'error' : ''}`}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
              {errors.name && <p className="text-xs text-rose-500 mt-1.5">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-linkedin-text mb-1.5">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-linkedin-muted" />
                <input
                  type="tel"
                  {...register('phone')}
                  placeholder="+91 98765 43210"
                  className={`hf-input ${errors.phone ? 'error' : ''}`}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
              {errors.phone && <p className="text-xs text-rose-500 mt-1.5">{errors.phone.message}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-linkedin-text mb-1.5">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-linkedin-muted" />
              <input
                type="email"
                {...register('email')}
                placeholder="rahul@example.com"
                className={`hf-input ${errors.email ? 'error' : ''}`}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
            {errors.email && <p className="text-xs text-rose-500 mt-1.5">{errors.email.message}</p>}
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-sm font-semibold text-linkedin-text mb-1.5">
              Resume / CV <span className="text-rose-500">*</span>
              <span className="ml-2 text-xs font-normal text-linkedin-muted">PDF, DOC, DOCX up to 5MB</span>
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />

            {!file ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`drop-zone ${isDragOver ? 'drag-over' : ''} ${fileError ? 'border-rose-400' : ''}`}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: '#EAF4FF' }}>
                  <UploadCloud className="w-6 h-6" style={{ color: '#0A66C2' }} />
                </div>
                <p className="font-semibold text-linkedin-text text-sm">
                  Click to upload or drag & drop your resume
                </p>
                <p className="text-xs text-linkedin-muted mt-1">PDF, DOC, or DOCX (Max 5MB)</p>
              </div>
            ) : (
              <div className="p-4 rounded-xl border flex items-center justify-between" style={{ background: '#EAF4FF', borderColor: '#BFDBFE' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#0A66C2' }}>
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-linkedin-text truncate max-w-xs">{file.name}</p>
                    <p className="text-xs text-linkedin-muted mt-0.5">
                      {(file.size / 1024 / 1024).toFixed(2)} MB · Ready for AI screening
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="p-1.5 rounded-lg hover:bg-white text-linkedin-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {fileError && <p className="text-xs text-rose-500 mt-1.5">{fileError}</p>}
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-sm font-semibold text-linkedin-text mb-1.5">
              Application Note <span className="text-xs font-normal text-linkedin-muted ml-1">(Optional)</span>
            </label>
            <div className="relative">
              <MessageSquare className="w-4 h-4 absolute left-3.5 top-3.5 text-linkedin-muted" />
              <textarea
                {...register('note')}
                rows={3}
                placeholder="Share a short note about your experience or why you're interested in this role..."
                className="hf-input resize-none"
                style={{ paddingLeft: '2.5rem', paddingTop: '0.75rem' }}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full py-3.5 text-sm mt-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Uploading & Submitting...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Submit Application
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-linkedin-muted hover:text-linkedin-blue transition-colors">
            ← Back to Open Positions
          </Link>
        </div>
      </main>
    </div>
  );
};
