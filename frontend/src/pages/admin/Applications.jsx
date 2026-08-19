import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { StagePill } from '../../components/ui/StagePill';
import { StageChangeModal } from '../../components/applications/StageChangeModal';
import { EmptyState } from '../../components/ui/EmptyState';
import { applicationService } from '../../services/applicationService';
import { jobService } from '../../services/jobService';
import { formatDate } from '../../utils/formatters';
import { ALL_STAGES } from '../../utils/stageHelpers';
import {
  Search,
  Users,
  ChevronRight,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  Filter,
} from 'lucide-react';

const stageMeta = {
  Applied:  { color: '#1D4ED8', bg: '#DBEAFE' },
  R1:       { color: '#4F46E5', bg: '#EDE9FE' },
  R2:       { color: '#B45309', bg: '#FEF3C7' },
  R3:       { color: '#7C3AED', bg: '#F3E8FF' },
  Approved: { color: '#057642', bg: '#D1FAE5' },
  Reject:   { color: '#E11D48', bg: '#FFF1F2' },
};

const StageBadge = ({ stage }) => {
  const m = stageMeta[stage] || { color: '#666', bg: '#F1F5F9' };
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: m.bg, color: m.color }}>
      {stage}
    </span>
  );
};

export const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState('all');
  const [selectedStage, setSelectedStage] = useState('all');
  const [selectedAppForStage, setSelectedAppForStage] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedJob !== 'all') params.jobId = selectedJob;
      if (selectedStage !== 'all') params.stage = selectedStage;
      if (search.trim()) params.search = search.trim();
      const res = await applicationService.getApplications(params);
      setApplications(res.data || []);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await jobService.getActiveJobs();
        setJobs(res.data || []);
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchApplications(), 250);
    return () => clearTimeout(t);
  }, [search, selectedJob, selectedStage]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Candidate Applications"
          subtitle="Search, filter, and advance applicants through the pipeline"
          onMenuClick={() => setSidebarOpen(true)}
          action={
            <button
              onClick={fetchApplications}
              className="btn-secondary text-xs px-3 py-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          }
        />

        <main className="flex-1 p-4 sm:p-6 space-y-4 max-w-7xl w-full">
          {/* Filter Bar */}
          <div className="hf-card p-4 flex flex-col md:flex-row items-start md:items-center gap-3">
            <div className="relative flex-1 w-full md:max-w-sm">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-linkedin-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, or skill..."
                className="hf-input text-sm"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-linkedin-muted flex-shrink-0" />
                <select
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                  className="hf-select text-xs py-2 min-w-[140px]"
                >
                  <option value="all">All Positions ({jobs.length})</option>
                  {jobs.map((j) => (
                    <option key={j._id} value={j._id}>{j.title}</option>
                  ))}
                </select>
              </div>

              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="hf-select text-xs py-2 min-w-[130px]"
              >
                <option value="all">All Stages</option>
                {ALL_STAGES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {(search || selectedJob !== 'all' || selectedStage !== 'all') && (
              <button
                onClick={() => { setSearch(''); setSelectedJob('all'); setSelectedStage('all'); }}
                className="text-xs font-medium text-rose-500 hover:text-rose-600 whitespace-nowrap"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Table Card */}
          <div className="hf-card overflow-hidden">
            {/* Table Header */}
            <div className="px-5 py-3.5 border-b border-linkedin-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" style={{ color: '#0A66C2' }} />
                <span className="font-semibold text-sm text-linkedin-text">
                  {loading ? 'Loading...' : `${applications.length} Application${applications.length !== 1 ? 's' : ''}`}
                </span>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-2" style={{ borderColor: '#0A66C2', borderTopColor: 'transparent' }} />
                <span className="text-sm text-linkedin-muted">Loading applications...</span>
              </div>
            ) : applications.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No applications match filters"
                description="Try clearing your search query or choosing a different filter."
                action={
                  <button
                    onClick={() => { setSearch(''); setSelectedJob('all'); setSelectedStage('all'); }}
                    className="btn-primary text-sm"
                  >
                    Reset Filters
                  </button>
                }
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full hf-table">
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th className="hidden sm:table-cell">Position</th>
                      <th>Stage</th>
                      <th className="hidden lg:table-cell">AI Match</th>
                      <th className="hidden md:table-cell">Applied</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => {
                      const score = app.aiAnalysis?.matchScore;
                      const scoreColor = score >= 80 ? '#057642' : score >= 65 ? '#0A66C2' : '#B45309';
                      const scoreBg   = score >= 80 ? '#D1FAE5' : score >= 65 ? '#EAF4FF' : '#FEF3C7';
                      return (
                        <tr key={app._id} className="group">
                          {/* Candidate */}
                          <td>
                            <div className="flex items-center gap-2.5">
                              <div
                                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white flex-shrink-0"
                                style={{ background: 'linear-gradient(135deg, #0A66C2, #4F46E5)' }}
                              >
                                {app.candidateId?.name?.charAt(0).toUpperCase() || '?'}
                              </div>
                              <div>
                                <div className="font-semibold text-linkedin-text text-sm leading-tight">{app.candidateId?.name}</div>
                                <div className="text-xs text-linkedin-muted hidden sm:block">{app.candidateId?.email}</div>
                              </div>
                            </div>
                          </td>

                          {/* Position */}
                          <td className="hidden sm:table-cell">
                            <div className="font-medium text-linkedin-text text-sm">{app.jobId?.title}</div>
                            <div className="text-xs text-linkedin-muted mt-0.5">{app.jobId?.employmentType} · {app.jobId?.location}</div>
                          </td>

                          {/* Stage */}
                          <td>
                            <div className="flex items-center gap-1.5">
                              <StageBadge stage={app.stage} />
                              <button
                                onClick={() => setSelectedAppForStage(app)}
                                title="Change Stage"
                                className="p-1 rounded-lg hover:bg-linkedin-lightblue text-linkedin-muted opacity-0 group-hover:opacity-100 transition-all"
                              >
                                <SlidersHorizontal className="w-3.5 h-3.5" style={{ color: '#0A66C2' }} />
                              </button>
                            </div>
                          </td>

                          {/* AI Match */}
                          <td className="hidden lg:table-cell">
                            {score !== null && score !== undefined ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: scoreBg, color: scoreColor }}>
                                <Sparkles className="w-3 h-3" />
                                {score}%
                              </span>
                            ) : (
                              <span className="text-xs text-linkedin-muted italic">Pending</span>
                            )}
                          </td>

                          {/* Applied Date */}
                          <td className="hidden md:table-cell text-xs text-linkedin-muted">
                            {formatDate(app.createdAt)}
                          </td>

                          {/* Action */}
                          <td className="text-right">
                            <Link
                              to={`/admin/applications/${app._id}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                              style={{ background: '#EAF4FF', color: '#0A66C2' }}
                            >
                              Details
                              <ChevronRight className="w-3 h-3" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {selectedAppForStage && (
        <StageChangeModal
          isOpen={!!selectedAppForStage}
          onClose={() => setSelectedAppForStage(null)}
          application={selectedAppForStage}
          onStageUpdated={fetchApplications}
        />
      )}
    </div>
  );
};
