import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, Lock, Menu, X, Sparkles } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-linkedin-border" style={{ boxShadow: '0 1px 4px rgba(0,0,0,.08)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg, #0A66C2, #4F46E5)' }}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-linkedin-text hidden sm:block">
              HireFlow <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ background: '#EAF4FF', color: '#0A66C2' }}>AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'text-linkedin-blue bg-linkedin-lightblue'
                  : 'text-linkedin-muted hover:text-linkedin-text hover:bg-linkedin-hover'
              }`}
            >
              Open Positions
            </Link>

            <Link
              to="/apply"
              className="btn-primary ml-2 text-sm"
            >
              <Briefcase className="w-4 h-4" />
              Apply Now
            </Link>

            <div className="h-5 w-px bg-linkedin-border mx-1" />

            <Link
              to="/admin/login"
              className="btn-ghost text-sm"
            >
              <Lock className="w-3.5 h-3.5" />
              For Employers
            </Link>
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-linkedin-hover text-linkedin-muted"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <>
          <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-72 bg-white z-50 flex flex-col shadow-2xl animate-slide-in">
            <div className="flex items-center justify-between p-4 border-b border-linkedin-border">
              <span className="font-bold text-linkedin-text">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-linkedin-hover">
                <X className="w-5 h-5 text-linkedin-muted" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-linkedin-text hover:bg-linkedin-lightblue hover:text-linkedin-blue transition-colors"
              >
                <Briefcase className="w-4 h-4" />
                Open Positions
              </Link>
              <Link
                to="/apply"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-linkedin-text hover:bg-linkedin-lightblue hover:text-linkedin-blue transition-colors"
              >
                <Briefcase className="w-4 h-4" />
                Apply Now
              </Link>
              <Link
                to="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-linkedin-muted hover:bg-linkedin-hover transition-colors"
              >
                <Lock className="w-4 h-4" />
                Employer Login
              </Link>
            </nav>

            <div className="p-4 border-t border-linkedin-border">
              <Link to="/apply" onClick={() => setMobileOpen(false)} className="btn-primary w-full">
                Apply for a Job
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
};
