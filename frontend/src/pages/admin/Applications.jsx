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
  Filter,
  Users,
  ChevronRight,
  Sparkles,
  RefreshCw,
  ExternalLink,
  SlidersHorizontal,
} from 'lucide-react';

export const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState('all');
  const [selectedStage, setSelectedStage] = useState('all');

  // Stage change modal
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
    const timeoutId = setTimeout(() => {
      fetchApplications();
    }, 250);
    return () => clearTimeout(timeoutId);
  }, [search, selectedJob, selectedStage]);

  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Candidate Applications"
          subtitle="Search, filter, and advance applicants through the screening pipeline"
          action={
            <button
              onClick={fetchApplications}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-850 border border-slate-800 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-brand-400' : ''}`} />
              <span>Refresh</span>
            </button>
          }
        />

        <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl w-full">
          {/* Filter Bar */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search candidates by name, email, or skill (e.g. React)..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Job filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Job:</span>
                <select
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-medium"
                >
                  <option value="all">All Positions ({jobs.length})</option>
                  {jobs.map((j) => (
                    <option key={j._id} value={j._id}>
                      {j.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stage filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Stage:</span>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-medium"
                >
                  <option value="all">All Stages</option>
                  {ALL_STAGES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Applications Table */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Applications List ({applications.length})
                </span>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center text-xs text-slate-400">
                <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                Loading applications...
              </div>
            ) : applications.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No applications match filters"
                description="Try clearing your search query or choosing a different job/stage filter."
                action={
                  <button
                    onClick={() => {
                      setSearch('');
                      setSelectedJob('all');
                      setSelectedStage('all');
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 transition-colors"
                  >
                    Reset Filters
                  </button>
                }
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/80 bg-slate-900/40 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-5">Candidate Details</th>
                      <th className="py-3 px-5">Applied Job</th>
                      <th className="py-3 px-5">Stage Pipeline</th>
                      <th className="py-3 px-5">AI Match</th>
                      <th className="py-3 px-5">Applied Date</th>
                      <th className="py-3 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs">
                    {applications.map((app) => {
                      const matchScore = app.aiAnalysis?.matchScore;
                      return (
                        <tr
                          key={app._id}
                          className="hover:bg-slate-900/40 transition-colors group"
                        >
                          {/* Candidate Info */}
                          <td className="py-4 px-5">
                            <div className="font-bold text-white group-hover:text-brand-300 transition-colors">
                              {app.candidateId?.name}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {app.candidateId?.email}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {app.candidateId?.phone}
                            </div>
                          </td>

                          {/* Applied Job */}
                          <td className="py-4 px-5">
                            <div className="text-slate-200 font-semibold">{app.jobId?.title}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {app.jobId?.employmentType} • {app.jobId?.location}
                            </div>
                          </td>

                          {/* Stage */}
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-2">
                              <StagePill stage={app.stage} size="sm" />
                              <button
                                onClick={() => setSelectedAppForStage(app)}
                                title="Change Stage"
                                className="p-1 rounded-md text-slate-500 hover:text-brand-400 hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                          {/* AI Match Score */}
                          <td className="py-4 px-5">
                            {matchScore !== null && matchScore !== undefined ? (
                              <span
                                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                                  matchScore >= 80
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                    : matchScore >= 65
                                    ? 'bg-brand-500/10 text-brand-400 border-brand-500/30'
                                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                }`}
                              >
                                <Sparkles className="w-3 h-3" />
                                {matchScore}%
                              </span>
                            ) : (
                              <span className="text-slate-500 text-[11px] italic">Pending</span>
                            )}
                          </td>

                          {/* Applied Date */}
                          <td className="py-4 px-5 text-slate-400">
                            {formatDate(app.createdAt)}
                          </td>

                          {/* Action */}
                          <td className="py-4 px-5 text-right">
                            <Link
                              to={`/admin/applications/${app._id}`}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-sm shadow-brand-500/20 transition-all active:scale-95"
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
            )}
          </div>
        </main>
      </div>

      {/* Stage Change Modal */}
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
