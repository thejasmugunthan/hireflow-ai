import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Cpu,
  Check,
  XCircle,
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
  const isPending = ai?.status === 'pending';

  const getScoreColor = (sc) => {
    if (sc >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-emerald-500/20';
    if (sc >= 65) return 'text-brand-400 border-brand-500/30 bg-brand-500/10 shadow-brand-500/20';
    return 'text-amber-400 border-amber-500/30 bg-amber-500/10 shadow-amber-500/20';
  };

  const getScoreRingColor = (sc) => {
    if (sc >= 80) return '#10b981';
    if (sc >= 65) return '#6366f1';
    return '#f59e0b';
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-violet-500 flex items-center justify-center shadow-md shadow-brand-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              AI Candidate Insights
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                Advisory Only
              </span>
            </h3>
            <p className="text-xs text-slate-400">Automated resume extraction & skill matching</p>
          </div>
        </div>

        <button
          onClick={handleReanalyze}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-brand-500/40 transition-all disabled:opacity-50"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-brand-400' : ''}`} />
          <span>{loading ? 'Analyzing...' : 'Re-run Analysis'}</span>
        </button>
      </div>

      {isPending ? (
        <div className="py-12 text-center">
          <div className="inline-flex p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20 mb-3 animate-subtle-pulse">
            <Cpu className="w-6 h-6 text-brand-400 animate-spin" />
          </div>
          <h4 className="text-sm font-semibold text-white">AI Analysis in Progress</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Analyzing candidate resume structure and computing job alignment scores...
          </p>
        </div>
      ) : (
        <div className="space-y-6 pt-5">
          {/* Match Score & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Score Ring */}
            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 text-center">
              <div className="relative flex items-center justify-center w-24 h-24 mb-2">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#1e293b"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke={getScoreRingColor(score)}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * score) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-white">{score}%</span>
                </div>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Match Score
              </span>
            </div>

            {/* AI Executive Summary */}
            <div className="md:col-span-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400 mb-1.5 block">
                  AI Assessment Summary
                </span>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {ai?.summary || 'Candidate analyzed against role requirements.'}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Human decision-making retains final authority over all pipeline stages.</span>
              </div>
            </div>
          </div>

          {/* Skills Breakdown */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Extracted Skills & Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {ai?.skills && ai.skills.length > 0 ? (
                ai.skills.map((skill, index) => {
                  const isMatched = ai.matchedSkills?.includes(skill);
                  return (
                    <span
                      key={index}
                      className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg border font-medium ${
                        isMatched
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : 'bg-slate-900 text-slate-300 border-slate-800'
                      }`}
                    >
                      {isMatched ? <Check className="w-3 h-3 text-emerald-400" /> : null}
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
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/30 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verified Strengths</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {ai?.strengths && ai.strengths.length > 0 ? (
                  ai.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400 italic">No standout strengths detected</li>
                )}
              </ul>
            </div>

            {/* Potential Gaps */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/30 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Areas to Probe / Potential Gaps</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {ai?.gaps && ai.gaps.length > 0 ? (
                  ai.gaps.map((gap, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
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
