import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { ALL_STAGES, getNextAllowedStages } from '../../utils/stageHelpers';
import { applicationService } from '../../services/applicationService';
import { AlertCircle, ShieldAlert } from 'lucide-react';

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
        <div className="p-3 rounded-xl bg-slate-50 border border-linkedin-border flex items-center justify-between text-xs">
          <span className="text-linkedin-muted font-medium">Current Stage:</span>
          <span className="font-bold text-linkedin-text px-2.5 py-0.5 rounded-full bg-blue-50 text-linkedin-blue border border-blue-200">
            {currentStage}
          </span>
        </div>

        {/* Target Stage Selection */}
        <div>
          <label className="block text-xs font-semibold text-linkedin-text mb-2">
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
                      ? 'bg-blue-50 border-linkedin-blue text-linkedin-blue shadow-xs'
                      : 'bg-white border-linkedin-border text-linkedin-text hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{st}</span>
                  {isRecommended && (
                    <span className="text-[10px] text-emerald-600 font-normal mt-0.5">Recommended</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-xs font-semibold text-linkedin-text mb-1.5">
            Stage Transition Note / Reason (Optional):
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Scored 85% in R1 screening; advanced to deep technical"
            className="hf-input text-xs"
          />
        </div>

        {/* Admin Override Toggle */}
        <div className="pt-2 border-t border-linkedin-border">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-linkedin-muted hover:text-linkedin-text">
            <input
              type="checkbox"
              checked={force}
              onChange={(e) => setForce(e.target.checked)}
              className="rounded border-slate-300 text-linkedin-blue focus:ring-linkedin-blue"
            />
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              Administrative Stage Override (bypass workflow state check)
            </span>
          </label>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-600">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-linkedin-border">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary text-xs px-4 py-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary text-xs px-5 py-2"
          >
            {loading ? 'Updating Stage...' : 'Confirm Stage Change'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
