import React from 'react';

interface MetricCardProps {
  id?: string;
  title: string;
  value: string;
  secondaryValue?: string;
  sublabel?: string;
  badge?: string;
  badgeVariant?: 'emerald' | 'red' | 'blue' | 'yellow' | 'slate';
  icon?: React.ReactNode;
  highlighted?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  value,
  secondaryValue,
  sublabel,
  badge,
  badgeVariant = 'slate',
  icon,
  highlighted = false,
}) => {
  const getBadgeClasses = () => {
    switch (badgeVariant) {
      case 'emerald':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'red':
        return 'bg-red-500/15 text-red-400 border-red-500/30';
      case 'blue':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'yellow':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div
      id={id}
      className={`rounded-2xl p-4 border transition-all relative overflow-hidden ${
        highlighted
          ? 'bg-gradient-to-b from-slate-800/90 to-slate-900/95 border-emerald-500/60 shadow-lg shadow-emerald-950/20 ring-1 ring-emerald-500/30'
          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        {icon && <div className="text-slate-400 shrink-0">{icon}</div>}
      </div>

      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
          {value}
        </span>
        {badge && (
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getBadgeClasses()}`}
          >
            {badge}
          </span>
        )}
      </div>

      {(secondaryValue || sublabel) && (
        <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          {secondaryValue && <span className="font-mono text-slate-300">{secondaryValue}</span>}
          {sublabel && <span className="text-[11px] text-slate-400">{sublabel}</span>}
        </div>
      )}
    </div>
  );
};
