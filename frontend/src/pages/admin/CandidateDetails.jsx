import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  Calendar,
} from 'lucide-react';

const stageMeta = {
  Applied:  { color: '#1D4ED8', bg: '#DBEAFE' },
  R1:       { color: '#4F46E5', bg: '#EDE9FE' },
  R2:       { color: '#B45309', bg: '#FEF3C7' },
  R3:       { color: '#7C3AED', bg: '#F3E8FF' },
  Approved: { color: '#057642', bg: '#D1FAE5' },
  Reject:   { color: '#E11D48', bg: '#FFF1F2' },
};

export const CandidateDetails = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  useEffect(() => { fetchApplicationDetails(); }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <AdminSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#0A66C2', borderTopColor: 'transparent' }} />
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <AdminSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <p className="text-rose-500 font-semibold text-base mb-4">{error || 'Candidate profile not found'}</p>
          <Link to="/admin/applications" className="btn-primary text-sm">
            Return to Applications
          </Link>
        </div>
      </div>
    );
  }

  const candidate = application.candidateId;
  const job = application.jobId;
  const stageMeta_ = stageMeta[application.stage] || { color: '#666', bg: '#F1F5F9' };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title={candidate?.name || 'Candidate Profile'}
          subtitle={`Applied for ${job?.title || 'Open Role'} on ${formatDate(application.createdAt)}`}
          onMenuClick={() => setSidebarOpen(true)}
          action={
            <Link
              to="/admin/applications"
              className="btn-ghost text-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Pipeline
            </Link>
          }
        />

        <main className="flex-1 p-4 sm:p-6 space-y-4 max-w-6xl w-full">
          {/* Candidate Profile Card */}
          <div className="hf-card p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
              {/* Left — Avatar + Info */}
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #0A66C2, #4F46E5)' }}
                >
                  {candidate?.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-xl font-bold text-linkedin-text">{candidate?.name}</h2>
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      style={{ background: stageMeta_.bg, color: stageMeta_.color }}
                    >
                      {application.stage}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-linkedin-muted">
                    <a href={`mailto:${candidate?.email}`} className="flex items-center gap-1.5 hover:text-linkedin-blue transition-colors">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{candidate?.email}</span>
                    </a>
                    <a href={`tel:${candidate?.phone}`} className="flex items-center gap-1.5 hover:text-linkedin-blue transition-colors">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{candidate?.phone}</span>
                    </a>
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span className="font-medium text-linkedin-text">{job?.title}</span>
                      <span>({job?.location} · {job?.employmentType})</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Applied {formatDateTime(application.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right — Actions */}
              <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                <a
                  href={`/api/applications/${application._id}/resume`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary text-xs px-4 py-2"
                >
                  <FileText className="w-4 h-4" />
                  View Resume (PDF)
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => setIsStageModalOpen(true)}
                  className="btn-primary text-xs px-4 py-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Update Stage
                </button>
              </div>
            </div>

            {/* Candidate Note */}
            {application.note && (
              <div className="mt-4 pt-4 border-t border-linkedin-border flex items-start gap-2.5 text-sm">
                <MessageSquare className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#0A66C2' }} />
                <div className="text-linkedin-text">
                  <span className="font-semibold">Candidate Note: </span>
                  <span className="italic text-linkedin-muted">"{application.note}"</span>
                </div>
              </div>
            )}
          </div>

          {/* AI Insights */}
          <AIInsightsCard application={application} onRefresh={fetchApplicationDetails} />

          {/* Stage Timeline */}
          <StageTimeline application={application} />

          {/* Interview Notes */}
          <InterviewNotesSection application={application} onNoteAdded={fetchApplicationDetails} />
        </main>
      </div>

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
