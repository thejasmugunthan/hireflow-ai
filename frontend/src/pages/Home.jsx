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
  CheckCircle2,
  Cpu,
  Layers,
  ShieldCheck,
  Search,
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
    const titleMatch = job.title?.toLowerCase().includes(q);
    const locMatch = job.location?.toLowerCase().includes(q);
    const skillMatch = job.skills?.some((s) => s.toLowerCase().includes(q));
    return titleMatch || locMatch || skillMatch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-24 border-b border-slate-900">
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-brand-600/20 to-violet-600/20 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Next-Gen Candidate Application & Hiring Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight sm:leading-none">
              Accelerate Hiring with{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-violet-300 to-indigo-400">
                HireFlow AI
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Explore open engineering roles, submit your application with instant resume parsing, and experience a transparent, streamlined hiring pipeline.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/apply"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-violet-600 text-white font-bold text-sm shadow-xl shadow-brand-600/30 hover:from-brand-500 hover:to-violet-500 transition-all duration-200 active:scale-95"
              >
                <Briefcase className="w-4 h-4" />
                <span>Submit Job Application</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/admin/login"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <span>Hiring Team Login</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Highlights Banner */}
        <section className="py-12 border-b border-slate-900/60 bg-slate-950/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl glass-panel border border-slate-800/80 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-3">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">AI Candidate Insights</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Automated resume extraction generates skill match percentages, strengths, and gap highlights advisory to recruiters.
                </p>
              </div>

              <div className="p-5 rounded-2xl glass-panel border border-slate-800/80 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Structured Hiring Pipeline</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enforces clear stage workflows (Applied ➔ R1 ➔ R2 ➔ R3 ➔ Approved) with stage histories and interview rating logs.
                </p>
              </div>

              <div className="p-5 rounded-2xl glass-panel border border-slate-800/80 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Duplicate Prevention & RBAC</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Unique constraints stop duplicate submissions for the same role while JWT protects sensitive candidate and admin actions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Open Positions Grid */}
        <section id="positions" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-400 mb-1">
                Career Opportunities
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Featured Open Positions ({jobs.length})
              </h2>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, skill, or location..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-12">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-44 rounded-2xl bg-slate-900/50 border border-slate-800/80 animate-pulse"
                ></div>
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="py-16 text-center rounded-2xl glass-panel border border-slate-800/80">
              <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No positions match your query</h3>
              <p className="text-xs text-slate-400 mt-1">Try refining your search keyword.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredJobs.map((job) => (
                <div
                  key={job._id}
                  className="glass-panel glass-panel-hover rounded-2xl p-6 border border-slate-800/80 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-lg text-white group-hover:text-brand-300 transition-colors">
                        {job.title}
                      </h3>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-300 font-semibold border border-brand-500/20 flex-shrink-0">
                        {job.employmentType}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {job.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Skills pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.skills?.slice(0, 4).map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills?.length > 4 && (
                        <span className="text-[10px] text-slate-400 self-center">
                          +{job.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Fast-track review</span>
                    <Link
                      to={`/apply?jobId=${job._id}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20 transition-all active:scale-95"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-400">
        <p>© 2026 HireFlow AI — Candidate Application & Hiring Management System</p>
      </footer>
    </div>
  );
};
