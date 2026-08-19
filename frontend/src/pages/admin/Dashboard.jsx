import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { AdminHeader } from '../../components/layout/AdminHeader';
import { applicationService } from '../../services/applicationService';
import { formatDate } from '../../utils/formatters';
import {
  Briefcase,
  Users,
  Clock,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  XCircle,
} from 'lucide-react';

const StatCard = ({ title, value, subtext, icon: Icon, color }) => {
  const colorMap = {
    blue:    { bg: '#EAF4FF', text: '#0A66C2', border: '#BFDBFE' },
    green:   { bg: '#D1FAE5', text: '#057642', border: '#6EE7B7' },
    amber:   { bg: '#FEF3C7', text: '#B45309', border: '#FCD34D' },
    purple:  { bg: '#EDE9FE', text: '#6D28D9', border: '#C4B5FD' },
    rose:    { bg: '#FFF1F2', text: '#E11D48', border: '#FECDD3' },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="hf-card p-5 flex items-start gap-4 hf-card-hover animate-fade-in-up">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
        <Icon className="w-5 h-5" style={{ color: c.text }} />
      </div>
      <div>
        <p className="text-xs text-linkedin-muted font-medium">{title}</p>
        <p className="text-2xl font-extrabold text-linkedin-text mt-0.5 leading-none">{value}</p>
        <p className="text-xs text-linkedin-muted mt-1">{subtext}</p>
      </div>
    </div>
  );
};

const stageMeta = {
  Applied:  { color: '#1D4ED8', bg: '#DBEAFE', label: 'Applied' },
  R1:       { color: '#4F46E5', bg: '#EDE9FE', label: 'Round 1' },
  R2:       { color: '#B45309', bg: '#FEF3C7', label: 'Round 2' },
  R3:       { color: '#7C3AED', bg: '#F3E8FF', label: 'Round 3' },
  Approved: { color: '#057642', bg: '#D1FAE5', label: 'Approved' },
  Reject:   { color: '#E11D48', bg: '#FFF1F2', label: 'Rejected' },
};

const StagePill = ({ stage }) => {
  const m = stageMeta[stage] || { color: '#666', bg: '#F1F5F9', label: stage };
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: m.bg, color: m.color }}>
      {m.label}
    </span>
  );
};

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    Applied: 0, R1: 0, R2: 0, R3: 0, Approved: 0, Reject: 0,
  };
  const totalApps = Math.max(stats?.totalApplications || 1, 1);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Talent Dashboard"
          subtitle="Real-time candidate metrics and pipeline insights"
          onMenuClick={() => setSidebarOpen(true)}
          action={
            <Link
              to="/admin/applications"
              className="btn-primary text-xs px-4 py-2"
            >
              All Applications
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />

        <main className="flex-1 p-4 sm:p-6 space-y-6 max-w-7xl w-full">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              title="Active Job Openings"
              value={loading ? '—' : stats?.totalJobs ?? 0}
              subtext="Published requisitions"
              icon={Briefcase}
              color="blue"
            />
            <StatCard
              title="Total Applications"
              value={loading ? '—' : stats?.totalApplications ?? 0}
              subtext="Received to date"
              icon={Users}
              color="purple"
            />
            <StatCard
              title="In Pipeline"
              value={loading ? '—' : stats?.pendingCount ?? 0}
              subtext="Under active review"
              icon={Clock}
              color="amber"
            />
            <StatCard
              title="Offers Approved"
              value={loading ? '—' : stats?.approvedCount ?? 0}
              subtext="Candidates hired"
              icon={CheckCircle2}
              color="green"
            />
          </div>

          {/* Two-column grid */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 sm:gap-6">
            {/* Pipeline Breakdown — 3 cols */}
            <div className="xl:col-span-3 hf-card p-5 sm:p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-linkedin-text text-sm">Application Pipeline</h3>
                  <p className="text-xs text-linkedin-muted mt-0.5">Distribution across hiring stages</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-linkedin-muted">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {stats?.totalApplications || 0} total
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(stageBreakdown).map(([stageName, count]) => {
                  const pct = Math.round((count / totalApps) * 100) || 0;
                  const m = stageMeta[stageName] || { color: '#94A3B8', bg: '#F1F5F9', label: stageName };
                  return (
                    <div key={stageName}>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: m.color }} />
                          <span className="font-semibold text-linkedin-text">{m.label}</span>
                        </div>
                        <span className="font-bold text-linkedin-text">
                          {count} <span className="font-normal text-linkedin-muted">({pct}%)</span>
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${Math.max(pct, count > 0 ? 3 : 0)}%`,
                            background: m.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats — 2 cols */}
            <div className="xl:col-span-2 space-y-4">
              <div className="hf-card p-5">
                <h3 className="font-bold text-linkedin-text text-sm mb-4">Quick Metrics</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Approval Rate', value: stats?.totalApplications ? `${Math.round((stats.approvedCount / stats.totalApplications) * 100)}%` : '0%', color: '#057642' },
                    { label: 'Rejection Rate', value: stats?.totalApplications ? `${Math.round(((stats.stageBreakdown?.Reject || 0) / stats.totalApplications) * 100)}%` : '0%', color: '#E11D48' },
                    { label: 'Avg per Job', value: stats?.totalJobs ? Math.round(stats.totalApplications / stats.totalJobs) : '0', color: '#0A66C2' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex items-center justify-between py-2.5 border-b border-linkedin-border last:border-0">
                      <span className="text-xs text-linkedin-muted font-medium">{label}</span>
                      <span className="text-sm font-bold" style={{ color }}>{loading ? '—' : value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hf-card p-5">
                <h3 className="font-bold text-linkedin-text text-sm mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Link to="/admin/applications" className="flex items-center justify-between p-3 rounded-lg hover:bg-linkedin-lightblue transition-colors group">
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4" style={{ color: '#0A66C2' }} />
                      <span className="text-xs font-medium text-linkedin-text">View All Candidates</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-linkedin-muted group-hover:text-linkedin-blue transition-colors" />
                  </Link>
                  <Link to="/admin/jobs" className="flex items-center justify-between p-3 rounded-lg hover:bg-linkedin-lightblue transition-colors group">
                    <div className="flex items-center gap-2.5">
                      <Briefcase className="w-4 h-4" style={{ color: '#0A66C2' }} />
                      <span className="text-xs font-medium text-linkedin-text">Manage Job Postings</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-linkedin-muted group-hover:text-linkedin-blue transition-colors" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Applications Table */}
          <div className="hf-card overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-linkedin-border flex items-center justify-between">
              <div>
                <h3 className="font-bold text-linkedin-text text-sm">Recent Candidates</h3>
                <p className="text-xs text-linkedin-muted mt-0.5">Latest applicants across positions</p>
              </div>
              <Link
                to="/admin/applications"
                className="text-xs font-semibold flex items-center gap-1 transition-colors"
                style={{ color: '#0A66C2' }}
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full hf-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th className="hidden sm:table-cell">Position</th>
                    <th>Stage</th>
                    <th className="hidden md:table-cell">Applied</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [1, 2, 3].map((n) => (
                      <tr key={n}>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <td key={i}>
                            <div className="skeleton h-4 rounded w-full" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : stats?.recentApplications?.length > 0 ? (
                    stats.recentApplications.map((app) => (
                      <tr key={app._id}>
                        <td>
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #0A66C2, #4F46E5)' }}>
                              {app.candidateId?.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div>
                              <div className="font-semibold text-linkedin-text text-sm">{app.candidateId?.name}</div>
                              <div className="text-xs text-linkedin-muted hidden sm:block">{app.candidateId?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell">
                          <span className="font-medium text-linkedin-text text-sm">{app.jobId?.title}</span>
                        </td>
                        <td>
                          <StagePill stage={app.stage} />
                        </td>
                        <td className="hidden md:table-cell text-linkedin-muted text-xs">
                          {formatDate(app.createdAt)}
                        </td>
                        <td className="text-right">
                          <Link
                            to={`/admin/applications/${app._id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
                            style={{ background: '#EAF4FF', color: '#0A66C2' }}
                          >
                            Review
                            <ChevronRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-linkedin-muted text-sm">
                        <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        No applications yet.
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
