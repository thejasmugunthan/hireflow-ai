import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { AIInsightsCard } from '../../components/applications/AIInsightsCard';
import { StageTimeline } from '../../components/applications/StageTimeline';
import { InterviewNotesSection } from '../../components/applications/InterviewNotesSection';
import { StageChangeModal } from '../../components/applications/StageChangeModal';
import { applicationService } from '../../services/applicationService';
import { formatDateTime } from '../../utils/formatters';
import { STAGE_CONFIG } from '../../utils/stageHelpers';
import {
  Mail,
  Phone,
  Briefcase,
  Calendar,
  FileText,
  SlidersHorizontal,
  ExternalLink,
  ArrowLeft,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';

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
      setError('');
      const response = await applicationService.getApplicationById(id);
      setApplication(response.data);
    } catch (err) {
      console.error('Error fetching application details:', err);
      setError(err.response?.data?.message || 'Failed to load candidate application details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchApplicationDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex bg-linkedin-bg">
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader onMenuClick={() => setSidebarOpen(true)} title="Candidate Profile" />
          <div className="flex-1 p-6 space-y-4 max-w-6xl w-full">
            <div className="h-44 bg-white rounded-2xl border border-slate-200 skeleton" />
            <div className="h-64 bg-white rounded-2xl border border-slate-200 skeleton" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen flex bg-linkedin-bg">
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader onMenuClick={() => setSidebarOpen(true)} title="Candidate Profile" />
          <div className="flex-1 p-6 max-w-6xl w-full flex items-center justify-center">
            <div className="hf-card p-8 max-w-md w-full text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
              <h2 className="text-lg font-bold text-linkedin-text">Error Loading Candidate</h2>
              <p className="text-sm text-linkedin-muted">{error || 'Candidate record was not found.'}</p>
              <Link to="/admin/applications" className="btn-primary inline-flex text-xs px-5 py-2.5">
                ← Back to Applications
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const candidate = application.candidateId;
  const job = application.jobId;
  const stageMeta = STAGE_CONFIG[application.stage] || {
    label: application.stage,
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  return (
    <div className="min-h-screen flex bg-linkedin-bg">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
          title={candidate?.name || 'Candidate Details'}
          subtitle={`Applied for ${job?.title || 'Job Opening'} on ${formatDateTime(application.createdAt)}`}
          action={
            <Link
              to="/admin/applications"
              className="btn-secondary text-xs px-3 py-1.5 inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Pipeline</span>
            </Link>
          }
        />

        <main className="flex-1 p-3.5 sm:p-6 space-y-4 max-w-6xl w-full mx-auto">
          {/* Candidate Profile Card */}
          <div className="hf-card p-4 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
              {/* Left — Avatar + Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-white flex-shrink-0 shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #0A66C2, #1677FF)' }}
                >
                  {candidate?.name?.charAt(0).toUpperCase() || '?'}
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-xl font-bold text-slate-900">{candidate?.name}</h2>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${stageMeta.badgeClass}`}>
                      {application.stage}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                    <a href={`mailto:${candidate?.email}`} className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{candidate?.email}</span>
                    </a>
                    <a href={`tel:${candidate?.phone}`} className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{candidate?.phone}</span>
                    </a>
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-700">{job?.title}</span>
                      <span>({job?.location} · {job?.employmentType})</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Applied {formatDateTime(application.createdAt)}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right — Actions (Full-width grid on mobile, inline on desktop) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:items-center gap-2.5 flex-shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <a
                  href={`/api/applications/${application._id}/resume`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary text-xs px-4 py-2.5 justify-center flex items-center gap-1.5 w-full sm:w-auto"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>View Resume (PDF)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setIsStageModalOpen(true)}
                  className="btn-primary text-xs px-4 py-2.5 justify-center flex items-center gap-1.5 w-full sm:w-auto shadow-sm"
                  style={{ background: '#1677FF' }}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Update Stage</span>
                </button>
              </div>
            </div>

            {/* Candidate Note */}
            {application.note && (
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                <MessageSquare className="w-4 h-4 flex-shrink-0 text-blue-600 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800">Candidate Note: </span>
                  <span className="italic">"{application.note}"</span>
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
