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
  Search,
  Building2,
  TrendingUp,
  User,
  Users,
  CheckCircle2,
  SearchCode,
  Star,
  Check,
  Send,
  BarChart3,
  Cpu,
  Layers,
  ShieldCheck,
} from 'lucide-react';

export const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');

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
    const matchesSearch =
      job.title?.toLowerCase().includes(q) ||
      job.location?.toLowerCase().includes(q) ||
      job.skills?.some((s) => s.toLowerCase().includes(q));

    const matchesType =
      selectedType === 'all' ||
      job.employmentType?.toLowerCase() === selectedType.toLowerCase();

    return matchesSearch && matchesType;
  });

  const employmentTypeColor = (type) => {
    const map = {
      'Full-Time': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Part-Time': 'bg-amber-50 text-amber-700 border-amber-200',
      'Contract': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'Internship': 'bg-blue-50 text-blue-700 border-blue-200',
    };
    return map[type] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFD] text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      <Navbar />

      <main className="flex-1 overflow-x-hidden">
        {/* ── HERO SECTION (MATCHING REFERENCE DESIGN) ────────────────────── */}
        <section className="relative pt-8 pb-16 md:pt-16 md:pb-24 overflow-hidden bg-gradient-to-b from-white via-[#F6F9FD] to-[#EDF4FE]">
          {/* Subtle Background Dot Grids */}
          <div className="absolute top-10 right-10 w-36 h-36 opacity-30 pointer-events-none hidden lg:block" style={{ backgroundImage: 'radial-gradient(#1677FF 1.5px, transparent 1.5px)', backgroundSize: '14px 14px' }} />
          <div className="absolute bottom-6 left-8 w-44 h-44 opacity-25 pointer-events-none hidden lg:block" style={{ backgroundImage: 'radial-gradient(#1677FF 1.5px, transparent 1.5px)', backgroundSize: '14px 14px' }} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

              {/* Left Column: Heading + Value Proposition + CTA */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                {/* Pill Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border border-blue-200/80 bg-blue-50/90 text-blue-600 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>AI-Powered Hiring Platform</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                  Find Your Dream <br className="hidden sm:inline" />
                  <span className="text-[#1677FF]">Career Opportunity</span>
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  Browse top engineering and tech roles. Submit applications with AI-powered resume screening and enjoy transparent, stage-by-stage hiring feedback.
                </p>

                {/* 3 Metric Badges */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-1">
                  {/* Stat 1 */}
                  <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-xs px-3.5 py-2 rounded-2xl border border-blue-100 shadow-xs">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-extrabold text-sm text-slate-900 leading-tight">
                        {jobs.length > 0 ? `${jobs.length}+` : '10+'}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">Open Roles</div>
                    </div>
                  </div>

                  {/* Stat 2 */}
                  <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-xs px-3.5 py-2 rounded-2xl border border-blue-100 shadow-xs">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-extrabold text-sm text-slate-900 leading-tight">Fast AI</div>
                      <div className="text-[11px] text-slate-500 font-medium">Screening</div>
                    </div>
                  </div>

                  {/* Stat 3 */}
                  <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-xs px-3.5 py-2 rounded-2xl border border-blue-100 shadow-xs">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-extrabold text-sm text-slate-900 leading-tight">Transparent</div>
                      <div className="text-[11px] text-slate-500 font-medium">Pipeline</div>
                    </div>
                  </div>
                </div>

                {/* Hero CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
                  <Link
                    to="/apply"
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 active:scale-95"
                    style={{ background: '#1677FF' }}
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Apply Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/admin/login"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-blue-600 bg-white border border-blue-200 hover:bg-blue-50/50 hover:border-blue-300 shadow-xs transition-all active:scale-95"
                  >
                    <User className="w-4 h-4 text-blue-600" />
                    <span>Hiring Team Login</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Interactive Illustration / Dashboard Mockup */}
              <div className="lg:col-span-5 flex justify-center relative">
                {/* Decorative glow */}
                <div className="absolute inset-0 bg-blue-400/10 blur-3xl rounded-full pointer-events-none transform scale-90" />

                {/* Main Glass Mockup Container */}
                <div className="relative w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-blue-100 shadow-2xl shadow-blue-500/10 space-y-4 animate-fade-in-up">

                  {/* Window Browser Header with Dots */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500/70" />
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-400/50" />
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-300/30" />
                    </div>
                    <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                      Live Candidate Tracker
                    </span>
                  </div>

                  {/* Mockup Line Bars */}
                  <div className="space-y-2.5 pt-1">
                    <div className="h-3.5 bg-blue-500/80 rounded-full w-28" />
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                          JD
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="h-2.5 bg-slate-300 rounded w-24" />
                          <div className="h-2 bg-slate-200 rounded w-36" />
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Passed R1
                        </span>
                      </div>

                      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                          AK
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="h-2.5 bg-slate-300 rounded w-28" />
                          <div className="h-2 bg-slate-200 rounded w-32" />
                        </div>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          95% Match
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Floating Candidate Star Rating Pill (Bottom Left/Center) */}
                  <div className="p-3 rounded-2xl bg-white border border-blue-100 shadow-lg flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm" style={{ background: '#1677FF' }}>
                      TM
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-800">Thejas M</div>
                      <div className="flex items-center gap-1 text-amber-400 text-xs mt-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <span className="ml-auto text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      Approved
                    </span>
                  </div>

                  {/* Floating Glass Magnifying Glass Tag */}
                  <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-blue-200 shadow-xl flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Search className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-left pr-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">AI Screening</div>
                      <div className="text-xs font-extrabold text-blue-600">Keyword Match ✓</div>
                    </div>
                  </div>

                  {/* Floating Checkmark Pill */}
                  <div className="absolute -bottom-3 -left-3 bg-white rounded-full px-3 py-1.5 border border-blue-100 shadow-md flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span>Instant Feedback</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── MOBILE QUICK ACTION BAR (DEDICATED MOBILE VIEW) ─────────────── */}
        <section className="sm:hidden px-4 py-3 bg-white border-y border-slate-100 sticky top-16 z-30 shadow-xs">
          <div className="flex items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search roles..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>
            <Link
              to="/apply"
              className="px-3 py-2 rounded-xl text-xs font-bold text-white shadow-xs whitespace-nowrap"
              style={{ background: '#1677FF' }}
            >
              Apply Now
            </Link>
          </div>
        </section>

        {/* ── KEY FEATURES HIGHLIGHT ───────────────────────────────────────── */}
        <section className="py-12 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl bg-[#F8FAFD] border border-blue-50/80 hover:border-blue-200 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Cpu className="w-6 h-6" style={{ color: '#1677FF' }} />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1.5">
                  AI Candidate Insights
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Automated resume parsing calculates role alignment scores, tech stack matches, verified strengths, and potential gaps.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl bg-[#F8FAFD] border border-blue-50/80 hover:border-blue-200 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <Layers className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1.5">
                  Structured Hiring Pipeline
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Clear progressive evaluation from Applied ➔ R1 ➔ R2 ➔ R3 ➔ Approved with interview star ratings and feedback history.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl bg-[#F8FAFD] border border-blue-50/80 hover:border-blue-200 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1.5">
                  Plagiarism & Cloud Integrity
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Direct MongoDB cloud resume persistence and AI authenticity checks detect boilerplate templates and ensure fair screening.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── JOB REQUISITIONS DIRECTORY ───────────────────────────────────── */}
        <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header & Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Available Openings
                <span className="ml-2.5 text-xs sm:text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  {jobs.length} Positions
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Explore engineering, product, and AI roles open for fast-track screening
              </p>
            </div>

            {/* Desktop Search & Type Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search title, skills, city..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 shadow-xs"
                />
              </div>

              {/* Type Filter Pill Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {['all', 'Full-time', 'Internship', 'Contract'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedType === type
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                    style={selectedType === type ? { background: '#1677FF' } : {}}
                  >
                    {type === 'all' ? 'All Roles' : type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Job Listings Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-56 bg-white rounded-2xl border border-slate-200 p-6 animate-pulse" />
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 py-16 px-4 text-center">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-base text-slate-800">No positions match your criteria</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                Try searching with different keywords or reset your employment type filter.
              </p>
              <button
                onClick={() => { setSearch(''); setSelectedType('all'); }}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100"
              >
                Clear Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 p-6 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Top Header: Building Icon + Employment Type */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
                        <Building2 className="w-5 h-5" style={{ color: '#1677FF' }} />
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${employmentTypeColor(job.employmentType)}`}>
                        {job.employmentType}
                      </span>
                    </div>

                    {/* Job Title & Details */}
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {job.status}
                        </span>
                      </div>
                    </div>

                    {/* Job Description */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Skills Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.skills?.slice(0, 4).map((sk, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-medium text-slate-700"
                        >
                          {sk}
                        </span>
                      ))}
                      {job.skills?.length > 4 && (
                        <span className="text-[11px] text-slate-400 self-center">
                          +{job.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active Hiring
                    </span>
                    <Link
                      to={`/apply?jobId=${job._id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all active:scale-95"
                      style={{ background: '#1677FF' }}
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

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-xs" style={{ background: '#1677FF' }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-sm text-slate-900">HireFlow</span>
          </div>

          <p className="text-xs text-slate-500 text-center sm:text-left">
            © 2026 HireFlow || Designed & Developed by Thejas.
          </p>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
            <Link to="/apply" className="hover:text-blue-600 transition-colors">Apply</Link>
            <Link to="/admin/login" className="hover:text-blue-600 transition-colors">Employer Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
