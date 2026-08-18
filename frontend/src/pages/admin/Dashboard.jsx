import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { StatCard } from '../../components/ui/StatCard';
import { StagePill } from '../../components/ui/StagePill';
import { applicationService } from '../../services/applicationService';
import { formatDate } from '../../utils/formatters';
import {
  Briefcase,
  Users,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await applicationService.getDashboardStats();
        setStats(response.data);
      } catch (error) {
        console.error('Failed to load dashboard metrics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stageBreakdown = stats?.stageBreakdown || {
    Applied: 0,
    R1: 0,
    R2: 0,
    R3: 0,
    Approved: 0,
    Reject: 0,
  };

  const totalApps = stats?.totalApplications || 1;

  const stageColorMap = {
    Applied: 'bg-blue-500',
    R1: 'bg-indigo-500',
    R2: 'bg-amber-500',
    R3: 'bg-purple-500',
    Approved: 'bg-emerald-500',
    Reject: 'bg-rose-500',
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Talent Acquisition Dashboard"
          subtitle="Real-time candidate metrics, pipeline distribution & screening insights"
          action={
            <Link
              to="/admin/applications"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/20 transition-all active:scale-95"
            >
              <span>View All Applications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />

        <main className="flex-1 p-6 sm:p-8 space-y-8 max-w-7xl w-full">
          {/* Top 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Active Job Openings"
              value={loading ? '...' : stats?.totalJobs ?? 0}
              subtext="Requisitions published"
              icon={Briefcase}
              color="brand"
            />
            <StatCard
              title="Total Applications"
              value={loading ? '...' : stats?.totalApplications ?? 0}
              subtext="Received to date"
              icon={Users}
              color="blue"
            />
            <StatCard
              title="In-Pipeline (Pending)"
              value={loading ? '...' : stats?.pendingCount ?? 0}
              subtext="Under active screening"
              icon={Clock}
              color="amber"
            />
            <StatCard
              title="Offers Approved"
              value={loading ? '...' : stats?.approvedCount ?? 0}
              subtext="Hired candidates"
              icon={CheckCircle2}
              color="emerald"
            />
          </div>

          {/* Applications by Stage Breakdown */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">Applications by Pipeline Stage</h3>
                <p className="text-xs text-slate-400">Distribution of active and archived candidates</p>
              </div>
              <span className="text-xs text-slate-400 font-semibold">
                {stats?.totalApplications || 0} Total Evaluated
              </span>
            </div>

            <div className="space-y-3.5">
              {Object.entries(stageBreakdown).map(([stageName, count]) => {
                const percentage = Math.round((count / totalApps) * 100) || 0;
                return (
                  <div key={stageName} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300 flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${stageColorMap[stageName] || 'bg-slate-500'}`}
                        ></span>
                        {stageName}
                      </span>
                      <span className="font-bold text-slate-200">
                        {count} candidates ({percentage}%)
                      </span>
                    </div>

                    <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          stageColorMap[stageName] || 'bg-slate-500'
                        }`}
                        style={{ width: `${Math.max(percentage, count > 0 ? 3 : 0)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Applications Table */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">Recent Candidates</h3>
                <p className="text-xs text-slate-400">Latest applicants across open positions</p>
              </div>

              <Link
                to="/admin/applications"
                className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1"
              >
                <span>View Full Pipeline</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-slate-900/40 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-5">Candidate</th>
                    <th className="py-3 px-5">Position</th>
                    <th className="py-3 px-5">Current Stage</th>
                    <th className="py-3 px-5">Date Applied</th>
                    <th className="py-3 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {stats?.recentApplications?.length > 0 ? (
                    stats.recentApplications.map((app) => (
                      <tr
                        key={app._id}
                        className="hover:bg-slate-900/40 transition-colors"
                      >
                        <td className="py-3.5 px-5">
                          <div className="font-bold text-white">{app.candidateId?.name}</div>
                          <div className="text-[11px] text-slate-400">{app.candidateId?.email}</div>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="text-slate-200 font-medium">{app.jobId?.title}</span>
                        </td>
                        <td className="py-3.5 px-5">
                          <StagePill stage={app.stage} size="sm" />
                        </td>
                        <td className="py-3.5 px-5 text-slate-400">
                          {formatDate(app.createdAt)}
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <Link
                            to={`/admin/applications/${app._id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/20 transition-colors"
                          >
                            <span>Inspect</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                        No applications submitted yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
