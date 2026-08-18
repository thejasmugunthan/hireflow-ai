import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { ALL_STAGES, getNextAllowedStages, STAGE_CONFIG } from '../../utils/stageHelpers';
import { applicationService } from '../../services/applicationService';
import { AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

export const StageChangeModal = ({ isOpen, onClose, application, onStageUpdated }) => {
  const currentStage = application?.stage || 'Applied';
  const allowedNext = getNextAllowedStages(currentStage);

  const [selectedStage, setSelectedStage] = useState(allowedNext[0] || currentStage);
  const [reason, setReason] = useState('');
  const [force, setForce] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await applicationService.updateStage(application._id, {
        stage: selectedStage,
        reason: reason.trim() || `Moved to ${selectedStage}`,
        force,
      });
      if (onStageUpdated) onStageUpdated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update stage.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Hiring Pipeline Stage">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current State Info */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Current Stage:</span>
          <span className="font-bold text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
            {currentStage}
          </span>
        </div>

        {/* Target Stage Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Select Next Stage:
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(force ? ALL_STAGES : (allowedNext.length > 0 ? allowedNext : ALL_STAGES)).map((st) => {
              const isSelected = selectedStage === st;
              const isRecommended = allowedNext.includes(st);

              return (
                <button
                  type="button"
                  key={st}
                  onClick={() => setSelectedStage(st)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-brand-600/20 border-brand-500 text-brand-300 shadow-sm shadow-brand-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                  }`}
                >
                  <span className="truncate">{st}</span>
                  {isRecommended && (
                    <span className="text-[10px] text-emerald-400 font-normal mt-0.5">Recommended</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Stage Transition Note / Reason (Optional):
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Scored 85% in R1 screening; advanced to deep technical"
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Admin Override Toggle */}
        <div className="pt-2 border-t border-slate-800">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 hover:text-slate-300">
            <input
              type="checkbox"
              checked={force}
              onChange={(e) => setForce(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-brand-600 focus:ring-brand-500"
            />
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Administrative Stage Override (bypass workflow state check)
            </span>
          </label>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 flex items-center gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/25 transition-all disabled:opacity-50 active:scale-95"
          >
            {loading ? 'Updating Stage...' : 'Confirm Stage Change'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
