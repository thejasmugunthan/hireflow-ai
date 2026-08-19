import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  Activity,
  Layers,
  Cpu,
  CheckCircle2,
} from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('admin@enter.in');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@enter.in');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen flex bg-[#F6F9FD] text-slate-900 selection:bg-blue-500 selection:text-white">
      {/* ── LEFT MODERN SHOWCASE PANEL ───────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[520px] flex-shrink-0 p-12 relative overflow-hidden text-white"
        style={{
          background: 'radial-gradient(ellipse at top left, #1d4ed8 0%, #0A66C2 45%, #0B192C 100%)',
        }}
      >
        {/* Background ambient lighting effects */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex items-center justify-between relative z-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-white block">HireFlow</span>
              <span className="text-[10px] font-bold text-blue-200 tracking-widest uppercase">Admin Workspace</span>
            </div>
          </Link>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/15 text-blue-100">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            System Live
          </span>
        </div>

        {/* Center: Unique Interactive Floating Pipeline Dashboard Preview */}
        <div className="relative z-10 my-auto py-8 space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-300">
              Talent Operating System
            </span>
            <h2 className="text-3xl font-black text-white leading-tight">
              Recruiter Command Center
            </h2>
          </div>

          {/* Frosted Glass Live Widget */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/15 shadow-2xl space-y-4">
            {/* Widget Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-300" />
                <span className="text-xs font-bold text-white">Live Pipeline Status</span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                100% Encrypted
              </span>
            </div>

            {/* Visual Stage Progress Nodes */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {[
                { name: 'Applied', count: '12', color: 'bg-blue-400' },
                { name: 'R1 Screen', count: '8', color: 'bg-indigo-400' },
                { name: 'R2 Tech', count: '5', color: 'bg-amber-400' },
                { name: 'Approved', count: '3', color: 'bg-emerald-400' },
              ].map((st) => (
                <div key={st.name} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-sm font-black text-white">{st.count}</div>
                  <div className="text-[10px] text-blue-200 font-medium truncate">{st.name}</div>
                  <div className={`w-full h-1 rounded-full ${st.color} mt-1.5 opacity-80`} />
                </div>
              ))}
            </div>

            {/* AI Screening Indicator */}
            <div className="p-3 rounded-xl bg-black/20 border border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-500/30 flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-blue-300" />
                </div>
                <div>
                  <div className="font-semibold text-white">Automated AI Parser</div>
                  <div className="text-[10px] text-blue-200">Instant Resume & Plagiarism Audit</div>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-blue-200 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-300" />
            <span>256-Bit TLS Secured Admin Session</span>
          </div>
          <span>v2.4.0</span>
        </div>
      </div>

      {/* ── RIGHT LOGIN CARD ─────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative">
        <div className="w-full max-w-md space-y-6 animate-fade-in-up">

          {/* Mobile Header */}
          <div className="lg:hidden text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-md" style={{ background: '#1677FF' }}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">HireFlow AI</h1>
            <p className="text-xs text-slate-500 font-medium">Recruitment Team Portal</p>
          </div>

          {/* Login Box */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-6">
            <div className="hidden lg:block space-y-1">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Sign In</h1>
              <p className="text-xs text-slate-500">Access candidate applications and manage your hiring pipeline</p>
            </div>

            {/* Quick Demo Credentials Autofill Banner */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs">
              <div className="flex items-center gap-2 text-blue-700">
                <ShieldCheck className="w-4 h-4 flex-shrink-0 text-blue-600" />
                <span className="font-semibold">Demo: admin@enter.in / admin123</span>
              </div>
              <button
                type="button"
                onClick={handleFillDemo}
                className="px-3 py-1 rounded-xl text-[11px] font-bold text-white transition-all shadow-xs active:scale-95 flex-shrink-0"
                style={{ background: '#1677FF' }}
              >
                Auto Fill
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium animate-fade-in-up">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@enter.in"
                    className="w-full pl-10 pr-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your admin password"
                    className="w-full pl-10 pr-10 py-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl font-bold text-xs text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                style={{ background: '#1677FF' }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Hiring Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-slate-100">
              <Link
                to="/"
                className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
              >
                ← Return to Public Job Board
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
