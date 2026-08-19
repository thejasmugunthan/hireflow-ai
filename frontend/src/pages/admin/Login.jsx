import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Lock, Mail, ArrowRight, AlertCircle, ShieldCheck, Eye, EyeOff } from 'lucide-react';

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
    <div className="min-h-screen flex bg-linkedin-bg">
      {/* Left Branding Panel - hidden on mobile */}
      <div
        className="hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 p-12 text-white"
        style={{ background: 'linear-gradient(160deg, #0A66C2 0%, #1d4ed8 50%, #4F46E5 100%)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl">HireFlow AI</span>
        </div>

        <div className="space-y-6">
          <h2 className="text-4xl font-extrabold leading-tight">
            Hire smarter,<br />not harder.
          </h2>
          <p className="text-blue-100 text-base leading-relaxed">
            AI-powered candidate screening, structured pipeline management, and real-time analytics — all in one platform.
          </p>
          <div className="space-y-3 pt-2">
            {[
              'AI-driven resume analysis & scoring',
              'Stage-by-stage hiring pipeline (R1→R2→R3)',
              'Real-time dashboard & insights',
              'Duplicate application prevention',
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm text-blue-50">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-blue-200 text-xs">© 2026 HireFlow AI — Candidate Management Platform</p>
      </div>

      {/* Right Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md space-y-6 animate-fade-in-up">

          {/* Mobile Brand Header */}
          <div className="lg:hidden text-center">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md" style={{ background: 'linear-gradient(135deg, #0A66C2, #4F46E5)' }}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-linkedin-text">HireFlow AI</h1>
            <p className="text-sm text-linkedin-muted mt-1">Admin Portal</p>
          </div>

          {/* Form Card */}
          <div className="hf-card p-8 space-y-5">
            <div className="hidden lg:block">
              <h1 className="text-2xl font-extrabold text-linkedin-text">Sign in</h1>
              <p className="text-sm text-linkedin-muted mt-1">Welcome back to your hiring dashboard</p>
            </div>

            {/* Demo Credentials Banner */}
            <div
              className="flex items-center justify-between p-3.5 rounded-xl text-sm"
              style={{ background: '#EAF4FF', border: '1px solid #BFDBFE' }}
            >
              <div className="flex items-center gap-2 text-linkedin-blue">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium text-xs">Demo: admin@enter.in / admin123</span>
              </div>
              <button
                type="button"
                onClick={handleFillDemo}
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-colors flex-shrink-0"
                style={{ background: '#0A66C2' }}
                onMouseOver={e => e.target.style.background = '#004182'}
                onMouseOut={e => e.target.style.background = '#0A66C2'}
              >
                Auto Fill
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm animate-fade-in-up">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-linkedin-text mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-linkedin-muted" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@enter.in"
                    className="hf-input"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-linkedin-text mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-linkedin-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="hf-input"
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-linkedin-muted hover:text-linkedin-text transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-sm mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2">
              <Link
                to="/"
                className="text-xs text-linkedin-muted hover:text-linkedin-blue transition-colors"
              >
                ← Back to Candidate Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
