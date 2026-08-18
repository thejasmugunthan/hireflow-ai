import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Briefcase, Lock, ArrowRight } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-violet-500 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-brand-300">
              HireFlow <span className="text-brand-400 font-bold text-sm px-1.5 py-0.5 rounded bg-brand-500/10 border border-brand-500/20">AI</span>
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-white ${
              location.pathname === '/' ? 'text-brand-400 font-semibold' : 'text-slate-400'
            }`}
          >
            Open Positions
          </Link>

          <Link
            to="/apply"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-brand-600 to-violet-600 text-white shadow-lg shadow-brand-600/25 hover:from-brand-500 hover:to-violet-500 hover:shadow-brand-500/35 transition-all duration-200 active:scale-95"
          >
            <Briefcase className="w-4 h-4" />
            <span>Apply Now</span>
          </Link>

          <div className="h-5 w-px bg-slate-800 hidden sm:block"></div>

          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-850 transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Admin Portal</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};
