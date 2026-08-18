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
  Clock,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

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

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreate = () => {
    setEditingJob(null);
    setIsModalOpen(true);
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

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

  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Job Openings Management"
          subtitle="Publish, edit, and monitor application volume across open roles"
          action={
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Job</span>
            </button>
          }
        />

        <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl w-full">
          {/* Header Summary */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Active Positions Overview</h3>
                <p className="text-xs text-slate-400">
                  {jobs.filter((j) => j.status === 'Active').length} Active • {jobs.length} Total Postings
                </p>
              </div>
            </div>

            <button
              onClick={fetchJobs}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-400' : ''}`} />
            </button>
          </div>

          {/* Jobs Table */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-400">
                <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                Loading job requisitions...
              </div>
            ) : jobs.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No job postings found"
                description="Create your first job posting to start receiving candidate applications."
                action={
                  <button
                    onClick={handleCreate}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500"
                  >
                    + Create Job
                  </button>
                }
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/80 bg-slate-900/40 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-5">Job Title</th>
                      <th className="py-3 px-5">Location & Type</th>
                      <th className="py-3 px-5">Required Competencies</th>
                      <th className="py-3 px-5">Status</th>
                      <th className="py-3 px-5">Applicants</th>
                      <th className="py-3 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs">
                    {jobs.map((job) => (
                      <tr key={job._id} className="hover:bg-slate-900/40 transition-colors">
                        {/* Title */}
                        <td className="py-4 px-5">
                          <div className="font-bold text-white text-sm">{job.title}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 max-w-xs">
                            {job.description}
                          </div>
                        </td>

                        {/* Location & Type */}
                        <td className="py-4 px-5 text-slate-300">
                          <div>{job.location}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{job.employmentType}</div>
                        </td>

                        {/* Skills */}
                        <td className="py-4 px-5">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {job.skills?.slice(0, 3).map((sk, i) => (
                              <span
                                key={i}
                                className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
                              >
                                {sk}
                              </span>
                            ))}
                            {job.skills?.length > 3 && (
                              <span className="text-[10px] text-slate-500 self-center">
                                +{job.skills.length - 3}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-5">
                          <button
                            onClick={() => handleToggleStatus(job)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                              job.status === 'Active'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                job.status === 'Active' ? 'bg-emerald-400' : 'bg-slate-500'
                              }`}
                            ></span>
                            <span>{job.status}</span>
                          </button>
                        </td>

                        {/* Applicants count */}
                        <td className="py-4 px-5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-300 font-bold border border-brand-500/20">
                            <Users className="w-3.5 h-3.5" />
                            <span>{job.applicationCount ?? 0}</span>
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(job)}
                              title="Edit Job"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(job._id)}
                              title="Delete Job"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
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
            )}
          </div>
        </main>
      </div>

      {/* Create / Edit Job Modal */}
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
