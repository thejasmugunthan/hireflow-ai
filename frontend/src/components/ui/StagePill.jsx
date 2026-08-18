import React from 'react';
import { STAGE_CONFIG } from '../../utils/stageHelpers';

export const StagePill = ({ stage, size = 'md' }) => {
  const config = STAGE_CONFIG[stage] || {
    label: stage || 'Unknown',
    badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
    dotClass: 'bg-slate-400',
  };

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2',
    lg: 'text-sm px-3.5 py-1.5 gap-2.5 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border ${config.badgeClass} ${sizeClasses[size]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`}></span>
      <span>{config.label}</span>
    </span>
  );
};
