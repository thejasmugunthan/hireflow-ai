import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, User, Menu, X, Sparkles } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20" style={{ background: 'linear-gradient(135deg, #1677FF 0%, #0A66C2 100%)' }}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                HireFlow
              </span>
              {/* <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-600 border border-blue-200">
                AI
              </span> */}
            </div>
          </Link>

          {/* Desktop Nav Buttons */}
          <nav className="hidden md:flex items-center gap-3">
            {/* <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                location.pathname === '/'
                  ? 'text-blue-600 bg-blue-50/80 border border-blue-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Open Positions
            </Link> */}

            <Link
              to="/apply"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all active:scale-95"
              style={{ background: '#1677FF' }}
            >
              <Briefcase className="w-4 h-4" />
              <span>Apply Now</span>
            </Link>

            <div className="h-5 w-px bg-slate-200 mx-1" />

            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <User className="w-4 h-4 text-slate-400" />
              <span>For Employers</span>
            </Link>
          </nav>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/apply"
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 shadow-sm flex items-center gap-1.5"
              style={{ background: '#1677FF' }}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Apply</span>
            </Link>
            <button
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 flex flex-col shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-xs" style={{ background: '#1677FF' }}>
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-extrabold text-base text-slate-900">HireFlow AI</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-5 space-y-2 overflow-y-auto">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span>Explore Open Positions</span>
              </Link>

              <Link
                to="/apply"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span>Fast-Track Application</span>
              </Link>

              <div className="my-2 border-t border-slate-100" />

              <Link
                to="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span>Hiring Team Portal</span>
              </Link>
            </nav>

            <div className="p-5 border-t border-slate-100 space-y-2">
              <Link
                to="/apply"
                onClick={() => setMobileOpen(false)}
                className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white text-center block shadow-md shadow-blue-500/20"
                style={{ background: '#1677FF' }}
              >
                Apply for a Role
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
};
