import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { jobService } from '../../services/jobService';
import { Briefcase, AlertCircle } from 'lucide-react';

export const JobModal = ({ isOpen, onClose, job, onSaved }) => {
  const isEditing = !!job;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: '',
    location: 'Bangalore',
    employmentType: 'Full-time',
    status: 'Active',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        description: job.description || '',
        skills: Array.isArray(job.skills) ? job.skills.join(', ') : job.skills || '',
        location: job.location || 'Bangalore',
        employmentType: job.employmentType || 'Full-time',
        status: job.status || 'Active',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        skills: '',
        location: 'Bangalore',
        employmentType: 'Full-time',
        status: 'Active',
      });
    }
    setError('');
  }, [job, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Job title and description are required.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const payload = {
        ...formData,
        skills: formData.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      };

      if (isEditing) {
        await jobService.updateJob(job._id, payload);
      } else {
        await jobService.createJob(payload);
      }

      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save job posting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Job Opening' : 'Create New Job Opening'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-linkedin-text mb-1.5">
            Job Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Full Stack Developer, AI/ML Intern"
            className="hf-input text-sm"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-linkedin-text mb-1.5">
            Job Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed description of responsibilities, requirements, and tech stack..."
            className="hf-input text-sm resize-y"
          ></textarea>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-xs font-semibold text-linkedin-text mb-1.5">
            Required Skills (Comma separated)
          </label>
          <input
            type="text"
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            placeholder="React, TypeScript, Node.js, MongoDB, REST APIs"
            className="hf-input text-sm"
          />
        </div>

        {/* Location & Type & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-linkedin-text mb-1.5">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Bangalore, Remote"
              className="hf-input text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-linkedin-text mb-1.5">
              Employment Type
            </label>
            <select
              value={formData.employmentType}
              onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
              className="hf-select text-xs"
            >
              <option value="Full-time">Full-time</option>
              <option value="Internship">Internship</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-linkedin-text mb-1.5">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="hf-select text-xs"
            >
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-600">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Actions */}
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
            {loading ? 'Saving...' : isEditing ? 'Update Job' : 'Create Job'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
