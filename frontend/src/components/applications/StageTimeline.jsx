import React from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';
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
    <div className="hf-card p-6 space-y-6">
      <div>
        <h3 className="font-bold text-sm text-linkedin-text">Application Pipeline & Timeline</h3>
        <p className="text-xs text-linkedin-muted">Chronological stage movements and hiring milestones</p>
      </div>

      {/* Horizontal Pipeline Steps */}
      <div className="py-2">
        <div className="flex items-center justify-between relative">
          {/* Background Connecting Line */}
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-200 z-0"></div>

          {mainPipeline.map((stageName, index) => {
            const isCompleted = currentIndex > index || (currentStage === 'Approved' && index <= 4);
            const isCurrent = currentStage === stageName;

            return (
              <div key={stageName} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all duration-300 ${
                    isCurrent
                      ? 'border-linkedin-blue text-white shadow-md scale-110'
                      : isCompleted
                      ? 'border-emerald-500 text-white'
                      : 'bg-white border-slate-300 text-linkedin-muted'
                  }`}
                  style={{
                    background: isCurrent
                      ? '#0A66C2'
                      : isCompleted
                      ? '#057642'
                      : '#FFFFFF',
                  }}
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
                      ? 'text-linkedin-blue font-bold'
                      : isCompleted
                      ? 'text-emerald-700'
                      : 'text-linkedin-muted'
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
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-600">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>
              Candidate application concluded with <strong>{currentStage}</strong> status.
            </span>
          </div>
        )}
      </div>

      {/* Stage History Chronological Log */}
      <div className="border-t border-linkedin-border pt-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-linkedin-muted mb-4 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>Stage History Log ({history.length})</span>
        </h4>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {history.map((event, idx) => (
            <div key={idx} className="relative group">
              {/* Dot */}
              <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-white border-2 border-linkedin-blue flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#0A66C2' }}></div>
              </div>

              {/* Content */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-linkedin-text">
                    {event.from ? `${event.from} ➔ ${event.to}` : `Initiated at ${event.to}`}
                  </span>
                  {event.reason && (
                    <span className="text-xs text-linkedin-muted italic font-normal">
                      — &ldquo;{event.reason}&rdquo;
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-linkedin-muted flex-shrink-0">
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
