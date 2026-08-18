import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { StagePill } from '../../components/ui/StagePill';
import { AIInsightsCard } from '../../components/applications/AIInsightsCard';
import { StageTimeline } from '../../components/applications/StageTimeline';
import { InterviewNotesSection } from '../../components/applications/InterviewNotesSection';
import { StageChangeModal } from '../../components/applications/StageChangeModal';
import { applicationService } from '../../services/applicationService';
import { formatDate, formatDateTime } from '../../utils/formatters';
import {
  ArrowLeft,
  Mail,
  Phone,
  Briefcase,
  FileText,
  ExternalLink,
  SlidersHorizontal,
  MessageSquare,
  Sparkles,
  Calendar,
} from 'lucide-react';

export const CandidateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      const res = await applicationService.getApplicationById(id);
      setApplication(res.data);
    } catch (err) {
      console.error('Failed to load candidate details:', err);
      setError(err.response?.data?.message || 'Application not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-950">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="flex min-h-screen bg-slate-950">
        <AdminSidebar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <p className="text-rose-400 font-bold text-base mb-4">{error || 'Candidate profile not found'}</p>
          <Link
            to="/admin/applications"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500"
          >
            Return to Applications
          </Link>
        </div>
      </div>
    );
  }

  const candidate = application.candidateId;
  const job = application.jobId;

  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title={`Candidate Profile: ${candidate?.name || 'Applicant'}`}
          subtitle={`Applied for ${job?.title || 'Open Role'} on ${formatDate(application.createdAt)}`}
          action={
            <Link
              to="/admin/applications"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-850 border border-slate-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Pipeline</span>
            </Link>
          }
        />

        <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl w-full">
          {/* Candidate Profile Top Card */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Name & Contact Info */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">
                    {candidate?.name}
                  </h2>
                  <StagePill stage={application.stage} size="lg" />
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                  <a
                    href={`mailto:${candidate?.email}`}
                    className="flex items-center gap-1.5 hover:text-brand-300 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{candidate?.email}</span>
                  </a>

                  <a
                    href={`tel:${candidate?.phone}`}
                    className="flex items-center gap-1.5 hover:text-brand-300 transition-colors font-mono"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{candidate?.phone}</span>
                  </a>

                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-200 font-semibold">{job?.title}</span>
                    <span>({job?.location} • {job?.employmentType})</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Applied {formatDateTime(application.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {candidate?.resumeUrl && (
                  <a
                    href={candidate.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all shadow-sm"
                  >
                    <FileText className="w-4 h-4 text-brand-400" />
                    <span>View Resume</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                )}

                <button
                  onClick={() => setIsStageModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/25 transition-all active:scale-95"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Update Stage Pipeline</span>
                </button>
              </div>
            </div>

            {/* Candidate Application Note if available */}
            {application.note && (
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-300">
                <MessageSquare className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-200">Candidate Note: </span>
                  <span className="italic text-slate-300">&ldquo;{application.note}&rdquo;</span>
                </div>
              </div>
            )}
          </div>

          {/* AI Candidate Insights Section */}
          <AIInsightsCard
            application={application}
            onRefresh={fetchApplicationDetails}
          />

          {/* Hiring Workflow Pipeline & Timeline */}
          <StageTimeline application={application} />

          {/* Interview Evaluation & Notes Section */}
          <InterviewNotesSection
            application={application}
            onNoteAdded={fetchApplicationDetails}
          />
        </main>
      </div>

      {/* Stage Change Modal */}
      {isStageModalOpen && (
        <StageChangeModal
          isOpen={isStageModalOpen}
          onClose={() => setIsStageModalOpen(false)}
          application={application}
          onStageUpdated={fetchApplicationDetails}
        />
      )}
    </div>
  );
};
