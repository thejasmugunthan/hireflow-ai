import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color = 'brand', subtext }) => {
  const colorMap = {
    brand: 'from-brand-600/20 to-violet-600/10 text-brand-400 border-brand-500/20',
    blue: 'from-blue-600/20 to-cyan-600/10 text-blue-400 border-blue-500/20',
    emerald: 'from-emerald-600/20 to-teal-600/10 text-emerald-400 border-emerald-500/20',
    amber: 'from-amber-600/20 to-yellow-600/10 text-amber-400 border-amber-500/20',
    rose: 'from-rose-600/20 to-red-600/10 text-rose-400 border-rose-500/20',
  };

  const iconBgMap = {
    brand: 'bg-brand-500/10 text-brand-400 border border-brand-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 relative overflow-hidden transition-all duration-200 hover:border-slate-700">
      <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full bg-gradient-to-br ${colorMap[color]} blur-2xl opacity-50`}></div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="text-3xl font-extrabold text-white mt-1.5 tracking-tight">{value}</h3>
          {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgMap[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};
