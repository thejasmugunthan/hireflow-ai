import React, { useState } from 'react';
import { MessageSquarePlus, Star, Clock } from 'lucide-react';
import { StarRating } from '../ui/StarRating';
import { formatDateTime } from '../../utils/formatters';
import { applicationService } from '../../services/applicationService';

export const InterviewNotesSection = ({ application, onNoteAdded }) => {
  const [stage, setStage] = useState(application?.stage || 'R1');
  const [rating, setRating] = useState(4);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const savedNotes = application?.interviewNotes || [];

  const handleSave = async (e) => {
    e.preventDefault();
    if (!notes.trim()) {
      setError('Please enter interview feedback notes.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      await applicationService.addInterviewNote(application._id, {
        stage,
        rating,
        notes: notes.trim(),
      });
      setNotes('');
      if (onNoteAdded) onNoteAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save interview note.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="hf-card p-6 space-y-6">
      <div>
        <h3 className="font-bold text-sm text-linkedin-text">Interview Notes & Evaluation</h3>
        <p className="text-xs text-linkedin-muted">
          Structured interviewer feedback, technical scoring, and round notes
        </p>
      </div>

      {/* Add New Note Form */}
      <form onSubmit={handleSave} className="p-4 rounded-xl bg-slate-50 border border-linkedin-border space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Round Selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-linkedin-text">Interview Stage:</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="hf-select text-xs"
            >
              <option value="R1">R1 Technical Screening</option>
              <option value="R2">R2 Deep Technical</option>
              <option value="R3">R3 System Design / Leadership</option>
              <option value="HR">HR / Culture Fit</option>
              <option value="General">General Assessment</option>
            </select>
          </div>

          {/* Star Rating Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-linkedin-text">Score:</span>
            <StarRating rating={rating} onChange={setRating} size="md" />
            <span className="text-xs font-bold text-amber-600 ml-1">{rating}/5</span>
          </div>
        </div>

        {/* Textarea */}
        <div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Document key interview insights, technical strengths, problem solving ability, questions asked..."
            rows={3}
            className="hf-input text-xs resize-y"
          ></textarea>
        </div>

        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary text-xs px-4 py-2"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving Note...' : 'Save Interview Note'}</span>
          </button>
        </div>
      </form>

      {/* Saved Notes Log */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-linkedin-muted flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-amber-500" />
          <span>Recorded Feedback ({savedNotes.length})</span>
        </h4>

        {savedNotes.length === 0 ? (
          <div className="py-6 text-center text-xs text-linkedin-muted rounded-xl bg-slate-50 border border-dashed border-linkedin-border">
            No interview notes logged yet. Use the form above to record your feedback.
          </div>
        ) : (
          savedNotes.map((noteItem, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white border border-linkedin-border space-y-2 hover:border-slate-300 transition-colors shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-linkedin-blue font-bold text-xs">
                    {noteItem.stage}
                  </span>
                  <div className="flex items-center gap-1">
                    <StarRating rating={noteItem.rating} readonly size="sm" />
                    <span className="text-xs font-bold text-amber-600 ml-1">
                      {noteItem.rating}/5
                    </span>
                  </div>
                </div>

                <span className="text-xs text-linkedin-muted flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDateTime(noteItem.createdAt)}
                </span>
              </div>

              <p className="text-xs text-linkedin-text whitespace-pre-wrap leading-relaxed">
                {noteItem.notes}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
