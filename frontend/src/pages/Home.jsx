import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { jobService } from '../services/jobService';
import {
  Sparkles,
  ArrowRight,
  Briefcase,
  MapPin,
  Clock,
  Cpu,
  Layers,
  ShieldCheck,
  Search,
  Building2,
  TrendingUp,
  Users,
} from 'lucide-react';

export const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await jobService.getActiveJobs();
        setJobs(response.data || []);
      } catch (error) {
        console.error('Failed to load active jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const q = search.toLowerCase();
    return (
      job.title?.toLowerCase().includes(q) ||
      job.location?.toLowerCase().includes(q) ||
      job.skills?.some((s) => s.toLowerCase().includes(q))
    );
  });

  const employmentTypeColor = (type) => {
    const map = {
      'Full-Time': 'badge-green',
      'Part-Time': 'badge-amber',
      'Contract': 'badge-indigo',
      'Internship': 'badge-blue',
    };
    return map[type] || 'badge-slate';
  };

  return (
    <div className="min-h-screen flex flex-col bg-linkedin-bg">
      <Navbar />

      <main className="flex-1">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="bg-white border-b border-linkedin-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
            <div className="flex flex-col lg:flex-row items-center gap-10">

              {/* Left Content */}
              <div className="flex-1 text-center lg:text-left space-y-5 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border" style={{ background: '#EAF4FF', borderColor: '#BFDBFE', color: '#0A66C2' }}>
                  <Sparkles className="w-3.5 h-3.5" />
                  AI-Powered Hiring Platform
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-linkedin-text leading-tight tracking-tight">
                  Find Your Dream{' '}
                  <span style={{ color: '#0A66C2' }}>Career Opportunity</span>
                </h1>

                <p className="text-base text-linkedin-muted max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Browse top engineering and tech roles. Submit applications with AI-powered resume screening and enjoy transparent, stage-by-stage hiring feedback.
                </p>

                {/* Stats Row */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-2">
                  {[
                    { icon: Briefcase, label: `${jobs.length}+ Open Roles` },
                    { icon: Users, label: 'Fast AI Screening' },
                    { icon: TrendingUp, label: 'Transparent Pipeline' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-1.5 text-sm text-linkedin-muted font-medium">
                      <Icon className="w-4 h-4" style={{ color: '#0A66C2' }} />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
                  <Link to="/apply" className="btn-primary text-sm px-6 py-3">
                    <Briefcase className="w-4 h-4" />
                    Apply Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/admin/login"
                    className="btn-secondary text-sm px-6 py-3"
                  >
                    Hiring Team Login
                  </Link>
                </div>
              </div>

              {/* Right Illustration Card */}
              <div className="flex-shrink-0 w-full max-w-sm lg:max-w-xs xl:max-w-sm">
                <div className="hf-card p-6 space-y-4 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #0A66C2, #4F46E5)' }}>H</div>
                    <div>
                      <div className="font-semibold text-linkedin-text text-sm">HireFlow AI</div>
                      <div className="text-xs text-linkedin-muted">Next-Gen Hiring Platform</div>
                    </div>
                    <span className="ml-auto badge badge-green">Hiring</span>
                  </div>
                  <div className="space-y-2 pt-1">
                    {['React Developer', 'ML Engineer', 'Product Manager'].map((role) => (
                      <div key={role} className="flex items-center justify-between py-2 px-3 rounded-lg bg-linkedin-bg hover:bg-linkedin-lightblue transition-colors cursor-pointer">
                        <span className="text-xs font-medium text-linkedin-text">{role}</span>
                        <span className="text-xs text-linkedin-blue font-semibold">View →</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2">
                    <Link to="/apply" className="btn-primary w-full text-sm py-2.5">
                      See All Open Positions
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES BANNER ──────────────────────── */}
        <section className="py-10 border-b border-linkedin-border bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: Cpu,
                  color: '#0A66C2',
                  bg: '#EAF4FF',
                  title: 'AI Candidate Insights',
                  desc: 'Automated resume parsing generates skill match scores, strengths, and gap highlights for recruiters.',
                },
                {
                  icon: Layers,
                  color: '#059669',
                  bg: '#D1FAE5',
                  title: 'Structured Hiring Pipeline',
                  desc: 'Applied → R1 → R2 → R3 → Approved stage workflow with full interview logs and ratings.',
                },
                {
                  icon: ShieldCheck,
                  color: '#7C3AED',
                  bg: '#EDE9FE',
                  title: 'Secure & Fair Process',
                  desc: 'JWT auth + duplicate prevention ensures a transparent and merit-based hiring experience.',
                },
              ].map(({ icon: Icon, color, bg, title, desc }) => (
                <div key={title} className="hf-card p-5 flex gap-4 items-start hf-card-hover">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-linkedin-text text-sm mb-1">{title}</h3>
                    <p className="text-xs text-linkedin-muted leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── JOB LISTINGS ─────────────────────────── */}
        <section className="py-10 max-w-6xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-linkedin-text">
                Open Positions
                <span className="ml-2 text-sm font-normal text-linkedin-muted">({jobs.length} available)</span>
              </h2>
              <p className="text-sm text-linkedin-muted mt-0.5">Explore and apply for your next opportunity</p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-linkedin-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search roles, skills, location..."
                className="hf-input pl-10 py-2.5 text-sm"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          {/* Job Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="hf-card p-5 h-48 skeleton" />
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="hf-card py-16 text-center">
              <Briefcase className="w-10 h-10 text-linkedin-muted mx-auto mb-3 opacity-50" />
              <h3 className="font-semibold text-linkedin-text">No positions found</h3>
              <p className="text-sm text-linkedin-muted mt-1">Try adjusting your search keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredJobs.map((job, idx) => (
                <div
                  key={job._id}
                  className="hf-card hf-card-hover p-5 flex flex-col justify-between animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="space-y-3">
                    {/* Company Icon + Type */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#EAF4FF' }}>
                        <Building2 className="w-5 h-5" style={{ color: '#0A66C2' }} />
                      </div>
                      <span className={`badge ${employmentTypeColor(job.employmentType)}`}>
                        {job.employmentType}
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="font-bold text-linkedin-text text-base leading-snug">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-linkedin-muted">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {job.status}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-linkedin-muted line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5">
                      {job.skills?.slice(0, 4).map((skill, i) => (
                        <span key={i} className="badge badge-slate text-xs">
                          {skill}
                        </span>
                      ))}
                      {job.skills?.length > 4 && (
                        <span className="text-xs text-linkedin-muted self-center">+{job.skills.length - 4} more</span>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 mt-3 border-t border-linkedin-border flex items-center justify-between">
                    <span className="text-xs text-linkedin-muted font-medium">Fast-track review</span>
                    <Link
                      to={`/apply?jobId=${job._id}`}
                      className="btn-primary text-xs px-4 py-2"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-linkedin-border py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0A66C2, #4F46E5)' }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm text-linkedin-text">HireFlow AI</span>
          </div>
          <p className="text-xs text-linkedin-muted">© 2026 HireFlow AI — Next-Gen Hiring & Candidate Management</p>
          <div className="flex items-center gap-4 text-xs text-linkedin-muted">
            <Link to="/admin/login" className="hover:text-linkedin-blue transition-colors">For Employers</Link>
            <Link to="/apply" className="hover:text-linkedin-blue transition-colors">Apply</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
