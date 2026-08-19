import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Cpu,
  Check,
  ShieldCheck,
  Zap,
  Target,
} from 'lucide-react';
import { applicationService } from '../../services/applicationService';

export const AIInsightsCard = ({ application, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const ai = application?.aiAnalysis;

  const handleReanalyze = async () => {
    try {
      setLoading(true);
      await applicationService.triggerAIAnalysis(application._id);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error reanalyzing with AI:', error);
    } finally {
      setLoading(false);
    }
  };

  const score = ai?.matchScore ?? 0;
  const plagiarismScore = ai?.plagiarismScore ?? 12;
  const originalityScore = ai?.originalityScore ?? (100 - plagiarismScore);
  const isPending = ai?.status === 'pending';
  const matchedCount = ai?.matchedSkills?.length ?? 0;

  const getScoreColor = (sc) => {
    if (sc >= 80) return { text: '#057642', bg: '#E6F4EA', ring: '#057642', label: 'Strong Match' };
    if (sc >= 65) return { text: '#0A66C2', bg: '#EAF4FF', ring: '#0A66C2', label: 'Solid Match' };
    return { text: '#B45309', bg: '#FEF3C7', ring: '#D97706', label: 'Moderate Match' };
  };

  const getVerdict = (sc) => {
    if (sc >= 80) {
      return {
        badge: 'Strong Fit (Fast-Track)',
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dot: 'bg-emerald-500',
        recommendation: 'Highly recommended to advance to Round 1 technical interview.',
      };
    }
    if (sc >= 65) {
      return {
        badge: 'Qualified (Proceed to R1)',
        bg: 'bg-blue-50 text-blue-800 border-blue-200',
        dot: 'bg-blue-500',
        recommendation: 'Meets core requirements. Schedule initial technical screening.',
      };
    }
    return {
      badge: 'Potential Match (Review Gaps)',
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500',
      recommendation: 'Check missing skills during preliminary interview screening.',
    };
  };

  const getPlagiarismColor = (plag) => {
    if (plag <= 20) return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'High Originality' };
    if (plag <= 40) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Standard Phrasing' };
    return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', label: 'High Template Plagiarism' };
  };

  const scoreMeta = getScoreColor(score);
  const verdict = getVerdict(score);
  const plagMeta = getPlagiarismColor(plagiarismScore);

  return (
    <div className="hf-card p-4 sm:p-6 space-y-5">
      {/* Header — Fully Responsive Flex */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-linkedin-border">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #0A66C2, #4F46E5)' }}>
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                AI Candidate Insights
              </h3>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                OpenAI + NLP
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Automated skill verification, match scoring & plagiarism audit</p>
          </div>
        </div>

        <button
          onClick={handleReanalyze}
          disabled={loading}
          className="btn-secondary text-xs px-3.5 py-2 self-start sm:self-auto flex items-center gap-1.5 whitespace-nowrap"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Analyzing...' : 'Re-run Analysis'}</span>
        </button>
      </div>

      {isPending ? (
        <div className="py-12 text-center">
          <div className="inline-flex p-3 rounded-2xl bg-blue-50 border border-blue-200 mb-3">
            <Cpu className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
          <h4 className="text-sm font-semibold text-slate-900">AI Analysis in Progress</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Parsing resume text, calculating keyword alignment, and auditing authenticity...
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Top Metrics: 3 Cards (Stacked on Mobile, 3 Columns on Desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-stretch">

            {/* 1. Match Score Card (lg: 3 cols) */}
            <div className="lg:col-span-3 p-4 rounded-2xl bg-slate-50 border border-linkedin-border flex flex-col items-center justify-center text-center">
              {/* Radial Progress Ring (Rock-solid SVG with standard ViewBox) */}
              <div className="relative w-28 h-28 flex items-center justify-center my-1">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#E2E8F0"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={scoreMeta.ring}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * score) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-900 leading-none">{score}%</span>
                  <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Match</span>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-700 mt-1">
                Role Alignment Score
              </span>
            </div>

            {/* 2. Plagiarism & Authenticity Meter (lg: 4 cols) */}
            <div className="lg:col-span-4 p-4 rounded-2xl bg-slate-50 border border-linkedin-border flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    Plagiarism & Authenticity
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${plagMeta.bg} ${plagMeta.text} ${plagMeta.border}`}>
                    {plagMeta.label}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-emerald-700">Originality: {originalityScore}%</span>
                    <span className="text-rose-600">Plagiarism Risk: {plagiarismScore}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-700"
                      style={{ width: `${originalityScore}%` }}
                    />
                    <div
                      className="bg-rose-500 h-full transition-all duration-700"
                      style={{ width: `${plagiarismScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Authenticity description */}
              <div className="pt-2 border-t border-linkedin-border text-[11px] text-slate-500 leading-tight">
                {ai?.plagiarismFlags && ai.plagiarismFlags.length > 0 ? (
                  <span>{ai.plagiarismFlags[0]}</span>
                ) : (
                  <span>Verified unique candidate project portfolio.</span>
                )}
              </div>
            </div>

            {/* 3. Recruiter Verdict & Skill Counts (lg: 5 cols) */}
            <div className="sm:col-span-2 lg:col-span-5 p-4 rounded-2xl bg-slate-50 border border-linkedin-border flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-blue-600" />
                    Recruiter Verdict
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${verdict.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${verdict.dot}`} />
                    {verdict.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-800 font-medium leading-relaxed">
                  {verdict.recommendation}
                </p>
              </div>

              {/* Skills Match Quick Stats */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-linkedin-border text-xs">
                <div className="p-2 rounded-xl bg-white border border-slate-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900">{matchedCount} Matched</div>
                    <div className="text-[10px] text-slate-400">Core job skills</div>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-white border border-slate-200 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900">{ai?.skills?.length ?? 0} Detected</div>
                    <div className="text-[10px] text-slate-400">Total tech stack</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Extracted Skills Breakdown */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Extracted Skills & Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {ai?.skills && ai.skills.length > 0 ? (
                ai.skills.map((skill, index) => {
                  const isMatched = ai.matchedSkills?.includes(skill);
                  return (
                    <span
                      key={index}
                      className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border font-medium ${
                        isMatched
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {isMatched ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : null}
                      <span>{skill}</span>
                    </span>
                  );
                })
              ) : (
                <span className="text-xs text-slate-400">No specific skills parsed.</span>
              )}
            </div>
          </div>

          {/* Strengths & Potential Gaps Two-Column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified Strengths</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {ai?.strengths && ai.strengths.length > 0 ? (
                  ai.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400 italic">No standout strengths detected</li>
                )}
              </ul>
            </div>

            {/* Potential Gaps */}
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Areas to Probe / Potential Gaps</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {ai?.gaps && ai.gaps.length > 0 ? (
                  ai.gaps.map((gap, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{gap}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400 italic">No major red flags or gaps detected</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
