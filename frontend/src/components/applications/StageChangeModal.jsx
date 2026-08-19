import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { getStageDecisionOptions, isTerminalStage, ALL_STAGES } from '../../utils/stageHelpers';
import { applicationService } from '../../services/applicationService';
import { CheckCircle2, XCircle, AlertCircle, ShieldAlert, ArrowRight, Lock } from 'lucide-react';

export const StageChangeModal = ({ isOpen, onClose, application, onStageUpdated }) => {
  const currentStage = application?.stage || 'Applied';
  const decisionOptions = getStageDecisionOptions(currentStage);
  const isTerminal = isTerminalStage(currentStage);

  const [decisionType, setDecisionType] = useState('pass'); // 'pass' | 'reject'
  const [selectedStage, setSelectedStage] = useState(decisionOptions?.pass?.stage || currentStage);
  const [reason, setReason] = useState('');
  const [force, setForce] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (decisionOptions) {
      setSelectedStage(decisionType === 'pass' ? decisionOptions.pass.stage : decisionOptions.reject.stage);
    }
  }, [decisionType, currentStage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await applicationService.updateStage(application._id, {
        stage: selectedStage,
        reason: reason.trim() || `${decisionType === 'pass' ? 'Selected / Advanced' : 'Rejected'} at ${currentStage} stage`,
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
    <Modal isOpen={isOpen} onClose={onClose} title="Hiring Decision & Stage Workflow" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current State Info */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-linkedin-border flex items-center justify-between text-xs">
          <div>
            <span className="text-linkedin-muted font-medium block">Current Candidate Stage:</span>
            <span className="font-bold text-sm text-linkedin-text">{currentStage}</span>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-linkedin-blue border border-blue-200">
            {isTerminal ? 'Final Status' : 'In Review'}
          </span>
        </div>

        {isTerminal && !force ? (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2 text-xs text-amber-800">
            <div className="flex items-center gap-2 font-bold">
              <Lock className="w-4 h-4 text-amber-600" />
              <span>Terminal Stage Reached</span>
            </div>
            <p>
              This candidate application is currently in <strong>{currentStage}</strong> status. Per standard hiring pipeline integrity rules, candidates cannot be moved backward.
            </p>
          </div>
        ) : (
          /* Decision Selection */
          decisionOptions && (
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-linkedin-muted">
                Select Round Evaluation Decision:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Selected / Pass Option */}
                <div
                  onClick={() => setDecisionType('pass')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    decisionType === 'pass'
                      ? 'border-emerald-500 bg-emerald-50/70 shadow-sm'
                      : 'border-linkedin-border bg-white hover:bg-slate-50 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Candidate Selected
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                      Pass
                    </span>
                  </div>
                  <div className="font-semibold text-xs text-linkedin-text mt-2">
                    {decisionOptions.pass.label}
                  </div>
                  <p className="text-[11px] text-linkedin-muted mt-1 leading-snug">
                    {decisionOptions.pass.description}
                  </p>
                </div>

                {/* Reject Option */}
                <div
                  onClick={() => setDecisionType('reject')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    decisionType === 'reject'
                      ? 'border-rose-500 bg-rose-50/70 shadow-sm'
                      : 'border-linkedin-border bg-white hover:bg-slate-50 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      Candidate Rejected
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-900">
                      Fail
                    </span>
                  </div>
                  <div className="font-semibold text-xs text-linkedin-text mt-2">
                    {decisionOptions.reject.label}
                  </div>
                  <p className="text-[11px] text-linkedin-muted mt-1 leading-snug">
                    {decisionOptions.reject.description}
                  </p>
                </div>
              </div>
            </div>
          )
        )}

        {/* Feedback / Transition Note */}
        <div>
          <label className="block text-xs font-semibold text-linkedin-text mb-1.5">
            Interviewer Feedback / Decision Rationale (Optional):
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Cleared technical coding task with 90% score, approved for next round"
            className="hf-input text-xs"
          />
        </div>

        {/* Admin Override for Emergency Stage Correction */}
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
              Administrative manual override (allows custom stage picking)
            </span>
          </label>

          {force && (
            <div className="mt-2">
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="hf-select text-xs w-full"
              >
                {ALL_STAGES.map((st) => (
                  <option key={st} value={st}>Move manually to: {st}</option>
                ))}
              </select>
            </div>
          )}
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
            disabled={loading || (isTerminal && !force)}
            className={`btn-primary text-xs px-5 py-2 ${
              decisionType === 'reject' && !force ? 'bg-rose-600 hover:bg-rose-700' : ''
            }`}
          >
            {loading ? (
              'Updating...'
            ) : (
              <span className="flex items-center gap-1.5">
                <span>Confirm Decision & Move to {selectedStage}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
