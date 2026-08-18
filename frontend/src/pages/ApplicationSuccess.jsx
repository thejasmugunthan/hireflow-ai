import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { CheckCircle2, ArrowRight, Sparkles, Briefcase, Mail } from 'lucide-react';

export const ApplicationSuccess = () => {
  const location = useLocation();
  const state = location.state || {};

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-lg w-full glass-card rounded-3xl p-8 border border-slate-800 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

          {/* Animated checkmark icon */}
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Application Submitted Successfully</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Thank you, {state.candidateName || 'Candidate'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
              Your application for <strong>{state.jobTitle || 'the selected role'}</strong> has been received by our hiring team.
            </p>
          </div>

          {/* Summary Box */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-left space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Position:</span>
              <span className="font-bold text-white">{state.jobTitle || 'Software Role'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Candidate Email:</span>
              <span className="font-medium text-slate-200">{state.candidateEmail || '—'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Status:</span>
              <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20">
                Applied (AI Screening Queued)
              </span>
            </div>
          </div>

          {/* Info note */}
          <p className="text-xs text-slate-400 leading-relaxed">
            Our automated AI parser is screening your resume against role competencies. The recruitment team will review your profile and reach out via email for next steps.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Explore More Positions</span>
            </Link>

            <Link
              to="/apply"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20 transition-all active:scale-95"
            >
              <span>Submit Another Application</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
