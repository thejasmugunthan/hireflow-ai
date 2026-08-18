import React from 'react';
import { Check, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';
import { STAGE_CONFIG } from '../../utils/stageHelpers';

export const StageTimeline = ({ application }) => {
  const currentStage = application?.stage || 'Applied';
  const history = application?.stageHistory || [];

  const mainPipeline = ['Applied', 'R1', 'R2', 'R3', 'Approved'];
  const isRejected = currentStage.includes('Reject');

  const getStageIndex = (st) => {
    if (st.includes('Reject')) return -1;
    return mainPipeline.indexOf(st);
  };

  const currentIndex = getStageIndex(currentStage);

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-6">
      <div>
        <h3 className="font-bold text-base text-white">Application Pipeline & Timeline</h3>
        <p className="text-xs text-slate-400">Chronological stage movements and hiring milestones</p>
      </div>

      {/* Horizontal Pipeline Steps */}
      <div className="py-2">
        <div className="flex items-center justify-between relative">
          {/* Background Connecting Line */}
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-800 z-0"></div>

          {mainPipeline.map((stageName, index) => {
            const isCompleted = currentIndex > index || (currentStage === 'Approved' && index <= 4);
            const isCurrent = currentStage === stageName;
            const isFuture = currentIndex < index && !isRejected;

            return (
              <div key={stageName} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all duration-300 ${
                    isCurrent
                      ? 'bg-brand-600 border-white text-white shadow-lg shadow-brand-500/50 scale-110'
                      : isCompleted
                      ? 'bg-emerald-600 border-emerald-400 text-white'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span
                  className={`text-[11px] font-semibold mt-2 ${
                    isCurrent
                      ? 'text-white'
                      : isCompleted
                      ? 'text-emerald-400'
                      : 'text-slate-400'
                  }`}
                >
                  {STAGE_CONFIG[stageName]?.label || stageName}
                </span>
              </div>
            );
          })}
        </div>

        {/* Rejection Alert if currently in a rejected stage */}
        {isRejected && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 flex items-center gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>
              Candidate application concluded with <strong>{currentStage}</strong> status.
            </span>
          </div>
        )}
      </div>

      {/* Stage History Chronological Log */}
      <div className="border-t border-slate-800/80 pt-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>Stage History Log ({history.length})</span>
        </h4>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {history.map((event, idx) => (
            <div key={idx} className="relative group">
              {/* Dot */}
              <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-brand-500 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-400"></div>
              </div>

              {/* Content */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">
                    {event.from ? `${event.from} ➔ ${event.to}` : `Initiated at ${event.to}`}
                  </span>
                  {event.reason && (
                    <span className="text-xs text-slate-400 italic font-normal">
                      — &ldquo;{event.reason}&rdquo;
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 flex-shrink-0">
                  {formatDateTime(event.changedAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
