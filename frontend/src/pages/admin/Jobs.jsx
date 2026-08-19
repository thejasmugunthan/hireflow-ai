import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { JobModal } from '../../components/jobs/JobModal';
import { EmptyState } from '../../components/ui/EmptyState';
import { jobService } from '../../services/jobService';
import { formatDate } from '../../utils/formatters';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Users,
  MapPin,
  RefreshCw,
} from 'lucide-react';

export const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await jobService.getAllJobsAdmin();
      setJobs(res.data || []);
    } catch (err) {
      console.error('Failed to fetch admin jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleCreate = () => { setEditingJob(null); setIsModalOpen(true); };
  const handleEdit = (job) => { setEditingJob(job); setIsModalOpen(true); };

  const handleToggleStatus = async (job) => {
    try {
      const newStatus = job.status === 'Active' ? 'Closed' : 'Active';
      await jobService.updateJob(job._id, { status: newStatus });
      fetchJobs();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await jobService.deleteJob(jobId);
        fetchJobs();
      } catch (err) {
        console.error('Failed to delete job:', err);
      }
    }
  };

  const activeCount = jobs.filter((j) => j.status === 'Active').length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Job Postings"
          subtitle="Publish, edit, and monitor roles"
          onMenuClick={() => setSidebarOpen(true)}
          action={
            <button onClick={handleCreate} className="btn-primary text-xs px-4 py-2">
              <Plus className="w-4 h-4" />
              Create Job
            </button>
          }
        />

        <main className="flex-1 p-4 sm:p-6 space-y-4 max-w-7xl w-full">
          {/* Summary Bar */}
          <div className="hf-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EAF4FF' }}>
                <Briefcase className="w-5 h-5" style={{ color: '#0A66C2' }} />
              </div>
              <div>
                <div className="font-bold text-linkedin-text text-sm">Job Openings Overview</div>
                <div className="text-xs text-linkedin-muted mt-0.5">
                  <span className="font-semibold text-emerald-600">{activeCount} Active</span>
                  {' · '}
                  {jobs.length} Total Postings
                </div>
              </div>
            </div>
            <button
              onClick={fetchJobs}
              className="p-2 rounded-lg hover:bg-linkedin-hover text-linkedin-muted transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Jobs Grid (cards on mobile, table on desktop) */}
          <div className="hf-card overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-2" style={{ borderColor: '#0A66C2', borderTopColor: 'transparent' }} />
                <span className="text-sm text-linkedin-muted">Loading job postings...</span>
              </div>
            ) : jobs.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No job postings yet"
                description="Create your first job posting to start receiving applications."
                action={
                  <button onClick={handleCreate} className="btn-primary text-sm">
                    <Plus className="w-4 h-4" />
                    Create Job Posting
                  </button>
                }
              />
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full hf-table">
                    <thead>
                      <tr>
                        <th>Job Title</th>
                        <th>Location & Type</th>
                        <th>Skills</th>
                        <th>Status</th>
                        <th>Applicants</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((job) => (
                        <tr key={job._id}>
                          <td>
                            <div className="font-semibold text-linkedin-text text-sm">{job.title}</div>
                            <div className="text-xs text-linkedin-muted mt-0.5 line-clamp-1 max-w-xs">{job.description}</div>
                          </td>
                          <td>
                            <div className="text-sm text-linkedin-text flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-linkedin-muted flex-shrink-0" />
                              {job.location}
                            </div>
                            <div className="text-xs text-linkedin-muted mt-0.5">{job.employmentType}</div>
                          </td>
                          <td>
                            <div className="flex flex-wrap gap-1 max-w-[180px]">
                              {job.skills?.slice(0, 3).map((sk, i) => (
                                <span key={i} className="badge badge-slate text-xs">{sk}</span>
                              ))}
                              {job.skills?.length > 3 && (
                                <span className="text-xs text-linkedin-muted self-center">+{job.skills.length - 3}</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <button
                              onClick={() => handleToggleStatus(job)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                                job.status === 'Active'
                                  ? 'text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100'
                                  : 'text-linkedin-muted bg-slate-100 border border-linkedin-border hover:bg-slate-200'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${job.status === 'Active' ? 'bg-emerald-500' : 'bg-linkedin-muted'}`} />
                              {job.status}
                            </button>
                          </td>
                          <td>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: '#EAF4FF', color: '#0A66C2' }}>
                              <Users className="w-3.5 h-3.5" />
                              {job.applicationCount ?? 0}
                            </span>
                          </td>
                          <td className="text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleEdit(job)}
                                title="Edit"
                                className="p-1.5 rounded-lg text-linkedin-muted hover:text-linkedin-blue hover:bg-linkedin-lightblue transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(job._id)}
                                title="Delete"
                                className="p-1.5 rounded-lg text-linkedin-muted hover:text-rose-500 hover:bg-rose-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Job Cards */}
                <div className="md:hidden divide-y divide-linkedin-border">
                  {jobs.map((job) => (
                    <div key={job._id} className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-semibold text-linkedin-text text-sm">{job.title}</div>
                          <div className="text-xs text-linkedin-muted mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {job.location} · {job.employmentType}
                          </div>
                        </div>
                        <button
                          onClick={() => handleToggleStatus(job)}
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                            job.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-linkedin-muted border border-linkedin-border'
                          }`}
                        >
                          {job.status}
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {job.skills?.slice(0, 4).map((sk, i) => (
                          <span key={i} className="badge badge-slate text-xs">{sk}</span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-linkedin-muted flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {job.applicationCount ?? 0} applicants
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => handleEdit(job)} className="p-1.5 rounded-lg text-linkedin-muted hover:text-linkedin-blue hover:bg-linkedin-lightblue transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(job._id)} className="p-1.5 rounded-lg text-linkedin-muted hover:text-rose-500 hover:bg-rose-50 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {isModalOpen && (
        <JobModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          job={editingJob}
          onSaved={fetchJobs}
        />
      )}
    </div>
  );
};
