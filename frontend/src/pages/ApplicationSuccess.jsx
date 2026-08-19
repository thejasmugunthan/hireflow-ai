import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { CheckCircle2, ArrowRight, Briefcase, Sparkles, Mail } from 'lucide-react';

export const ApplicationSuccess = () => {
  const location = useLocation();
  const state = location.state || {};

  return (
    <div className="min-h-screen flex flex-col bg-linkedin-bg">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-lg space-y-0 animate-fade-in-up">
          {/* Success Card */}
          <div className="hf-card p-8 sm:p-10 text-center space-y-6">
            {/* Check Icon */}
            <div className="relative mx-auto w-20 h-20">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto" style={{ background: 'linear-gradient(135deg, #D1FAE5, #6EE7B7)' }}>
                <CheckCircle2 className="w-10 h-10" style={{ color: '#057642' }} />
              </div>
              <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: '#057642' }} />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold" style={{ background: '#D1FAE5', color: '#057642' }}>
              <Sparkles className="w-3.5 h-3.5" />
              Application Submitted Successfully!
            </div>

            {/* Text */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-linkedin-text tracking-tight">
                Thank you, {state.candidateName || 'Candidate'}! 🎉
              </h1>
              <p className="text-sm text-linkedin-muted max-w-sm mx-auto leading-relaxed">
                Your application for <strong className="text-linkedin-text">{state.jobTitle || 'the selected role'}</strong> has been received by our hiring team.
              </p>
            </div>

            {/* Summary Box */}
            <div className="hf-card-flat p-4 text-left space-y-3 rounded-xl">
              <div className="flex items-center justify-between text-sm">
                <span className="text-linkedin-muted">Position</span>
                <span className="font-semibold text-linkedin-text">{state.jobTitle || 'Software Role'}</span>
              </div>
              <div className="border-t border-linkedin-border" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-linkedin-muted">Email</span>
                <span className="font-medium text-linkedin-text flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-linkedin-muted" />
                  {state.candidateEmail || '—'}
                </span>
              </div>
              <div className="border-t border-linkedin-border" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-linkedin-muted">Status</span>
                <span className="badge badge-blue">Applied · AI Screening Queued</span>
              </div>
            </div>

            {/* Next Steps */}
            <div className="p-4 rounded-xl text-sm text-left" style={{ background: '#EAF4FF', borderLeft: '3px solid #0A66C2' }}>
              <p className="font-semibold text-linkedin-text mb-1">What happens next?</p>
              <p className="text-xs text-linkedin-muted leading-relaxed">
                Our AI engine is analyzing your resume against the role requirements. The recruitment team will review your profile and contact you via email within 3–5 business days.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link to="/" className="btn-secondary text-sm px-5 py-2.5">
                <Briefcase className="w-4 h-4" />
                Explore More Positions
              </Link>
              <Link to="/apply" className="btn-primary text-sm px-5 py-2.5">
                Submit Another Application
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-linkedin-muted border-t border-linkedin-border bg-white">
        © 2026 HireFlow AI — Candidate Application & Hiring Management System
      </footer>
    </div>
  );
};
