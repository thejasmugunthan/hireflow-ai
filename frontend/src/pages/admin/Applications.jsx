import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { EmptyState } from '../../components/ui/EmptyState';
import { StageChangeModal } from '../../components/applications/StageChangeModal';
import { applicationService } from '../../services/applicationService';
import { jobService } from '../../services/jobService';
import { formatDate } from '../../utils/formatters';
import { ALL_STAGES, STAGE_CONFIG } from '../../utils/stageHelpers';
import {
  Search,
  Filter,
  Users,
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
  Briefcase,
  Calendar,
  Mail,
} from 'lucide-react';

const StageBadge = ({ stage }) => {
  const meta = STAGE_CONFIG[stage] || {
    label: stage,
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${meta.badgeClass}`}>
      {meta.label}
    </span>
  );
};

export const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState('all');
  const [selectedStage, setSelectedStage] = useState('all');
  const [selectedAppForStage, setSelectedAppForStage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedJob !== 'all') params.jobId = selectedJob;
      if (selectedStage !== 'all') params.stage = selectedStage;
      if (search.trim()) params.search = search.trim();
      const response = await applicationService.getApplications(params);
      setApplications(response.data || []);
    } catch (err) {
      console.error('Error loading applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchFilterJobs = async () => {
      try {
        const res = await jobService.getAllJobs();
        setJobs(res.data || []);
      } catch (err) {
        console.error('Failed to load jobs for filter:', err);
      }
    };
    fetchFilterJobs();
  }, []);

  useEffect(() => {
    const delay = setTimeout(fetchApplications, 250);
    return () => clearTimeout(delay);
  }, [search, selectedJob, selectedStage]);

  return (
    <div className="min-h-screen flex bg-linkedin-bg">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
          title="Candidate Applications"
          subtitle="Review applicants, inspect AI resume scores, and manage hiring stages"
        />

        <main className="flex-1 p-3.5 sm:p-6 space-y-4 max-w-7xl w-full mx-auto">
          {/* ── FILTER & SEARCH BAR ──────────────────────────────────────── */}
          <div className="hf-card p-4 space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email, or skill..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              {/* Dropdown Filters */}
              <div className="grid grid-cols-2 md:flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <select
                    value={selectedJob}
                    onChange={(e) => setSelectedJob(e.target.value)}
                    className="w-full md:w-auto px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="all">All Positions ({jobs.length})</option>
                    {jobs.map((j) => (
                      <option key={j._id} value={j._id}>{j.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    value={selectedStage}
                    onChange={(e) => setSelectedStage(e.target.value)}
                    className="w-full md:w-auto px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="all">All Stages</option>
                    {ALL_STAGES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              {(search || selectedJob !== 'all' || selectedStage !== 'all') && (
                <button
                  onClick={() => { setSearch(''); setSelectedJob('all'); setSelectedStage('all'); }}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 self-center whitespace-nowrap px-2 py-1"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* ── APPLICATIONS LIST CONTAINER ────────────────────────────────── */}
          <div className="hf-card overflow-hidden">
            {/* Header Counter */}
            <div className="px-4 sm:px-5 py-3.5 border-b border-linkedin-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-xs sm:text-sm text-slate-900">
                  {loading ? 'Loading...' : `${applications.length} Candidate Application${applications.length !== 1 ? 's' : ''}`}
                </span>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-2" style={{ borderColor: '#1677FF', borderTopColor: 'transparent' }} />
                <span className="text-xs text-slate-500 font-medium">Loading candidates...</span>
              </div>
            ) : applications.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No applications match filters"
                description="Try resetting your search query or selecting a different stage filter."
                action={
                  <button
                    onClick={() => { setSearch(''); setSelectedJob('all'); setSelectedStage('all'); }}
                    className="btn-primary text-xs px-4 py-2"
                  >
                    Reset Filters
                  </button>
                }
              />
            ) : (
              <>
                {/* ── MOBILE VIEW: DEDICATED CARDS (hidden on md+) ─────────────── */}
                <div className="md:hidden divide-y divide-slate-100">
                  {applications.map((app) => {
                    const score = app.aiAnalysis?.matchScore;
                    const scoreColor = score >= 80 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : score >= 65 ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-amber-700 bg-amber-50 border-amber-200';

                    return (
                      <div key={app._id} className="p-4 space-y-3 hover:bg-slate-50/70 transition-colors">
                        {/* Top: Avatar + Name + Stage Pill */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0 shadow-xs"
                              style={{ background: 'linear-gradient(135deg, #0A66C2, #1677FF)' }}
                            >
                              {app.candidateId?.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div>
                              <Link
                                to={`/admin/applications/${app._id}`}
                                className="font-bold text-sm text-slate-900 hover:text-blue-600 leading-tight block"
                              >
                                {app.candidateId?.name}
                              </Link>
                              <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                                <Mail className="w-3 h-3 text-slate-400" />
                                <span className="truncate max-w-[180px]">{app.candidateId?.email}</span>
                              </div>
                            </div>
                          </div>

                          <StageBadge stage={app.stage} />
                        </div>

                        {/* Middle: Job Applied Info + AI Match Badge */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                            <Briefcase className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                            <span className="truncate max-w-[190px]">{app.jobId?.title || 'Job Opening'}</span>
                          </div>

                          {score !== null && score !== undefined ? (
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${scoreColor}`}>
                              <Sparkles className="w-3 h-3" />
                              {score}% Match
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Screening pending</span>
                          )}
                        </div>

                        {/* Bottom: Date + Action Buttons */}
                        <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                          <div className="flex items-center gap-1 text-[11px] text-slate-400">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(app.createdAt)}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedAppForStage(app)}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
                              title="Update Stage"
                            >
                              <SlidersHorizontal className="w-3.5 h-3.5" />
                            </button>

                            <Link
                              to={`/admin/applications/${app._id}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs"
                              style={{ background: '#1677FF' }}
                            >
                              <span>View Profile</span>
                              <ChevronRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ── DESKTOP VIEW: FULL RICH DATA TABLE (hidden on mobile) ──── */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full hf-table">
                    <thead>
                      <tr>
                        <th>Candidate</th>
                        <th>Position</th>
                        <th>Stage</th>
                        <th>AI Match</th>
                        <th>Applied Date</th>
                        <th className="text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => {
                        const score = app.aiAnalysis?.matchScore;
                        const scoreColor = score >= 80 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : score >= 65 ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-amber-700 bg-amber-50 border-amber-200';

                        return (
                          <tr key={app._id} className="group hover:bg-slate-50/80 transition-colors">
                            {/* Candidate */}
                            <td>
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0 shadow-xs"
                                  style={{ background: 'linear-gradient(135deg, #0A66C2, #1677FF)' }}
                                >
                                  {app.candidateId?.name?.charAt(0).toUpperCase() || '?'}
                                </div>
                                <div>
                                  <Link
                                    to={`/admin/applications/${app._id}`}
                                    className="font-bold text-slate-900 hover:text-blue-600 text-sm leading-tight block"
                                  >
                                    {app.candidateId?.name}
                                  </Link>
                                  <div className="text-xs text-slate-500 mt-0.5">{app.candidateId?.email}</div>
                                </div>
                              </div>
                            </td>

                            {/* Position */}
                            <td>
                              <div className="font-semibold text-slate-800 text-sm">{app.jobId?.title}</div>
                              <div className="text-xs text-slate-500 mt-0.5">{app.jobId?.employmentType} · {app.jobId?.location}</div>
                            </td>

                            {/* Stage */}
                            <td>
                              <div className="flex items-center gap-2">
                                <StageBadge stage={app.stage} />
                                <button
                                  onClick={() => setSelectedAppForStage(app)}
                                  title="Change Stage"
                                  className="p-1 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <SlidersHorizontal className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>

                            {/* AI Match */}
                            <td>
                              {score !== null && score !== undefined ? (
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${scoreColor}`}>
                                  <Sparkles className="w-3 h-3" />
                                  {score}% Match
                                </span>
                              ) : (
                                <span className="text-xs text-slate-400 italic">Screening pending</span>
                              )}
                            </td>

                            {/* Applied Date */}
                            <td className="text-xs text-slate-500 font-medium">
                              {formatDate(app.createdAt)}
                            </td>

                            {/* Action */}
                            <td className="text-right">
                              <Link
                                to={`/admin/applications/${app._id}`}
                                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-600 hover:text-white transition-all shadow-xs"
                              >
                                <span>Details</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
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
