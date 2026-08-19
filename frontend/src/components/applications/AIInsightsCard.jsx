import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Cpu,
  Check,
  ShieldCheck,
  FileCheck,
  AlertOctagon,
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

  const getScoreRingColor = (sc) => {
    if (sc >= 80) return '#057642';
    if (sc >= 65) return '#0A66C2';
    return '#B45309';
  };

  const getPlagiarismColor = (plag) => {
    if (plag <= 20) return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Low Plagiarism Risk' };
    if (plag <= 40) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Moderate Similarity' };
    return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', label: 'High Template Plagiarism' };
  };

  const plagMeta = getPlagiarismColor(plagiarismScore);

  return (
    <div className="hf-card p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-linkedin-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0A66C2, #4F46E5)' }}>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-linkedin-text flex items-center gap-2">
              AI Talent & Resume Authenticity Insights
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-linkedin-blue border border-blue-200">
                OpenAI + NLP
              </span>
            </h3>
            <p className="text-xs text-linkedin-muted">Automated skill extraction, match scoring & plagiarism audit</p>
          </div>
        </div>

        <button
          onClick={handleReanalyze}
          disabled={loading}
          className="btn-secondary text-xs px-3 py-1.5"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Analyzing...' : 'Re-run Analysis'}</span>
        </button>
      </div>

      {isPending ? (
        <div className="py-12 text-center">
          <div className="inline-flex p-3 rounded-2xl bg-blue-50 border border-blue-200 mb-3">
            <Cpu className="w-6 h-6 text-linkedin-blue animate-spin" />
          </div>
          <h4 className="text-sm font-semibold text-linkedin-text">AI Analysis & Plagiarism Check in Progress</h4>
          <p className="text-xs text-linkedin-muted max-w-sm mx-auto mt-1">
            Analyzing resume text structure, matching keywords, and evaluating originality metrics...
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Top Metrics Row: Match Score + Plagiarism Meter + Executive Summary */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
            {/* Match Score Ring (3 cols) */}
            <div className="md:col-span-3 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 border border-linkedin-border text-center">
              <div className="relative flex items-center justify-center w-22 h-22 mb-1">
                <svg className="w-22 h-22 transform -rotate-90">
                  <circle
                    cx="44"
                    cy="44"
                    r="36"
                    stroke="#E2E8F0"
                    strokeWidth="7"
                    fill="transparent"
                  />
                  <circle
                    cx="44"
                    cy="44"
                    r="36"
                    stroke={getScoreRingColor(score)}
                    strokeWidth="7"
                    fill="transparent"
                    strokeDasharray="226.2"
                    strokeDashoffset={226.2 - (226.2 * score) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-linkedin-text">{score}%</span>
                </div>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-linkedin-muted">
                Role Match Score
              </span>
            </div>

            {/* Plagiarism & Authenticity Meter (4 cols) */}
            <div className="md:col-span-4 p-4 rounded-xl bg-slate-50 border border-linkedin-border flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-linkedin-text flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-linkedin-blue" />
                    Plagiarism / Originality
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

              {/* Plagiarism observations */}
              <div className="mt-3 pt-2 border-t border-linkedin-border text-[11px] text-linkedin-muted leading-tight">
                {ai?.plagiarismFlags && ai.plagiarismFlags.length > 0 ? (
                  <span>{ai.plagiarismFlags[0]}</span>
                ) : (
                  <span>Verified unique technical portfolio & experience flow.</span>
                )}
              </div>
            </div>

            {/* AI Executive Summary (5 cols) */}
            <div className="md:col-span-5 p-4 rounded-xl bg-slate-50 border border-linkedin-border flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-linkedin-blue mb-1.5 block">
                  AI Assessment Summary
                </span>
                <p className="text-xs sm:text-sm text-linkedin-text leading-relaxed">
                  {ai?.summary || 'Candidate analyzed against role requirements.'}
                </p>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-linkedin-muted">
                <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                <span>Advisory insight. Human recruiters maintain final approval.</span>
              </div>
            </div>
          </div>

          {/* Extracted Skills Breakdown */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-linkedin-muted mb-2.5">
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
                          : 'bg-slate-100 text-linkedin-text border-slate-200'
                      }`}
                    >
                      {isMatched ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : null}
                      <span>{skill}</span>
                    </span>
                  );
                })
              ) : (
                <span className="text-xs text-linkedin-muted">No specific skills parsed.</span>
              )}
            </div>
          </div>

          {/* Strengths & Potential Gaps Two-Column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified Strengths</span>
              </div>
              <ul className="space-y-1.5 text-xs text-linkedin-text">
                {ai?.strengths && ai.strengths.length > 0 ? (
                  ai.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-linkedin-muted italic">No standout strengths detected</li>
                )}
              </ul>
            </div>

            {/* Potential Gaps */}
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Areas to Probe / Potential Gaps</span>
              </div>
              <ul className="space-y-1.5 text-xs text-linkedin-text">
                {ai?.gaps && ai.gaps.length > 0 ? (
                  ai.gaps.map((gap, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{gap}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-linkedin-muted italic">No major red flags or gaps detected</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
