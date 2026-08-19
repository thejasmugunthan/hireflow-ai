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
    <div className="hf-card p-4 sm:p-6 space-y-6">
      <div>
        <h3 className="font-bold text-sm sm:text-base text-slate-900">Application Pipeline & Timeline</h3>
        <p className="text-xs text-slate-500">Chronological stage movements and hiring milestones</p>
      </div>

      {/* Desktop Stepper (hidden on xs/sm mobile) */}
      <div className="hidden sm:block py-2">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-200 z-0" />

          {mainPipeline.map((stageName, index) => {
            const isCompleted = currentIndex > index || (currentStage === 'Approved' && index <= 4);
            const isCurrent = currentStage === stageName;

            return (
              <div key={stageName} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all duration-300 ${
                    isCurrent
                      ? 'border-blue-600 text-white shadow-md scale-110'
                      : isCompleted
                      ? 'border-emerald-500 text-white'
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}
                  style={{
                    background: isCurrent
                      ? '#1677FF'
                      : isCompleted
                      ? '#057642'
                      : '#FFFFFF',
                  }}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span
                  className={`text-[11px] font-semibold mt-2 ${
                    isCurrent
                      ? 'text-blue-600 font-bold'
                      : isCompleted
                      ? 'text-emerald-700'
                      : 'text-slate-500'
                  }`}
                >
                  {STAGE_CONFIG[stageName]?.label || stageName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Stepper (Dedicated Compact View) */}
      <div className="sm:hidden space-y-2">
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
          {mainPipeline.map((stageName, index) => {
            const isCompleted = currentIndex > index || (currentStage === 'Approved' && index <= 4);
            const isCurrent = currentStage === stageName;

            return (
              <div
                key={stageName}
                className={`flex-1 text-center py-2 px-1 rounded-xl text-[10px] font-bold border transition-all ${
                  isCurrent
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
                style={isCurrent ? { background: '#1677FF' } : {}}
              >
                <div>{index + 1}. {stageName}</div>
                <div className="text-[9px] font-normal opacity-90 truncate">
                  {isCompleted ? '✓ Done' : isCurrent ? '● Active' : 'Pending'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rejection Alert if currently in a rejected stage */}
      {isRejected && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
          <span>
            Candidate concluded with <strong>{currentStage}</strong> status.
          </span>
        </div>
      )}

      {/* Stage History Chronological Log */}
      <div className="border-t border-linkedin-border pt-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Stage History Log ({history.length})</span>
        </h4>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {history.map((event, idx) => (
            <div key={idx} className="relative group">
              {/* Dot */}
              <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              </div>

              {/* Content */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  <span className="text-xs font-bold text-slate-900 block sm:inline">
                    {event.from ? `${event.from} ➔ ${event.to}` : `Initiated at ${event.to}`}
                  </span>
                  {event.reason && (
                    <span className="text-xs text-slate-500 italic font-normal block sm:inline sm:ml-2">
                      — &ldquo;{event.reason}&rdquo;
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 flex-shrink-0 mt-0.5 sm:mt-0">
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
