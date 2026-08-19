import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color = 'blue', subtext }) => {
  const colorMap = {
    blue:    { bg: '#EAF4FF', text: '#0A66C2', border: '#BFDBFE' },
    green:   { bg: '#D1FAE5', text: '#057642', border: '#6EE7B7' },
    amber:   { bg: '#FEF3C7', text: '#B45309', border: '#FCD34D' },
    purple:  { bg: '#EDE9FE', text: '#6D28D9', border: '#C4B5FD' },
    rose:    { bg: '#FFF1F2', text: '#E11D48', border: '#FECDD3' },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="hf-card p-5 flex items-start gap-4 hf-card-hover animate-fade-in-up">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: c.bg, border: `1px solid ${c.border}` }}
      >
        {Icon && <Icon className="w-5 h-5" style={{ color: c.text }} />}
      </div>
      <div>
        <p className="text-xs text-linkedin-muted font-medium">{title}</p>
        <p className="text-2xl font-extrabold text-linkedin-text mt-0.5 leading-none">{value}</p>
        {subtext && <p className="text-xs text-linkedin-muted mt-1">{subtext}</p>}
      </div>
    </div>
  );
};
